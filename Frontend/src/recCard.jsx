import React, { useState } from 'react';
import { Modal, Button } from 'antd';

const GPURecommendations = ({ recommendations, hasSearched = false }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedGpu, setSelectedGpu] = useState(null);

  const showModal = (gpu) => {
    setSelectedGpu(gpu);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedGpu(null);
  };
  if(recommendations.length >= 10)
  {
    recommendations = recommendations.slice(0,3);
  }
  return (
    <>
      {recommendations.length > 0 && (
        <div className="gpu-container">
          <div className="gpu-card-grid">
            {recommendations.map((gpu, index) => (
              <div key={index} className="gpu-card" onClick={() => showModal(gpu)}>
                <div className="gpu-card-body">
                  <h3 className="gpu-name uppercase">{gpu.resource_class}</h3>
                  <ul className="gpu-info">
                    <li><strong>OS:</strong> {gpu.operating_system}</li>
                    <li><strong>vCPUs:</strong> {gpu.vcpus}</li>
                    <li><strong>RAM:</strong> {gpu.ram} GB</li>
                    <li><strong>Price per Hour:</strong> ₹{gpu.price_per_hour.toLocaleString()}</li>
                    <li><strong>GPU:</strong> {gpu.gpu_description}</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recommendations.length === 0 && hasSearched && (
        <div className="gpu-container flex items-center justify-center">
          <div className="bg-red-50 text-red-600 border border-red-200 px-6 py-4 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-semibold mb-1">Sorry, the GPUs are not available. </h2>
            <p className="text-xl text-red-500">We will notify you when the GPU becomes available.</p>
          </div>
        </div>
      )}

      {/* Ant Design Modal */}
      {selectedGpu && (
        <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button
            key="back"
            onClick={handleCancel}
            className="bg-gray-800 text-white hover:bg-gray-700 rounded px-4 py-2 transition"
          >
            Close
          </Button>,
        ]}
        width={600}
        className="!p-0"
        bodyStyle={{ padding: 0 }}
      >
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden mt-10">
          <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center uppercase">{selectedGpu.resource_class}</h1>
            {/* <p className="text-sm text-gray-500 mb-4">Professional-grade GPU instance</p> */}
          </div>
      
          <div className="grid grid-cols-2 gap-6 px-6 py-4 border-t">
            <div>
              <p className="text-sm text-gray-500">Operating System</p>
              <p className="text-base font-medium text-gray-800">{selectedGpu.operating_system}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">vCPUs</p>
              <p className="text-base font-medium text-gray-800">{selectedGpu.vcpus}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">RAM</p>
              <p className="text-base font-medium text-gray-800">{selectedGpu.ram} GB</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Price / Hour</p>
              <p className="text-base font-semibold text-green-600">₹{selectedGpu.price_per_hour.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Price / Month</p>
              <p className="text-base font-semibold text-green-600">₹{selectedGpu.price_per_month.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Price / Spot</p>
              <p className="text-base font-semibold text-green-600">₹{selectedGpu.price_per_spot.toLocaleString()}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">GPU Description</p>
              <p className="text-base font-medium text-gray-800">{selectedGpu.gpu_description}</p>
            </div>
          </div>
        </div>
      </Modal>
      
      
      )}
    </>
  );
};

export default GPURecommendations;