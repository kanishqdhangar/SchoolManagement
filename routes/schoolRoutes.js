// routes/schoolRoutes.js
import express from "express";
import { db } from "../db.js";

const router = express.Router();

// POST /addSchool
router.post("/addSchool", async (req, res) => {
  const { name, address, latitude, longitude } = req.body;
  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const query = `INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)`;
    const [result] = await db.query(query, [name, address, latitude, longitude]);

    res.status(201).json({ message: "School added successfully", schoolId: result.insertId });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ message: "Error inserting data.", error: err.message });
  }
});

// GET /listSchools?latitude=...&longitude=...
router.get("/listSchools", async (req, res) => {
  const { latitude, longitude } = req.query;
  if (!latitude || !longitude) {
    return res.status(400).json({ message: "Latitude and longitude are required." });
  }

  try {
    const query = `
      SELECT *, 
        (6371 * ACOS(COS(RADIANS(?)) * COS(RADIANS(latitude)) * 
        COS(RADIANS(longitude) - RADIANS(?)) + SIN(RADIANS(?)) * 
        SIN(RADIANS(latitude)))) AS distance 
      FROM schools 
      ORDER BY distance
    `;
    const [results] = await db.query(query, [latitude, longitude, latitude]);

    res.json(results);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Error fetching data.", error: err.message });
  }
});

export default router;
