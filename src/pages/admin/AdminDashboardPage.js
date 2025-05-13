"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../../components/Layout"
import { Button } from "../../components/ui/Button"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "../../components/ui/Tabs"
import Skeleton from "../../components/ui/Skeleton"
import "../../styles/AdminDashboardPage.css"
import { BarChart3, ShoppingCart, Users, CreditCard, Package, TrendingUp } from 'lucide-react'
import axios from "axios"

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
  const navigate = useNavigate()

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("facilities")
  const [facilityCount, setFacilityCount] = useState(0)

  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    dailyGrowth: [],
  })

  // 통계 데이터
  const [stats, setStats] = useState({
    facilities: { total: 0, approved: 0, pending: 0, rejected: 0 },
    products: { total: 0, inStock: 0, outOfStock: 0 },
    users: { total: 0, new: 0 },
    orders: { total: 0, completed: 0, processing: 0, cancelled: 0 },
    revenue: { total: 0, thisMonth: 0, lastMonth: 0 },
  })

  // 데이터 리스트
  const [recentActivities, setRecentActivities] = useState([])
  const [popularFacilities, setPopularFacilities] = useState([])
  const [popularProducts, setPopularProducts] = useState([])
  const [monthlyRevenue, setMonthlyRevenue] = useState([])
  const [userGrowth, setUserGrowth] = useState([])
  const [facilityTypeStats, setFacilityTypeStats] = useState([])
  const [dailyUserGrowth, setDailyUserGrowth] = useState([])


