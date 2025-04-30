import React, { useState } from "react";

const RegionSelectorModal = ({ isOpen, onClose, onSelectRegion }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("전체"); // 기본 탭은 "전체"
  const [recentRegions, setRecentRegions] = useState([]); // 최근 본 지역 관리
  const [selectedRegion, setSelectedRegion] = useState(null); // 선택된 지역
  const [selectedDistrict, setSelectedDistrict] = useState(null); // 선택된 시/군/구

  const regions = [
    "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종",
    "경기도", "강원도", "충청북도", "충청남도", "전라북도", "전라남도",
    "경상북도", "경상남도", "제주"
  ];

  const districts = {
    서울: ["강남구", "서초구", "송파구", "강동구", "마포구", "용산구"],
    부산: ["해운대구", "남구", "북구", "사하구", "동래구", "영도구"],
    대구: ["중구", "동구", "서구", "남구", "북구", "수성구"],
    인천: ["연수구", "남동구", "미추홀구", "서구", "부평구", "계양구"],
    광주: ["동구", "서구", "남구", "북구", "광산구"],
    대전: ["동구", "중구", "서구", "유성구", "대덕구"],
    울산: ["남구", "동구", "북구", "중구", "울주군"],
    세종: ["세종시"],
    경기도: ["수원시", "고양시", "성남시", "용인시", "화성시", "평택시"],
    강원도: ["춘천시", "원주시", "강릉시", "동해시", "태백시", "속초시"],
    충청북도: ["청주시", "충주시", "제천시", "보은군", "옥천군", "영동군"],
    충청남도: ["천안시", "공주시", "보령시", "아산시", "서산시", "논산시"],
    전라북도: ["전주시", "익산시", "군산시", "남원시", "김제시", "완주군"],
    전라남도: ["목포시", "여수시", "순천시", "광양시", "담양군", "영암군"],
    경상북도: ["포항시", "경주시", "구미시", "김천시", "안동시", "영천시"],
    경상남도: ["창원시", "진주시", "통영시", "사천시", "밀양시", "김해시"],
    제주: ["제주시", "서귀포시"]
  };

  const filteredRegions = regions.filter(region =>
    region.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const filteredDistricts = selectedRegion ? districts[selectedRegion] || [] : [];

  const handleSelectRegion = (region) => {
    setSelectedRegion(region);
    setSelectedDistrict(null); // 지역 선택시 시/군/구 초기화
    setActiveTab("시/군/구"); // 지역 선택시 자동으로 시/군/구 탭으로 변경
  };

  const handleSelectDistrict = (district) => {
    setSelectedDistrict(district);
  };

  const handleConfirmSelection = () => {
    if (selectedRegion && selectedDistrict) {
      onSelectRegion(`${selectedRegion} ${selectedDistrict}`);
      setRecentRegions((prev) => [selectedRegion, ...prev.filter((r) => r !== selectedRegion)].slice(0, 5)); // 최근 본 지역 기록
      onClose(); // 지역 선택 후 모달 닫기
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ${isOpen ? "block" : "hidden"}`}
    >
      <div className="bg-white w-80 p-4 rounded-lg shadow-lg relative">
        {/* X 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 text-xl"
        >
          ×
        </button>

        {/* "지역 선택" 텍스트 */}
        <div className="text-lg font-semibold mb-2">지역 선택</div>

        {/* 구분선 추가 */}
        <div className="border-b border-gray-300 mb-4"></div>

        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="지역명 입력"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* 탭 버튼 */}
        <div className="flex justify-between mt-4">
          <button
            className={`w-1/2 p-2 text-center ${activeTab === "전체" ? "bg-blue-500 text-white" : "bg-white text-black"}`}
            onClick={() => setActiveTab("전체")}
          >
            {selectedRegion ? selectedRegion : "전체"}
          </button>
          <button
            className={`w-1/2 p-2 text-center ${activeTab === "시/군/구" ? "bg-blue-500 text-white" : "bg-white text-black"}`}
            onClick={() => setActiveTab("시/군/구")}
          >
            시/군/구
          </button>
        </div>

        {/* 탭에 따른 지역 목록 */}
        <div className="mt-4">
          {activeTab === "전체" ? (
            <div className="grid grid-cols-3 gap-2">
              {filteredRegions.map((region) => (
                <button
                  key={region}
                  onClick={() => handleSelectRegion(region)}
                  className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
                >
                  {region}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {filteredDistricts.map((district) => (
                <button
                  key={district}
                  onClick={() => handleSelectDistrict(district)}
                  className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
                >
                  {district}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 선택 완료 버튼 */}
        {selectedDistrict && (
          <div className="mt-4 text-center">
            <button
              onClick={handleConfirmSelection}
              className="bg-blue-500 text-white rounded-md py-2 px-4"
            >
              선택 완료
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionSelectorModal;
