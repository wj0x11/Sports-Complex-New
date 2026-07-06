import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]); 

import express from "express";
import cors from "cors";
import Employee from "./Models/emp.js";
import Booking from "./Models/booking.js";
import Notification from "./Models/notification.js";
import Sport from "./Models/sport.js"; 
import Court from "./Models/court.js";
import Coach from "./Models/coach.js";
import Membership from "./Models/membership.js";
import Payment from "./Models/payment.js";
import Equipment from "./Models/equipment.js";
import EquipmentRental from "./Models/equipmentRental.js";
import Tournament from "./Models/tournament.js";
import Feedback from "./Models/feedback.js";
import TrainingSession from "./Models/trainingSession.js";
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


// ================================ COURTS ================================
app.get("/api/courts", async (req, res) => {
    const { sportSlug } = req.query;
    try {
        let query = {};
        if (sportSlug) query.sportSlug = sportSlug;
        const courts = await Court.find(query).sort({ createdAt: -1 });
        res.status(200).json(courts);
    } catch (err) {
        console.error("Error fetching courts:", err);
        res.status(500).json({ message: "Failed to fetch courts.", error: err.message });
    }
});

app.post("/api/courts", async (req, res) => {
    const { name, sportSlug, sportName, description, pricePerHour, capacity, images, location } = req.body;
    if (!name || !sportSlug || !sportName || !pricePerHour) {
        return res.status(400).json({ message: "Name, sport, and price are required." });
    }
    try {
        const newCourt = new Court({ name, sportSlug, sportName, description, pricePerHour, capacity, images, location });
        await newCourt.save();
        res.status(201).json(newCourt);
    } catch (err) {
        console.error("Error creating court:", err);
        res.status(500).json({ message: "Failed to create court.", error: err.message });
    }
});

app.put("/api/courts/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const updatedCourt = await Court.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedCourt) return res.status(404).json({ message: "Court not found." });
        res.status(200).json(updatedCourt);
    } catch (err) {
        console.error("Error updating court:", err);
        res.status(500).json({ message: "Failed to update court.", error: err.message });
    }
});

app.delete("/api/courts/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Court.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Court not found." });
        res.status(200).json({ message: "Court deleted successfully." });
    } catch (err) {
        console.error("Error deleting court:", err);
        res.status(500).json({ message: "Failed to delete court.", error: err.message });
    }
});


// ================================ COACHES ================================
app.get("/api/coaches", async (req, res) => {
    const { sportSlug } = req.query;
    try {
        let query = {};
        if (sportSlug) query.sportSlug = sportSlug;
        const coaches = await Coach.find(query).sort({ createdAt: -1 });
        res.status(200).json(coaches);
    } catch (err) {
        console.error("Error fetching coaches:", err);
        res.status(500).json({ message: "Failed to fetch coaches.", error: err.message });
    }
});

app.post("/api/coaches", async (req, res) => {
    const { fullName, email, phone, sportSlug, sportName, experience, specialization, pricePerSession, bio, avatar } = req.body;
    if (!fullName || !email || !phone || !sportSlug || !sportName || !pricePerSession) {
        return res.status(400).json({ message: "All required fields must be provided." });
    }
    try {
        const newCoach = new Coach({ fullName, email, phone, sportSlug, sportName, experience, specialization, pricePerSession, bio, avatar });
        await newCoach.save();
        res.status(201).json(newCoach);
    } catch (err) {
        console.error("Error creating coach:", err);
        res.status(500).json({ message: "Failed to create coach.", error: err.message });
    }
});

app.put("/api/coaches/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const updatedCoach = await Coach.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedCoach) return res.status(404).json({ message: "Coach not found." });
        res.status(200).json(updatedCoach);
    } catch (err) {
        console.error("Error updating coach:", err);
        res.status(500).json({ message: "Failed to update coach.", error: err.message });
    }
});

