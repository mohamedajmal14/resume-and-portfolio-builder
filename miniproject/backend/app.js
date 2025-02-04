const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const User = require("./mongo"); // Import the User model
const PortfolioModel = require('./portfolio'); // Adjust the path as necessary


const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Secret key for JWT
const JWT_SECRET = "a57b2dd842d221dd543c11459831e0eb6a4ea9729320f425499d34066d3661a6b9a034d25333a0cb34aa4a3fa4f5ea3529f6a0a2fda383b9c949dd567976b0a1"; // Replace with a more secure secret key

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Save uploaded files in the "uploads" directory
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique file name with timestamp
    },
});
const upload = multer({ storage });

// POST route for login
app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(email);
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// POST route for signup
app.post("/api/auth/signup", async (req, res) => {
    const { firstName, email, password, confirmPassword } = req.body;
    console.log(email,firstName,password,confirmPassword);

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            email,
            password: hashedPassword, // Save hashed password
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ message: "Signup successful", token, user: newUser });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// Middleware to verify JWT token
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    
    if (!token) {
        return res.status(401).json({ message: "Authentication token missing" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

// Example of a protected route
app.get("/api/user/profile", authenticateJWT, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Profile fetch error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// POST route for profile image upload
app.post("/api/user/uploadProfileImage", upload.single("profileImage"), async (req, res) => {
    const { userId } = req.body; // Get userId from request body
    const imagePath = req.file ? `uploads/${req.file.filename}` : null; // Get the image path

    if (!imagePath) {
        return res.status(400).json({ message: "No image uploaded" });
    }

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { profileImage: imagePath },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile image updated successfully", profileImage: imagePath });
    } catch (error) {
        console.error("Image upload error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});


// PUT route for updating user profile
app.put("/api/user/update", authenticateJWT, async (req, res) => {
    const { firstName, email, password, userId } = req.body;

    // Create an object to hold the updated data
    const updatedData = {};
    
    // Update fields only if they are provided
    if (firstName) updatedData.firstName = firstName;
    if (email) updatedData.email = email;
    if (password) {
        // Hash the new password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        updatedData.password = hashedPassword;
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

app.post('/api/portfolio/add', async (req, res) => {
    const { title, description, technologies, demoLink, githubLink, userId } = req.body;

    // Check for required fields
    if (!title || !description || !technologies || !userId) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const portfolioItem = new PortfolioModel({
            title,
            description,
            technologies,
            demoLink,
            githubLink,
            user: userId,
        });

        await portfolioItem.save();
        res.status(201).json(portfolioItem);
    } catch (error) {
        console.error("Error adding portfolio item:", error); // Log the error
        res.status(500).json({ message: 'Failed to add portfolio item.', error: error.message });
    }
});

  

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/react-auth")
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.error("MongoDB connection error:", error));

// Start the server on port 5000
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
