import { useState, useEffect } from "react";
import {
  Await,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";

import RegionSelectorModal from "../components/RegionSelectorModal";
import FilterModal from "./FilterModal";
import "../styles/SearchPage.css";
import RegionSelector from "../components/RegionSelector";

import {
  FaSearch,
  FaRegHeart,
  FaHeart,
  FaMapMarkerAlt,
  FaChevronLeft,
} from "react-icons/fa";

const facilitySizeMap = {
  소형: "SMALL",
  중형: "MEDIUM",
  대형: "LARGE",
};

const typeMap = {
  요양병원: "nursing_hospital",
  요양원: "nursing_home",
  실버타운: "silver_town",
};

const gradeMap = {
  "1등급": "1등급",
  "2등급": "2등급",
  "3등급": "3등급",
  "4등급": "4등급",
  "5등급": "5등급",
  등급제외: "등급제외",
  A: "A",
  B: "B",
  C: "C",
  D: "D",
  E: "E",
};

function SearchPage() {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "요양병원";

  const [facilityDropdownOpen, setFacilityDropdownOpen] = useState(false);

  const [selectedFacilityType, setSelectedFacilityType] = useState("시설규모");
  const [facilitySizeModalOpen, setFacilitySizeModalOpen] = useState(false);

  const [selectedEvaluationGrade, setSelectedEvaluationGrade] =
    useState("평가등급");
  const [evaluationGradeModalOpen, setEvaluationGradeModalOpen] =
    useState(false);

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
  ];

  // 지역선택
  const [selectedRegion, setSelectedRegion] = useState("서울");
  const [regionModalOpen, setRegionModalOpen] = useState(false);

  useEffect(() => {
    fetchFacilities();
  }, [
    category,
    selectedRegion,
    selectedFacilityType,
    selectedEvaluationGrade,
    selectedSort,
  ]);

  // 찜목록 가져오기
  useEffect(() => {
  const fetchBookmarks = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${API_BASE_URL}/bookmarks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const likedIds = res.data.map((item) => item.facilityId); // 🔥 id만 뽑아
      setLikedFacilities(likedIds); // ✅ 상태 반영
    } catch (err) {
      console.error("찜한 시설 불러오기 실패", err);
    }
  };

  fetchBookmarks();
}, []); 

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (typeMap[category]) {
        queryParams.append("type", typeMap[category]);
      }

      if (selectedRegion && selectedRegion !== "전체") {
        queryParams.append("region", selectedRegion);
      }

      if (selectedFacilityType !== "시설규모") {
        queryParams.append(
          "facilitySize",
          facilitySizeMap[selectedFacilityType]
        );
      }

      if (selectedEvaluationGrade !== "평가등급") {
        queryParams.append("grade", gradeMap[selectedEvaluationGrade]);
      }

      if (selectedSort) {
        queryParams.append("sort", selectedSort); // 예: view / consult / like
      }

      const url = `${API_BASE_URL}/facility/search?${queryParams.toString()}`;

      const res = await fetch(url);
      const data = await res.json();

      const sorted = data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // 🔥 최신순 정렬
        .map((fac) => ({
          id: fac.id,
          name: fac.name,
          address: fac.address,
          category: category,
          imgSrc: fac.imageUrls?.[0] || "/placeholder.svg",
          grade: fac.grade || null,
          facilitySize: fac.facilitySize || null,
          establishedYear: fac.establishedYear || null,
          rating: fac.rating || 4.3,
          reviewCount: fac.reviewCount || 0,
        }));

      setFacilities(sorted);
      setError(null);
    } catch (err) {
      console.error("시설 불러오기 실패:", err);
      setError("시설 정보를 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  // click 이벤트 (viewCount +1)
  const handleIncreaseView = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/facility/${id}/view`);
    } catch (error) {
      console.error("viewCount에러 : ", error);
    }
  };

  // click 이벤트 (찜하기)
  const handleFavorites = async (id) => {
    const isLiked = likedFacilities.includes(id);
    const token = localStorage.getItem("accessToken");

    try {
      if (isLiked) {
        await axios.delete(`${API_BASE_URL}/bookmarks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLikedFacilities((prev) => prev.filter((fid) => fid !== id));
      } else {
        await axios.post(
          `${API_BASE_URL}/bookmarks/${id}`,
          {}, // POST body 없음
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLikedFacilities((prev) => [...prev, id]);
      }
    } catch (error) {
      console.error("찜 토글 에러:", error);
    }
  };

  const filtered = facilities.filter((f) => {
    if (
      searchKeyword &&
      !f.name.includes(searchKeyword) &&
      !f.address.includes(searchKeyword)
    ) {
      return false;
    }

    if (
      selectedFacilityType !== "시설규모" &&
      f.facilitySize !== facilitySizeMap[selectedFacilityType]
    ) {
      return false;
    }

    if (
      selectedEvaluationGrade !== "평가등급" &&
      f.grade !== gradeMap[selectedEvaluationGrade]
    ) {
      return false;
    }

    return true;
  });

  const handleGoToDetail = (id) => {
    handleIncreaseView(id);
    navigate(`/facility/${id}`);
  };

  return (
    <div className="searchpage-container">
      {/* 상단바 */}
      <div className="searchpage-header flex items-center gap-4">
        <button onClick={() => navigate("/")} className="text-gray-600 text-xl">
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
                  navigate(`/search?category=${cat.label}`);
                  setFacilityDropdownOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-sm"
              >
                <img
                  src={cat.imgSrc}
                  alt={cat.label}
                  className="w-5 h-5 mr-3"
                />
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

        {/* 🔥 모달 여기에 렌더링 */}
        <RegionSelectorModal
          isOpen={regionModalOpen}
          onClose={() => setRegionModalOpen(false)}
          onSelectRegion={(region) => {
            setSelectedRegion(region); //
            setRegionModalOpen(false); //
          }}
        />
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
          <button
            onClick={() => setFacilitySizeModalOpen(true)}
            className="border border-black rounded-full px-4 py-2 text-xs"
          >
            {selectedFacilityType} ▼
          </button>
          {category !== "실버타운" && (
            <button
              onClick={() => setEvaluationGradeModalOpen(true)}
              className="border border-black rounded-full px-4 py-2 text-xs"
            >
              {selectedEvaluationGrade} ▼
            </button>
          )}
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
          {!loading &&
            !error &&
            filtered.map((fac) => (
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
                    {fac.grade && (
                      <span className="facility-tag grade-tag">
                        등급: {fac.grade}
                      </span>
                    )}
                    {fac.facilitySize && (
                      <span className="facility-tag size-tag">
                        규모: {fac.facilitySize}
                      </span>
                    )}
                    {fac.establishedYear && (
                      <span className="facility-tag">
                        설립 {new Date().getFullYear() - fac.establishedYear}년
                      </span>
                    )}
                  </div>
                  <div className="facility-image-container">
                    <img src={fac.imgSrc} alt={fac.name} />

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavorites(fac.id);
                      }}
                      className="like-button"
                    >
                      {likedFacilities.includes(fac.id) ? (
                        <FaHeart className="liked" />
                      ) : (
                        <FaRegHeart />
                      )}
                    </button>
                    
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>

      {/* 모달 */}
      <RegionSelectorModal
        isOpen={regionModalOpen}
        onClose={() => setRegionModalOpen(false)}
        onSelectRegion={setSelectedRegion}
      />
      {facilitySizeModalOpen && (
        <FilterModal
          title="시설규모"
          options={["대형", "중형", "소형"]}
          selectedOption={selectedFacilityType}
          onApply={(opt) => setSelectedFacilityType(opt || "시설규모")}
          onClose={() => setFacilitySizeModalOpen(false)}
        />
      )}
      {evaluationGradeModalOpen && (
        <FilterModal
          title="평가등급"
          options={
            category === "요양병원"
              ? ["1등급", "2등급", "3등급", "4등급", "5등급", "등급제외"]
              : ["A", "B", "C", "D", "E", "등급제외"]
          }
          selectedOption={selectedEvaluationGrade}
          onApply={(opt) => setSelectedEvaluationGrade(opt || "평가등급")}
          onClose={() => setEvaluationGradeModalOpen(false)}
        />
      )}
      {sortModalOpen && (
        <FilterModal
          title="정렬방식"
          options={["조회순", "상담많은순", "찜많은순"]}
          selectedOption={selectedSort}
          onApply={(opt) => setSelectedSort(opt || "조회순")}
          onClose={() => setSortModalOpen(false)}
        />
      )}
    </div>
  );
}

export default SearchPage;