app.delete("/api/coaches/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Coach.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Coach not found." });
        res.status(200).json({ message: "Coach deleted successfully." });
    } catch (err) {
        console.error("Error deleting coach:", err);
        res.status(500).json({ message: "Failed to delete coach.", error: err.message });
    }
});


// ================================ MEMBERSHIPS ================================
app.get("/api/memberships", async (req, res) => {
    const { userEmail } = req.query;
    try {
        let query = {};
        if (userEmail) query.userEmail = userEmail;
        const memberships = await Membership.find(query).sort({ createdAt: -1 });
        res.status(200).json(memberships);
    } catch (err) {
        console.error("Error fetching memberships:", err);
        res.status(500).json({ message: "Failed to fetch memberships.", error: err.message });
    }
});

app.post("/api/memberships", async (req, res) => {
    const { userId, userEmail, userName, type, price, startDate, endDate, features, status } = req.body;
    if (!userEmail || !type || !price || !startDate || !endDate) {
        return res.status(400).json({ message: "All required fields must be provided." });
    }
    try {
        const newMembership = new Membership({ 
            userId, userEmail, userName, type, price, 
            startDate: new Date(startDate), endDate: new Date(endDate), 
            features, status: status || "Active" 
        });
        await newMembership.save();
        res.status(201).json(newMembership);
    } catch (err) {
        console.error("Error creating membership:", err);
        res.status(500).json({ message: "Failed to create membership.", error: err.message });
    }
});

app.put("/api/memberships/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const { startDate, endDate, ...otherData } = req.body;
        const updateData = { ...otherData };
        if (startDate) updateData.startDate = new Date(startDate);
        if (endDate) updateData.endDate = new Date(endDate);
        const updatedMembership = await Membership.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedMembership) return res.status(404).json({ message: "Membership not found." });
        res.status(200).json(updatedMembership);
    } catch (err) {
        console.error("Error updating membership:", err);
        res.status(500).json({ message: "Failed to update membership.", error: err.message });
    }
});

app.delete("/api/memberships/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Membership.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Membership not found." });
        res.status(200).json({ message: "Membership deleted successfully." });
    } catch (err) {
        console.error("Error deleting membership:", err);
        res.status(500).json({ message: "Failed to delete membership.", error: err.message });
    }
});


