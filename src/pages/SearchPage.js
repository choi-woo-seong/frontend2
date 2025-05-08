// src/pages/SearchPage.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

import RegionSelectorModal from "../components/RegionSelectorModal";
import FilterModal from "./FilterModal";
import "../styles/SearchPage.css";

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
    { label: "요양원",   imgSrc: "/images/요양원.svg" },
    { label: "실버타운", imgSrc: "/images/실버타운.svg" },
  ];

  useEffect(() => {
    fetchFacilities();
  }, [location.search]);

  const [searchParams] = useSearchParams();
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    if (urlCategory) setCategory(urlCategory);
  }, [searchParams]);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setFacilities([
          {
            id: 1,
            category: "요양병원",
            name: "프레스토요양병원",
            address: "서울특별시 강남구 도산대로 209",
            imgSrc: "/images/프레스토요양병원.jpg",
            tags: ["등급제외", "소형", "설립 8년", "재활", "치매"],
            rating: 4.5,
            reviewCount: 28,
          },
          {
            id: 2,
            category: "요양원",
            name: "행복요양원",
            address: "서울특별시 송파구 올림픽로 300",
            imgSrc: "/images/행복요양원.jpg",
            tags: ["2등급", "중형", "설립 10년", "호스피스"],
            rating: 4.2,
            reviewCount: 15,
          },
          {
            id: 4,
            category: "요양병원",
            name: "아아요양병원",
            address: "서울특별시 송파구 올림픽로 800",
            imgSrc: "/images/행복요양원.jpg",
            tags: ["2등급", "중형", "설립 10년", "호스피스"],
            rating: 4.2,
            reviewCount: 15,
          },
          {
            id: 3,
            category: "실버타운",
            name: "골든실버타운",
            address: "경기도 성남시 수정구 성남대로 400",
            imgSrc: "/images/골든실버타운.jpg",
            tags: ["1등급", "대형", "설립 5년", "레저", "커뮤니티"],
            rating: 4.8,
            reviewCount: 34,
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
    setLikedFacilities(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
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
            {categories.map(cat => (
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
            onChange={e => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>

      {/* 필터 버튼 */}
      <div className="searchpage-filters">
        <div className="flex gap-2 flex-1">
          <button
            onClick={() => setFacilitySizeModalOpen(true)}
            className="border border-black rounded-full px-4 py-2 text-xs"
          >
            {selectedFacilityType} ▼
          </button>
          <button
            onClick={() => setEvaluationGradeModalOpen(true)}
            className="border border-black rounded-full px-4 py-2 text-xs"
          >
            {selectedEvaluationGrade} ▼
          </button>
          <button
            onClick={() => setSpecializationModalOpen(true)}
            className="border border-black rounded-full px-4 py-2 text-xs"
          >
            {selectedSpecialization} ▼
          </button>
        </div>
        <button
          onClick={() => setSortModalOpen(true)}
          className="border border-black rounded-full px-4 py-2 text-xs"
        >
          {selectedSort} ▼
        </button>
      </div>

      {/* 시설 목록 */}
      <div className="searchpage-facility-list">
        <ul className="facility-list">
          {loading && <p>로딩 중...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error &&
            facilities
              .filter(f => f.category === category)
              .filter(f => {
                if (
                  searchKeyword &&
                  !f.name.toLowerCase().includes(searchKeyword.toLowerCase()) &&
                  !f.address.toLowerCase().includes(searchKeyword.toLowerCase())
                ) return false;

                if (selectedFacilityType !== "시설규모" && !f.tags.includes(selectedFacilityType))
                  return false;

                if (selectedEvaluationGrade !== "평가등급" && !f.tags.includes(selectedEvaluationGrade))
                  return false;

                if (selectedSpecialization !== "특화영역" && !f.tags.includes(selectedSpecialization))
                  return false;

                return true;
              })
              .map(fac => (
                <li
                  key={fac.id}
                  className="facility-item"
                  onClick={() => handleGoToDetail(fac.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="facility-info">
                    <div className="facility-text">
                      <h3>{fac.name}</h3>
                      <p>{fac.address}</p>
                      <div className="facility-tags">
                        {fac.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="facility-tag"
                            style={getTagStyle(tag)}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="facility-image-container">
                      <img src={fac.imgSrc} alt={fac.name} />
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleLikeToggle(fac.id);
                        }}
                        className="like-button"
                      >
                        {likedFacilities.includes(fac.id)
                          ? <FaHeart className="liked" />
                          : <FaRegHeart />}
                      </button>
                    </div>
                  </div>
                </li>
              ))
          }
        </ul>
      </div>

      {/* 지도 보기 버튼 */}
      <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2">
        <button
          onClick={() => {
            const filtered = facilities
              .filter(f => f.category === category)
              .filter(f => {
                if (
                  searchKeyword &&
                  !f.name.toLowerCase().includes(searchKeyword.toLowerCase()) &&
                  !f.address.toLowerCase().includes(searchKeyword.toLowerCase())
                ) return false;

                if (selectedFacilityType !== "시설규모" && !f.tags.includes(selectedFacilityType))
                  return false;

                if (selectedEvaluationGrade !== "평가등급" && !f.tags.includes(selectedEvaluationGrade))
                  return false;

                if (selectedSpecialization !== "특화영역" && !f.tags.includes(selectedSpecialization))
                  return false;

                return true;
              });

            if (filtered.length === 0) {
              alert("표시할 시설이 없습니다.");
              return;
            }

            navigate("/map", { state: { facilities: filtered } });
          }}
          className="bg-white border px-6 py-3 rounded-full shadow-md flex items-center gap-2"
        >
          <FaMapMarkerAlt />
          지도보기
        </button>
      </div>

      {/* 모달들 */}
      {facilitySizeModalOpen && (
        <FilterModal
          title="시설규모"
          options={["대형", "중형", "소형"]}
          selectedOption={selectedFacilityType}
          onApply={opt => setSelectedFacilityType(opt || "시설규모")}
          onClose={() => setFacilitySizeModalOpen(false)}
        />
      )}
      {evaluationGradeModalOpen && (
        <FilterModal
          title="평가등급"
          options={["1등급", "2등급", "3등급", "4등급", "5등급", "등급제외"]}
          selectedOption={selectedEvaluationGrade}
          onApply={opt => setSelectedEvaluationGrade(opt || "평가등급")}
          onClose={() => setEvaluationGradeModalOpen(false)}
        />
      )}
      {specializationModalOpen && (
        <FilterModal
          title="특화영역"
          options={["재활", "치매", "호스피스", "장기입원"]}
          selectedOption={selectedSpecialization}
          onApply={opt => setSelectedSpecialization(opt || "특화영역")}
          onClose={() => setSpecializationModalOpen(false)}
        />
      )}
      {sortModalOpen && (
        <FilterModal
          title="정렬방식"
          options={["추천순", "조회순", "상담많은순", "후기많은순", "찜많은순"]}
          selectedOption={selectedSort}
          onApply={opt => setSelectedSort(opt || "추천순")}
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
