video link: https://courses.chaicode.com/learn/home/Web-Dev-Cohort/Web-Dev-Cohort-Live/section/596916/lesson/3730619

## overview of previous task:
1. project initialize: ```npm init```
2. common type of error: ```"type": "module"```
3. create ```index.js```

    * import express 
    * port: process.env.PORT
    * routing
    * error
        * cors
    * express.json()
    * express.urlencoded()

4. install ```dotenv``` package
5. create models
6. create controller --> it is basic functions
7. create route 


---

## let's continue from here

We mainly work in two files:
* Controller and 
* Routes

### let's write controller for user-registration

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



### Now, verify the user based on token

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

        const user = await User.findOne({verificationToken: token})

        if (!user) {
            return res.status(400).json({
                message: "Invalid token",
            })
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();


    }

    export { registerUser, verifyUser };


### if we want to modify something before save. we can do apply middleware in model file.

*User.model.js*

#### sample boiler plate 

    UserSchema.pre("save", async function(next){
        
        next();
    })

full file is

    UserSchema.pre("save", async function(next){
        if (this.isModified("password")){
            this.password = await bcrypt.hash(this.password, 10);
        }
        next();
    })

#### update user.routes.js

    import express from 'express';
    import { registerUser, verifyUser } from '../controller/user.controller.js';

    const router = express.Router();

    router.post('/register', registerUser)
    router.get('/verify/:token', verifyUser)

    export default router;



### user login conroller

    const login = async (req, res) => {

        // get username and password
        // validate
        // check if user exists
        // compare password


        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            })
        }

        try {
            const user = await User.findOne(email)

            if (!user) {
                return res.status(400).json({
                    message: "Invalid credentials",
                })
            }

            const isMatch = await bcrypt.compare(password, user.password)

            console.log(isMatch);

            if (!isMatch) {
                return res.status(400).json({
                    message: "Invalid credentials",
                })
            }

            const token = jwt.sign({id: user._id}, 
                'shhhhh', 
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
            return res.status(400).json({
                message: "User not logged in",
                error,
                success: false,
            })
            
        }
    }


    export { registerUser, verifyUser, login };



### update user.routes.js

    import express from 'express';
    import { registerUser, verifyUser, login } from '../controller/user.controller.js';

    const router = express.Router();

    router.post('/register', registerUser)
    router.get('/verify/:token', verifyUser)
    router.post('/login', login)

    export default router;




### we can work on Additional features

1. if user need user's profile then we need route (we can write)
2. logout 
3. forgot password
4. reset password










