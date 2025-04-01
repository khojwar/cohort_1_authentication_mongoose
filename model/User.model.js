import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    }
    
}, {
    timestamps: true
});

UserSchema.pre("save", async function(next){
    if (this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

const User = mongoose.model("User", UserSchema);

export default User;