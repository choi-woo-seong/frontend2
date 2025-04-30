"use client"

import {useState, useEffect} from "react"
import {useParams, Link} from "react-router-dom"
import {
    ChevronLeft,
    Heart,
    ShoppingCart,
    Share2,
    MessageCircle,
    Star
} from "lucide-react"
import {Button} from "../components/ui/Button"
import Layout from "../components/Layout"
import RecommendedSection from "../components/RecommendedSection"

// 백엔드 개발자 참고: GET /api/products/:id API 필요 응답 형식: { product: { id, name, price,
// originalPrice, discount, description, images, specifications, reviews, rating
// } }
function ProductDetailPage() {
    const {id} = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [activeTab, setActiveTab] = useState("description")
    const [isFavorite, setIsFavorite] = useState(false)

    // 제품 데이터 가져오기
    useEffect(() => {
        // 실제 구현에서는 Axios를 사용하여 API 호출 const fetchProduct = async () => {   try {
        // setLoading(true);     const response = await
        // axios.get(`/api/products/${id}`);     setProduct(response.data.product);   }
        // catch (error) {     console.error('제품을 불러오는 중 오류가 발생했습니다:', error);   }
        // finally {     setLoading(false);   } }; fetchProduct(); 임시 데이터
        setTimeout(() => {
            setProduct({
                id: Number.parseInt(id),
                name: "실버워커 (바퀴X) 노인용 보행기 경량 접이식 보행보조기",
                price: "220,000원",
                originalPrice: "1,100,000원",
                discount: "80%",
                description: "가볍고 튼튼한 알루미늄 소재로 제작된 노인용 보행기입니다. 접이식 디자인으로 보관과 이동이 편리하며, 미끄럼 방지 고무 팁이 안전한 보행을 " +
                        "도와줍니다.",
                images: [
                    "/images/supportive-stroll.png", "/images/elderly-woman-using-walker.png", "/images/elderly-woman-using-rollator.png"
                ],
                specifications: [
                    {
                        name: "재질",
                        value: "알루미늄"
                    }, {
                        name: "무게",
                        value: "2.5kg"
                    }, {
                        name: "최대 하중",
                        value: "100kg"
                    }, {
                        name: "높이 조절",
                        value: "78-90cm"
                    }, {
                        name: "접이식",
                        value: "가능"
                    }, {
                        name: "색상",
                        value: "실버"
                    }
                ],
                reviews: [
                    {
                        id: 1,
                        user: "김**",
                        rating: 5,
                        content: "가볍고 튼튼해서 좋아요. 어머니가 사용하시기에 편리합니다.",
                        date: "2023-05-15"
                    }, {
                        id: 2,
                        user: "이**",
                        rating: 4,
                        content: "배송이 빨라서 좋았습니다. 제품도 만족스러워요.",
                        date: "2023-04-22"
                    }, {
                        id: 3,
                        user: "박**",
                        rating: 5,
                        content: "접이식이라 보관하기 좋고, 어르신이 사용하기에 안정적입니다.",
                        date: "2023-03-10"
                    }
                ],
                rating: 4.7,
                reviewCount: 42
            })
            setLoading(false)
        }, 500)
    }, [id])

    // 수량 변경 핸들러
    const handleQuantityChange = (amount) => {
        const newQuantity = quantity + amount
        if (newQuantity >= 1) {
            setQuantity(newQuantity)
        }
    }

    // 장바구니에 추가하는 함수 백엔드 개발자 참고: POST /api/cart/add API 필요 요청 형식: { productId:
    // number, quantity: number } 응답 형식: { success: boolean, message: string }
    const addToCart = () => {
        // 실제 구현에서는 Axios를 사용하여 API 호출 axios.post('/api/cart/add', { productId:
        // parseInt(id), quantity })   .then(response => {      성공 처리   })
        // .catch(error => {      오류 처리   }); 임시 알림
        alert(`${product.name} ${quantity}개가 장바구니에 추가되었습니다.`)
    }

    // 즐겨찾기 토글 함수 백엔드 개발자 참고: POST /api/favorites/toggle API 필요 요청 형식: { productId:
    // number } 응답 형식: { success: boolean, isFavorite: boolean }
    const toggleFavorite = () => {
        // 실제 구현에서는 Axios를 사용하여 API 호출 axios.post('/api/favorites/toggle', { productId:
        // parseInt(id) })   .then(response => {
        // setIsFavorite(response.data.isFavorite);   })   .catch(error => {      오류 처리
        // }); 임시 구현
        setIsFavorite(!isFavorite)
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-4">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-32 bg-gray-200 rounded mb-4"></div>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-4">
                <p>제품을 찾을 수 없습니다.</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-4">
            {/* 상단 네비게이션 */}
            <div className="flex items-center mb-4">
                <Link to="/products" className="flex items-center text-gray-500">
                    <ChevronLeft className="h-5 w-5"/>
                    <span>제품 목록</span>
                </Link>
            </div>

            {/* 제품 이미지 슬라이더 */}
            <div className="mb-4">
                <img
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-64 object-contain bg-white rounded-lg"/>
            </div>

            {/* 제품 정보 */}
            <div className="bg-white rounded-lg p-4 mb-4">
                <h1 className="text-xl font-bold mb-2">{product.name}</h1>

                <div className="flex items-center mb-2">
                    <div className="flex items-center">
                        {
                            [...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                    i < Math.floor(product.rating)
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300"}`}/>
                            ))
                        }
                    </div>
                    <span className="text-sm ml-1">{product.rating}</span>
                    <span className="text-sm text-gray-500 ml-2">({product.reviewCount}개 리뷰)</span>
                </div>

                <div className="mb-4">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold">{product.price}</span>
                        <span className="text-red-500 ml-2">{product.discount}</span>
                    </div>
                    <div className="text-sm text-gray-500 line-through">{product.originalPrice}</div>
                </div>

                {/* 수량 선택 */}
                <div className="flex items-center mb-4">
                    <span className="mr-2">수량:</span>
                    <div className="flex items-center border rounded">
                        <button
                            className="px-3 py-1"
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}>
                            -
                        </button>
                        <span className="px-3 py-1 border-x">{quantity}</span>
                        <button className="px-3 py-1" onClick={() => handleQuantityChange(1)}>
                            +
                        </button>
                    </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex gap-2 mb-4">
                    <Button
                        className="flex flex-1 items-center justify-center bg-blue-500 hover:bg-blue-600 text-white gap-2 py-3"
                        onClick={addToCart}>
                        <ShoppingCart className="h-5 w-5"/> {/* 아이콘 키움 */}
                        <span className="text-base font-medium">장바구니</span>
                        {/* 텍스트 중앙정렬 */}
                    </Button>
                    <Button variant="outline" className="p-3">
                        <Share2 className="h-5 w-5"/>
                    </Button>
                </div>

                {/* 배송 정보 */}
                <div className="bg-gray-50 p-3 rounded text-sm">
                    <p className="mb-1">· 무료배송</p>
                    <p>· 3일 이내 출고</p>
                </div>
            </div>

            {/* 탭 메뉴 */}
            <div className="bg-white rounded-lg mb-4 overflow-hidden">
                <div className="flex border-b">
                    <button
                        className={`flex-1 py-3 text-center ${
                        activeTab === "description"
                            ? "border-b-2 border-blue-500 font-medium"
                            : ""}`}
                        onClick={() => setActiveTab("description")}>
                        상세정보
                    </button>
                    <button
                        className={`flex-1 py-3 text-center ${
                        activeTab === "reviews"
                            ? "border-b-2 border-blue-500 font-medium"
                            : ""}`}
                        onClick={() => setActiveTab("reviews")}>
                        리뷰
                    </button>
                    <button
                        className={`flex-1 py-3 text-center ${
                        activeTab === "qna"
                            ? "border-b-2 border-blue-500 font-medium"
                            : ""}`}
                        onClick={() => setActiveTab("qna")}>
                        문의
                    </button>
                </div>

                <div className="p-4">
                    {
                        activeTab === "description" && (
                            <div>
                                <p className="mb-4">{product.description}</p>

                                <h3 className="font-medium mb-2">제품 사양</h3>
                                <table className="w-full text-sm">
                                    <tbody>
                                        {
                                            product
                                                .specifications
                                                .map((spec, index) => (
                                                    <tr key={index} className="border-b">
                                                        <td className="py-2 font-medium w-1/3">{spec.name}</td>
                                                        <td className="py-2">{spec.value}</td>
                                                    </tr>
                                                ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        )
                    }

                    {
                        activeTab === "reviews" && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="text-2xl font-bold mr-2">{product.rating}</div>
                                        <div className="flex">
                                            {
                                                [...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${
                                                        i < Math.floor(product.rating)
                                                            ? "text-yellow-400 fill-yellow-400"
                                                            : "text-gray-300"}`}/>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        리뷰 작성
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {
                                        product
                                            .reviews
                                            .map((review) => (
                                                <div key={review.id} className="border-b pb-4">
                                                    <div className="flex items-center mb-1">
                                                        <div className="flex">
                                                            {
                                                                [...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`h-3 w-3 ${
                                                                        i < review.rating
                                                                            ? "text-yellow-400 fill-yellow-400"
                                                                            : "text-gray-300"}`}/>
                                                                ))
                                                            }
                                                        </div>
                                                        <span className="text-sm ml-2">{review.user}</span>
                                                        <span className="text-xs text-gray-500 ml-auto">{review.date}</span>
                                                    </div>
                                                    <p className="text-sm">{review.content}</p>
                                                </div>
                                            ))
                                    }
                                </div>
                            </div>
                        )
                    }

                    {
                        activeTab === "qna" && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-medium">상품 문의</h3>
                                    <Link to={`/products/${id}/question`}>
                                        <Button size="sm" className="flex items-center">
                                            <MessageCircle className="h-4 w-4 mr-1"/>
                                            문의하기
                                        </Button>
                                    </Link>
                                </div>

                                <div className="text-center py-8 text-gray-500">
                                    <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-20"/>
                                    <p>등록된 문의가 없습니다.</p>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>

            {/* 추천 제품 */}
            <RecommendedSection/>
        </div>
    )
}

export default ProductDetailPage
