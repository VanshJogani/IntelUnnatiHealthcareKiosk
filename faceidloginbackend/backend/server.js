const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const USERS_FILE = path.join(__dirname, "users.json");

console.log("[Startup] USERS_FILE path:", USERS_FILE);

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    console.log("[readUsers] users.json not found, creating new file.");
    fs.writeFileSync(USERS_FILE, "[]");
  }
  try {
    const data = fs.readFileSync(USERS_FILE, "utf8");
    console.log("[readUsers] Read data:", data);
    return JSON.parse(data);
  } catch (e) {
    console.error("[readUsers] Error reading users.json:", e);
    return [];
  }
}

function writeUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    console.log("[writeUsers] Wrote users:", users);
  } catch (e) {
    console.error("[writeUsers] Error writing users.json:", e);
  }
}

app.post("/api/register-face", (req, res) => {
  const { username, descriptor } = req.body;
  console.log("[POST /api/register-face] username:", username);
  const users = readUsers();

  users.push({ username, descriptor });
  writeUsers(users);

  res.json({ success: true, message: "Face registered!" });
});

app.get("/api/descriptors", (req, res) => {
  console.log("[GET /api/descriptors]");
  const users = readUsers();
  res.json(users);
});

app.listen(5050, () => console.log("🚀 Server running on http://localhost:5050"));
