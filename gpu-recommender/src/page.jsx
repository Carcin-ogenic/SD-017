import React, { useState } from "react";
import { Card } from "antd";
import { Select, Slider, Button } from "antd";
import "antd/dist/reset.css";

const { Option } = Select;

export default function GPUForm() {
  const [formData, setFormData] = useState({
    os: "windows",
    region: undefined,
    price: [0, 10000],
    cpus: [1, 208],
    ram: [1, 2000],
  });

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

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5", display: "flex", justifyContent: "center", alignItems: "center", padding: 24 }}>
      <Card title="GPU Recommendation Form" style={{ width: "100%", maxWidth: 800 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label>Operating System</label>
            <Select
              style={{ width: "100%" }}
              value={formData.os}
              onChange={handleSelectChange("os")}
            >
              <Option value="windows">Windows</Option>
              <Option value="linux">Linux</Option>
            </Select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>Region (Required)</label>
            <Select
              style={{ width: "100%" }}
              placeholder="Select region"
              value={formData.region}
              onChange={handleSelectChange("region")}
              required
            >
              <Option value="us-east-at-1">us-east-at-1</Option>
              <Option value="ap-south-mum-1">ap-south-mum-1</Option>
              <Option value="ap-south-del-1">ap-south-del-1</Option>
              <Option value="ap-south-noi-1">ap-south-noi-1</Option>
            </Select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>Price Range: ${formData.price[0]} - ${formData.price[1]}</label>
            <Slider
              range
              min={0}
              max={10000}
              step={100}
              value={formData.price}
              onChange={handleSliderChange("price")}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>CPU Cores: {formData.cpus[0]} - {formData.cpus[1]}</label>
            <Slider
              range
              min={1}
              max={208}
              step={1}
              value={formData.cpus}
              onChange={handleSliderChange("cpus")}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>RAM Size (GB): {formData.ram[0]} - {formData.ram[1]}</label>
            <Slider
              range
              min={1}
              max={2000}
              step={10}
              value={formData.ram}
              onChange={handleSliderChange("ram")}
            />
          </div>

          <Button type="primary" htmlType="submit" block>Submit</Button>
        </form>
      </Card>
    </div>
  );
}
