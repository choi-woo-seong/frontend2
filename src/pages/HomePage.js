// src/pages/HomePage.jsx
import "../styles/HomePage.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ChevronRight, ShoppingCart } from "lucide-react";

import { Button } from "../components/ui/Button";
import FacilityTypeGrid from "../components/FacilityTypeGrid";
import FaqSection from "../components/FaqSection";
import PromotionSection from "../components/PromotionSection";
import NoticeBar from "../components/NoticeBar";
import VideoSection from "../components/VideoSection";
import BottomNavigation from "../components/BottomNavigation";
import logo from "../pages/img/logo.png";
import { useAuth } from "../hooks/use-auth"; // ✅ 전역 상태 사용

const API_BASE_URL = process.env.REACT_APP_API_URL;

function HomePage() {
  // --- 기존 로그인 상태 관리 ---
  const [isLoggin, setIsLoggin] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggin(!!token);
  }, []);

  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      setIsLoggin(false);
      localStorage.removeItem("accessToken");
      alert("로그아웃 되었습니다.");
      navigate("/");
    }
  };

  // --- 상품 데이터 상태 및 로딩 상태 ---
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // --- 마운트 시 API 호출 ---
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await fetch(`${API_BASE_URL}/products`);
      if (!res.ok) throw new Error("상품 정보를 불러오지 못했습니다.");
      const data = await res.json();

      const mapped = data.map((p) => {
        const price = typeof p.price === "number" ? p.price : parseInt(p.price);
        const discountPrice = typeof p.discountPrice === "number"
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

  // ✅ 여기에 useEffect 추가
  useEffect(() => {
    fetchProducts();
  }, []);
  

  // --- 장바구니 담기 핸들러 ---
  const addToCart = (product) => {
    alert(`${product.name}이(가) 장바구니에 추가되었습니다.`);
    // TODO: 실제 API 연동 시, POST /cart 엔드포인트 호출 로직 추가
  };
  console.log(products)
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="home-header-inner">
          <div className="home-logo-area">
            <img src={logo} alt="로고" className="logo" />
          </div>
          <div className="auth-buttons flex items-center space-x-2">
            {isLoggin ? (
              <Button
                variant="ghost"
                size="sm"
                className="auth-button"
                onClick={handleLogout}
              >
                로그아웃
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="auth-button"
                  >
                    로그인
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="auth-button"
                  >
                    회원가입
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <NoticeBar />

        {/* 검색 섹션 */}
        <div className="search-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="시설명, 지역명으로 검색하세요"
              className="search-input"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* 히어로 배너 */}
        <div className="hero-section">
          <div className="hero-banner">
            <div className="hero-text">
              <div className="hero-tags">
                <span className="tag yellow">요양 고민</span>
                <span className="tag pink">상담</span>
                <span className="tag blue">정보</span>
              </div>
              <h1 className="hero-title">함께 소통해요!</h1>
            </div>
            <div className="hero-image">
              <img
                src="/images/compassionate-elder-care-chat.png"
                alt="상담 이미지"
                className="chat-image"
              />
            </div>
          </div>
        </div>

        {/* 시설 타입 그리드 */}
        <div className="facility-grid-section">
          <div className="facility-card">
            <div className="facility-card-header"></div>
            <FacilityTypeGrid />
          </div>
        </div>

        <VideoSection />
        <PromotionSection />

        {/* 상품 섹션: API 통해 받아온 products 렌더링 */}
        <div className="products-section">
  <div className="products-card">
    <div className="products-header">
      <h2>인기 제품 추천 상품</h2>
      <Link to="/products" className="more-link">
        더보기
        <ChevronRight className="icon-tiny" />
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
        products.slice(0, 3).map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className="product-card"
          >
    <div className="home-product-image-box">
      <img
        src={product.images || "/images/placeholder.svg"}
        alt={product.name}
        className="home-product-image"
      />
    </div>

        <div className="product-price-info">
          <span className="price">
            {product.discountPrice
              ? parseInt(product.discountPrice).toLocaleString("ko-KR") + "원"
              : product.price + "원"}
          </span>
          {product.discount && (
            <span className="discount">{product.discount}</span>
          )}
</div>

          </Link>
        ))
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
