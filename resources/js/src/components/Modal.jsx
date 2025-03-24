import React from "react";
import ReactDOM from "react-dom";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
      <div className="relative bg-white rounded-lg shadow-2xl w-[95vw] max-w-[900px] p-6 md:p-10 flex flex-col overflow-y-auto max-h-[90vh] z-[1001]">
        <button onClick={onClose} className="absolute top-4 right-4 text-xl text-gray-600 hover:text-gray-900">
          ✖
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
