import React, { useState } from "react";
import { Card, Select, Slider, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./App.css";

const { Option } = Select;

const defaultFormData = {
  text: '',
  os: "windows",
  region: undefined,
  price: [50, 1000],
  cpus: [4, 512],
  ram: [4, 2000],
};

export default function GPUForm() {
  const [formData, setFormData] = useState(defaultFormData);
  const [recommendations, setRecommendations] = useState([]);
  const [desc, setDesc] = useState('')

  const handleSliderChange = (field) => (value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSelectChange = (field) => (value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { os, region, price, cpus, ram } = formData;

    if (!region) {
      alert("Please select a region.");
      return;
    }

    const payload = {
      text : desc,
      operatingSystem: os,
      region,
      minbudget: price[0],
      maxbudget: price[1],
      minVcpus: cpus[0],
      maxVcpus: cpus[1],
      minRam: ram[0],
      maxRam: ram[1],
    };

    try {
      const response = await fetch("http://localhost:3000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Request failed");

      const data = await response.json();
      setRecommendations(data.recommendations);
      console.log("Recommendations:", data.recommendations);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      alert("Something went wrong while fetching recommendations.");
    }
  };

  const handleReset = () => {
    setFormData(defaultFormData);
    setRecommendations([]);
  };

  const formatPrice = (value) => `₹${value.toLocaleString()}`;
  const formatCores = (value) => `${value} Cores`;
  const formatRAM = (value) => `${value} GB`;

  return (
    <>
      <header className="gpu-header">
        <SearchOutlined style={{ fontSize: "24px", marginRight: "12px" }} />
        FindMyGPU
      </header>

      <div className="gpu-container">
        <Card className="gpu-card">
          <form onSubmit={handleSubmit}>
            <div className="gpu-form-item">
              <label className="gpu-label">Describe Your Use Case</label>
              <textarea
                className="gpu-textarea"
                rows={4}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="e.g., Machine learning training, 3D rendering..."
              />
            </div>
            <div className="gpu-form-item">
              <label className="gpu-label">Operating System</label>
              <Select
                className="gpu-select"
                value={formData.os}
                onChange={handleSelectChange("os")}
              >
                <Option value="windows">Windows</Option>
                <Option value="linux">Linux</Option>
              </Select>
            </div>

            <div className="gpu-form-item">
              <label className="gpu-label">
                Region<span className="gpu-required">*</span>
              </label>
              <Select
                className="gpu-select"
                placeholder="Select region"
                value={formData.region}
                onChange={handleSelectChange("region")}
              >
                <Option value="us-east-at-1">US East (at-1)</Option>
                <Option value="ap-south-mum-1">Asia Pacific South (Mumbai)</Option>
                <Option value="ap-south-del-1">Asia Pacific South (Delhi)</Option>
                <Option value="ap-south-noi-1">Asia Pacific South (Noida)</Option>
              </Select>
            </div>

            <div className="gpu-form-item">
              <label className="gpu-label">Price Range (per hour)</label>
              <Slider
                className="gpu-slider"
                range
                min={50}
                max={1000}
                step={100}
                value={formData.price}
                onChange={handleSliderChange("price")}
                tipFormatter={formatPrice}
              />
              <div className="gpu-value-display">
                {formatPrice(formData.price[0])} - {formatPrice(formData.price[1])}
              </div>
            </div>

            <div className="gpu-form-item">
              <label className="gpu-label">CPU Cores</label>
              <Slider
                className="gpu-slider"
                range
                min={4}
                max={512}
                step={4}
                value={formData.cpus}
                onChange={handleSliderChange("cpus")}
                tipFormatter={formatCores}
              />
              <div className="gpu-value-display">
                {formatCores(formData.cpus[0])} - {formatCores(formData.cpus[1])}
              </div>
            </div>

            <div className="gpu-form-item">
              <label className="gpu-label">RAM Size</label>
              <Slider
                className="gpu-slider"
                range
                min={4}
                max={2000}
                step={4}
                value={formData.ram}
                onChange={handleSliderChange("ram")}
                tipFormatter={formatRAM}
              />
              <div className="gpu-value-display">
                {formatRAM(formData.ram[0])} - {formatRAM(formData.ram[1])}
              </div>
            </div>

            <div className="gpu-button-group">
              <Button type="primary" htmlType="submit" className="gpu-submit">
                Find Recommended GPUs
              </Button>
              <Button onClick={handleReset} className="gpu-reset">
                Reset Form
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {recommendations.length > 0 && (
        <div className="gpu-results">
          <h2 className="gpu-results-title">Recommended GPU Instances</h2>
          {recommendations.map((gpu, index) => (
            <Card
              key={index}
              title={gpu.resource_name}
              className="gpu-recommendation-card"
              style={{ margin: "16px" }}
            >
              <p><strong>OS:</strong> {gpu.operating_system}</p>
              <p><strong>vCPUs:</strong> {gpu.vcpus}</p>
              <p><strong>RAM:</strong> {gpu.ram} GB</p>
              <p><strong>Price per Month:</strong> ₹{gpu.price_per_month.toLocaleString()}</p>
              <p><strong>GPU:</strong> {gpu.gpu_description}</p>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
