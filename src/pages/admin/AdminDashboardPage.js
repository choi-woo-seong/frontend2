"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../../components/Layout"
import { Button } from "../../components/ui/Button"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "../../components/ui/Tabs"
import Skeleton from "../../components/ui/Skeleton"
import "../../styles/AdminDashboardPage.css"
import axios from "axios"
import { Line, Bar, Doughnut } from "react-chartjs-2"
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

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

/**
 * 관리자 대시보드 페이지
 * UI 수정: 통계 카드를 그리드로 정렬, 매출 차트를 라인 차트로 변경
 */
const AdminDashboardPage = () => {
  const navigate = useNavigate()

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("facilities")

  const facilityTypeMap = {
     nursing_hospital : "요양병원",
     nursing_home : "요양원",
     silver_town : "실버타운",
  };

  // 통계 데이터
  const [facilityCount, setFacilityCount] = useState(0)
  const [userStats, setUserStats] = useState({ totalUsers: 0, dailyGrowth: [] })
  const [stats, setStats] = useState({
    facilities: { total: 0, approved: 0, pending: 0, rejected: 0 },
    products:   { total: 0, inStock: 0, outOfStock: 0 },
    users:      { total: 0, new: 0 },
    orders:     { total: 0, completed: 0, processing: 0, cancelled: 0 },
    revenue:    { total: 0, thisMonth: 0, lastMonth: 0 },
  })

  // 차트용 데이터
  const [monthlyRevenue, setMonthlyRevenue] = useState([])
  const [userGrowth, setUserGrowth] = useState([])
  const [facilityTypeStats, setFacilityTypeStats] = useState([])
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [popularFacilities, setPopularFacilities] = useState([]);
  const [popularProducts,   setPopularProducts]   = useState([]);
  const [dailyUserGrowth, setDailyUserGrowth] = useState([]);

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem("accessToken") || ""
        const headers = { Authorization: `Bearer ${token}` }

        const [facilityRes, summaryRes, userGrowthRes, saleSummaryRes, popFacRes, popProdRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/admin/dashboard/facility-count`, { headers }),
          axios.get(`${process.env.REACT_APP_API_URL}/admin/dashboard/summary`, { headers }),
          axios.get(`${process.env.REACT_APP_API_URL}/admin/dashboard/user-daily-growth`, { headers }),
          axios.get(`${process.env.REACT_APP_API_URL}/admin/dashboard/sale-summary`, { headers }),
          axios.get(`${process.env.REACT_APP_API_URL}/admin/dashboard/popular-facilities`, { headers }),
          axios.get(`${process.env.REACT_APP_API_URL}/admin/dashboard/popular-products`,   { headers }),
        ])

        axios.get(`${process.env.REACT_APP_API_URL}/admin/dashboard/daily-sales`, { headers })
            .then(res => setDailyRevenue(res.data))
            .catch(err => console.error(err));

        axios.get(`${process.env.REACT_APP_API_URL}/admin/dashboard/user-daily-growth?daysBack=7`, { headers })
            .then(res => setDailyUserGrowth(res.data))
            .catch(console.error);

        axios.get(`${process.env.REACT_APP_API_URL}/admin/dashboard/facility-type-stats`)
            .then(res => setFacilityTypeStats(res.data))
            
        setFacilityCount(facilityRes.data)
        const sum = summaryRes.data
        setStats(prev => ({
          ...prev,
          products: sum.products,
          users: sum.users,
          revenue: {
            total: saleSummaryRes.data.total,
            thisMonth: saleSummaryRes.data.today,
            lastMonth: saleSummaryRes.data.yesterday,
          },
        }))
        setMonthlyRevenue(saleSummaryRes.data.monthly || [])
        setUserStats({ totalUsers: userGrowthRes.data[0]?.total || 0, dailyGrowth: userGrowthRes.data })
        setUserGrowth(userGrowthRes.data.map(({ date, count }) => ({ month: date, users: count })))
        setPopularFacilities(popFacRes.data || []);
        setPopularProducts(  popProdRes.data || []);
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
      "product-list":  "/admin/products",
      "notice-write":  "/admin/notices/new",
      "inquiry-answer":"/admin/questions",
    }
    navigate(routes[action] || "/admin")
  }

  const formatCurrency = (amt) => new Intl.NumberFormat("ko-KR",{style:"currency",currency:"KRW",maximumFractionDigits:0}).format(amt)
  const formatTime = (dt) => {
    const diff = Math.floor((new Date() - new Date(dt)) / 60000)
    return diff < 60 ? `${diff}분 전` : diff < 1440 ? `${Math.floor(diff/60)}시간 전` : new Date(dt).toLocaleDateString("ko-KR")
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="admin-dashboard">
          <h1 className="admin-dashboard-title">관리자 대시보드</h1>
          <div className="admin-dashboard-stats grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_,i) => <Skeleton key={i} className="admin-stat-card-skel" />)}
          </div>
          <div className="admin-dashboard-content">
            <Skeleton className="admin-chart-skel" />
          </div>
        </div>
      </Layout>
    )
  }
  const increaseRate = stats.revenue.lastMonth > 0
  ? Math.round(((stats.revenue.thisMonth - stats.revenue.lastMonth) / stats.revenue.lastMonth) * 100)
  : 0;

const revenueUp = stats.revenue.thisMonth > stats.revenue.lastMonth;
const dayLabels = Array.from({ length: 7 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));              // 6일 전부터 오늘까지
  return `${d.getMonth() + 1}/${d.getDate()}`;   // e.g. "5/14"
});

const revenueChartData = {
  labels: dayLabels,
  datasets: [{
    label: "일별 매출",
    data: dayLabels.map((_, idx) => dailyRevenue[idx]?.amount || 0),
    borderColor: "#9775FA",
    backgroundColor: (context) => {
      const chart = context.chart;
      const {ctx, chartArea} = chart;
      if (!chartArea) return null; // 초기 렌더링 대응

      const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
      gradient.addColorStop(0, "rgba(151, 117, 250, 0.1)");  // 라벤더 투명도 배경
      gradient.addColorStop(1, "rgba(151, 117, 250, 0.35)");

      return gradient;
    },
    tension: 0.4,
    borderWidth: 2,
    pointRadius: 5,
    pointBackgroundColor: "#fff",
    pointBorderColor: "#9775FA",
    pointBorderWidth: 2,
    pointHoverRadius: 7,
    fill: true, // ✅ fill true로 해야 배경 보임
  }],
};


const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "top",
      align: "center",
   labels: {
  boxWidth: 20,
  boxHeight: 12,
  color: "#6B4EFF", // 💜 라벤더 느낌의 보라색 텍스트
  padding: 16,
  animation: {
  duration: 1000,
  easing: 'easeOutQuart'
},

},

    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#6B7280", display: true },
    },
    y: {
      beginAtZero: true,
      suggestedMax: 3000000,
      grid: { color: "#E5E7EB" },
      ticks: {
        stepSize: 500000,
        callback: (val) => val.toLocaleString(),
        color: "#6B7280",
      },
    },
  },
};
const userChartData = {
  labels: dayLabels,
  datasets: [{
    label: "일별 사용자 증가",
    data: dayLabels.map((_, i) => dailyUserGrowth[i]?.count || 0),
    backgroundColor: "#D0BFFF",  // 💜 라벤더 파스텔
    borderColor: "#9775FA",      // 💜 진한 포인트
    borderWidth: 2,
    barPercentage: 0.6,
    categoryPercentage: 0.8,
    borderRadius: 8,
  }],
};


const userChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "top",
      align: "center",
      labels: {
        color: "#6B4EFF",         // 💜 라벤더 포인트 컬러
        boxWidth: 12,
        boxHeight: 12
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#5E5873" }  // 진보라 느낌의 회색
    },
    y: {
      beginAtZero: true,
      grid: { color: "#E6E6F8" },  // 아주 연한 라벤더 배경선
      ticks: {
        stepSize: 1,
        callback: (v) => v.toString(),
        color: "#5E5873"
      }
    }
  }
};





const labels = facilityTypeStats.map(f => facilityTypeMap[f.type] || f.type)

const facilityTypeData = {
  labels,
  datasets: [{
    data: facilityTypeStats.map(f => f.count),
    backgroundColor: [
      '#7FB3D5', // Soft Blue - 요양병원
      '#F5B7B1', // Peach Pink - 요양원
      '#A2D9CE', // Light Mint - 실버타운
    ],
    borderWidth: 0,
    cutout: '60%',
  }]
}


const facilityTypeOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      align: 'center',
      labels: { boxWidth: 12, boxHeight: 12, padding: 16 },
    },
  },
}
  return (
    <Layout>
      <div className="admin-dashboard">
        {/* 통계 카드 */}
        <div className="admin-dashboard-stats grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="admin-stat-card">
  <div className="admin-stat-title">시설</div>
  <div className="admin-stat-value">{facilityCount}</div>
  <div className="admin-stat-subinfo">
    <span>신규(이번 달): {facilityCount}</span>
  </div>

</div>

<div className="admin-stat-card">
  <div className="admin-stat-title">상품</div>
  <div className="admin-stat-value">{stats.products.total}</div>
  <div className="admin-stat-subinfo">
    <span>신규(이번 달): {stats.products.total}</span>
  </div>
  
 
</div>

<div className="admin-stat-card">
  <div className="admin-stat-title">사용자</div>
  <div className="admin-stat-value">{userStats.totalUsers}</div>
  <div className="admin-stat-subinfo">
    <span>신규(이번 달): {userStats.dailyGrowth.reduce((sum, u) => sum + u.count, 0)}</span>
  </div>
</div>


<div className="admin-stat-card">
  <div className="admin-stat-title">매출</div>
  <div className="admin-stat-value">{formatCurrency(stats.revenue.total)}</div>
  <div className="admin-stat-subinfo">
    <span>이번 달: {formatCurrency(stats.revenue.thisMonth)}</span>
    <span>지난 달: {formatCurrency(stats.revenue.lastMonth)}</span>
  </div>
  <div className="admin-stat-subinfo">
    <span style={{ color: revenueUp ? "#10B981" : "#EF4444" }}>
      {increaseRate >= 0 ? `+${increaseRate}%` : `${increaseRate}%`}
    </span>
  </div>
</div>


        </div>

        {/* 메인 콘텐츠 */}
        <div className="admin-dashboard-content">
          {/* 매출 차트 */}
          <div className="admin-chart-card">
            <h3>일별 매출 추이 (최근 7일)</h3>
            <div className="admin-chart-container" style={{ height: "300px" }}>
              <Line data={revenueChartData} options={chartOptions} />
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
                  <tbody>{popularFacilities.map(f => (
                    <tr key={f.id}><td>{f.name}</td><td>{facilityTypeMap[f.type] || f.type}</td><td>{f.viewCount}</td><td>{f.likeCount}</td><td>{f.reviewCount}</td><td><Button size="sm" onClick={() => handleFacilityDetail(f.id)}>상세</Button></td></tr>
                  ))}</tbody>
                </table>
              </TabsContent>
              <TabsContent value="products">
                <table className="admin-table">
                  <thead><tr><th>상품명</th><th>카테고리</th><th>판매량</th><th>매출</th><th>재고</th><th>관리</th></tr></thead>
                  <tbody>{popularProducts.map(p => (
                    <tr key={p.id}><td>{p.name}</td><td>{p.categoryName}</td><td>{p.salesCount}</td><td>{formatCurrency(p.revenue)}</td><td>{p.stockQuantity}</td><td><Button size="sm" onClick={() => handleProductDetail(p.id)}>상세</Button></td></tr>
                  ))}</tbody>
                </table>
              </TabsContent>
            </Tabs>
          </div>

          {/* 사용자 증가 차트 */}
          <div className="admin-chart-card">
            <h3>일별 사용자 증가 추이 (최근 7일)</h3>
            <div className="admin-chart-container" style={{ height: "300px" }}>
              <Bar  data={userChartData} options={userChartOptions} />
            </div>
          </div>
        </div>

        {/* 사이드바 */}
        <div className="admin-dashboard-sidebar">
          <div className="admin-chart-card">
            <h3>시설 유형 분포</h3>
            <div className="admin-chart-container" style={{ height: '250px' }}>
              <Doughnut
                data={facilityTypeData}
                options={facilityTypeOptions}
              />
            </div>
          </div>
          <div className="admin-quick-actions">
            <h3>빠른 작업</h3>
            <div className="grid grid-cols-2 gap-2">
  <Button onClick={() => handleQuickAction("facility-list")}>
    시설 목록
  </Button>
  <Button onClick={() => handleQuickAction("product-list")}>
    상품 목록
  </Button>
  <Button onClick={() => handleQuickAction("notice-write")} >
    공지사항 작성
  </Button>
  <Button onClick={() => handleQuickAction("inquiry-answer")}>
    문의 답변
  </Button>
</div>

          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdminDashboardPage
