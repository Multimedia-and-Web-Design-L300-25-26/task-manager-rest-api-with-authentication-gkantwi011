import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Email must be unique
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ error: "Email already in use" });
        }

        // Password must be hashed before storing
        const hashedPassword = await bcrypt.hash(password, 8);
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        // Return user information without the password
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).send(userResponse);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).send({ error: "Unable to login" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ error: "Unable to login" });
        }

        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
        res.send({ user, token });
    } catch (error) {
        res.status(400).send();
    }
};
