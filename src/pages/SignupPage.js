import {Link} from "react-router-dom"
import {ChevronLeft} from "lucide-react"
import SignupForm from "../components/auth/SignupForm"

function SignupPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* 헤더 */}
            <header className="bg-white border-b h-16">
                {/* ✅ 높이 96px로 강제 지정 */}
                <div className="container mx-auto px-4 h-full flex items-center">
                    <Link to="/" className="mr-4">
                        <ChevronLeft className="h-5 w-5"/>
                    </Link>
                    <h1 className="text-lg font-medium">회원가입</h1>
                </div>
            </header>

            {/* 메인 콘텐츠 */}
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <SignupForm/>
                </div>
            </main>
        </div>
    )
}

export default SignupPage
