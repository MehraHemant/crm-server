import express from "express";
import authMiddleware from "../Middlewares/authMiddleware.js";
import Leads from "../Models/Leads.js";
import adminCheck from "../Middlewares/adminCheck.js";
import { roleCheck } from "../Middlewares/roleCheck.js";
import { sendMail } from "../utils/sendMail.js";

const router = express.Router();

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const lead = await Leads.create({
      ...req.body,
      creator: req.user._id,
      lead_owner: req.user.manager?._id || req.user?.admin?._id || req.user._id,
    });
    const data = {
      to: req.user.role == "admin" ? req.user.email : req.user.admin.email,
      subject: "lead created",
      html: `A lead is created by ${req.user.first_name}.`
    }
    await sendMail(data);
    return res.status(201).json({ data: lead });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

router.get("/all", authMiddleware, async (req, res) => {
  try {
    var lead = await Leads.find({lead_owner:req.user?.admin || req.user._id}).populate("creator lead_owner");
    return res.status(200).json({ data: lead });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

router.delete("/:id", authMiddleware, adminCheck, async (req, res) => {
  const id = req.params.id;
  try {
    const lead = await Leads.findByIdAndDelete(id);
    res.status(200).json({ msg: "Deleted" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
})

router.get("/:id", authMiddleware, async (req, res) => {
  const id = req.params.id;
  try {
    const lead = await Leads.findById(id).populate("creator");
    res.status(200).json({ data: lead });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
})

router.put("/:id", authMiddleware, roleCheck, async (req, res) => {
  const id = req.params.id;
  try {
    const lead = await Leads.findByIdAndUpdate(id, { ...req.body }, { new: true }).populate("creator");
    res.status(200).json({ data: lead });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
})

export default router;
