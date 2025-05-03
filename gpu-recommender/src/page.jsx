import React, { useState } from "react";
import { Card, Select, Slider, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./App.css";

const { Option } = Select;

const defaultFormData = {
  os: "windows",
  region: "ap-south-mum-1",
  price: [0, 10000],
  cpus: [1, 208],
  ram: [1, 2000],
};

export default function GPUForm() {
  const [formData, setFormData] = useState(defaultFormData);

  const handleSliderChange = (field) => (value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSelectChange = (field) => (value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { os, region, price, cpus, ram } = formData;
    const payload = {
      os,
      region,
      minprice: price[0],
      maxprice: price[1],
      minCPUs: cpus[0],
      maxCPUs: cpus[1],
      minram: ram[0],
      maxram: ram[1],
    };
    console.log("Form submission payload:", payload);
  };

  const handleReset = () => {
    setFormData(defaultFormData);
  };

  const formatPrice = (value) => `$${value.toLocaleString()}`;
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
                value={formData.region}
                onChange={handleSelectChange("region")}
                required
              >
                <Option value="ap-south-mum-1">Asia Pacific South (Mumbai)</Option>
                <Option value="us-east-at-1">US East (at-1)</Option>
                <Option value="ap-south-del-1">Asia Pacific South (Delhi)</Option>
                <Option value="ap-south-noi-1">Asia Pacific South (Noida)</Option>
              </Select>
            </div>

            <div className="gpu-form-item">
              <label className="gpu-label">Price Range</label>
              <Slider
                className="gpu-slider"
                range
                min={0}
                max={10000}
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
                min={1}
                max={208}
                step={1}
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
                min={1}
                max={2000}
                step={10}
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
    </>
  );
}
