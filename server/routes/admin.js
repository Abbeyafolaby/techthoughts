import express from "express";
import Post from "../models/Post.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const adminLayout = "../views/layouts/admin.ejs";

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET


// Check Login
const authMiddleware = (req, res, next) =>{
    const token = req.cookies.token

    if(!token) {
        return res.status(401).json({message: "Unauthorized User"});
    } else {
        try {
            const decoded = jwt.verify(token, jwtSecret)
            req.userId = decoded.userId;
            next();

        } catch (error) {
            return res.status(401).json({message: "Unauthorized User"});
        }
    }
}

//Get Admin - Login page

router.get("/admin", async (req, res) => {
    try {
        const locals = {
            title: "Admin Dashboard",
            description: "Simple Blog admin dashboard"
        }

        res.render("admin/index",  {locals, layout: adminLayout});
    } catch (error) {
        console.log(error);
    }
});

// 

router.post("/admin", async (req, res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({username});

        if (!user) {
            return res.status(401).json({message: "Invalid credentials"});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({message: "Invalid credentials"})
        }

        const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });
        res.cookie("token", token, {httpOnly: true});
        res.redirect("/dashboard")

    } catch (error) {
        console.log(error);
    }
});


router.get("/dashboard", authMiddleware, async (req, res) => {
    res.render("admin/dashboard")
});


router.post('/register', async (req, res) => {
try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
    const user = await User.create({ username, password:hashedPassword });
    res.status(201).json({ message: 'User Created', user });
    } catch (error) {
    if(error.code === 11000) {
        res.status(409).json({ message: 'User already in use'});
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error'})
    }

} catch (error) {
    console.log(error);
}
});

export default router;