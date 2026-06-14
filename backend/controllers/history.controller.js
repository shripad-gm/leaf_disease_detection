import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import History from "../models/history.model.js";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localDbPath = path.join(__dirname, "..", "db", "history.json");

// Helper to ensure local JSON file exists and read it
const readLocalHistory = () => {
    try {
        if (!fs.existsSync(localDbPath)) {
            return [];
        }
        const data = fs.readFileSync(localDbPath, "utf-8");
        return JSON.parse(data || "[]");
    } catch (error) {
        console.error("Error reading local history:", error);
        return [];
    }
};

// Helper to write to local JSON file
const writeLocalHistory = (data) => {
    try {
        const dir = path.dirname(localDbPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(localDbPath, JSON.stringify(data, null, 2), "utf-8");
    } catch (error) {
        console.error("Error writing local history:", error);
    }
};

export const saveHistory = async (req, res) => {
    try {
        const { userId, type, metadata, report } = req.body;
        if (!userId || !type || !metadata || !report) {
            return res.status(400).json({ error: "Missing required history fields" });
        }

        // If MongoDB is successfully connected, use it
        if (mongoose.connection.readyState === 1) {
            const newHistory = new History({
                userId,
                type,
                metadata,
                report
            });
            await newHistory.save();
            return res.status(201).json(newHistory);
        } else {
            // Fallback to local JSON storage
            console.log("MongoDB is not connected. Saving history to local JSON storage...");
            const localList = readLocalHistory();
            const newHistory = {
                _id: "local-" + Math.random().toString(36).substring(2, 11) + "-" + Date.now(),
                userId,
                type,
                metadata,
                report,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            localList.unshift(newHistory);
            writeLocalHistory(localList);
            return res.status(201).json(newHistory);
        }
    } catch (error) {
        console.error("Error saving history:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getHistory = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ error: "Missing userId parameter" });
        }

        if (mongoose.connection.readyState === 1) {
            const historyList = await History.find({ userId }).sort({ createdAt: -1 });
            return res.status(200).json(historyList);
        } else {
            console.log("MongoDB is not connected. Fetching history from local JSON storage...");
            const localList = readLocalHistory();
            const filteredList = localList
                .filter(item => item.userId === userId)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            return res.status(200).json(filteredList);
        }
    } catch (error) {
        console.error("Error getting history:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteHistoryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.query;
        if (!id || !userId) {
            return res.status(400).json({ error: "Missing id or userId" });
        }

        if (mongoose.connection.readyState === 1) {
            const deleted = await History.findOneAndDelete({ _id: id, userId });
            if (!deleted) {
                return res.status(404).json({ error: "History item not found or unauthorized" });
            }
            return res.status(200).json({ message: "History item deleted successfully" });
        } else {
            console.log("MongoDB is not connected. Deleting history item from local JSON storage...");
            const localList = readLocalHistory();
            const itemIndex = localList.findIndex(item => item._id === id && item.userId === userId);
            if (itemIndex === -1) {
                return res.status(404).json({ error: "History item not found or unauthorized" });
            }
            localList.splice(itemIndex, 1);
            writeLocalHistory(localList);
            return res.status(200).json({ message: "History item deleted successfully" });
        }
    } catch (error) {
        console.error("Error deleting history item:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const clearHistory = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ error: "Missing userId" });
        }

        if (mongoose.connection.readyState === 1) {
            await History.deleteMany({ userId });
            return res.status(200).json({ message: "History cleared successfully" });
        } else {
            console.log("MongoDB is not connected. Clearing history from local JSON storage...");
            const localList = readLocalHistory();
            const remainingList = localList.filter(item => item.userId !== userId);
            writeLocalHistory(remainingList);
            return res.status(200).json({ message: "History cleared successfully" });
        }
    } catch (error) {
        console.error("Error clearing history:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