// ================================ NOTIFICATIONS ================================
app.get("/api/notifications", async (req, res) => {
    const { email } = req.query;
    try {
        let query = {};
        if (email) {
            query.$or = [{ email: email }, { recipientType: "all" }];
        }
        const notifications = await Notification.find(query).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (err) {
        console.error("Error fetching notifications:", err);
        res.status(500).json({ message: "Failed to fetch notifications.", error: err.message });
    }
});

app.post("/api/notifications", async (req, res) => {
    const { title, message, email, recipientType, isRead } = req.body;
    if (!title || !message) {
        return res.status(400).json({ message: "Title and message are required." });
    }
    try {
        const newNotification = new Notification({ 
            title, message, email, recipientType: recipientType || "specific", 
            isRead: isRead || false, sentAt: new Date() 
        });
        await newNotification.save();
        res.status(201).json(newNotification);
    } catch (err) {
        console.error("Error creating notification:", err);
        res.status(500).json({ message: "Failed to create notification.", error: err.message });
    }
});

app.put("/api/notifications/:id/read", async (req, res) => {
    const { id } = req.params;
    try {
        const updatedNotification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
        if (!updatedNotification) return res.status(404).json({ message: "Notification not found." });
        res.status(200).json(updatedNotification);
    } catch (err) {
        console.error("Error updating notification:", err);
        res.status(500).json({ message: "Failed to update notification.", error: err.message });
    }
});


// ================================ PAYMENTS ================================
app.get("/api/payments", async (req, res) => {
    const { userEmail } = req.query;
    try {
        let query = {};
        if (userEmail) query.userEmail = userEmail;
        const payments = await Payment.find(query).sort({ createdAt: -1 });
        res.status(200).json(payments);
    } catch (err) {
        console.error("Error fetching payments:", err);
        res.status(500).json({ message: "Failed to fetch payments.", error: err.message });
    }
});

app.post("/api/payments", async (req, res) => {
    const { paymentId, userId, userEmail, bookingId, amount, paymentMethod, description, invoiceNumber } = req.body;
    if (!paymentId || !userEmail || !amount || !paymentMethod) {
        return res.status(400).json({ message: "Payment ID, user email, amount, and method are required." });
    }
    try {
        const newPayment = new Payment({ paymentId, userId, userEmail, bookingId, amount, paymentMethod, description, invoiceNumber });
        await newPayment.save();
        res.status(201).json(newPayment);
    } catch (err) {
        console.error("Error creating payment:", err);
        res.status(500).json({ message: "Failed to create payment.", error: err.message });
    }
});


// ================================ EQUIPMENT ================================
app.get("/api/equipment", async (req, res) => {
    const { sportSlug } = req.query;
    try {
        let query = {};
        if (sportSlug) query.sportSlug = sportSlug;
        const equipment = await Equipment.find(query).sort({ createdAt: -1 });
        res.status(200).json(equipment);
    } catch (err) {
        console.error("Error fetching equipment:", err);
        res.status(500).json({ message: "Failed to fetch equipment.", error: err.message });
    }
});

app.post("/api/equipment", async (req, res) => {
    const { name, sportSlug, sportName, description, rentalPrice, totalQuantity, availableQuantity, image } = req.body;
    if (!name || !sportSlug || !sportName || !rentalPrice || !totalQuantity) {
        return res.status(400).json({ message: "Name, sport, rental price, and quantity are required." });
    }
    try {
        const newEquipment = new Equipment({ name, sportSlug, sportName, description, rentalPrice, totalQuantity, availableQuantity: availableQuantity || totalQuantity, image });
        await newEquipment.save();
        res.status(201).json(newEquipment);
    } catch (err) {
        console.error("Error creating equipment:", err);
        res.status(500).json({ message: "Failed to create equipment.", error: err.message });
    }
});

app.put("/api/equipment/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const updatedEquipment = await Equipment.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedEquipment) return res.status(404).json({ message: "Equipment not found." });
        res.status(200).json(updatedEquipment);
    } catch (err) {
        console.error("Error updating equipment:", err);
        res.status(500).json({ message: "Failed to update equipment.", error: err.message });
    }
});

app.delete("/api/equipment/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Equipment.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Equipment not found." });
        res.status(200).json({ message: "Equipment deleted successfully." });
    } catch (err) {
        console.error("Error deleting equipment:", err);
        res.status(500).json({ message: "Failed to delete equipment.", error: err.message });
    }
});


// ================================ EQUIPMENT RENTALS ================================
app.get("/api/equipment-rentals", async (req, res) => {
    const { userEmail } = req.query;
    try {
        let query = {};
        if (userEmail) query.userEmail = userEmail;
        const rentals = await EquipmentRental.find(query).sort({ createdAt: -1 });
        res.status(200).json(rentals);
    } catch (err) {
        console.error("Error fetching equipment rentals:", err);
        res.status(500).json({ message: "Failed to fetch equipment rentals.", error: err.message });
    }
});

app.post("/api/equipment-rentals", async (req, res) => {
    const { rentalId, userId, userEmail, equipmentId, equipmentName, rentalDate, dueDate, totalCost } = req.body;
    if (!rentalId || !userEmail || !equipmentId || !equipmentName || !rentalDate || !dueDate || !totalCost) {
        return res.status(400).json({ message: "All required fields must be provided." });
    }
    try {
        const newRental = new EquipmentRental({ rentalId, userId, userEmail, equipmentId, equipmentName, rentalDate: new Date(rentalDate), dueDate: new Date(dueDate), totalCost });
        await newRental.save();

        // Update equipment available quantity
        await Equipment.findByIdAndUpdate(equipmentId, { $inc: { availableQuantity: -1 } });
        
        res.status(201).json(newRental);
    } catch (err) {
        console.error("Error creating equipment rental:", err);
        res.status(500).json({ message: "Failed to create equipment rental.", error: err.message });
    }
});

