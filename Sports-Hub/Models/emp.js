import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
});

const Employee = mongoose.model("emp", employeeSchema);
export default Employee;