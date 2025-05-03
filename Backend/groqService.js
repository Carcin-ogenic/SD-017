require("dotenv").config();
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function extractFiltersFromText(userText) {
  console.log("Extracting filters from text:", userText);

  const systemPrompt =
    `You are an assistant that extracts GPU recommendation filters from user queries. ` +
    `Allowed regions are one of: us-east-at-1, ap-south-mum-1, ap-south-del-1, ap-south-noi-1. ` +
    `Given an input text, output a JSON object with keys: ` +
    `region (string), operatingSystem (string), minVcpus (integer), maxVcpus (integer), ` +
    `minRam (integer), maxRam (integer), minbudget (number), maxbudget (number). ` +
    `If the user does not specify a value for any key, estimate a reasonable default: ` +
    `region="ap-south-mum-1", operatingSystem="linux", ` +
    `minVcpus=1, maxVcpus=32, minRam=4, maxRam=128, minbudget=1000, maxbudget=50000.`;

  const userPrompt =
    `Extract the filters from this text:\n"""${userText}"""\n` + `Respond with a valid JSON object and nothing else.`;

  const completion = await groq.chat.completions.create({
    model: "gemma2-9b-it",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  let jsonText = completion.choices[0]?.message?.content || "{}";
  console.log("Raw JSON from model:", jsonText);

  jsonText = jsonText
    .trim()
    .replace(/^```(?:json)?\n?/, "")
    .replace(/```$/, "")
    .trim();

  jsonText = jsonText.replace(/Infinity/g, "32");
  jsonText = jsonText.replace(/null/g, "0");

  try {
    let params = JSON.parse(jsonText);
    return {
      region: typeof params.region === "string" && params.region ? params.region : "ap-south-mum-1",
      operatingSystem:
        typeof params.operatingSystem === "string" && params.operatingSystem ? params.operatingSystem : "linux",
      minVcpus: Number.isInteger(params.minVcpus) && params.minVcpus > 0 ? params.minVcpus : 4,
      maxVcpus: Number.isInteger(params.maxVcpus) && params.maxVcpus >= 1 ? params.maxVcpus : 512,
      minRam: Number.isInteger(params.minRam) && params.minRam > 4 ? params.minRam : 4,
      maxRam: Number.isInteger(params.maxRam) && params.maxRam >= 4 ? params.maxRam : 512,
      minbudget: typeof params.minbudget === "number" && params.minbudget > 0 ? params.minbudget : 50,
      maxbudget: typeof params.maxbudget === "number" && params.maxbudget >= 1000 ? params.maxbudget : 500000,
    };
  } catch (err) {
    console.error("Failed to parse JSON from GROQ:", jsonText, err);
    // Return defaults on parse error
    return {
      region: "ap-south-mum-1",
      operatingSystem: "linux",
      minVcpus: 0,
      maxVcpus: Infinity,
      minRam: 0,
      maxRam: Infinity,
      minbudget: 0,
      maxbudget: Infinity,
    };
  }
}

module.exports = { extractFiltersFromText };
