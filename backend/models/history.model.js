import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        required: true,
        enum: ["disease", "fertilizer"]
    },
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        required: true
    },
    report: {
        type: String,
        required: true
    }
}, { timestamps: true });

const History = mongoose.model("History", historySchema, "history");
export default History;
