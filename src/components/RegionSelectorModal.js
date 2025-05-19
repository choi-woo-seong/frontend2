import React, { useState } from "react";
import "../styles/region.css";

const RegionSelectorModal = ({ isOpen, onClose, onSelectRegion }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("전체");
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

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
    경기도: ["수원시", "고양시", "성남시", "용인시", "화성시", "평택시", "군포시"],
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

  const handleSelectRegionOnly = (region) => {
    onSelectRegion(region); // 서울 전체 조회
    onClose();
  };

  const handleSelectRegion = (region) => {
    setSelectedRegion(region);
    setSelectedDistrict(null);
    setActiveTab("시/군/구");
  };

  const handleSelectDistrict = (district) => {
    setSelectedDistrict(district);
  };

  const handleConfirmSelection = () => {
    if (selectedRegion && selectedDistrict) {
      onSelectRegion(`${selectedRegion} ${selectedDistrict}`);
      onClose();
    }
  };

 return (
  <div className={`region-modal-overlay ${isOpen ? "visible" : "hidden"}`}>
    <div className="region-modal-container">
     <button
  onClick={() => {
    if (activeTab === "시/군/구") {
      setActiveTab("전체");
      setSelectedDistrict(null);
    } else {
      onClose();
    }
  }}
  className="region-close-btn"
>
  ×
</button>


      <div className="region-title">지역 선택</div>
      <hr className="region-divider" />

      <input
        type="text"
        placeholder="지역명 입력"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        className="region-search-input"
      />

      <div className="region-tab-wrapper">
        <button
          className={`region-tab-btn ${activeTab === "전체" ? "active" : ""}`}
          onClick={() => setActiveTab("전체")}
        >
          전체
        </button>
        <button
          className={`region-tab-btn ${activeTab === "시/군/구" ? "active" : ""}`}
          onClick={() => setActiveTab("시/군/구")}
          disabled={!selectedRegion}
        >
          시/군/구
        </button>
      </div>

      <div className="region-grid">
        {activeTab === "전체" ? (
          filteredRegions.map((region) => (
            <div key={region} className="region-btn-group">
              <button
                onClick={() => handleSelectRegionOnly(region)}
                className="region-btn-main"
              >
                {region} 전체
              </button>
              <button
                onClick={() => handleSelectRegion(region)}
                className="region-btn-sub"
              >
                시/군/구 선택
              </button>
            </div>
          ))
        ) : (
          filteredDistricts.map((district) => (
            <button
              key={district}
              onClick={() => handleSelectDistrict(district)}
              className={`region-btn-district ${
                selectedDistrict === district ? "selected" : ""
              }`}
            >
              {district}
            </button>
          ))
        )}
      </div>

      {activeTab === "시/군/구" && selectedDistrict && (
        <div className="region-confirm-wrapper">
          <button
            onClick={handleConfirmSelection}
            className="region-confirm-btn"
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
