import React, { useState } from "react";
import "../styles/region.css";

const RegionSelectorModal = ({ isOpen, onClose, onSelectRegion }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("전체");
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  // 최상위 행정구역
  const regions = [
    "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종",
    "경기도", "강원도", "충청북도", "충청남도",
    "전라북도", "전라남도", "경상북도", "경상남도", "제주"
  ];

  // 시·도별 구·군·시 목록
  const districts = {
    서울: [
      "종로구","중구","용산구","성동구","광진구","동대문구","중랑구",
      "성북구","강북구","도봉구","노원구","은평구","서대문구","마포구",
      "양천구","강서구","구로구","금천구","영등포구","동작구","관악구",
      "서초구","강남구","송파구","강동구"
    ],
    부산: [
      "중구","서구","동구","영도구","부산진구","동래구","남구","북구",
      "해운대구","사하구","금정구","강서구","연제구","수영구","사상구",
      "기장군"
    ],
    대구: [
      "중구","동구","서구","남구","북구","수성구","달서구","달성군"
    ],
    인천: [
      "중구","동구","남구","미추홀구","연수구","남동구","부평구","계양구",
      "서구","강화군","옹진군"
    ],
    광주: ["동구","서구","남구","북구","광산구"],
    대전: ["동구","중구","서구","유성구","대덕구"],
    울산: ["중구","남구","동구","북구","울주군"],
    세종: ["세종시"],

    경기도: [
      "수원시","성남시","의정부시","안양시","부천시","광명시","평택시",
      "동두천시","안산시","고양시","과천시","구리시","남양주시","오산시",
      "시흥시","군포시","의왕시","하남시","용인시","파주시","이천시",
      "안성시","김포시","화성시","광주시","여주시","양평군","포천시",
      "가평군","연천군"
    ],
    강원도: [
      "춘천시","원주시","강릉시","동해시","태백시","속초시","삼척시",
      "홍천군","횡성군","영월군","평창군","정선군","철원군","화천군",
      "양구군","인제군","고성군","양양군"
    ],
    충청북도: [
      "청주시","충주시","제천시","보은군","옥천군","영동군",
      "증평군","진천군","괴산군","음성군","단양군"
    ],
    충청남도: [
      "천안시","공주시","보령시","아산시","서산시","논산시",
      "계룡시","당진시","금산군","부여군","서천군","홍성군",
      "청양군","예산군","태안군"
    ],
    전라북도: [
      "전주시","군산시","익산시","정읍시","남원시","김제시",
      "완주군","진안군","무주군","장수군","임실군","순창군",
      "고창군","부안군"
    ],
    전라남도: [
      "목포시","여수시","순천시","나주시","광양시",
      "담양군","장성군","화순군","보성군","고흥군","장흥군",
      "강진군","해남군","영암군","무안군","함평군","영광군","신안군"
    ],
    경상북도: [
      "포항시","경주시","김천시","안동시","구미시","영주시","영천시",
      "상주시","문경시","경산시",
      "군위군","의성군","청송군","영양군","영덕군","청도군",
      "고령군","성주군","칠곡군","예천군","봉화군","울진군","울릉군"
    ],
    경상남도: [
      "창원시","진주시","통영시","사천시","김해시","밀양시",
      "거제시","양산시",
      "의령군","함안군","창녕군","고성군","하동군","산청군","함양군","거창군","합천군"
    ],
    제주: ["제주시","서귀포시"]
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
