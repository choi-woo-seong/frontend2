import { Link, useLocation } from "react-router-dom";
import { useState,useEffect} from "react";
import { Home, Search, Heart, ShoppingBag, ShoppingCart } from "lucide-react";
import axios from "axios";
import "./BottomNavigation.css";

function BottomNavigation() {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const { pathname } = useLocation();
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isActive = (path) => (pathname === path ? "active" : "inactive");

  useEffect(() => {
    fetchFavorites();
    fetchCart();
  }, [pathname]);

  // 찜한 목록 개수 가져오기
  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${API_BASE_URL}/bookmarks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("찜 목록:", res.data);
      setFavorites(res.data);
    } catch (err) {
      console.error("찜한 시설 목록 불러오기 실패:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 장바구니 개수 가져오기
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${API_BASE_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("장바구니 목록:", res.data);
      setCart(res.data);
    } catch (err) {
      console.error("찜한 시설 목록 불러오기 실패:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 가짜 spacer 추가: 56px 만큼 차지 */}
      <div style={{ height: "56px" }} />

      <div className="bottom-navigation">
        <div className="bottom-navigation-inner">
          {/* 홈 */}
          <Link to="/" className="bottom-navigation-link">
            <Home className={`bottom-navigation-icon ${isActive("/")}`} />
            <span className={`bottom-navigation-text ${isActive("/")}`}>
              홈
            </span>
          </Link>

          {/* 시설찾기 */}
          <Link to="/search" className="bottom-navigation-link">
            <Search
              className={`bottom-navigation-icon ${isActive("/search")}`}
            />
            <span className={`bottom-navigation-text ${isActive("/search")}`}>
              시설찾기
            </span>
          </Link>

          {/* 찜한목록 */}
          <Link to="/favorites" className="bottom-navigation-link">
            <Heart
              className={`bottom-navigation-icon ${isActive("/favorites")}`}
            />
            <span
              className={`bottom-navigation-text ${isActive("/favorites")}`}
            >
              찜한목록({favorites.length})
            </span>
          </Link>

          {/* 스토어 */}
          <Link to="/products" className="bottom-navigation-link">
            <ShoppingBag
              className={`bottom-navigation-icon ${isActive("/products")}`}
            />
            <span className={`bottom-navigation-text ${isActive("/products")}`}>
              스토어
            </span>
          </Link>

          {/* 장바구니 */}
          <Link to="/cart" className="bottom-navigation-link">
            <ShoppingCart
              className={`bottom-navigation-icon ${isActive("/cart")}`}
            />
            <span className={`bottom-navigation-text ${isActive("/cart")}`}>
              장바구니({cart.length})
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}

export default BottomNavigation;
