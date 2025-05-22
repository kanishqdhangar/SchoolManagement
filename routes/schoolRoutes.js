// routes/schoolRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// POST /addSchool
router.post("/addSchool", (req, res) => {
  const { name, address, latitude, longitude } = req.body;
  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const query = `INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)`;
  db.query(query, [name, address, latitude, longitude], (err, result) => {
    if (err) return res.status(500).json({ message: "Error inserting data.", error: err });
    res.status(201).json({ message: "School added successfully", schoolId: result.insertId });
  });
});

// GET /listSchools?latitude=...&longitude=...
router.get("/listSchools", (req, res) => {
  const { latitude, longitude } = req.query;
  if (!latitude || !longitude) {
    return res.status(400).json({ message: "Latitude and longitude are required." });
  }

  const query = `SELECT *, 
    (6371 * ACOS(COS(RADIANS(?)) * COS(RADIANS(latitude)) * 
    COS(RADIANS(longitude) - RADIANS(?)) + SIN(RADIANS(?)) * 
    SIN(RADIANS(latitude)))) AS distance 
    FROM schools 
    ORDER BY distance`;

  db.query(query, [latitude, longitude, latitude], (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching data.", error: err });
    res.json(results);
  });
});


module.exports = router;
