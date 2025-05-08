"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import "../styles/VideosPage.css"

const VideosPage = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  // ✅ 유튜브 썸네일 자동 추출 함수
  const getYoutubeThumbnail = (url) => {
    const match = url.match(/(?:youtube\.com.*v=|youtu\.be\/)([^&]+)/)
    const videoId = match?.[1]
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : "/placeholder.svg"
  }

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        setTimeout(() => {
          const mockVideos = [
            {
              id: 1,
              title: "노인 복지 시설 종류와 특징",
              category: "교육",
              duration: "12:34",
              views: 1245,
              uploadDate: "2023-04-15",
              videoUrl: "https://www.youtube.com/watch?v=_QUQK4zs8dM",
            },
            {
              id: 2,
              title: "노인 복지 시설 이용 방법",
              category: "정책",
              duration: "08:21",
              views: 987,
              uploadDate: "2023-04-10",
              videoUrl: "https://www.youtube.com/watch?v=YXkftby8yE8",
            },
            {
              id: 3,
              title: "실버타운과 요양원의 차이점",
              category: "정보",
              duration: "15:47",
              views: 2345,
              uploadDate: "2023-04-05",
              videoUrl: "https://www.youtube.com/watch?v=bl42kcYfdrg",
            },
            {
              id: 4,
              title: "노인 복지 정책 발표",
              category: "가이드",
              duration: "32:18",
              views: 876,
              uploadDate: "2023-03-28",
              videoUrl: "https://www.youtube.com/watch?v=RERvwQvRvGU",
            },
            {
              id: 5,
              title: "치매 예방을 위한 손운동",
              category: "건강",
              duration: "10:05",
              views: 3456,
              uploadDate: "2023-03-20",
              videoUrl: "https://www.youtube.com/watch?v=JAp3Lgu98S4&t=14s",
            },
            {
              id: 6,
              title: "노인 맞춤형 건강 체조",
              category: "건강",
              duration: "18:32",
              views: 2134,
              uploadDate: "2023-03-15",
              videoUrl: "https://www.youtube.com/watch?v=AJrCXjPT1Pg",
            },
          ]

          setVideos(mockVideos)
          setLoading(false)
        }, 500)
      } catch (error) {
        console.error("비디오를 불러오는 중 오류가 발생했습니다:", error)
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  return (
    <div className="videos-page">
      <div className="page-header">
        <div className="container flex items-center gap-2">
          <Link to="/" className="flex items-center text-gray-600">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-semibold">영상으로 만나는 요양정보</h1>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="videos-grid">
              {videos.length > 0 ? (
                videos.map((video) => (
                  <div key={video.id} className="video-card">
                    <a
                      href={video.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="video-thumbnail">
                        {/* ✅ 유튜브 썸네일 자동 적용 */}
                        <img
                          src={getYoutubeThumbnail(video.videoUrl)}
                          alt={video.title}
                        />
                        <div className="video-duration">{video.duration}</div>
                        <div className="play-button">
                          <i className="fas fa-play"></i>
                        </div>
                      </div>
                    </a>
                    <div className="video-info">
                      <h3 className="video-title">{video.title}</h3>
                      <div className="video-meta">
                        <span className="video-category">{video.category}</span>
                        <span className="video-views">조회수 {video.views}회</span>
                        <span className="video-date">{video.uploadDate}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <i className="fas fa-video"></i>
                  </div>
                  <h2>영상이 없습니다</h2>
                  <p>현재 등록된 영상이 없습니다.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VideosPage
