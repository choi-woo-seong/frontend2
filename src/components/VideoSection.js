import { useState, useEffect } from 'react'
import { ChevronRight, Play } from 'lucide-react'

// 환경변수로 API 베이스 URL 설정
const API_BASE_URL = process.env.REACT_APP_API_URL

function VideoSection() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE_URL}/videos`)
        if (!res.ok) throw new Error('영상 정보를 불러오지 못했습니다.')
        const data = await res.json()
        // 최신 순으로 정렬 후 최대 4개만 저장
        const latestFour = data
          .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
          .slice(0, 4)
        setVideos(latestFour)
      } catch (error) {
        console.error('영상 불러오기 오류:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [])

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium">영상으로 만나는 요양정보</h2>
          <a href="/videos" className="text-xs text-gray-500 flex items-center">
            더보기 <ChevronRight className="h-3 w-3" />
          </a>
        </div>

        {loading ? (
          <div className="loading-spinner text-center py-8">로딩 중…</div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {videos.map((video) => (
              <a
                key={video.videoId}
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <div className="bg-white bg-opacity-80 rounded-full p-2">
                      <Play className="h-4 w-4 text-blue-500" />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs font-medium line-clamp-2">{video.title}</p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="empty-state text-center py-8 text-gray-500">
            <div className="empty-icon">
              <Play className="h-6 w-6" />
            </div>
            <h2 className="text-sm font-medium mt-2">영상이 없습니다</h2>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoSection;
