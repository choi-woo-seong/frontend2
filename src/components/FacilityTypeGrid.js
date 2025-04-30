import { Link } from "react-router-dom"
import { Search } from "lucide-react"

// 시설 유형 데이터
const facilityTypes = [
  { id: 0, name: "시설찾기", path: "/search" },
  { id: 1, name: "요양병원", icon: "/images/요양병원.svg", path: "/search?type=요양병원" },
  { id: 2, name: "요양원",   icon: "/images/요양원.svg",   path: "/search?type=요양원"   },
  { id: 3, name: "실버타운", icon: "/images/실버타운.svg", path: "/search?type=실버타운" },
  { id: 4, name: "양로원",   icon: "/images/양로원.svg",   path: "/search?type=양로원"   },
  { id: 5, name: "주야간보호", icon: "/images/주야간보호.svg", path: "/search?type=주야간보호" },
  { id: 6, name: "단기보호", icon: "/images/단기보호.svg", path: "/search?type=단기보호" },
  { id: 7, name: "방문요양", icon: "/images/방문요양.svg", path: "/search?type=방문요양" },
  { id: 8, name: "방문간호", icon: "/images/방문간호.svg", path: "/search?type=방문간호" },
  { id: 9, name: "방문목욕", icon: "/images/방문목욕.svg", path: "/search?type=방문목욕" },
]

function FacilityTypeGrid() {
  return (
    <div className="grid grid-cols-5 gap-6">
      {facilityTypes.map((type) => (
        <Link
          key={type.id}
          to={type.path}
          className="
            group flex flex-col items-center text-center
            bg-white rounded-xl p-4
            transition hover:shadow-lg
          "
        >
          {type.id === 0 ? (
            <div className="w-16 h-16 mb-2 flex items-center justify-center
                            transform transition group-hover:scale-110">
              <Search className="w-8 h-8 text-gray-400 group-hover:text-blue-500" />
            </div>
          ) : (
            <div className="w-16 h-16 mb-2
                            transform transition group-hover:scale-110">
              <img
                src={type.icon}
                alt={type.name}
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <span className="text-gray-700 text-sm font-medium group-hover:text-blue-500">
            {type.name}
          </span>
        </Link>
      ))}
    </div>
  )
}

export default FacilityTypeGrid
