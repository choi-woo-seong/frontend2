import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FacilityList from "../components/FacilityList";
import RegionSelectorModal from "../components/RegionSelectorModal";
import FilterModal from "./FilterModal";
import '../styles/SearchPage.css';

import {
  FaSearch,
  FaRegHeart,
  FaHeart,
  FaMapMarkerAlt,
  FaChevronLeft
} from "react-icons/fa";

function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [category, setCategory] = useState("요양병원");
  const [facilityDropdownOpen, setFacilityDropdownOpen] = useState(false);

  const [selectedRegion, setSelectedRegion] = useState("서울");
  const [regionModalOpen, setRegionModalOpen] = useState(false);

  const [selectedFacilityType, setSelectedFacilityType] = useState("시설규모");
  const [facilitySizeModalOpen, setFacilitySizeModalOpen] = useState(false);

  const [selectedEvaluationGrade, setSelectedEvaluationGrade] = useState("평가등급");
  const [evaluationGradeModalOpen, setEvaluationGradeModalOpen] = useState(false);

  const [selectedSpecialization, setSelectedSpecialization] = useState("특화영역");
  const [specializationModalOpen, setSpecializationModalOpen] = useState(false);

  const [selectedSort, setSelectedSort] = useState("추천순");
  const [sortModalOpen, setSortModalOpen] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedFacilities, setLikedFacilities] = useState([]);

  const categories = [
    { label: "요양병원", imgSrc: "/images/요양병원.svg" },
    { label: "요양원", imgSrc: "/images/요양원.svg" },
    { label: "실버타운", imgSrc: "/images/실버타운.svg" },
    { label: "양로원", imgSrc: "/images/양로원.svg" },
    { label: "주야간보호", imgSrc: "/images/주야간보호.svg" },
    { label: "단기보호", imgSrc: "/images/단기보호.svg" },
    { label: "방문요양", imgSrc: "/images/방문요양.svg" },
    { label: "방문간호", imgSrc: "/images/방문간호.svg" },
    { label: "방문목욕", imgSrc: "/images/방문목욕.svg" },
  ];

  useEffect(() => {
    fetchFacilities();
  }, [location.search]);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setFacilities([
          {
            id: 1,
            name: "프레스토요양병원",
            address: "서울특별시 강남구 도산대로 209",
            imgSrc: "/images/프레스토요양병원.jpg",
            tags: ["등급제외", "소형", "설립 8년", "재활", "치매"],
            rating: 4.5,
            reviewCount: 28,
          },
          {
            id: 2,
            name: "서울센트럴요양병원",
            address: "서울특별시 영등포구 경인로 767",
            imgSrc: "/images/서울센트럴요양병원.jpg",
            tags: ["2등급", "대형", "설립 7년", "재활", "호스피스"],
            rating: 4.2,
            reviewCount: 15,
          },
        ]);
        setLoading(false);
        setError(null);
      }, 500);
    } catch (err) {
      console.error("시설 데이터 오류:", err);
      setError("시설 정보를 불러올 수 없습니다.");
      setLoading(false);
    }
  };

  const handleLikeToggle = (id) => {
    setLikedFacilities((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleGoToDetail = (id) => {
    navigate(`/facility/${id}`);
  };

  const handleSelectRegion = (region) => {
    setSelectedRegion(region);
    setRegionModalOpen(false);
  };

  const getTagStyle = (tag) => {
    if (tag.includes("등급")) {
      return { color: "#007bff", fontWeight: "bold" };
    }
    return {};
  };

  return (
    <div className="searchpage-container">
      {/* 상단바 */}
      <div className="searchpage-header flex items-center gap-4">
        <button onClick={() => navigate('/')} className="text-gray-600 text-xl">
          <FaChevronLeft />
        </button>

        <button onClick={() => setFacilityDropdownOpen(!facilityDropdownOpen)}>
          {category}
          <span className="ml-1 text-xs">▼</span>
        </button>

        {facilityDropdownOpen && (
          <div className="absolute top-16 left-4 w-56 bg-white border rounded-xl shadow-md z-20 py-2">
            {categories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => {
                  setCategory(cat.label);
                  setFacilityDropdownOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-sm"
              >
                <img src={cat.imgSrc} alt={cat.label} className="w-5 h-5 mr-3" />
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 지역 선택 */}
      <div className="searchpage-region">
        <button
          onClick={() => setRegionModalOpen(true)}
          className="w-full flex items-center justify-between bg-gray-100 px-4 py-3 rounded-md text-sm"
        >
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-[#007bff]" />
            <span>{selectedRegion}</span>
          </div>
          <span className="text-gray-400">▼</span>
        </button>
      </div>

      {/* 검색창 */}
      <div className="searchpage-search-wrapper">
        <div className="searchpage-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="검색어 입력"
            className="search-input"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>

      {/* 필터 버튼 */}
      <div className="searchpage-filters">
        <div className="flex gap-2 flex-1">
          <button onClick={() => setFacilitySizeModalOpen(true)} className="border border-black rounded-full px-4 py-2 text-xs">
            {selectedFacilityType} ▼
          </button>
          <button onClick={() => setEvaluationGradeModalOpen(true)} className="border border-black rounded-full px-4 py-2 text-xs">
            {selectedEvaluationGrade} ▼
          </button>
          <button onClick={() => setSpecializationModalOpen(true)} className="border border-black rounded-full px-4 py-2 text-xs">
            {selectedSpecialization} ▼
          </button>
        </div>
        <button onClick={() => setSortModalOpen(true)} className="border border-black rounded-full px-4 py-2 text-xs">
          {selectedSort} ▼
        </button>
      </div>

      {/* 시설 목록 */}
      <div className="searchpage-facility-list">
        <ul className="facility-list">
          {facilities.map((facility) => (
            <li
              className="facility-item"
              key={facility.id}
              onClick={() => handleGoToDetail(facility.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="facility-info">
                <div className="facility-text">
                  <h3>{facility.name}</h3>
                  <p>{facility.address}</p>
                  <div className="facility-tags">
                    {facility.tags.map((tag, index) => (
                      <span
                        className="facility-tag"
                        key={index}
                        style={getTagStyle(tag)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="facility-image-container">
                  <img src={facility.imgSrc || '/default-image.jpg'} alt={facility.name} />
                  <button onClick={(e) => {
                    e.stopPropagation(); // 상세페이지 이동 막기
                    handleLikeToggle(facility.id);
                  }} className="like-button">
                    {likedFacilities.includes(facility.id)
                      ? <FaHeart className="liked" />
                      : <FaRegHeart />}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 지도 보기 버튼 */}
      <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2">
        <button
          onClick={() => navigate("/map")}
          className="bg-white border px-6 py-3 rounded-full shadow-md flex items-center gap-2"
        >
          <FaMapMarkerAlt />
          지도보기
        </button>
      </div>

      {/* 필터 모달들 */}
      {facilitySizeModalOpen && (
        <FilterModal
          title="시설규모"
          options={["대형", "중형", "소형"]}
          selectedOption={selectedFacilityType}
          onApply={(option) => setSelectedFacilityType(option || "시설규모")}
          onClose={() => setFacilitySizeModalOpen(false)}
        />
      )}
      {evaluationGradeModalOpen && (
        <FilterModal
          title="평가등급"
          options={["1등급", "2등급", "3등급", "4등급", "5등급", "등급제외"]}
          selectedOption={selectedEvaluationGrade}
          onApply={(option) => setSelectedEvaluationGrade(option || "평가등급")}
          onClose={() => setEvaluationGradeModalOpen(false)}
        />
      )}
      {specializationModalOpen && (
        <FilterModal
          title="특화영역"
          options={["재활", "치매", "호스피스", "장기입원"]}
          selectedOption={selectedSpecialization}
          onApply={(option) => setSelectedSpecialization(option || "특화영역")}
          onClose={() => setSpecializationModalOpen(false)}
        />
      )}
      {sortModalOpen && (
        <FilterModal
          title="정렬방식"
          options={["추천순", "조회순", "상담많은순", "후기많은순", "찜많은순"]}
          selectedOption={selectedSort}
          onApply={(option) => setSelectedSort(option || "추천순")}
          onClose={() => setSortModalOpen(false)}
        />
      )}

      <RegionSelectorModal
        isOpen={regionModalOpen}
        onClose={() => setRegionModalOpen(false)}
        onSelectRegion={handleSelectRegion}
      />
    </div>
  );
}

export default SearchPage;
