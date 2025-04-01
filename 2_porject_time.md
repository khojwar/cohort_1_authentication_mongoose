video link: https://courses.chaicode.com/learn/home/Web-Dev-Cohort/Web-Dev-Cohort-Live/section/596916/lesson/3726186

#### This After 2:40 hr

After configuring boiler plate. Now, time to start project.

Now, We are creating
## Authentication System:

Data we store or
## User Schemas
    name,
    email,
    password,
    role: User, admin
    isVerified,

    passwordResetToken,
    passwordResetExpire,

    verification Token,
    created At

Now, implement in code.

create folder called ```model``` and create file inside it called ```User.model.js```

it is a ```boiler plate``` to create model (it is common for all model)

    import mongoose from "mongoose";

    const UserSchema = new mongoose.Schema({});

    const User = mongoose.model("User", UserSchema);

    export default User;


final code is: 

    import mongoose from "mongoose";

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

    const User = mongoose.model("User", UserSchema);

    export default User;







