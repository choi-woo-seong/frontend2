"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/Tabs";
import Badge from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Star, ChevronLeft, Heart, Phone } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../styles/FacilityDetailPage.css";

export default function FacilityDetailPage() {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();

  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  const dummyCostImage = "/images/sample-cost-info.png";

  useEffect(() => {
    const fetchFacility = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/facility/${id}`); // ✅ 실제 API 호출
        console.log("디테일 응답 데이터 확인:", res.data); // 🔥 확인 포인트
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

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await axios.delete(`/api/users/favorites/${id}`);
      } else {
        await axios.post("/api/users/favorites", { facilityId: id });
      }
      setIsFavorite(!isFavorite);
    } catch {
      alert("즐겨찾기 처리 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div className="p-4 text-center">로딩 중...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (!facility)
    return <div className="p-4 text-center">시설 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="facility-detail-container">
      {/* 뒤로가기 */}
      <div className="back-button justify-start">
        <Link to="/search" className="flex items-center text-gray-500">
          <ChevronLeft className="h-5 w-5" />
          <span>시설 목록</span>
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
  <button onClick={handleToggleFavorite} className="favorite-button absolute top-3 right-3 z-10">
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
        <TabsContent value="review" className="bg-white rounded-lg shadow p-6">
          <p>리뷰 기능은 준비중입니다.</p>
        </TabsContent>

        {/* 문의 탭 */}
        <TabsContent
          value="question"
          className="bg-white rounded-lg shadow p-6"
        >
          <p>문의 기능은 준비중입니다.</p>
        </TabsContent>
      </Tabs>

      {/* 전화 버튼 */}
      <a
        href={`tel:${facility.phone}`}
        className="call-button fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-8 py-3 rounded-full shadow-lg hover:bg-blue-600"
      >
        <Phone className="inline-block mr-2" /> 전화문의
      </a>
    </div>
  );
}
