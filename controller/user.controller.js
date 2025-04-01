import User from "../model/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { log } from "console";

// register user
const registerUser = async (req, res) => {
    
    // get data
    // validate data
    // check if user already exists
    // create user database
    // create verification token
    // save verification token in database
    // send verification token as email to user
    // send success status to user

    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required",
        })
    }

    try {
        const existingUser = await User.findOne({email})

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            })
        }
        
        const user = await User.create({
            name,
            email,
            password,
        })
        console.log(user);
        
        if (!user) {
            return res.status(400).json({
                message: "User not registered",
            })
        }

        const token = crypto.randomBytes(32).toString("hex")
        console.log(token);

        user.verificationToken = token;

        await user.save();
        
        // send email
        var transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAILTRAP_USERNAME, 
                pass: process.env.MAILTRAP_PASSWORD, 
            }
        });

        const mailOption = {
            from: process.env.MAILTRAP_SENDEREMAIL, // sender address
            to: user.email, // list of receivers
            subject: "Verify your email", // Subject line
            text: `Please click in the following link:
            ${process.env.BASE_URL}/api/v1/users/verify/${token}
            `, // plain text body
        }

        await transporter.sendMail(mailOption)

        res.status(201).json({
            message: "User registered successfully",
            success: true,
        })

    } catch (error) {
        return res.status(400).json({
            message: "User not registered",
            error,
            success: false,
        })
    }
};

// verify user
const verifyUser = async (req, res) => {
    // get token from url
    // validate
    // find user by token
    // if not
    // set user isVerified to true
    // remove verification token
    // save user
    // return response

    const {token} = req.params;
    console.log(token);

    if (!token) {
        return res.status(400).json({
            message: "Invalid token",
        })
    }

    try {
        const user = await User.findOne({verificationToken: token})

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        return res.status(200).json({
            message: "Email verified successfully. You can now log in.",
            success: true,
        });

        
    } catch (error) {
        return res.status(500).json({
            message: "Verification failed",
            error: error.message,
            success: false,
        });

    }
}

// login user
const login = async (req, res) => {

    // get username and password
    // validate
    // Find User in Database
    // Check User Existence & Verification Status
    // Verify (check) Password using bcrypt.compare()
    // Generate JWT Token using jwt.sign()
    // Set JWT Token in Cookie using res.cookie()
    // Send Response to User


    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "All fields are required",
        })
    }

    try {
        const user = await User.findOne({email})

        if (!user || !user.isVerified) {
            return res.status(400).json({ message: "Invalid credentials or email not verified" });
        }
        
        const isMatch = await bcrypt.compare(password, user.password)

        console.log(isMatch);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials",
            })
        }

        const token = jwt.sign({id: user._id}, 
            process.env.JWT_SECRET, 
            {expiresIn: '14h'}
        )
        
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        }

        res.cookie('token', token, cookieOptions)

        res.status(200).json({
            message: "User logged in successfully",
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
            }
        })




    } catch (error) {
        return res.status(500).json({
            message: "User not logged in",
            error,
            success: false,
        })
        
    }
}

// profile
const getMe = async (req, res) => {
    try {
        // console.log("Reach at profile level", req.user); 

        const user = User.findById(req.user.id).select("-password", "-verificationToken", "-isVerified", "-createdAt", "-updatedAt")
        
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            })
        }

        res.status(200).json({
            success: true,
            user,
        })  
    } catch (error) {
        console.log("Error at profile level", error.message);
        
    }
}

// logout user
const logoutUser = async (req, res) => {
    try {

        res.cookie("token", "", {
            // expires: new Date(0)    // cookie will be expired immediately
        })

        return res.status(200).json({
            success: true,
            message: "User logged out successfully",
        })
        
    } catch (error) {
        
    }
}

// forgot password
const forgetPassword = async (req, res) => {
    try {
        // get email from request body
        // validate email
        // find user by email
        // if not found, return error
        // generate reset password token using crypto and set reset expiry time 
        // save token in database (user.save())
        // send email to user with reset password link (design url)
        // send success response

        const {email} = req.body

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            })
        }

        // find user by email
        const user = await User.findOne({email})

        if (!user) {
            return res.status(400).json({
                message: "User not found",
            })
        }

        // generate reset password token using crypto and set reset expiry time
        const resetToken = crypto.randomBytes(32).toString("hex")

        // set reset password token and expiry time in user object
        user.resetPasswordToken = resetToken;    // set reset password token in user object
        user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;   // set expiry time in user object (30 minutes)

        await user.save();    // save user object in database


        // send email to user with reset password link (design url)
        var transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAILTRAP_USERNAME, 
                pass: process.env.MAILTRAP_PASSWORD, 
            }
        });

        const mailOption = {
            from: process.env.MAILTRAP_SENDEREMAIL, // sender address
            to: user.email, // list of receivers
            subject: "Verify your email", // Subject line
            text: `Please click in the following link:
            ${process.env.BASE_URL}/api/v1/users/reset/${resetToken}
            `, // plain text body
        }

        await transporter.sendMail(mailOption)

        return res.status(200).json({
            success: true,
            message: `Reset password link sent to ${user.email}`,
        })
   
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
            success: false,
        })
    }
}

// reset password
const resetPassword = async (req, res) => {
    // get token from url
    // get password from request body
    // get user by token and expiry time
    // set password in user object
    // remove reset password token and expiry time from user object
    // save user object in database

    const {token} = req.params;
    const {password} = req.body;

    console.log(token, password);
    
    try {
        const user = await User.findOne({
            resetPasswordToken: token,      // token should be correct
            resetPasswordExpire: { $gt: Date.now() }    // token should not be expired
        })

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired token",
            })
        }

        console.log("User found:", user);  

        // set password in user object
        user.password = password;    // set password in user object

        user.resetPasswordToken = undefined;    // remove reset password token from user object
        user.resetPasswordExpire = undefined;    // remove reset password expiry time from user object

        await user.save();    // save user object in database

        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        })
        
    } catch (error) { 
          
    }
}



export { registerUser, verifyUser, login, getMe, logoutUser, forgetPassword, resetPassword };


