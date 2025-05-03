import React, { useState } from 'react';
import { Modal, Button } from 'antd';

const GPURecommendations = ({ recommendations }) => {
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
    recommendations = recommendations.slice(0,10);
  }
  return (
    <>
      {recommendations.length > 0 && (
        <div className="gpu-container">
          <div className="gpu-card-grid">
            {recommendations.map((gpu, index) => (
              <div key={index} className="gpu-card" onClick={() => showModal(gpu)}>
                <div className="gpu-card-body">
                  <h3 className="gpu-name">{gpu.resource_name}</h3>
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

      {/* Ant Design Modal */}
      {selectedGpu && (
        <Modal
          title={selectedGpu.resource_name}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Close
            </Button>,
          ]}
          className="h-[400px] w-[400px]"
          width={600}                              // sets modal width to 800px
            // style={{ top: 50 }}                      // moves modal down 50px from the top
            bodyStyle={{
                maxHeight: '120vh',                     // inner content max-height
                overflowY: 'auto',                     // scroll if content overflows                       // optional: adjust padding
        }}
        >
          <ul>
            <li><strong>OS:</strong> {selectedGpu.operating_system}</li>
            <li><strong>vCPUs:</strong> {selectedGpu.vcpus}</li>
            <li><strong>RAM:</strong> {selectedGpu.ram} GB</li>
            <li><strong>Price per Hour:</strong> ₹{selectedGpu.price_per_hour.toLocaleString()}</li>
            <li><strong>GPU:</strong> {selectedGpu.gpu_description}</li>
          </ul>
        </Modal>
      )}
    </>
  );
};

export default GPURecommendations;