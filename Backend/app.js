require("dotenv").config();
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.get("/recommend", async (req, res) => {
  res.send("Hello GPU's");
});
app.post("/recommend", async (req, res) => {
  try {
    const { region = "mumbai", minVcpus = 0, minRam = 0, maxHourlyBudget = Infinity } = req.body;

    // Example: https://customer.acecloudhosting.com/api/v1/pricing?is_gpu=true&resource=instances&region=ap-south-mum-1
    const apiUrl = `${process.env.ACECLOUD_API_URL}?is_gpu=true&resource=instances&region=${region}`;

    const { data } = await axios.get(apiUrl);
    const instances = data.data || [];

    const recommendations = instances.filter(
      (inst) => inst.vcpus >= minVcpus && inst.ram >= minRam && inst.price_per_hour <= maxHourlyBudget
    );

    return res.json({ recommendations });
  } catch (err) {
    console.error("Error in /recommend:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
