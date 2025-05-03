# Spec Choice (GPU Recommender) (SD‑017)
# Demo Link : https://youtu.be/B8C6pciHDec
A full‑stack web application to help users select the best GPU based on their needs and preferences.

---

## Table of Contents

- [About](#about)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Setup](#setup)  
  - [Prerequisites](#prerequisites)  
  - [Environment Variables](#environment-variables)  
  - [Installation](#installation)  
  - [Running the App](#running-the-app)  
- [API Reference](#api-reference)  
- [Folder Structure](#folder-structure)  
- [Contributing](#contributing)  
- [License](#license)  
- [Contact](#contact)  

---

## About

GPU Recommender is a lightweight, high‑performance web application that helps users choose a graphics card (GPU) tailored to their specific workloads—gaming, rendering, machine learning, or general productivity. A Node.js/Express backend fetches and filters a dataset, while a React/Vite/AntD frontend provides an intuitive interface.

---

## Features

- 🔍 Search and filter GPUs by brand, memory size, price range, and more  
- 📊 Sort recommendations by benchmark scores or price/performance ratio  
- ⚙️ Configurable criteria and weighting system  
- 🌐 CORS‑enabled REST API  
- 🔒 Environment‑driven configuration (API keys, database URLs)

---

## Tech Stack

- **Backend**: Node.js, Express, GROQ‑SDK (Sanity), Axios, dotenv, CORS, body‑parser  
- **Frontend**: React v19 + Vite, Ant Design, TailwindCSS  
- **Dev Tools**: ESLint, Vite, npm scripts  

---

## Setup

### Prerequisites

- Node.js >= 18.x  
- npm >= 9.x  

### Environment Variables

Create a `.env` file in the `Backend/` folder with:

```bash
PORT=3000
ACECLOUD_API_URL=your_sanity_project_id
USD_TO_INR=82
GROQ_API_KEY==https://api.yourdomain.com
```

Customize or add additional keys as needed for your data source.

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/Carcin-ogenic/SD-017.git
cd SD-017

# 2. Install Backend dependencies
cd Backend
npm install

# 3. Install Frontend dependencies
cd ../Frontend
npm install
```

### Running the App

#### Backend

```bash
cd Backend
npm start   # or `node app.js`
```

#### Frontend

```bash
cd Frontend
npm run dev
```

- Frontend Dev Server: http://localhost:5173  
- Backend API: http://localhost:<PORT> (default: 3000)

---

## API Reference

> **Note:** Adjust routes to your implementation.

- **GET** `/api/gpus`  
  Fetch all GPUs (supports query filters: `brand`, `vram`, `price`, etc.)

- **GET** `/api/gpus/:id`  
  Fetch details for a single GPU.

- **POST** `/api/recommend`  
  Send user criteria (weights) to receive top‑N recommendations.

---

## Folder Structure

```
SD-017/
├── Backend/
│   ├── index.js        # Express server entry
│   ├── routes/         # API route handlers
│   ├── services/       # Business logic & data access
│   ├── .env.example    # Sample env variables
│   └── package.json
│
└── Frontend/
    ├── public/         # Static assets
    ├── src/
    │   ├── App.jsx
    │   ├── components/  # Reusable UI pieces
    │   ├── pages/       # Page-level views
    │   └── styles/      # Tailwind & CSS files
    └── package.json
```

---

## Contributing

Contributions welcome!  

1. Fork the repository  
2. Create a feature branch: `git checkout -b feature/AmazingFeature`  
3. Commit your changes: `git commit -m "Add amazing feature"`  
4. Push to your branch: `git push origin feature/AmazingFeature`  
5. Open a Pull Request

Please follow existing code style and include tests where appropriate.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

👤 **Carcin-ogenic**  
GitHub: [https://github.com/Carcin-ogenic](https://github.com/Carcin-ogenic)  

Feel free to open issues or pull requests for bugs, suggestions, or improvements. Enjoy!
