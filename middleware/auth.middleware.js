import jwt from "jsonwebtoken";

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
}