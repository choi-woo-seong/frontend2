import { Link, useLocation } from "react-router-dom";
import { Home, Search, Heart, ShoppingBag, ShoppingCart } from "lucide-react";
import "./BottomNavigation.css";

function BottomNavigation() {
  const { pathname } = useLocation();
  const isActive = (path) => (pathname === path ? "active" : "inactive");

  return (
    <>
      {/* 가짜 spacer 추가: 56px 만큼 차지 */}
      <div style={{ height: "56px" }} />

      <div className="bottom-navigation">
        <div className="bottom-navigation-inner">
          {/* 홈 */}
          <Link to="/" className="bottom-navigation-link">
            <Home className={`bottom-navigation-icon ${isActive("/")}`} />
            <span className={`bottom-navigation-text ${isActive("/")}`}>홈</span>
          </Link>

          {/* 시설찾기 */}
          <Link to="/search" className="bottom-navigation-link">
            <Search className={`bottom-navigation-icon ${isActive("/search")}`} />
            <span className={`bottom-navigation-text ${isActive("/search")}`}>시설찾기</span>
          </Link>

          {/* 찜한목록 */}
          <Link to="/favorites" className="bottom-navigation-link">
            <Heart className={`bottom-navigation-icon ${isActive("/favorites")}`} />
            <span className={`bottom-navigation-text ${isActive("/favorites")}`}>찜한목록</span>
          </Link>

          {/* 스토어 */}
          <Link to="/products" className="bottom-navigation-link">
            <ShoppingBag className={`bottom-navigation-icon ${isActive("/products")}`} />
            <span className={`bottom-navigation-text ${isActive("/products")}`}>스토어</span>
          </Link>

          {/* 장바구니 */}
          <Link to="/cart" className="bottom-navigation-link">
            <ShoppingCart className={`bottom-navigation-icon ${isActive("/cart")}`} />
            <span className={`bottom-navigation-text ${isActive("/cart")}`}>장바구니</span>
          </Link>
        </div>
      </div>
    </>
  );
}

export default BottomNavigation;
