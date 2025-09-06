import mongoose from "mongoose";

const verificationShema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true
  },
  token: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
  }
}, {timestamps: true});

const Verification = mongoose.model("Verificattion", verificationShema);

export default Verification;