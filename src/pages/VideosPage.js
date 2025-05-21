"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import "../styles/VideosPage.css"

const API_BASE_URL = process.env.REACT_APP_API_URL

const VideosPage = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE_URL}/videos`)
        if (!res.ok) throw new Error("영상 정보를 불러오지 못했습니다.")
        const data = await res.json()
        setVideos(data)
      } catch (err) {
        console.error("영상 불러오기 오류:", err)
      } finally {
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
          ) : videos.length > 0 ? (
            <div className="videos-grid">
              {videos.map((video) => (
                <div key={video.videoId} className="video-card">
                  <a
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="video-thumbnail">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                      />
                      <div className="play-button">
                        <i className="fas fa-play"></i>
                      </div>
                    </div>
                  </a>
                  <div className="video-info">
                    <h3 className="video-title">{video.title}</h3>
                    <div className="video-meta">
                      <span className="video-date">
                        {new Date(video.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
      </div>
    </div>
  )
}

export default VideosPage
