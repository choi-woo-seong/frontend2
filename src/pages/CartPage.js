"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../hooks/use-cart"
import BottomNavigation from "../components/BottomNavigation"
import { Button } from "../components/ui/Button"
import { ChevronLeft } from "lucide-react" // ✅ 추가
import "../styles/CartPage.css"

/**
 * 장바구니 페이지 컴포넌트
 *
 * @returns {JSX.Element}
 */
function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = Number.parseInt(item.price.replace(/[^0-9]/g, ""))
      return total + price * item.quantity
    }, 0)
  }

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원"
  }

  const handlePayment = () => {
    alert("카카오페이 결제 기능은 현재 개발 중입니다.")
  }

  const handleClearAll = () => {
    alert("전체 삭제 기능은 현재 개발 중입니다.")
  }

  return (
    <div className="cart-page">
      {/* 헤더 */}
      <header className="page-header">
        <div className="container">
          {/* ✅ 여기 수정 */}
          <Link to="/" className="mr-2">
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <h1>장바구니</h1>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="page-content">
        <div className="container">
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : cart.length > 0 ? (
            <div>
              <div className="list-header">
                <h2>장바구니 ({cart.length})</h2>
                <Button variant="ghost" size="sm" className="clear-all-button" onClick={handleClearAll}>
                  전체 삭제
                </Button>
              </div>

              <div className="cart-items">
                {cart.map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-content">
                      <div className="product-image">
                        <img src={product.image || "/placeholder.svg"} alt={product.name} />
                      </div>
                      <div className="product-info">
                        <Link to={`/products/${product.id}`}>
                          <h3>{product.name}</h3>
                        </Link>
                        <p className="product-price">{product.price}</p>
                        {product.discount && <p className="product-discount">할인: {product.discount}</p>}
                      </div>
                    </div>

                    <div className="product-actions">
                      <div className="quantity-control">
                        <button
                          className="quantity-button"
                          onClick={() => updateQuantity(product.id, Math.max(1, product.quantity - 1))}
                        >
                          <i className="icon-minus"></i>
                        </button>
                        <span className="quantity-value">{product.quantity}</span>
                        <button
                          className="quantity-button"
                          onClick={() => updateQuantity(product.id, product.quantity + 1)}
                        >
                          <i className="icon-plus"></i>
                        </button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="delete-button"
                        onClick={() => removeFromCart(product.id)}
                      >
                        <i className="icon-trash"></i>
                        삭제
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 주문 요약 */}
              <div className="order-summary">
                <h3>주문 요약</h3>
                <div className="summary-items">
                  <div className="summary-item">
                    <span>상품 금액</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                  <div className="summary-item">
                    <span>배송비</span>
                    <span>무료</span>
                  </div>
                </div>
                <div className="summary-total">
                  <span>총 결제 금액</span>
                  <span className="total-price">{formatPrice(calculateTotal())}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="empty-cart-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7h13a1 1 0 001-1v-1H8.5M7 13L5.4 5H19" />
                </svg>
              </div>
              <h2 className="empty-title">장바구니가 비어있습니다</h2>
              <p className="empty-description">필요한 제품을 장바구니에 담아보세요.</p>
              <Link to="/products">
                <button className="empty-search-button">
                  제품 쇼핑하기
                </button>
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* 결제 버튼 */}
      {!isLoading && cart.length > 0 && (
        <div className="payment-bar">
          <Button onClick={handlePayment} className="payment-button">
            <i className="icon-credit-card"></i>
            카카오페이로 결제하기
          </Button>
        </div>
      )}

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  )
}

export default CartPage
