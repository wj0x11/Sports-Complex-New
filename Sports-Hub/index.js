import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]); 

import express from "express";
import cors from "cors";
import Employee from "./Models/emp.js";
import Booking from "./Models/booking.js";
import Notification from "./Models/notification.js";
import Sport from "./Models/sport.js"; 
import { connectDB } from "./config/db.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import process from "process";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());


connectDB().then(async () => {
    try {
        const adminEmail = "admin@gmail.com";
        const adminExists = await Employee.findOne({ email: adminEmail });
        if (!adminExists) {
            const defaultAdmin = new Employee({
                fullName: "Admin Gayantha",
                email: adminEmail,
                phone: "0767710134",
                password: "Admin@20", 
                role: "admin"
            });
            await defaultAdmin.save();
            console.log("==============================================");
            console.log("Auto-seeded default admin user:");
            console.log(`Email: ${adminEmail}`);
            console.log("Password: Admin@20");
            console.log("==============================================");
        } else {
            console.log("Admin user already exists in database.");
        }
    } catch (seedErr) {
        console.error("Error seeding default admin:", seedErr);
    }
});


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER || "battleblastsportshub@gmail.com",
        pass: process.env.EMAIL_PASS || "ivewebormdizlffw",
    },
});

const sendEmailNotification = (to, subject, text) => {
    const userMail = process.env.EMAIL_USER || "battleblastsportshub@gmail.com";
    if (!userMail || userMail === "your-email@gmail.com") {
        console.log(`SMTP user email is not configured. Skipping email to ${to}.`);
        return;
    }
    const mailOptions = {
        from: userMail,
        to,
        subject,
        text
    };
    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            console.error(`Error sending email to ${to}:`, err);
        } else {
            console.log(`Email notification sent successfully to ${to}`);
        }
    });
};


app.get("/", (req, res) => {
    res.send("Sports Hub API Running Successfully");
});     



app.get("/api/sports", async (req, res) => {
    try {
        const sports = await Sport.find({}).sort({ createdAt: -1 });
        res.status(200).json(sports);
    } catch (err) {
        console.error("Error fetching sports:", err);
        res.status(500).json({ message: "Failed to fetch sports.", error: err.message });
    }
});

app.post("/api/sports", async (req, res) => {
    const { name, description, type, image } = req.body;
    if (!name || !description) {
        return res.status(400).json({ message: "Name and description are required." });
    }
    try {
        const slug = name.toLowerCase().replace(/ /g, "-");
        const newSport = new Sport({
            name,
            slug,
            description,
            type: type || "court",
            image: image || "https://images.unsplash.com/photo-1517649763962-0c623066013b",
            isDisabled: false
        });
        await newSport.save();
        res.status(201).json(newSport);
    } catch (err) {
        console.error("Error creating sport:", err);
        res.status(500).json({ message: "Failed to create sport.", error: err.message });
    }
});


app.put("/api/sports/:id", async (req, res) => {
    const { id } = req.params;
    const { name, description, type, image } = req.body;
    try {
        const slug = name ? name.toLowerCase().replace(/ /g, "-") : undefined;
        const updatedSport = await Sport.findByIdAndUpdate(
            id,
            { name, slug, description, type, image },
            { new: true }
        );
        if (!updatedSport) {
            return res.status(404).json({ message: "Sport not found." });
        }
        res.status(200).json(updatedSport);
    } catch (err) {
        console.error("Error updating sport:", err);
        res.status(500).json({ message: "Failed to update sport.", error: err.message });
    }
});


app.patch("/api/sports/:id/toggle-status", async (req, res) => {
    const { id } = req.params;
    const { isDisabled } = req.body;
    try {
        const updatedSport = await Sport.findByIdAndUpdate(
            id,
            { isDisabled },
            { new: true }
        );
        if (!updatedSport) {
            return res.status(404).json({ message: "Sport not found." });
        }
        res.status(200).json(updatedSport);
    } catch (err) {
        console.error("Error updating sport status:", err);
        res.status(500).json({ message: "Failed to change sport status.", error: err.message });
    }
});