app.put("/api/equipment-rentals/:id", async (req, res) => {
    const { id } = req.params;
    const { returnDate, status } = req.body;
    try {
        const rental = await EquipmentRental.findById(id);
        if (!rental) return res.status(404).json({ message: "Rental not found." });

        if (status === "Returned" && !rental.returnDate) {
            // Increment available quantity when returned
            await Equipment.findByIdAndUpdate(rental.equipmentId, { $inc: { availableQuantity: 1 } });
        }

        const updatedRental = await EquipmentRental.findByIdAndUpdate(
            id,
            { ...req.body, returnDate: returnDate ? new Date(returnDate) : rental.returnDate },
            { new: true }
        );
        res.status(200).json(updatedRental);
    } catch (err) {
        console.error("Error updating equipment rental:", err);
        res.status(500).json({ message: "Failed to update equipment rental.", error: err.message });
    }
});


// ================================ TOURNAMENTS ================================
app.get("/api/tournaments", async (req, res) => {
    try {
        const tournaments = await Tournament.find({}).sort({ createdAt: -1 });
        res.status(200).json(tournaments);
    } catch (err) {
        console.error("Error fetching tournaments:", err);
        res.status(500).json({ message: "Failed to fetch tournaments.", error: err.message });
    }
});

app.post("/api/tournaments", async (req, res) => {
    const { name, sportSlug, sportName, description, startDate, endDate, location, maxParticipants, registrationDeadline, entryFee, prizes, status } = req.body;
    if (!name || !sportSlug || !sportName || !startDate || !endDate) {
        return res.status(400).json({ message: "Name, sport, start date, and end date are required." });
    }
    try {
        const newTournament = new Tournament({
            name, sportSlug, sportName, description,
            startDate: new Date(startDate), endDate: new Date(endDate),
            location, maxParticipants,
            registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : undefined,
            entryFee, prizes, status: status || "Upcoming"
        });
        await newTournament.save();
        res.status(201).json(newTournament);
    } catch (err) {
        console.error("Error creating tournament:", err);
        res.status(500).json({ message: "Failed to create tournament.", error: err.message });
    }
});

app.put("/api/tournaments/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const { startDate, endDate, registrationDeadline, ...otherData } = req.body;
        const updateData = { ...otherData };
        if (startDate) updateData.startDate = new Date(startDate);
        if (endDate) updateData.endDate = new Date(endDate);
        if (registrationDeadline) updateData.registrationDeadline = new Date(registrationDeadline);
        const updatedTournament = await Tournament.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedTournament) return res.status(404).json({ message: "Tournament not found." });
        res.status(200).json(updatedTournament);
    } catch (err) {
        console.error("Error updating tournament:", err);
        res.status(500).json({ message: "Failed to update tournament.", error: err.message });
    }
});

app.delete("/api/tournaments/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Tournament.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Tournament not found." });
        res.status(200).json({ message: "Tournament deleted successfully." });
    } catch (err) {
        console.error("Error deleting tournament:", err);
        res.status(500).json({ message: "Failed to delete tournament.", error: err.message });
    }
});


// ================================ FEEDBACK ================================
app.get("/api/feedback", async (req, res) => {
    try {
        const feedbacks = await Feedback.find({}).sort({ createdAt: -1 });
        res.status(200).json(feedbacks);
    } catch (err) {
        console.error("Error fetching feedback:", err);
        res.status(500).json({ message: "Failed to fetch feedback.", error: err.message });
    }
});

