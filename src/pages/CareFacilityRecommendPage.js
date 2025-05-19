import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CareFacilityRecommendPage.css";

const CareFacilityRecommendPage = () => {
  const API_BASE_URL = process.env.REACT_APP_PYTHON_API_URL;
  const hasCheckedRef = useRef(false);
  const [hasValidData, setHasValidData] = useState(true);
  const navigate = useNavigate();
  const [location, setLocation] = useState("서울");
  const [type, setType] = useState("요양원");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hasCheckedRef.current) return;
    hasCheckedRef.current = true;

    const score = localStorage.getItem("care_score");
    const grade = localStorage.getItem("care_grade");

    if (!score || !grade) {
      const confirmed = window.confirm(
        "장기요양 등급 테스트 결과가 없습니다. 테스트 페이지로 이동할까요?"
      );
      if (confirmed) {
        navigate("/care-grade-test");
      }else{
        navigate("/")
      }
    }
  }, [navigate]);

  const handleSearch = async () => {
    const score = localStorage.getItem("care_score");
    const grade = localStorage.getItem("care_grade");
    if (!score || !grade) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/recommend`, {
        score: Number(score), // 꼭 숫자로 변환
        grade,
        location,
        care_type: type,
      });
      setRecommendations(
        res.data.answer
          .split("\n\n")
          .map((line) => line.replace(/\*\*/g, "").trim()) // ✅ ** 제거
          .filter((line) => line !== "")
      );
    } catch (err) {
      console.error("AI 추천 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recommend-wrapper">
      <h1 className="recommend-title">AI 맞춤 요양시설 추천</h1>

      {/* 지역/타입 선택 */}
      <div className="recommend-form">
        <label>
          지역 선택:
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            {["서울", "부산","대구","인천","광주","대전","울산","세종","경기도","강원도","충청북도","충청남도","전라북도","전라남도","경상북도","경상남도","제주"].map(
              (region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              )
            )}
          </select>
        </label>

        <label>
          시설 타입:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {["요양병원", "요양원", "실버타운"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <button onClick={handleSearch} className="recommend-search-btn">
          추천 받기
        </button>
      </div>

      {/* 결과 출력 */}
      <div className="recommend-result">
        {loading && <p>🔍 추천 중입니다...</p>}

        {!loading && recommendations.length > 0 && (
          <div className="recommend-card-list">
            {recommendations.map((item, idx) => (
              <div key={idx} className="recommend-card">
                <p>{item}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CareFacilityRecommendPage;