app.post("/api/bookings", async (req, res) => {
    console.log("POST /api/bookings body:", req.body);
    try {
        const bookingData = req.body;
        
        if (bookingData.bookingDetails?.bookingDate && bookingData.bookingDetails?.bookingTime) {
            const facilityId = bookingData.court?.id || bookingData.coach?.id;
            const query = {
                "sport.slug": bookingData.sport?.slug,
                "bookingDetails.bookingDate": bookingData.bookingDetails.bookingDate,
                "bookingDetails.bookingTime": bookingData.bookingDetails.bookingTime,
                status: { $ne: "Cancelled" }
            };
            if (facilityId) {
                query.$or = [
                    { "court.id": Number(facilityId) },
                    { "coach.id": Number(facilityId) }
                ];
            }
            const doubleBook = await Booking.findOne(query);
            if (doubleBook) {
                return res.status(400).json({ message: "This slot is already booked. Please choose another slot." });
            }
        }

        const newBooking = new Booking(bookingData);
        await newBooking.save();

        const userNotif = new Notification({
            userEmail: newBooking.userEmail,
            title: "Booking Confirmed",
            message: `Your booking for ${newBooking.sport?.name} (${newBooking.court?.name || newBooking.coach?.name || 'Session'}) has been confirmed successfully.`
        });
        await userNotif.save();

        const adminNotif = new Notification({
            userEmail: "admin",
            title: "New Booking Received",
            message: `${newBooking.user?.fullName || newBooking.userEmail} has booked ${newBooking.sport?.name} on ${newBooking.bookingDetails?.bookingDate}.`
        });
        await adminNotif.save();

        const userEmailText = `Hi ${newBooking.user?.fullName || 'Valued Customer'},\n\n` +
            `Your booking at Battle Blast Sports Complex has been confirmed!\n\n` +
            `Reservation ID: ${newBooking.reservationId}\n` +
            `Sport: ${newBooking.sport?.name}\n` +
            `Facility/Coach: ${newBooking.court?.name || newBooking.coach?.name || 'Session'}\n` +
            `Date: ${newBooking.bookingDetails?.bookingDate}\n` +
            `Time: ${newBooking.bookingDetails?.bookingTime}\n` +
            `Total Amount: LKR ${newBooking.totalAmount}\n` +
            `Payment Status: Paid (${newBooking.paymentMethod})\n\n` +
            `Thank you for booking with us!\n` +
            `Battle Blast Sports Complex`;
        
        sendEmailNotification(newBooking.userEmail, "Booking Confirmation - Battle Blast", userEmailText);

        const adminEmail = process.env.EMAIL_USER || "battleblastsportshub@gmail.com";
        const adminEmailText = `Hello Admin,\n\n` +
            `A new sports reservation has been received.\n\n` +
            `Reservation ID: ${newBooking.reservationId}\n` +
            `User: ${newBooking.user?.fullName || 'Unknown'} (${newBooking.userEmail})\n` +
            `Sport: ${newBooking.sport?.name}\n` +
            `Facility/Coach: ${newBooking.court?.name || newBooking.coach?.name || 'Session'}\n` +
            `Date: ${newBooking.bookingDetails?.bookingDate}\n` +
            `Time: ${newBooking.bookingDetails?.bookingTime}\n` +
            `Total Amount: LKR ${newBooking.totalAmount}\n\n` +
            `Manage this booking at http://localhost:5173/admin-dashboard`;

        sendEmailNotification(adminEmail, "New Booking Alert - Battle Blast", adminEmailText);

        res.status(201).json(newBooking);
    } catch (err) {
        console.error("Error creating booking:", err);
        res.status(500).json({ message: "Failed to create booking.", error: err.message });
    }
});

