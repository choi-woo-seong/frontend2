import { useParams, Link } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { useEffect, useState } from "react"

const mockNotices = [
  {
    id: 1,
    title: "[공지] 직방 동행봉사 정보 및 이벤트 수신 안내",
    date: "2025.04.15",
    views: 245,
    content: "직방 동행봉사 안내 상세내용입니다. 참여 방법 및 일정은 추후 별도 공지 예정입니다."
  },
  {
    id: 2,
    title: "[공지] 개인정보 처리방침 개정 안내",
    date: "2025.04.10",
    views: 187,
    content: "개인정보 처리방침이 2025년 4월 30일부터 개정되어 시행됩니다."
  },
  {
    id: 3,
    title: "[공지] 서비스 점검 안내",
    date: "2025.04.01",
    views: 198,
    content: "서비스 점검이 2025년 4월 5일 오전 2시부터 4시까지 진행됩니다."
  }
]

const NoticeDetailPage = () => {
  const { id } = useParams()
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    const found = mockNotices.find(n => n.id === Number(id))
    setNotice(found)
  }, [id])

  if (!notice) {
    return (
      <div className="max-w-3xl mx-auto mt-10 text-center text-gray-500">
        공지사항을 찾을 수 없습니다.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex items-center">
          <Link to="/notices" className="mr-2">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-lg font-semibold text-gray-800">공지사항</h1>
        </div>
      </div>

      {/* 본문 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <table className="w-full table-fixed border border-gray-300 bg-white rounded-md shadow-sm">
          <tbody>
            <tr className="border-b border-gray-200">
              <th className="w-24 text-left px-4 py-2 bg-gray-50 text-sm text-gray-600">제목</th>
              <td className="px-4 py-2 text-gray-800">{notice.title}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="w-24 text-left px-4 py-2 bg-gray-50 text-sm text-gray-600">등록일</th>
              <td className="px-4 py-2 text-sm text-gray-700">{notice.date}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="w-24 text-left px-4 py-2 bg-gray-50 text-sm text-gray-600">조회수</th>
              <td className="px-4 py-2 text-sm text-gray-700">{notice.views}</td>
            </tr>
            <tr>
              <th className="w-24 text-left px-4 py-2 bg-gray-50 text-sm text-gray-600">내용</th>
              <td className="px-4 py-4 text-gray-700 leading-relaxed whitespace-pre-line">
                {notice.content}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default NoticeDetailPage
