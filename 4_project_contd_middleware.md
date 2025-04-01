video link: https://courses.chaicode.com/learn/home/Web-Dev-Cohort/Web-Dev-Cohort-Live/section/596916/lesson/3743969


## middleware
* create folder called `middleware` and inside that folder create file called `auth.middleware.js`

### boilderplate for middleware (`middleware\auth.middleware.js`)

    export const isLoggedIn = async (req, res, next) => {
        // ....
        next();
    }

middleware always used in routes. eg. (in `routes\user.routes.js` file)

    router.get("/me", isLoggedIn, getMe)


update `middleware\auth.middleware.js` file

    jwt from "jsonwebtoken";

    export const isLoggedIn = async (req, res, next) => {
        // take token from cookies
            // check if token is present in cookies
            // verify token


            try {
                console.log(req.cookies);

                let token = req.cookies?.token

                console.log("Token found:", token? "Yes" : "No");

                if (!token) {
                    console.log("Token not found");
                    return res.status(401).json({
                        success: false,
                        message: "Authentication failed",
                    })  
                }

                // verify token
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                console.log("Decoded data:", decoded);
                
                req.user = decoded    // insert user data into request object. 
            
                next();
                
            } catch (error) {
                console.log("Auth middleware error");

                return res.status(401).json({
                    success: false,
                    message: "Internal server error",
                })   
            }

            next();
        }


for Testing propuse, `user.controller.js` 

    const getMe = async () => {
        console.log("Reach at profile level", req.user); 
    }




#### Add code in `user.controller.js` file

    const getMe = async () => {
        try {
            // console.log("Reach at profile level", req.user); 

            const user = User.findById(req.user.id).select("-password", "-verificationToken", "-isVerified", "-createdAt", "-updatedAt")
            
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "User not found",
                })
            }

            return res.status(200).json({
                success: true,
                user,
            })     
        } catch (error) {
            
        }
    }


#### Add code in `user.controller.js` file

    // logout user
    const logoutUser = async () => {
        try {
            res.cookie("token", "", {
                expires: new Date(0)    // cookie will be expired immediately
            })

            return res.status(200).json({
                success: true,
                message: "User logged out successfully",
            })
            
        } catch (error) {
            
        }
    }


#### Add code in `user.controller.js` file
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

            
        } catch (error) {
            
        }
    }


#### Add code in `user.controller.js` file
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


## MORE:
### Difference between JWT vs Normal token (crypto token)

**JWT** --> IT is the heavy token. It carry data. We can not make it short.

**Normal token (crypto token)** --> collection of character. we can make it short.

---
### `undefine` vs `null based` on mongodb

**null** --> if we use null, it set null value. `field` still will be visible. It consume the memory.

**undefine** --> if we use undefine, it remove the `field`. It not consume the memory.

 
## ------- Finished ---------

