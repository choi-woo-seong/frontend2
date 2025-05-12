import { useParams, Link } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { useEffect, useState } from "react"

const NoticeDetailPage = () => {
  const { id } = useParams()
  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    const increaseViewAndFetch = async () => {
      try {
        // ✅ 조회수 증가 요청
        await fetch(`${process.env.REACT_APP_API_URL}/notices/${id}/view`, {
          method: "PATCH"
        })

        // ✅ 공지사항 상세 정보 가져오기
        const response = await fetch(`${process.env.REACT_APP_API_URL}/notices/${id}`)
        if (!response.ok) throw new Error("공지사항 조회 실패")
        const data = await response.json()

        if (!ignore) {
          setNotice(data)
        }
      } catch (error) {
        console.error("공지사항 불러오기 오류:", error)
        if (!ignore) setNotice(null)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    increaseViewAndFetch()

    return () => {
      ignore = true
    }
  }, [id])

  if (loading) {
    return <div className="text-center py-12 text-gray-500">불러오는 중...</div>
  }

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
            <tr>
              <th className="w-24 text-left px-4 py-2 bg-gray-50 text-sm text-gray-600">제목</th>
              <td className="px-4 py-2 text-gray-800">{notice.title}</td>
            </tr>
            <tr>
              <th className="w-24 text-left px-4 py-2 bg-gray-50 text-sm text-gray-600">등록일</th>
              <td className="px-4 py-2 text-sm text-gray-700">
                {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
              </td>
            </tr>
            <tr>
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
