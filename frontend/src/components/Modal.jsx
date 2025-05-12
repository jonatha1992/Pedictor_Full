import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-green-800 to-green-900 border border-green-700 p-6 rounded-xl shadow-2xl w-full max-w-md">
        {children}
      </div>
    </div>
  );
};

export default Modal;