app.get("/api/bookings", async (req, res) => {
    const { email } = req.query;
    try {
        let bookings;
        if (email) {
            bookings = await Booking.find({ userEmail: email }).sort({ createdAt: -1 });
        } else {
            bookings = await Booking.find({}).sort({ createdAt: -1 });
        }
        res.status(200).json(bookings);
    } catch (err) {
        console.error("Error fetching bookings:", err);
        res.status(500).json({ message: "Failed to fetch bookings.", error: err.message });
    }
});

app.put("/api/bookings/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const booking = await Booking.findOneAndUpdate(
            { id: Number(id) },
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        const userNotif = new Notification({
            userEmail: booking.userEmail,
            title: `Booking Status: ${status}`,
            message: `Your booking ${booking.reservationId} for ${booking.sport?.name} has been updated to ${status}.`
        });
        await userNotif.save();

        const userEmailText = `Hi ${booking.user?.fullName || 'Valued Customer'},\n\n` +
            `The status of your booking ${booking.reservationId} has been updated.\n\n` +
            `New Status: ${status}\n` +
            `Sport: ${booking.sport?.name}\n` +
            `Date: ${booking.bookingDetails?.bookingDate}\n` +
            `Time: ${booking.bookingDetails?.bookingTime}\n\n` +
            `View your bookings here: http://localhost:5173/booking-history\n\n` +
            `Thank you,\n` +
            `Battle Blast Sports Complex`;

        sendEmailNotification(booking.userEmail, `Booking Status Updated - ${status}`, userEmailText);

        res.status(200).json(booking);
    } catch (err) {
        console.error("Error updating booking status:", err);
        res.status(500).json({ message: "Failed to update booking status.", error: err.message });
    }
});

app.get("/api/bookings/booked-slots", async (req, res) => {
    const { sportSlug, date, facilityId } = req.query;
    if (!sportSlug || !date) {
        return res.status(400).json({ message: "sportSlug and date are required." });
    }
    try {
        const query = {
            "sport.slug": sportSlug,
            "bookingDetails.bookingDate": date,
            status: { $ne: "Cancelled" }
        };

        if (facilityId) {
            query.$or = [
                { "court.id": Number(facilityId) },
                { "coach.id": Number(facilityId) }
            ];
        }

        const bookings = await Booking.find(query);
        const bookedSlots = bookings.map(b => b.bookingDetails?.bookingTime).filter(Boolean);
        
        res.status(200).json(bookedSlots);
    } catch (err) {
        console.error("Error checking booked slots:", err);
        res.status(500).json({ message: "Failed to query booked slots.", error: err.message });
    }
});




app.get("/api/notifications", async (req, res) => {
    const { email } = req.query;
    try {
        let notifications;
        if (email) {
            notifications = await Notification.find({ userEmail: email }).sort({ createdAt: -1 });
        } else {
            notifications = await Notification.find({ userEmail: "admin" }).sort({ createdAt: -1 });
        }
        res.status(200).json(notifications);
    } catch (err) {
        console.error("Error fetching notifications:", err);
        res.status(500).json({ message: "Failed to fetch notifications.", error: err.message });
    }
});

app.put("/api/notifications/mark-read", async (req, res) => {
    const { email } = req.body;
    try {
        const query = email ? { userEmail: email } : { userEmail: "admin" };
        await Notification.updateMany(query, { status: "Read" });
        res.status(200).json({ success: true, message: "Notifications marked as read." });
    } catch (err) {
        console.error("Error marking notifications read:", err);
        res.status(500).json({ message: "Failed to update notifications.", error: err.message });
    }
});




app.get("/api/users", async (req, res) => {
    try {
        const users = await Employee.find({}).select("-password");
        res.status(200).json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "Failed to fetch users.", error: err.message });
    }
});

app.delete("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Employee.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json({ message: "User deleted successfully." });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ message: "Failed to delete user.", error: err.message });
    }
});




app.post("/api/login", async (req, res) => {
    console.log("Frontend came with data to /api/login:", req.body);
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const user = await Employee.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: "User not found. Please register first." });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Incorrect password." });
        }

        return res.status(200).json({ 
            message: "Login successful.", 
            role: user.role, 
            fullName: user.fullName 
        });

    } catch (err) {
        console.error("Database error during login:", err);
        return res.status(500).json({ message: "An error occurred during login.", error: err.message });
    }
});


app.post("/api/admin-login", async (req, res) => {
    console.log("Frontend came with data to /api/admin-login:", req.body);
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const user = await Employee.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: "Administrator not found. Please register first." });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Incorrect password." });
        }

        return res.status(200).json({ 
            message: "Login successful.", 
            role: user.role, 
            fullName: user.fullName 
        });

    } catch (err) {
        console.error("Database error during login:", err);
        return res.status(500).json({ message: "An error occurred during login.", error: err.message });
    }
});


app.post("/api/register", async (req, res) => {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }
    try {
        let userRole = "user";
        if (email === "admin@gmail.com") {
            userRole = "admin";
        }

        const newEmployee = new Employee({
            fullName: fullName,
            email: email,
            phone: phone,
            password: password,
            role: userRole
        });

        await newEmployee.save();
        return res.status(200).json({ message: "Registration successful." });

    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Error occurred while registering.", error: err.message });
    }
});

app.post("/api/forgot-password", async (req, res) => {
    console.log("Forgot password request for email:", req.body?.email);
    const { email } = req.body || {};

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    try {
        const user = await Employee.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: "User with this email does not exist." });
        }

        const token = crypto.randomBytes(20).toString("hex");
        
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;

        await user.save();

        const resetUrl = `http://localhost:5173/reset-password?token=${token}`;

        console.log("==============================================");
        console.log(`PASSWORD RESET URL: ${resetUrl}`);
        console.log("==============================================");

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER || "your-email@gmail.com",
                pass: process.env.EMAIL_PASS || "your-app-password",
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER || "your-email@gmail.com",
            to: user.email,
            subject: "Password Reset Link - Sports Hub",
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                  `Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n` +
                  `${resetUrl}\n\n` +
                  `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        if (!process.env.EMAIL_USER || process.env.EMAIL_USER === "your-email@gmail.com") {
            console.log("SMTP environment variables not configured. Email sending skipped. Reset URL printed above.");
            return res.status(200).json({ 
                message: "Password reset link generated. Since SMTP is not configured, please check the backend console for the link.", 
                devResetUrl: resetUrl 
            });
        }

        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.error("Error sending email:", err);
                return res.status(200).json({ 
                    message: "Reset token generated, but failed to send email. Check backend console for the reset link.", 
                    devResetUrl: resetUrl 
                });
            } else {
                console.log("Reset email sent successfully to " + user.email);
                return res.status(200).json({ message: "Password reset email sent successfully!" });
            }
        });

    } catch (err) {
        console.error("Forgot password database error:", err);
        return res.status(500).json({ message: "An error occurred during forgot password process.", error: err.message });
    }
});

app.post("/api/reset-password", async (req, res) => {
    console.log("Reset password request with token:", req.body?.token);
    const { token, password } = req.body || {};

    if (!token || !password) {
        return res.status(400).json({ message: "Token and new password are required." });
    }

    try {
        const user = await Employee.findOne({
            resetPasswordToken: token
        });

        if (!user) {
            return res.status(400).json({ message: "Password reset token is invalid." });
        }

        if (user.resetPasswordExpires < new Date()) {
            return res.status(400).json({ message: "Password reset token has expired." });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        console.log(`Password reset successful for user: ${user.email}`);

        return res.status(200).json({ message: "Password has been successfully reset. You can now log in with your new password." });

    } catch (err) {
        console.error("Reset password database error:", err);
        return res.status(500).json({ message: "An error occurred during password reset process.", error: err.message });
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});