useEffect(() => {
  const fetchDashboardSummary = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("accessToken") || ""
      const headers = { Authorization: `Bearer ${token}` }

      const [facilityRes, summaryRes, userGrowthRes, saleSummaryRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/admin/dashboard/facility-count`, { headers }),
        axios.get(`${process.env.REACT_APP_API_URL}/admin/dashboard/summary`, { headers }),
        axios.get(`${process.env.REACT_APP_API_URL}/admin/dashboard/user-daily-growth`, { headers }),
        axios.get(`${process.env.REACT_APP_API_URL}/admin/dashboard/sale-summary`, { headers }),
      ])

      // ✅ 시설 수
      setFacilityCount(facilityRes.data)

      // ✅ 상품 통계
      const sumData = summaryRes.data
      setStats(prev => ({
        ...prev,
        products: sumData.products || prev.products,
      }))

      // ✅ 매출 통계
      const saleData = saleSummaryRes.data
      setStats(prev => ({
        ...prev,
        revenue: {
          total: saleSummaryRes.data.total || 0,
          thisMonth: saleSummaryRes.data.today || 0,
          lastMonth: saleSummaryRes.data.yesterday || 0,
        },
      }))

      // ✅ 사용자 일별 증가 데이터 처리
      const userData = userGrowthRes.data || []
      const formatted = userData.map(({ date, count, total }) => ({
        month: date,
        users: count,
        total,
      }))

      setUserStats({
        totalUsers: userData.length > 0 ? userData[0].total : 0,
        dailyGrowth: userData,
      })

      // ✅ 그래프용 추이만 따로 저장
      setUserGrowth(formatted)

    } catch (err) {
      console.error("대시보드 데이터 로딩 실패:", err)
    } finally {
      setIsLoading(false)
    }
  }

  fetchDashboardSummary()
}, [])

  // 핸들러
  const handleTabChange = (val) => setActiveTab(val)
  const handleFacilityDetail = (id) => navigate(`/admin/facilities/${id}`)
  const handleProductDetail = (id) => navigate(`/admin/products/${id}`)
  const handleQuickAction = (action) => {
    const routes = {
      "facility-list": "/admin/facilities",
      "product-list": "/admin/products",
      "notice-write": "/admin/notices/new",
      "inquiry-answer": "/admin/questions",
    }
    navigate(routes[action] || "/admin")
  }

  const formatCurrency = (amt) => new Intl.NumberFormat("ko-KR",{style:"currency",currency:"KRW",maximumFractionDigits:0}).format(amt)
  const formatTime = (dt) => {
    const diff = Math.floor((new Date() - new Date(dt)) / 60000)
    return diff < 60 ? `${diff}분 전` : diff < 1440 ? `${Math.floor(diff/60)}시간 전` : new Date(dt).toLocaleDateString("ko-KR")
  }

  // 차트 데이터 구성
  const revenueChartData = { labels: monthlyRevenue.map(i=>i.month), datasets:[{label:"월별 매출",data:monthlyRevenue.map(i=>i.revenue),tension:0.4}] }
  const userChartData = { labels: userGrowth.map(i=>i.month), datasets:[{label:"가입자 수",data:userGrowth.map(i=>i.users),tension:0.4}] }
  const facilityTypeChartData = { labels: facilityTypeStats.map(i=>i.type), datasets:[{data:facilityTypeStats.map(i=>i.count)}] }

  if(isLoading) {
    return (
      <Layout>
        <div className="admin-dashboard">
          <h1 className="admin-dashboard-title">관리자 대시보드</h1>
          <div className="admin-dashboard-stats">
            {[...Array(4)].map((_,i)=><Skeleton key={i} className="admin-stat-card-skel" />)}
          </div>
          <div className="admin-dashboard-content"><Skeleton className="admin-chart-skel" /></div>
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
             <h3>시설</h3>
             <p>{facilityCount}</p>
          </div>
          <div className="admin-stat-card">
            <h3>상품</h3><p>{stats.products.total}</p>
          </div>
          <div className="admin-stat-card">
            <h3>사용자</h3>
            <p>{userStats.totalUsers}</p>
            <div><span>신규: {userStats.dailyGrowth.at(-1)?.count ?? 0}</span></div>
          </div>
          <div className="admin-stat-card">
            <h3>매출</h3>
            <p>{formatCurrency(stats.revenue.total)}</p>
            <div>
              <span>오늘: {formatCurrency(stats.revenue.thisMonth)}</span>
              <span> </span><span>어제: {formatCurrency(stats.revenue.lastMonth)}</span>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="admin-dashboard-content">
          {/* 매출 차트 */}
          <div className="admin-chart-card">
            <h3>월별 매출 추이</h3>
            <div className="admin-chart-container" style={{ height: "300px" }}>
              <Bar data={revenueChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          {/* 인기 시설/상품 탭 */}
          <div className="admin-chart-card">
            <Tabs value={activeTab} onValueChange={handleTabChange} defaultValue="facilities">
              <TabsList>
                <TabsTrigger value="facilities">인기 시설</TabsTrigger>
                <TabsTrigger value="products">인기 상품</TabsTrigger>
              </TabsList>
              <TabsContent value="facilities">
                <table className="admin-table">
                  <thead><tr><th>시설명</th><th>유형</th><th>조회수</th><th>찜</th><th>리뷰</th><th>관리</th></tr></thead>
                  <tbody>{popularFacilities.map(f=>(<tr key={f.id}><td>{f.name}</td><td>{f.type}</td><td>{f.views}</td><td>{f.favorites}</td><td>{f.reviews}</td><td><Button size="sm" onClick={()=>handleFacilityDetail(f.id)}>상세</Button></td></tr>))}</tbody>
                </table>
              </TabsContent>
              <TabsContent value="products">
                <table className="admin-table">
                  <thead><tr><th>상품명</th><th>카테고리</th><th>판매량</th><th>매출</th><th>재고</th><th>관리</th></tr></thead>
                  <tbody>{popularProducts.map(p=>(<tr key={p.id}><td>{p.name}</td><td>{p.category}</td><td>{p.sales}</td><td>{formatCurrency(p.revenue)}</td><td>{p.stock}</td><td><Button size="sm" onClick={()=>handleProductDetail(p.id)}>상세</Button></td></tr>))}</tbody>
                </table>
              </TabsContent>
            </Tabs>
          </div>

          {/* 가입자 증가 차트 */}
          <div className="admin-chart-card">
            <h3>사용자 증가 추이</h3>
            <div className="admin-chart-container" style={{ height: "300px" }}>
              <Line data={userChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        {/* 사이드바 */}
        <div className="admin-dashboard-sidebar">
          <div className="admin-chart-card">
            <h3>시설 유형 분포</h3>
            <div className="admin-chart-container" style={{ height: "250px" }}>
              <Doughnut data={facilityTypeChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
          <div className="admin-quick-actions">
            <h3>빠른 작업</h3>
            <div>
              <Button onClick={()=>handleQuickAction("facility-list")}>시설 목록</Button>
              <Button onClick={()=>handleQuickAction("product-list")}>상품 목록</Button>
              <Button onClick={()=>handleQuickAction("notice-write")}>공지사항 작성</Button>
              <Button onClick={()=>handleQuickAction("inquiry-answer")}>문의 답변</Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdminDashboardPage
