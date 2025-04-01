import express from 'express';
import { registerUser, verifyUser, login,  getMe, logoutUser, forgetPassword, resetPassword} from '../controller/user.controller.js';
import { isLoggedIn } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser)
router.get('/verify/:token', verifyUser)
router.post('/login', login)
router.get("/me", isLoggedIn, getMe)
router.get("/logout", isLoggedIn, logoutUser)
router.post("/forget", forgetPassword)
router.put("/reset/:token", resetPassword)
export default router;