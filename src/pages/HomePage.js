"use client";
import "../styles/HomePage.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { Button } from "../components/ui/Button";
import FacilityTypeGrid from "../components/FacilityTypeGrid";
import FaqSection from "../components/FaqSection";
import PromotionSection from "../components/PromotionSection";
import NoticeBar from "../components/NoticeBar";
import VideoSection from "../components/VideoSection";
import BottomNavigation from "../components/BottomNavigation";
import logo from "../pages/img/logo.png";
import { useAuth } from "../hooks/use-auth";

const API_BASE_URL = process.env.REACT_APP_API_URL;

function HomePage() {
  const { isLoggedIn, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      localStorage.removeItem("accessToken");
      alert("로그아웃 되었습니다.");
      navigate("/");
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await fetch(`${API_BASE_URL}/products`);
      if (!res.ok) throw new Error("상품 정보를 불러오지 못했습니다.");
      const data = await res.json();

      const mapped = data.map((p) => {
        const price = typeof p.price === "number" ? p.price : parseInt(p.price);
        const discountPrice =
          typeof p.discountPrice === "number"
            ? p.discountPrice
            : parseInt(p.discountPrice);
        const discount =
          price && discountPrice
            ? Math.round((1 - discountPrice / price) * 100) + "%"
            : null;

        return {
          ...p,
          price: price.toLocaleString("ko-KR"),
          discount,
          images: p.images?.[0] || "/images/placeholder.svg",
        };
      });

      setProducts(mapped);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="home-header-inner">
          <div className="home-logo-area">
            <img src={logo} alt="로고" className="logo" />
          </div>
          <div className="auth-buttons flex items-center space-x-2">
            {isLoggedIn ? (
              <Button variant="ghost" size="sm" className="auth-button" onClick={logout}>
                로그아웃
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="auth-button">로그인</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="ghost" size="sm" className="auth-button">회원가입</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <NoticeBar />

        {/* ✅ 슬라이드 배너 전체 너비 꽉 차도록 수정 */}
        <div className="hero-section">
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
          >
            {[1, 2, 3, 4].map((n) => (
              <SwiperSlide key={n}>
                <div className="w-full h-64 sm:h-80 md:h-[400px] lg:h-[500px] overflow-hidden">
                  <img
                    src={`/images/사진${n}.png`}
                    alt={`배너${n}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* 시설 타입 그리드 */}
        <div className="facility-grid-section">
          <div className="facility-card">
            <FacilityTypeGrid />
          </div>
        </div>

        <VideoSection />
        <PromotionSection />

        {/* 상품 목록 */}
        <div className="products-section">
          <div className="products-card">
            <div className="products-header">
              <h2>인기 제품 추천 상품</h2>
              <Link to="/products" className="more-link">
                더보기 <ChevronRight className="icon-tiny" />
              </Link>
            </div>

            <div className="store-banner">
              <div>요양원 입소 전 준비하세요.</div>
              <div>
                <Link to="/products" className="store-link">
                  스토어 바로가기 &gt;
                </Link>
              </div>
            </div>

            <div className="products-grid">
              {loadingProducts ? (
                <div>상품 로딩 중...</div>
              ) : (
                products.slice(0, 3).map((product) => {
                  const originalPrice = parseInt(product.price.replace(/,/g, ""));
                  const discountPrice = parseInt(product.discountPrice);
                  const discountPercent = product.discount;

                  return (
                    <Link key={product.id} to={`/products/${product.id}`} className="product-card">
                      <div className="home-product-image-box">
                        <img
                          src={product.images || "/images/placeholder.svg"}
                          alt={product.name}
                          className="home-product-image"
                        />
                      </div>
                      <div className="product-info mt-2">
                        <div className="product-name text-base font-medium text-gray-800 truncate">
                          {product.name}
                        </div>
                        {discountPrice ? (
                          <>
                            <div className="text-sm text-gray-400">
                              <span className="line-through">{originalPrice.toLocaleString("ko-KR")}원</span>
                              <span className="ml-2 text-blue-600 font-semibold">{discountPercent}</span>
                            </div>
                            <div className="text-lg font-bold text-black">
                              {discountPrice.toLocaleString("ko-KR")}원
                            </div>
                          </>
                        ) : (
                          <div className="text-lg font-bold text-black">
                            {originalPrice.toLocaleString("ko-KR")}원
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <FaqSection />
      </main>

      <BottomNavigation currentPath="/" />
    </div>
  );
}

export default HomePage;
