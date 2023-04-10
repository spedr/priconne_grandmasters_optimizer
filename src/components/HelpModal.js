import React from 'react';
import './custom-styles.css';

const HelpModal = ({ showModal, setShowModal, helpText }) => {
  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="modal-container bg-gray-100 p-6 rounded-md shadow-md">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">About execution modes</h3>
        <p className="mb-4 text-gray-600 help-text">
          {helpText.map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < helpText.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
        <button
          className="bg-gray-500 text-white font-semibold py-1 px-3 rounded-md"
          onClick={() => setShowModal(false)}
        >
          Ok
        </button>
      </div>
    </div>
  );
};

export default HelpModal;