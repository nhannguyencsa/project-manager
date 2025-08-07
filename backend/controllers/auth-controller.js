import User from "../models/user.js";
import bcrypt from "bcrypt";

 const registerUser = async (req, res) => {
  try {
    const {email, name, password} = req.body;

    // Check if the user exists
    const existingUser = await User.findOne({email});
    if(existingUser) {
      res.status(400).json({
        message: "Email address already in use"
      });
    }

    // hash the password
    const  salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      password: hashPassword,
      name
    })

    res.status(201).json({ 
      message: "Verification email sent to your email. Please check and verify your account"
    })

  } catch (error) {
    console.log(error);
    error.statuss(500).json( { message: "Internal server error" });
  }
 };

 const loginUser = async (req, res) => {
   try {
    
  } catch (error) {
    console.log(error);
    error.statuss(500).json( { message: "Internal server error" });
  }
 };

 export { registerUser, loginUser };