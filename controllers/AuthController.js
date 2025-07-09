const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { fullname, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({"error": "Email already exists"});
        }

        const user = new User({ fullname, email, password, role });
        await user.save();

        return res.status(201).json({"message": "User registered successfully"});
    } catch (error) {
        return res.status(500).json({"error": "Server error", "details": error.message});
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({"error": "User not found"});
        }
        const isPasswordCorrect = await user.matchPassword(password);
        
        if (!isPasswordCorrect) {
            return res.status(400).json({"error": "Invalid password"});
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.status(200).json({"message": "Login successful", "token": token});
    } 
    catch (error) {
        return res.status(500).json({"error": "Server error", "details": error.message});
    }
}
