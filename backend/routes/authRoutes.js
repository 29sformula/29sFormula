import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    const newUser = new User({
      name: name.trim(),
      email: trimmedEmail,
      password: password,
      isGoogleUser: false
    });

    await newUser.save();
    
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isGoogleUser: false
    });
  } catch (error) {
    console.error("Manual registration failed:", error);
    res.status(500).json({ error: "Failed to register account" });
  }
});

router.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    if (user.isGoogleUser) {
      return res.status(400).json({ error: "This email is registered using Google Sign-In. Please sign in with Google." });
    }

    if (user.password !== password) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isGoogleUser: false
    });
  } catch (error) {
    console.error("Manual login failed:", error);
    res.status(500).json({ error: "Failed to log in" });
  }
});

router.post("/api/auth/google", async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: "Google token credential is required" });
    }

    const googleVerifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`;
    const verifyRes = await fetch(googleVerifyUrl);
    
    if (!verifyRes.ok) {
      const errText = await verifyRes.text();
      console.error("Google token verification failed:", errText);
      return res.status(400).json({ error: "Failed to verify Google token credential." });
    }

    const payload = await verifyRes.json();
    const { sub: googleId, email, name } = payload;

    if (!email) {
      return res.status(400).json({ error: "Google account does not provide an email address." });
    }

    const trimmedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: trimmedEmail });

    if (!user) {
      user = new User({
        name: name || "Google User",
        email: trimmedEmail,
        googleId,
        isGoogleUser: true
      });
      await user.save();
    } else if (!user.isGoogleUser) {
      user.isGoogleUser = true;
      user.googleId = googleId;
      await user.save();
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isGoogleUser: true
    });
  } catch (error) {
    console.error("Google login failed:", error);
    res.status(500).json({ error: "Failed to verify Google credentials" });
  }
});

export default router;
