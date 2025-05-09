// src/pages/CartPage.jsx
"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import BottomNavigation from "../components/BottomNavigation"
import { Button } from "../components/ui/Button"
import { ChevronLeft } from "lucide-react"
import "../styles/CartPage.css"

const API_BASE_URL = process.env.REACT_APP_API_URL

/**
 * 장바구니 페이지 컴포넌트
 */
function CartPage() {
  const [cart, setCart] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // 백엔드에서 장바구니 아이템 가져오기
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem("accessToken")
        const res = await fetch(`${API_BASE_URL}/cart`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error("장바구니 로딩 실패")
        const data = await res.json()
      console.log(data)
        setCart(
          data.map(item => ({
            id: item.productId,
            name: item.productName,
            image: item.imageUrls?.[0] || "/placeholder.svg",
            quantity: item.quantity,
            price: item.unitPrice.toLocaleString("ko-KR") + "원"
          }))
        )
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCart()
  }, [])

  // 장바구니 항목 삭제
  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("accessToken")
      const res = await fetch(`${API_BASE_URL}/cart/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error("삭제 실패")
      setCart(prev => prev.filter(item => item.id !== productId))
    } catch (err) {
      console.error(err)
      alert("삭제 중 오류가 발생했습니다.")
    }
  }

  // 수량 변경
  const updateQuantity = async (productId, newQty) => {
    try {
      const token = localStorage.getItem("accessToken")
      const res = await fetch(`${API_BASE_URL}/cart`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: newQty })
      })
      if (!res.ok) throw new Error("수량 변경 실패")
      setCart(prev =>
        prev.map(item =>
          item.id === productId ? { ...item, quantity: newQty } : item
        )
      )
    } catch (err) {
      console.error(err)
      alert("수량 변경 중 오류가 발생했습니다.")
    }
  }

  
 const clearCart = async () => {
     try {
       const token = localStorage.getItem("accessToken")
       const res = await fetch(`${API_BASE_URL}/cart`, {
         method: "DELETE",
         headers: { Authorization: `Bearer ${token}` }
       })
       if (!res.ok) throw new Error("전체 삭제 실패")
       setCart([])   // 화면에서 모두 지워줍니다
     } catch (err) {
       console.error(err)
       alert("전체 삭제 중 오류가 발생했습니다.")
     }
   }

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

  return (
    <div className="cart-page">
      <header className="page-header">
        <div className="container">
          <Link to="/" className="mr-2">
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <h1>장바구니</h1>
        </div>
      </header>

      <main className="page-content">
        <div className="container">
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : cart.length > 0 ? (
            <>
              <div className="list-header">
                <h2>장바구니 ({cart.length})</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="clear-all-button"
                  onClick={clearCart}
                >
                  전체 삭제
                </Button>
              </div>

              <div className="cart-items">
                {cart.map(product => (
                  <div key={product.id} className="product-card">
                    <div className="product-content">
                      <div className="product-image">
                        <img src={product.image} alt={product.name} />
                      </div>
                      <div className="product-info">
                        <Link to={`/products/${product.id}`}>
                          <h3>{product.name}</h3>
                        </Link>
                        <p className="product-price">{product.price}</p>
                      </div>
                    </div>

                    <div className="product-actions">
                      <div className="quantity-control">
                        <button
                          className="quantity-button"
                          onClick={() => updateQuantity(product.id, Math.max(1, product.quantity - 1))}
                        >
                          -
                        </button>
                        <span className="quantity-value">{product.quantity}</span>
                        <button
                          className="quantity-button"
                          onClick={() => updateQuantity(product.id, product.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="delete-button"
                        onClick={() => removeFromCart(product.id)}
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

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
            </>
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
                <button className="empty-search-button">제품 쇼핑하기</button>
              </Link>
            </div>
          )}
        </div>
      </main>

      {!isLoading && cart.length > 0 && (
        <div className="payment-bar">
          <Button onClick={handlePayment} className="payment-button">
            카카오페이로 결제하기
          </Button>
        </div>
      )}

      <BottomNavigation />
    </div>
  )
}

export default CartPage
