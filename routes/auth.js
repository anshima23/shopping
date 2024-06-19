const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            // Encrypt the password using AES before storing
            password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
        });

        const savedUser = await newUser.save();
        // Return the saved user object without the password
        const { password, ...others } = savedUser._doc;
        res.status(201).json(others);
    } catch (err) {
        res.status(500).json(err); // Handle any internal server error
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        // If user is not found, send a 401 response
        if (!user) {
            return res.status(401).json("Wrong credentials");
        }

        // Decrypt the stored password and compare with the provided password
        const bytes = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
        
        console.log("Stored Password:", originalPassword);
        console.log("Request Password:", req.body.password);

        // If passwords do not match, send a 401 response
        if (originalPassword !== req.body.password) {
            return res.status(401).json("Wrong credentials");
        }

        // Generate JWT token
        const accessToken = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SEC,
            { expiresIn: "3d" }
        );

        // Return the user object without the password and the accessToken
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
    } catch (err) {
        res.status(500).json(err); // Handle any internal server error
    }
});


module.exports = router;
