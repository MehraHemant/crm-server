import mongoose from "mongoose";

const leadSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    company: {
      type: String,
    },
    address: {
      type: String,
    },
    contact: {
      type: String,
    },
    email: {
      type: String,
    },
    action: {
      type: String,
    },
    website: String,
    num_of_employees: Number,
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    lead_owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    lead_status: {
      type: String,
      enum: ["new", "contacted", "qualified", "lost", "canceled", "confirmed"],
      default: "new",
    },
    service_status: {
      type: String,
      enum: [
        "created",
        "open",
        "in-process",
        "released",
        "canceled",
        "completed",
      ],
      default: "created",
    },
  },
  { timeStamp: true }
);

export default mongoose.model("Leads", leadSchema);
