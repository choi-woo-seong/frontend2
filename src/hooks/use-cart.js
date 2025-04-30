"use client"

import { useState, useEffect, createContext, useContext } from "react"

// 장바구니 상품 타입 정의
// 백엔드 API 응답 구조에 맞게 수정 필요
/**
 * @typedef {Object} Product
 * @property {string|number} id - 상품 고유 ID
 * @property {string} name - 상품 이름
 * @property {string} price - 상품 가격 (형식: "10,000원")
 * @property {string} [image] - 상품 이미지 URL
 * @property {string} [discount] - 할인 정보
 * @property {number} quantity - 수량
 */

// 컨텍스트 생성
const CartContext = createContext(undefined)

/**
 * 장바구니 관리 프로바이더 컴포넌트
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  // 로컬 스토리지에서 장바구니 불러오기
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
  }, [])

  // 장바구니 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  /**
   * 장바구니에 상품 추가
   *
   * @param {Omit<Product, "quantity">} product - 추가할 상품 정보
   */
  const addToCart = (product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id)
      if (existingItem) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })

    // TODO: 백엔드 API 연동 - 사용자가 로그인한 경우 서버에 장바구니 동기화
    // axios.post('/api/cart', { productId: product.id, quantity: 1 })
    //   .then(response => console.log('Product added to cart on server'))
    //   .catch(error => console.error('Failed to add product to cart on server', error));
  }

  /**
   * 장바구니에서 상품 제거
   *
   * @param {string|number} id - 제거할 상품 ID
   */
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))

    // TODO: 백엔드 API 연동 - 사용자가 로그인한 경우 서버에 장바구니 동기화
    // axios.delete(`/api/cart/${id}`)
    //   .then(response => console.log('Product removed from cart on server'))
    //   .catch(error => console.error('Failed to remove product from cart on server', error));
  }

  /**
   * 상품 수량 업데이트
   *
   * @param {string|number} id - 업데이트할 상품 ID
   * @param {number} quantity - 새 수량
   */
  const updateQuantity = (id, quantity) => {
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))

    // TODO: 백엔드 API 연동 - 사용자가 로그인한 경우 서버에 장바구니 동기화
    // axios.put(`/api/cart/${id}`, { quantity })
    //   .then(response => console.log('Product quantity updated on server'))
    //   .catch(error => console.error('Failed to update product quantity on server', error));
  }

  /**
   * 장바구니 비우기
   */
  const clearCart = () => {
    setCart([])

    // TODO: 백엔드 API 연동 - 사용자가 로그인한 경우 서버에 장바구니 동기화
    // axios.delete('/api/cart')
    //   .then(response => console.log('Cart cleared on server'))
    //   .catch(error => console.error('Failed to clear cart on server', error));
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

/**
 * 장바구니 관리 훅
 *
 * @returns {Object} 장바구니 관리 객체
 * @returns {Product[]} returns.cart - 장바구니 목록
 * @returns {Function} returns.addToCart - 상품 추가 함수
 * @returns {Function} returns.removeFromCart - 상품 제거 함수
 * @returns {Function} returns.updateQuantity - 수량 업데이트 함수
 * @returns {Function} returns.clearCart - 장바구니 비우기 함수
 */
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
