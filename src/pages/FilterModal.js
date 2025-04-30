import React, { useState } from "react";

function FilterModal({ title, options, selectedOption, onSelect, onApply, onClose }) {
  const [tempSelected, setTempSelected] = useState(selectedOption);

  const handleOptionClick = (option) => {
    setTempSelected(option);
  };

  const handleApply = () => {
    onApply(tempSelected);
    onClose();
  };

  const handleReset = () => {
    setTempSelected(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 relative">
        {/* 제목과 닫기 버튼 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 text-xl">×</button>
        </div>

        {/* 옵션들 */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleOptionClick(option)}
              className={`border rounded-md px-2 py-2 text-sm ${
                tempSelected === option ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* 초기화 / 적용하기 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex-1 py-2 border rounded-md text-sm text-gray-700"
          >
            초기화
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-2 bg-blue-500 text-white rounded-md text-sm"
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterModal;
