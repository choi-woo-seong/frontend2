// src/pages/FacilityDetailPage.js
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useAuth } from "../hooks/use-auth";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/Tabs";
import { Button } from "../components/ui/Button";
import { Star, ChevronLeft, Heart, Phone } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../styles/FacilityDetailPage.css";

export default function FacilityDetailPage() {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const { id } = useParams();
  const { user } = useAuth();
  const [facilityReviews, setFacilityReviews] = useState([]);
  const [newReviewRating, setNewReviewRating] = useState(1);
  const [newReviewContent, setNewReviewContent] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newQuestionContent, setNewQuestionContent] = useState("");
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const dummyCostImage = "/images/sample-cost-info.png";

  useEffect(() => {
    const fetchFacility = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/facility/${id}`);
        setFacility(res.data);
      } catch (err) {
        console.error(err);
        setError("시설 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchFacility();
  }, [id]);

  useEffect(() => {
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const res = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setCurrentUser(res.data); // userId, name 등 포함된 객체
    } catch (error) {
      console.error("현재 사용자 정보를 불러오는 데 실패했습니다:", error);
    }
  };

  fetchCurrentUser();
}, []);

 useEffect(() => {
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/facility-reviews/${id}`);
      const data = res.data;
      setFacilityReviews(Array.isArray(data) ? data : []); // ⬅ 안전 처리
    } catch (err) {
      console.error("리뷰 불러오기 실패", err);
      setFacilityReviews([]); // ⬅ 실패해도 배열로 유지
    }
  };
  fetchReviews();
}, [id]);


  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`${API_BASE_URL}/bookmarks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const likedIds = res.data.map((item) => item.facilityId);
        setIsFavorite(likedIds.includes(Number(id)));
      } catch (err) {
        console.error("찜한 시설 불러오기 실패", err);
      }
    };
    fetchBookmarks();
  }, [id]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/questions/facility/${id}`);
        setQuestions(res.data);
      } catch (err) {
        console.error("문의 불러오기 실패", err);
      }
    };
    
    fetchQuestions();
  }, [id]);

  const handleQuestionSubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/questions`,
        {
          content: newQuestionContent,
          facilityId: Number(id),
          title: `시설(${facility.name}) 문의`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setQuestions((prev) => [...prev, response.data]);
      setNewQuestionContent("");
      setShowQuestionForm(false);
    } catch (error) {
      console.error("❌ 문의 등록 실패:", error);
      if (error.response) {
        alert(`문의 등록 실패: ${error.response.data.message || '알 수 없는 오류'}`);
      } else {
        alert("네트워크 오류 또는 서버에 접근할 수 없습니다.");
      }
    }
  };

  const handleToggleFavorite = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      if (isFavorite) {
        await axios.delete(`${API_BASE_URL}/bookmarks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFavorite(false);
      } else {
        await axios.post(`${API_BASE_URL}/bookmarks/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("찜 토글 에러", err);
    }
  };
const handleReviewSubmit = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.post(
      `${API_BASE_URL}/facility-reviews`,
      {
        facilityId: Number(id),
        rating: newReviewRating,
        content: newReviewContent,
       userName: user?.userId || "익명", // ✅ 사용자 ID로 보내기

      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    setFacilityReviews([...facilityReviews, response.data]);
    setShowReviewForm(false);
    setNewReviewRating(1);
    setNewReviewContent("");
  } catch (error) {
    console.error("리뷰 등록 실패", error);
    alert("리뷰 등록에 실패했습니다.");
  }
};


  const avgRating = facilityReviews.length > 0
    ? (facilityReviews.reduce((sum, r) => sum + r.rating, 0) / facilityReviews.length).toFixed(1)
    : 0;

  if (loading) return <div className="p-4 text-center">로딩 중...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (!facility) return <div className="p-4 text-center">시설 정보를 찾을 수 없습니다.</div>;


console.log(questions)
console.log(user)
 return (
  <div className="container mx-auto px-4 py-4">

    {/* 뒤로가기 */}
    <div className="flex items-center mt-4 mb-4">
      <Link to="/search" className="flex items-center text-gray-500">
        <ChevronLeft className="h-5 w-5" />
        <span className="text-lg font-semibold ml-1">시설 목록</span>
      </Link>
    </div>

    {/* 이미지 */}
    <div className="image-container relative">
      {facility.imageUrls?.length > 0 ? (
        <Swiper
          modules={[Navigation]}
          navigation={true}
          spaceBetween={10}
          slidesPerView={1}
          loop={true}
          className="rounded-lg"
        >
          {facility.imageUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <img
                src={url}
                alt={`시설 이미지 ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <img
          src="/placeholder.svg"
          alt="기본 이미지"
          className="w-full h-64 object-cover rounded-lg"
        />
      )}


  {/* 즐겨찾기 버튼 */}
<button
  onClick={handleToggleFavorite}
  className="favorite-button absolute top-3 right-3 z-10"
>
  <Heart
    className={isFavorite ? "text-red-500" : "text-gray-400"}
    fill={isFavorite ? "currentColor" : "none"}
  />
</button>