app.post("/api/feedback", async (req, res) => {
    const { userId, userEmail, userName, rating, comment } = req.body;
    if (!userEmail || !rating || !comment) {
        return res.status(400).json({ message: "Email, rating, and comment are required." });
    }
    try {
        const newFeedback = new Feedback({ userId, userEmail, userName, rating, comment });
        await newFeedback.save();
        res.status(201).json(newFeedback);
    } catch (err) {
        console.error("Error creating feedback:", err);
        res.status(500).json({ message: "Failed to create feedback.", error: err.message });
    }
});

app.put("/api/feedback/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const updatedFeedback = await Feedback.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedFeedback) return res.status(404).json({ message: "Feedback not found." });
        res.status(200).json(updatedFeedback);
    } catch (err) {
        console.error("Error updating feedback:", err);
        res.status(500).json({ message: "Failed to update feedback.", error: err.message });
    }
});

app.delete("/api/feedback/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Feedback.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Feedback not found." });
        res.status(200).json({ message: "Feedback deleted successfully." });
    } catch (err) {
        console.error("Error deleting feedback:", err);
        res.status(500).json({ message: "Failed to delete feedback.", error: err.message });
    }
});


// ================================ TRAINING SESSIONS ================================
app.get("/api/training-sessions", async (req, res) => {
    const { coachId } = req.query;
    try {
        let query = {};
        if (coachId) query.coachId = coachId;
        const sessions = await TrainingSession.find(query).sort({ date: -1 });
        res.status(200).json(sessions);
    } catch (err) {
        console.error("Error fetching training sessions:", err);
        res.status(500).json({ message: "Failed to fetch training sessions.", error: err.message });
    }
});

app.post("/api/training-sessions", async (req, res) => {
    const { coachId, coachName, sportSlug, sportName, date, time, duration, players, notes } = req.body;
    if (!coachId || !coachName || !sportSlug || !sportName || !date || !time) {
        return res.status(400).json({ message: "Coach, sport, date, and time are required." });
    }
    try {
        const newSession = new TrainingSession({ coachId, coachName, sportSlug, sportName, date: new Date(date), time, duration, players, notes });
        await newSession.save();
        res.status(201).json(newSession);
    } catch (err) {
        console.error("Error creating training session:", err);
        res.status(500).json({ message: "Failed to create training session.", error: err.message });
    }
});

app.put("/api/training-sessions/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const { date, ...otherData } = req.body;
        const updateData = { ...otherData };
        if (date) updateData.date = new Date(date);
        const updatedSession = await TrainingSession.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedSession) return res.status(404).json({ message: "Training session not found." });
        res.status(200).json(updatedSession);
    } catch (err) {
        console.error("Error updating training session:", err);
        res.status(500).json({ message: "Failed to update training session.", error: err.message });
    }
});

app.delete("/api/training-sessions/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await TrainingSession.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Training session not found." });
        res.status(200).json({ message: "Training session deleted successfully." });
    } catch (err) {
        console.error("Error deleting training session:", err);
        res.status(500).json({ message: "Failed to delete training session.", error: err.message });
    }
});


// ================================ DASHBOARD STATS ================================
app.get("/api/dashboard/stats", async (req, res) => {
    try {
        const totalUsers = await Employee.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const totalRevenue = await Booking.aggregate([
            { $match: { status: "Confirmed" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const todayBookings = await Booking.countDocuments({ "bookingDetails.bookingDate": todayStr, status: "Confirmed" });
        const upcomingTournaments = await Tournament.countDocuments({ status: "Upcoming" });
        const equipmentCount = await Equipment.countDocuments();

        res.status(200).json({
            totalUsers,
            totalBookings,
            totalRevenue: totalRevenue[0]?.total || 0,
            todayBookings,
            upcomingTournaments,
            equipmentCount
        });
    } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        res.status(500).json({ message: "Failed to fetch stats.", error: err.message });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`==============================================`);
    console.log(`Backend Server successfully running on port ${PORT}`);
    console.log(`==============================================`);
});