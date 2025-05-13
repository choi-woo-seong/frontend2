// components/FacilitySelectModal.jsx
import React from "react";
import "../styles/FacilityType.css"; // ✅ CSS 불러오기

const categories = ["요양병원", "요양원", "실버타운"];

function FacilitySelectModal({ isOpen, onClose, onSelect }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 facility-modal">
      <div className="bg-white p-6 rounded-xl shadow-lg w-80 facility-modal-box">
        <h2 className="text-lg font-semibold mb-4 text-blue-600">
          시설 유형 선택
        </h2>
        <ul className="space-y-3">
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => {
                  onSelect(cat);
                  onClose();
                }}
                className="w-full px-4 py-2 border rounded-lg text-sm facility-select-btn"
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 text-sm close-btn hover:underline"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default FacilitySelectModal;
