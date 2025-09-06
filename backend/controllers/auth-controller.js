import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Verification from "../models/verification.js";
import { sendEmail } from "../libs/send-email.js";
import aj from "../libs/arcjet.js";

//create user
 const registerUser = async (req, res) => {
  try {
    const {email, name, password} = req.body;

    //Chặn đăng ký khi Arcjet phát hiện email không hợp lệ (spam, bot, bị block).
    const decision = await aj.protect(req, {
      email,
      requested: 1 // thêm dòng này để tokenBucket không báo lỗi
     });
    if (decision.isDenied()) {
        return res.status(403).json({ message: "Invalid email address" });
    }

    // Check if the user exists
    const existingUser = await User.findOne({email});
    if(existingUser) {
      return res.status(400).json({
        message: "Email address already in use"
      });
    }

    // Create user
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      email,
      password: hashPassword,
      name
    })

    // send email
    // jwt.sign(payload, secretOrPrivateKey, options) dung de generate token
    // verificationToken chứa một chuỗi JWT
    const verificationToken = jwt.sign(
      { userId: newUser._id, purpose: "email-verification"},//user info
      process.env.JWT_SECRET,
      {expiresIn: "1h"}
    );

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const emailBody = `<p>Click <a href="${verificationLink}">here</a> to verify your email</p>`;
    const emailSubject = "Verify your email";
    
    const isEmailSent = await sendEmail(email, emailSubject, emailBody);
    if(!isEmailSent) {
      return res.status(500).json({
        message: "Failed to send verification email"
      });
    }
    res.status(201).json({ 
      message: "Verification email sent to your email. Please check and verify your account"
    })

    await Verification.create({
      userId: newUser._id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
    })

  } catch (error) {
    console.log(error);
    res.status(500).json( { message: "Internal server error" });
  }
 };

 //logic verify email
// Nếu user đã verify → luôn trả "Email already verified" (kể cả token hết hạn).
// Nếu user chưa verify nhưng token hết hạn → "Token is expired".
// Nếu user chưa verify và token còn hạn → "Email verified successfully"
 const verifyEmail = async (req, res) => {
  try {
    // nếu user đã verify thì trả về luôn (bất kể token hết hạn hay không)
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(200).json({
        message: "Email already verified. You can log in now."
      });
    }

    // Nếu user chưa verify nhưng token hết hạn → "Token is expired".
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token is expired" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }

    // Nếu user chưa verify và token còn hạn → "Email verified successfully"
    if (payload.purpose !== "email-verification") {
      return res.status(401).json({ message: "Invalid purpose" });
    }

    const verification = await Verification.findOne({
      userId: payload.userId,
      token,
    });
    if (!verification) {
      return res.status(401).json({ message: "Verification record not found" });
    }

    user.isEmailVerified = true;
    await user.save();
    await Verification.findByIdAndDelete(verification._id);

    return res.status(200).json({ message: "Email verified successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
 }

 //login user
 const loginUser = async (req, res) => {
  try {
    
  } catch (error) {
    console.log(error);
    res.status(500).json( { message: "Internal server error" });
  }
 };

 export { registerUser, verifyEmail, loginUser };