</div>


      {/* 시설 정보 테이블 */}
      <div className="basic-info-table">
        <h2>기본 정보</h2>
        <table>
          <tbody>
            <tr>
              <th>시설명</th>
              <td>{facility.name}</td>
            </tr>
            <tr>
              <th>설립년도</th>
              <td>{facility.establishedYear}년</td>
            </tr>
            <tr>
              <th>주소</th>
              <td>{facility.address}</td>
            </tr>
            <tr>
              <th>연락처</th>
              <td>{facility.phone}</td>
            </tr>
            <tr>
              <th>홈페이지 주소</th>
              <td>
                <a
                  href={facility.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {facility.homepage}
                </a>
              </td>
            </tr>
            <tr>
              <th>평가등급</th>
              <td>{facility.evaluation || facility.grade || "정보 없음"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="info">시설 설명</TabsTrigger>
          <TabsTrigger value="cost">비용 안내</TabsTrigger>
          <TabsTrigger value="review">리뷰</TabsTrigger>
          <TabsTrigger value="question">문의</TabsTrigger>
        </TabsList>

        {/* 시설 설명 탭 */}
        <TabsContent
          value="info"
          className="markdown-body bg-white rounded-lg shadow p-6"
        >
          {facility.description ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {facility.description}
            </ReactMarkdown>
          ) : (
            <p className="text-gray-400">시설 설명이 없습니다.</p>
          )}

          <h3 className="mt-6 mb-2 text-lg font-semibold">지도 보기</h3>
          <div className="w-full h-64 rounded-lg overflow-hidden border">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                facility.address
              )}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="구글 지도"
            />
          </div>
        </TabsContent>

        {/* 비용 안내 탭 */}
        <TabsContent
          value="cost"
          className="bg-white rounded-lg shadow p-6 text-center"
        >
          <h2 className="text-xl font-semibold mb-4">비용 안내</h2>
          <img
            src={dummyCostImage}
            alt="비용안내"
            className="rounded-lg inline-block"
          />
          <p className="mt-4 text-gray-500">
            ※ 자세한 비용은 추후 백엔드 연동 예정입니다.
          </p>
        </TabsContent>

        {/* 리뷰 탭 */}
      <TabsContent value="review" className="bg-white rounded-lg shadow p-6 overflow-auto">

        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 mr-1 ${
                i < Math.round(avgRating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-2 text-lg font-medium">{avgRating}</span>
          <span className="ml-1 text-gray-500">({facilityReviews.length}개)</span>
        </div>

        <div className="space-y-4 mb-4">
          {facilityReviews.map((r) => (
            <div key={r.id} className="border-b pb-4">
              <div className="flex items-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < r.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm ml-2 font-medium">{r.userName}</span>
                <span className="text-xs text-gray-500 ml-auto">
                  {new Date(r.createdAt).toLocaleString("ko-KR", {
                    year: "numeric", month: "2-digit", day: "2-digit",
                    hour: "2-digit", minute: "2-digit"
                  })}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{r.content}</p>
            </div>
          ))}
        </div>

        {showReviewForm ? (
          <div className="p-4 mb-4 bg-gray-50 rounded">
            <h4 className="font-medium mb-2">리뷰 작성하기</h4>
            <div className="flex mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`cursor-pointer h-5 w-5 ${
                    i < newReviewRating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => setNewReviewRating(i + 1)}
                />
              ))}
            </div>
            <textarea
              className="w-full border p-2 mb-2 rounded"
              rows={3}
              placeholder="리뷰를 작성하세요"
              value={newReviewContent}
              onChange={(e) => setNewReviewContent(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
                onClick={handleReviewSubmit}
              >
                등록
              </Button>
              <Button
                className="border border-gray-300 text-gray-700 rounded px-4 py-2 hover:bg-gray-100"
                onClick={() => setShowReviewForm(false)}
              >
                취소
              </Button>
            </div>
          </div>
        ) : (
          <Button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 text-sm"
              onClick={() => {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                  alert("리뷰 작성은 로그인 후 이용 가능합니다.");
                  return;
                }
                setShowReviewForm(true);
              }}
            >
              리뷰 작성
            </Button>

        )}
      </TabsContent>
    
<TabsContent value="question" className="bg-white rounded-lg shadow p-6 overflow-auto">
  {Array.isArray(questions) && questions.filter(q => q.userId === currentUser?.userId).length > 0 ? (
    <div className="space-y-4 mb-4">
      {questions
        .filter(q => q.userId === currentUser?.userId)
        .map((q) => (
          <div key={q.id} className="border-b pb-4">
            <div className="flex items-center mb-1">
              <span className="text-sm font-medium">{q.userId}</span>
              <span className="text-xs text-gray-500 ml-auto">
                {new Date(q.createdAt).toLocaleString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{q.content}</p>

            {q.answer && (
              <div className="mt-2 p-3 bg-gray-50 rounded">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm">답변</h4>
                  <span className="text-xs text-gray-500">
                    {new Date(q.answer.createdAt).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{q.answer.content}</p>
              </div>
            )}
          </div>
        ))}
    </div>
  ) : (
    <div className="text-gray-500 text-sm mb-4">등록된 문의가 없습니다.</div>
  )}


  {/* 문의 작성 폼 */}
  {showQuestionForm ? (
    <div className="p-4 mb-4 bg-gray-50 rounded">
      <h4 className="font-medium mb-2">문의 작성하기</h4>
      <textarea
        className="w-full border p-2 mb-2 rounded"
        rows={3}
        placeholder="문의 내용을 입력하세요"
        value={newQuestionContent}
        onChange={(e) => setNewQuestionContent(e.target.value)}
      />
      <div className="flex gap-2">
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
          onClick={handleQuestionSubmit}
        >
          등록
        </Button>
        <Button
          className="border border-gray-300 text-gray-700 rounded px-4 py-2 hover:bg-gray-100"
          onClick={() => setShowQuestionForm(false)}
        >
          취소
        </Button>
      </div>
    </div>
  ) : (
<Button
  className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 text-sm"
  onClick={() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("문의 작성은 로그인 후 이용 가능합니다.");
      return;
    }
    setShowQuestionForm(true);
  }}
>
  문의 작성
</Button>

  )}
</TabsContent>
      </Tabs>

     
    </div>
  );
}
