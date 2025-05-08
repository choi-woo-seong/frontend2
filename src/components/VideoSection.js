import { ChevronRight, Play } from "lucide-react"

// ✅ 유튜브 썸네일 자동 추출 함수
const getYoutubeThumbnail = (url) => {
  const match = url.match(/(?:youtube\.com.*v=|youtu\.be\/)([^&]+)/)
  const videoId = match?.[1]
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : "/placeholder.svg"
}

// 비디오 데이터
const videos = [
  {
    id: 1,
    title: "노인 복지 시설 종류와 특징",
    duration: "5:30",
    videoUrl: "https://www.youtube.com/watch?v=_QUQK4zs8dM",
  },
  {
    id: 2,
    title: "노인 복지 시설 이용 방법",
    duration: "7:15",
    videoUrl: "https://www.youtube.com/watch?v=YXkftby8yE8",
  },
  {
    id: 3,
    title: "실버타운과 요양원의 차이점",
    duration: "6:45",
    videoUrl: "https://www.youtube.com/watch?v=bl42kcYfdrg",
  },
  {
    id: 4,
    title: "노인 복지 정책 발표",
    duration: "8:20",
    videoUrl: "https://www.youtube.com/watch?v=RERvwQvRvGU",
  },
]

function VideoSection() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium">영상으로 만나는 요양정보</h2>
          <a href="/videos" className="text-xs text-gray-500 flex items-center">
            더보기 <ChevronRight className="h-3 w-3" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {videos.map((video) => (
            <a
              key={video.id}
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="relative rounded-lg overflow-hidden">
                {/* ✅ 유튜브 썸네일 자동 연동 */}
                <img
                  src={getYoutubeThumbnail(video.videoUrl)}
                  alt={video.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <div className="bg-white bg-opacity-80 rounded-full p-2">
                    <Play className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
                <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                  {video.duration}
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs font-medium line-clamp-2">{video.title}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VideoSection
