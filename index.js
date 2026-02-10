require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { getAIResponse } = require("./ai");

const app = express();
app.use(cors());
app.use(express.json());

const EMAIL = "swayam0980.be23@chitkara.edu.in";

// ---------- Helper Functions ----------
const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const lcm = (a, b) => (a * b) / gcd(a, b);

// ---------- POST /bfhl ----------
app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;
    const keys = Object.keys(body);

    if (keys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        error: "Exactly one key is required"
      });
    }

    const key = keys[0];
    let data;

    if (key === "fibonacci") {
      const n = body[key];
      if (!Number.isInteger(n) || n < 0)
        throw "Invalid fibonacci input";

      data = [];
      let a = 0, b = 1;
      for (let i = 0; i < n; i++) {
        data.push(a);
        [a, b] = [b, a + b];
      }

    } else if (key === "prime") {
      if (!Array.isArray(body[key]))
        throw "Invalid prime input";
      data = body[key].filter(isPrime);

    } else if (key === "lcm") {
      const arr = body[key];
      if (!Array.isArray(arr) || arr.length === 0)
        throw "Invalid lcm input";
      data = arr.reduce((x, y) => lcm(x, y));

    } else if (key === "hcf") {
      const arr = body[key];
      if (!Array.isArray(arr) || arr.length === 0)
        throw "Invalid hcf input";
      data = arr.reduce((x, y) => gcd(x, y));

    } else if (key === "AI") {
      data = await getAIResponse(body[key]);

    } else {
      throw "Invalid key";
    }

    return res.status(200).json({
      is_success: true,
      official_email: EMAIL,
      data
    });

  } catch (err) {
    return res.status(400).json({
      is_success: false,
      error: err.toString()
    });
  }
});

// ---------- GET /health ----------
app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: EMAIL
  });
});

// ---------- Server ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
