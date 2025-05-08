import "../styles/HomePage.css"
import { Link, useNavigate } from "react-router-dom"
import {
  Search,
  MessageCircle,
  ChevronRight,
  ShoppingCart
} from "lucide-react"

import { Button } from "../components/ui/Button"
import FacilityTypeGrid from "../components/FacilityTypeGrid"
import FaqSection from "../components/FaqSection"
import PromotionSection from "../components/PromotionSection"
import NoticeBar from "../components/NoticeBar"
import VideoSection from "../components/VideoSection"
import BottomNavigation from "../components/BottomNavigation"
import logo from "../pages/img/logo.png"
import { useAuth } from "../hooks/use-auth" // ✅ 전역 상태 사용

const products = [
  {
    id: 1,
    name: "실버워커 (바퀴X) 노인용 보행기 경량 접이식 보행보조기",
    price: "220,000원",
    discount: "80%",
    image: "/images/supportive-stroll.png"
  },
  {
    id: 2,
    name: "의료용 실버워커(MASSAGE 722F) 노인용 보행기",
    price: "100,000원",
    discount: "50%",
    image: "/images/elderly-woman-using-walker.png"
  },
  {
    id: 3,
    name: "의료용 워커 노인 보행기 4발 지팡이 실버카 보행보조기",
    price: "54,000원",
    discount: "60%",
    image: "/images/elderly-woman-using-rollator.png"
  }
]

function HomePage() {
  const navigate = useNavigate()
  const { isLoggedIn, logout } = useAuth() // ✅ 전역 로그인 상태 사용

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      logout() // ✅ 전역 로그아웃 함수 호출
      alert("로그아웃 되었습니다.")
      navigate("/") // 홈으로 이동
    }
  }

  const addToCart = (product) => {
    alert(`${product.name}이(가) 장바구니에 추가되었습니다.`)
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="home-header-inner">
          <div className="home-logo-area">
            <img src={logo} alt="로고" className="logo" />
          </div>
          <div className="auth-buttons">
            {!isLoggedIn ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="auth-button">
                    로그인
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="ghost" size="sm" className="auth-button">
                    회원가입
                  </Button>
                </Link>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="auth-button"
                onClick={handleLogout}
              >
                로그아웃
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <NoticeBar />

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

        <div className="facility-grid-section">
          <div className="facility-card">
            <div className="facility-card-header">
             
             
            </div>
            <FacilityTypeGrid />
          </div>
        </div>

        <VideoSection />
        <PromotionSection />

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
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="product-card"
                >
                  <div className="product-image-box">
                    <img
                      src={product.image || "/images/placeholder.svg"}
                      alt={product.name}
                      className="product-image"
                    />
                    <button
                      className="add-cart-button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        addToCart(product)
                      }}
                    >
                      <ShoppingCart className="icon-tiny" />
                    </button>
                  </div>
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-price-info">
                      <span className="price">{product.price}</span>
                      <span className="discount">{product.discount}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <FaqSection />
      </main>

      <BottomNavigation currentPath="/" />
    </div>
  )
}

export default HomePage
