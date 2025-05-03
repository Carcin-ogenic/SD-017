require("dotenv").config();
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function extractFiltersFromText(userText) {
  console.log("Extracting filters from text:", userText);

  const systemPrompt =
  `You are an assistant that extracts GPU recommendation filters from short user-provided use-case descriptions. ` +
  `Your output must be a JSON object with exactly these keys (and types):\n` +
  `  • region (string): one of [us-east-at-1, ap-south-mum-1, ap-south-del-1, ap-south-noi-1]\n` +
  `  • operatingSystem (string): “linux” or “windows”\n` +
  `  • minVcpus (integer), maxVcpus (integer)\n` +
  `  • minRam (integer, GB), maxRam (integer, GB)\n` +
  `  • minbudget (number, INR), maxbudget (number, INR)\n\n` +
  `**GLOBAL HARD CAPS (never exceed):**\n` +
  `  maxVcpus ≤ 512,\n` +
  `  maxRam ≤ 2000 GB,\n` +
  `  maxbudget ≤ 1000 INR\n\n` +
  `RULES FOR INFERENCE:\n` +
  `1. **Region & OS:**\n` +
  `   • If user mentions a region, use it; otherwise default to "ap-south-mum-1".\n` +
  `   • If user specifies “Windows” or “Linux,” honor it; otherwise default to "linux".\n\n` +
  `2. **Use-Case Tiers:** Detect keywords for “low-end,” “mid-range,” or “high-end”:\n` +
  `   a) **Low-End** (e.g. “basic,” “entry-level,” “mobile dev”):\n` +
  `      • maxVcpus ≤ 16, maxRam ≤ 32 GB, maxbudget ≤ 300\n` +
  `      • minVcpus = 2–4, minRam = 4–8, minbudget = 50–150\n` +
  `   b) **Mid-Range** (e.g. “video editing,” “modern games,” “small ML”):\n` +
  `      • maxVcpus ≤ 64, maxRam ≤ 128 GB, maxbudget ≤ 800\n` +
  `      • minVcpus = 4–8, minRam = 16–32, minbudget = 150–300\n` +
  `   c) **High-End** (e.g. “high-end gaming,” “4K/8K video,” “large LLM training”):\n` +
  `      • maxVcpus ≤ 512, maxRam ≤ 2000 GB, maxbudget ≤ 1000\n` +
  `      • minVcpus = 8–16, minRam = 64–128, minbudget = 300–1000\n\n` +
  `3. **Special Cases:**\n` +
  `   • “training large models”: push toward high-end specs within caps.\n` +
  `   • “really high-end gaming”: ensure maxRam ≥ 256 GB (but ≤ 2000).\n\n` +
  `4. **Defaults as Last Resort:** If no clues, fall back to:\n` +
  `   region="ap-south-mum-1", operatingSystem="linux", ` +
  `minVcpus=4, maxVcpus=512, minRam=4, maxRam=2000, ` +
  `minbudget=50, maxbudget=1000.\n\n` +
  `**IMPORTANT:** Tighten ranges to the narrowest band that covers the use case, ` +
  `but never exceed the global hard caps.`; 





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
      maxRam: Number.isInteger(params.maxRam) && params.maxRam >= 4 ? params.maxRam : 2000,
      minbudget: typeof params.minbudget === "number" && params.minbudget > 0 ? params.minbudget : 50,
      maxbudget: typeof params.maxbudget === "number" && params.maxbudget >= 50 ? params.maxbudget : 1000,
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
