import { Link } from "react-router-dom"
import { ChevronRight, Play } from "lucide-react"

// 비디오 데이터
// 백엔드 개발자 참고: GET /api/videos/featured API 필요
const videos = [
  {
    id: 1,
    title: "요양시설 종류별 특징 알아보기",
    duration: "5:30",
    thumbnail: "/images/welfare-facilities-types-thumbnail.png",
    url: "/videos/1",
  },
  {
    id: 2,
    title: "요양시설 이용 방법 및 절차",
    duration: "7:15",
    thumbnail: "/images/senior-facility-usage-thumbnail.png",
    url: "/videos/2",
  },
  {
    id: 3,
    title: "실버타운 vs 요양원 vs 양로원 차이점",
    duration: "6:45",
    thumbnail: "/images/senior-housing-differences-thumbnail.png",
    url: "/videos/3",
  },
  {
    id: 4,
    title: "노인복지 정책 및 지원금 안내",
    duration: "8:20",
    thumbnail: "/images/senior-welfare-presentation-thumbnail.png",
    url: "/videos/4",
  },
]

function VideoSection() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium">영상으로 만나는 요양정보</h2>
          <Link to="/videos" className="text-xs text-gray-500 flex items-center">
            더보기 <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {videos.map((video) => (
            <Link key={video.id} to={video.url} className="block">
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
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
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VideoSection
