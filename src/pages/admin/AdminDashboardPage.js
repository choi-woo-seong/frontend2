"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../../components/Layout"
import { Button } from "../../components/ui/Button"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "../../components/ui/Tabs"
import Skeleton from "../../components/ui/Skeleton"
import "../../styles/AdminDashboardPage.css"
import { Link } from "react-router-dom"
import { BarChart3, ShoppingCart, Users, CreditCard, Package, TrendingUp } from 'lucide-react'

// Chart.js 라이브러리 임포트
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line, Bar, Doughnut } from "react-chartjs-2"

// Chart.js 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

/**
 * 관리자 대시보드 페이지
 * 시설, 상품, 사용자, 주문 등의 통계 및 관리 기능을 제공합니다.
 */
const AdminDashboardPage = () => {
  // 라우팅을 위한 navigate 함수
  const navigate = useNavigate()

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("facilities")

  // 통계 데이터
  const [stats, setStats] = useState({
    facilities: { total: 0, approved: 0, pending: 0, rejected: 0 },
    products: { total: 0, inStock: 0, outOfStock: 0 },
    users: { total: 0, new: 0 },
    orders: { total: 0, completed: 0, processing: 0, cancelled: 0 },
    revenue: { total: 0, thisMonth: 0, lastMonth: 0 },
  })

  // 최근 활동 데이터
  const [recentActivities, setRecentActivities] = useState([])

  // 인기 시설 데이터
  const [popularFacilities, setPopularFacilities] = useState([])

  // 인기 상품 데이터
  const [popularProducts, setPopularProducts] = useState([])

  // 월별 매출 데이터
  const [monthlyRevenue, setMonthlyRevenue] = useState([])

  // 사용자 증가 데이터
  const [userGrowth, setUserGrowth] = useState([])

  // 데이터 로드
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // TODO: 백엔드 API 연동 - 대시보드 데이터 요청
        // 현재는 더미 데이터로 대체

        // 통계 데이터 설정
        setStats({
          facilities: { total: 120, approved: 98, pending: 15, rejected: 7 },
          products: { total: 85, inStock: 72, outOfStock: 13 },
          users: { total: 450, new: 32 },
          orders: { total: 215, completed: 180, processing: 25, cancelled: 10 },
          revenue: { total: 12500000, thisMonth: 2800000, lastMonth: 2500000 },
        })

        // 최근 활동 데이터 설정
        setRecentActivities([
          { id: 1, type: "user_signup", user: "김철수", timestamp: new Date(Date.now() - 25 * 60000) },
          {
            id: 2,
            type: "facility_review",
            user: "이영희",
            facility: "행복요양원",
            rating: 4,
            timestamp: new Date(Date.now() - 55 * 60000),
          },
          {
            id: 3,
            type: "product_order",
            user: "박지민",
            product: "전동 침대",
            quantity: 1,
            timestamp: new Date(Date.now() - 120 * 60000),
          },
          {
            id: 4,
            type: "facility_registration",
            facility: "미소요양병원",
            timestamp: new Date(Date.now() - 180 * 60000),
          },
          {
            id: 5,
            type: "question",
            user: "최동욱",
            content: "방문요양 서비스 비용은 어떻게 되나요?",
            timestamp: new Date(Date.now() - 240 * 60000),
          },
        ])

        // 인기 시설 데이터 설정
        setPopularFacilities([
          { id: 1, name: "행복요양원", type: "요양원", views: 1250, favorites: 87, reviews: 42 },
          { id: 2, name: "미소요양병원", type: "요양병원", views: 980, favorites: 65, reviews: 38 },
          { id: 3, name: "푸른실버타운", type: "실버타운", views: 870, favorites: 59, reviews: 31 },
          { id: 4, name: "사랑방문요양센터", type: "방문요양", views: 750, favorites: 42, reviews: 28 },
          { id: 5, name: "건강요양원", type: "요양원", views: 680, favorites: 38, reviews: 25 },
        ])

        // 인기 상품 데이터 설정
        setPopularProducts([
          { id: 1, name: "전동 침대", category: "가구", sales: 28, revenue: 5600000, stock: 15 },
          { id: 2, name: "접이식 워커", category: "이동보조", sales: 35, revenue: 1750000, stock: 22 },
          { id: 3, name: "목욕의자", category: "욕실용품", sales: 42, revenue: 1260000, stock: 18 },
          { id: 4, name: "전동 휠체어", category: "이동보조", sales: 12, revenue: 4800000, stock: 8 },
          { id: 5, name: "욕창방지 매트리스", category: "침구류", sales: 25, revenue: 2500000, stock: 20 },
        ])

        // 월별 매출 데이터 설정
        setMonthlyRevenue([
          { month: "1월", revenue: 1800000 },
          { month: "2월", revenue: 2100000 },
          { month: "3월", revenue: 1950000 },
          { month: "4월", revenue: 2300000 },
          { month: "5월", revenue: 2450000 },
          { month: "6월", revenue: 2600000 },
          { month: "7월", revenue: 2400000 },
          { month: "8월", revenue: 2500000 },
          { month: "9월", revenue: 2700000 },
          { month: "10월", revenue: 2800000 },
          { month: "11월", revenue: 0 },
          { month: "12월", revenue: 0 },
        ])

        // 사용자 증가 데이터 설정
        setUserGrowth([
          { month: "1월", users: 320 },
          { month: "2월", users: 340 },
          { month: "3월", users: 355 },
          { month: "4월", users: 370 },
          { month: "5월", users: 385 },
          { month: "6월", users: 400 },
          { month: "7월", users: 415 },
          { month: "8월", users: 425 },
          { month: "9월", users: 440 },
          { month: "10월", users: 450 },
          { month: "11월", users: 0 },
          { month: "12월", users: 0 },
        ])

        // 로딩 완료
        setIsLoading(false)
      } catch (error) {
        console.error("대시보드 데이터 로드 중 오류 발생:", error)
        // 에러 처리
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // 탭 변경 핸들러
  const handleTabChange = (value) => {
    console.log("탭 변경:", value)
    setActiveTab(value)
  }

  // 시설 상세 페이지로 이동
  const handleFacilityDetail = (facilityId) => {
    console.log(`시설 ID ${facilityId}의 상세 페이지로 이동합니다.`)
    navigate(`/admin/facilities/${facilityId}`)
  }

  // 상품 상세 페이지로 이동
  const handleProductDetail = (productId) => {
    console.log(`상품 ID ${productId}의 상세 페이지로 이동합니다.`)
    navigate(`/admin/products/${productId}`)
  }

  // 빠른 작업 핸들러
  const handleQuickAction = (action) => {
    switch (action) {
      case "facility-list":
        console.log("시설 목록 페이지로 이동합니다.")
        navigate("/admin/facilities")
        break
      case "product-list":
        console.log("상품 목록 페이지로 이동합니다.")
        navigate("/admin/products")
        break
      case "notice-write":
        console.log("공지사항 작성 페이지로 이동합니다.")
        navigate("/admin/notices/new")
        break
      case "inquiry-answer":
        console.log("문의 답변 페이지로 이동합니다.")
        navigate("/admin/questions")
        break
      default:
        break
    }
  }

  // 모든 활동 보기 핸들러
  const handleViewAllActivities = () => {
    console.log("모든 활동 보기 페이지로 이동합니다.")
    navigate("/admin/activities")
  }

  /**
   * 금액 포맷팅 함수
   *
   * @param {number} amount - 금액
   * @returns {string} 포맷팅된 금액 문자열
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  /**
   * 시간 포맷팅 함수
   *
   * @param {Date} date - 날짜 객체
   * @returns {string} 포맷팅된 시간 문자열
   */
  const formatTime = (date) => {
    const now = new Date()
    const diffMinutes = Math.floor((now - date) / (1000 * 60))

    if (diffMinutes < 60) {
      return `${diffMinutes}분 전`
    } else if (diffMinutes < 24 * 60) {
      return `${Math.floor(diffMinutes / 60)}시간 전`
    } else {
      return date.toLocaleDateString("ko-KR")
    }
  }

  /**
   * 활동 타입에 따른 메시지 생성
   *
   * @param {Object} activity - 활동 객체
   * @returns {string} 활동 메시지
   */
  const getActivityMessage = (activity) => {
    switch (activity.type) {
      case "user_signup":
        return `${activity.user}님이 회원가입했습니다.`
      case "facility_review":
        return `${activity.user}님이 ${activity.facility}에 ${activity.rating}점 리뷰를 남겼습니다.`
      case "product_order":
        return `${activity.user}님이 ${activity.product} ${activity.quantity}개를 주문했습니다.`
      case "facility_registration":
        return `${activity.facility}이(가) 새로 등록되었습니다.`
      case "question":
        return `${activity.user}님이 질문을 남겼습니다: "${activity.content.substring(0, 20)}..."`
      default:
        return "새로운 활동이 있습니다."
    }
  }

  // 차트 데이터 - 월별 매출
  const revenueChartData = {
    labels: monthlyRevenue.map((item) => item.month),
    datasets: [
      {
        label: "월별 매출",
        data: monthlyRevenue.map((item) => item.revenue),
        borderColor: "rgb(79, 70, 229)",
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  }

  // 차트 데이터 - 사용자 증가
  const userChartData = {
    labels: userGrowth.map((item) => item.month),
    datasets: [
      {
        label: "사용자 수",
        data: userGrowth.map((item) => item.users),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderRadius: 4,
      },
    ],
  }

  // 차트 데이터 - 시설 유형 분포
  const facilityTypeChartData = {
    labels: ["요양원", "요양병원", "실버타운", "방문요양", "주야간보호"],
    datasets: [
      {
        data: [35, 25, 15, 15, 10],
        backgroundColor: [
          "rgba(79, 70, 229, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderWidth: 1,
      },
    ],
  }

  // 차트 옵션 - 공통
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  }

  // 로딩 중 스켈레톤 UI 표시
  if (isLoading) {
    return (
      <Layout>
        <div className="admin-dashboard">
          <h1 className="admin-dashboard-title">관리자 대시보드</h1>
          <div className="admin-dashboard-stats">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="admin-stat-card">
                <Skeleton className="admin-stat-title-skeleton" />
                <Skeleton className="admin-stat-value-skeleton" />
                <Skeleton className="admin-stat-subtitle-skeleton" />
              </div>
            ))}
          </div>
          <div className="admin-dashboard-content">
            <div className="admin-dashboard-main">
              <Skeleton className="admin-chart-skeleton" />
            </div>
            <div className="admin-dashboard-sidebar">
              <Skeleton className="admin-activity-skeleton" />
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="admin-dashboard">
        {/* 통계 카드 */}
        <div className="admin-dashboard-stats">
          <div className="admin-stat-card">
            <h3 className="admin-stat-title">시설</h3>
            <p className="admin-stat-value">{stats.facilities.total}</p>
            <div className="admin-stat-details">
              <span className="admin-stat-detail">승인: {stats.facilities.approved}</span>
              <span className="admin-stat-detail">대기: {stats.facilities.pending}</span>
              <span className="admin-stat-detail">거부: {stats.facilities.rejected}</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <h3 className="admin-stat-title">상품</h3>
            <p className="admin-stat-value">{stats.products.total}</p>
            <div className="admin-stat-details">
              <span className="admin-stat-detail">재고 있음: {stats.products.inStock}</span>
              <span className="admin-stat-detail">품절: {stats.products.outOfStock}</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <h3 className="admin-stat-title">사용자</h3>
            <p className="admin-stat-value">{stats.users.total}</p>
            <div className="admin-stat-details">
              <span className="admin-stat-detail">신규(이번 달): {stats.users.new}</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <h3 className="admin-stat-title">매출</h3>
            <p className="admin-stat-value">{formatCurrency(stats.revenue.total)}</p>
            <div className="admin-stat-details">
              <span className="admin-stat-detail">이번 달: {formatCurrency(stats.revenue.thisMonth)}</span>
              <span className="admin-stat-detail">지난 달: {formatCurrency(stats.revenue.lastMonth)}</span>
              <span className="admin-stat-detail admin-stat-growth">
                {stats.revenue.thisMonth > stats.revenue.lastMonth ? "+" : ""}
                {Math.round(((stats.revenue.thisMonth - stats.revenue.lastMonth) / stats.revenue.lastMonth) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* 차트 섹션 */}
        <div className="admin-dashboard-content">
          <div className="admin-dashboard-main">
            {/* 매출 차트 */}
            <div className="admin-chart-card">
              <h3 className="admin-section-title">월별 매출 추이</h3>
              <div className="admin-chart-container" style={{ height: "300px" }}>
                <Line data={revenueChartData} options={chartOptions} />
              </div>
            </div>

            {/* 탭 컨텐츠 */}
            <div className="admin-chart-card">
              <Tabs value={activeTab} onValueChange={handleTabChange} defaultValue="facilities">
                <TabsList>
                  <TabsTrigger value="facilities">인기 시설</TabsTrigger>
                  <TabsTrigger value="products">인기 상품</TabsTrigger>
                </TabsList>

                <TabsContent value="facilities">
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>시설명</th>
                          <th>유형</th>
                          <th>조회수</th>
                          <th>찜</th>
                          <th>리뷰</th>
                          <th>관리</th>
                        </tr>
                      </thead>
                      <tbody>
                        {popularFacilities.map((facility) => (
                          <tr key={facility.id}>
                            <td>{facility.name}</td>
                            <td>{facility.type}</td>
                            <td>{facility.views.toLocaleString()}</td>
                            <td>{facility.favorites.toLocaleString()}</td>
                            <td>{facility.reviews.toLocaleString()}</td>
                            <td>
                              <Button
                                variant="outline"
                                size="sm"
                                className="admin-table-button"
                                onClick={() => handleFacilityDetail(facility.id)}
                              >
                                상세
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="products">
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>상품명</th>
                          <th>카테고리</th>
                          <th>판매량</th>
                          <th>매출</th>
                          <th>재고</th>
                          <th>관리</th>
                        </tr>
                      </thead>
                      <tbody>
                        {popularProducts.map((product) => (
                          <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>{product.sales.toLocaleString()}</td>
                            <td>{formatCurrency(product.revenue)}</td>
                            <td>{product.stock.toLocaleString()}</td>
                            <td>
                              <Button
                                variant="outline"
                                size="sm"
                                className="admin-table-button"
                                onClick={() => handleProductDetail(product.id)}
                              >
                                상세
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* 사용자 증가 차트 */}
            <div className="admin-chart-card">
              <h3 className="admin-section-title">사용자 증가 추이</h3>
              <div className="admin-chart-container" style={{ height: "300px" }}>
                <Bar data={userChartData} options={chartOptions} />
              </div>
            </div>
          </div>

          <div className="admin-dashboard-sidebar">
            {/* 시설 유형 분포 차트 */}
            <div className="admin-chart-card">
              <h3 className="admin-section-title">시설 유형 분포</h3>
              <div className="admin-chart-container" style={{ height: "250px" }}>
                <Doughnut data={facilityTypeChartData} options={chartOptions} />
              </div>
            </div>

            {/* 최근 활동 */}
            <div className="admin-activity">
              <h3 className="admin-section-title">최근 활동</h3>
              <ul className="admin-activity-list">
                {recentActivities.map((activity) => (
                  <li key={activity.id} className="admin-activity-item">
                    <div className="admin-activity-content">
                      <p className="admin-activity-message">{getActivityMessage(activity)}</p>
                      <span className="admin-activity-time">{formatTime(activity.timestamp)}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <Button className="admin-view-all-button" onClick={handleViewAllActivities}>
                모든 활동 보기
              </Button>
            </div>

            {/* 빠른 작업 */}
            <div className="admin-quick-actions">
              <h3 className="admin-section-title">빠른 작업</h3>
              <div className="admin-quick-actions-grid">
                <Button className="admin-quick-action-button" onClick={() => handleQuickAction("facility-list")}>
                  시설 목록
                </Button>
                <Button className="admin-quick-action-button" onClick={() => handleQuickAction("product-list")}>
                  상품 목록
                </Button>
                <Button className="admin-quick-action-button" onClick={() => handleQuickAction("notice-write")}>
                  공지사항 작성
                </Button>
                <Button className="admin-quick-action-button" onClick={() => handleQuickAction("inquiry-answer")}>
                  문의 답변
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdminDashboardPage
