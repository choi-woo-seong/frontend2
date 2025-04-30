/**
 * 클래스 이름을 조건부로 결합하는 유틸리티 함수
 * @param {...string} classes - 결합할 클래스 이름들
 * @returns {string} - 결합된 클래스 이름 문자열
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

/**
 * 가격을 포맷팅하는 함수
 * @param {number} price - 포맷팅할 가격
 * @returns {string} - 포맷팅된 가격 문자열 (예: "10,000원")
 */
export function formatPrice(price) {
  return price.toLocaleString("ko-KR") + "원"
}

/**
 * 날짜를 포맷팅하는 함수
 * @param {string|Date} date - 포맷팅할 날짜
 * @returns {string} - 포맷팅된 날짜 문자열 (예: "2023-05-15")
 */
export function formatDate(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

/**
 * 문자열을 자르고 말줄임표를 추가하는 함수
 * @param {string} text - 자를 문자열
 * @param {number} maxLength - 최대 길이
 * @returns {string} - 잘린 문자열
 */
export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

/**
 * 로컬 스토리지에 데이터를 저장하는 함수
 * @param {string} key - 저장할 키
 * @param {any} value - 저장할 값
 */
export function setLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error("로컬 스토리지에 저장하는 중 오류가 발생했습니다:", error)
  }
}

/**
 * 로컬 스토리지에서 데이터를 가져오는 함수
 * @param {string} key - 가져올 키
 * @param {any} defaultValue - 기본값
 * @returns {any} - 저장된 값 또는 기본값
 */
export function getLocalStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error("로컬 스토리지에서 가져오는 중 오류가 발생했습니다:", error)
    return defaultValue
  }
}

/**
 * 쿼리 파라미터를 객체로 파싱하는 함수
 * @param {string} queryString - 파싱할 쿼리 문자열
 * @returns {Object} - 파싱된 쿼리 파라미터 객체
 */
export function parseQueryString(queryString) {
  const params = new URLSearchParams(queryString)
  const result = {}
  for (const [key, value] of params.entries()) {
    result[key] = value
  }
  return result
}

/**
 * 객체를 쿼리 문자열로 변환하는 함수
 * @param {Object} params - 변환할 객체
 * @returns {string} - 변환된 쿼리 문자열
 */
export function buildQueryString(params) {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&")
}
