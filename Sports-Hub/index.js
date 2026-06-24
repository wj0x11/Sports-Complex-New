import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]); 

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Employee from "./Models/emp.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import process from "process";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("MongoDB Connected...");
    
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
                console.log("Password: admin123");
                console.log("==============================================");
            } else {
                console.log("Admin user already exists in database.");
            }
        } catch (seedErr) {
            console.error("Error seeding default admin:", seedErr);
        }
    })
    .catch(err => console.log("MongoDB connection error:", err));

app.get("/", (req, res) => {
    res.send("Sports Hub API Running Successfully");
});    



app.post("/login", async (req, res) => {
    console.log("Frontend came with data to /login:", req.body);
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


app.post("/admin-login", async (req, res) => {
    console.log("Frontend came with data to /admin-login:", req.body);
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




app.post("/register", async (req, res) => {
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

app.post("/forgot-password", async (req, res) => {
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

app.post("/reset-password", async (req, res) => {
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
            console.log(`Reset password failed: No user found with token ${token}`);
            return res.status(400).json({ message: "Password reset token is invalid." });
        }

        if (user.resetPasswordExpires < new Date()) {
            console.log(`Reset password failed: Token has expired. Expiry: ${user.resetPasswordExpires}, Current time: ${new Date()}`);
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