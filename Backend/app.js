require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
const { extractFiltersFromText } = require("./groqService.js");

const app = express();
const PORT = 3000;

app.use(cors());

app.use(bodyParser.json());

app.get("/recommend", async (req, res) => {
  res.send("Hello GPU's");
});
app.post("/recommend", async (req, res) => {
  //   console.log("REQ", req.body);
  try {
    let {
      region = "ap-south-mum-1",
      operatingSystem = "linux",
      minVcpus = 0,
      maxVcpus = Infinity,
      minRam = 0,
      maxRam = Infinity,
      minbudget = 0,
      maxbudget = Infinity,
      text,
    } = req.body;

    if (text && text.trim().length > 0) {
      let nlpFilters = await extractFiltersFromText(text);
      //   console.log(nlpFilters);
      ({ region, operatingSystem, minVcpus, maxVcpus, minRam, maxRam, minbudget, maxbudget } = nlpFilters);
    }

    // Example: https://customer.acecloudhosting.com/api/v1/pricing?is_gpu=true&resource=instances&region=ap-south-mum-1
    const apiUrl = `${process.env.ACECLOUD_API_URL}` + `?is_gpu=true` + `&resource=instances` + `&region=${region}`;

    // console.log("api", apiUrl);
    const { data } = await axios.get(apiUrl);
    const instances = data.data || [];

    const recommendations = instances.filter((inst) => {
      if ((inst.operating_system || "").toLowerCase() !== operatingSystem.toLowerCase()) return false;
      const withinVcpus = inst.vcpus >= minVcpus && inst.vcpus <= maxVcpus;
      const withinRam = inst.ram >= minRam && inst.ram <= maxRam;

      let priceInINR = inst.price_per_hour;
      const currency = (inst.currency || "INR").toUpperCase();
      if (currency === "USD") {
        priceInINR = inst.price_per_hour * process.env.USD_TO_INR;
      }

      const withinPrice = priceInINR >= minbudget && priceInINR <= maxbudget;
      return withinVcpus && withinRam && withinPrice;
    });

    return res.json({ recommendations });
  } catch (err) {
    console.error("Error in /recommend:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
