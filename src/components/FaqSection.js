"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ChevronRight, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "./ui/Button"

// FAQ 데이터
// 백엔드 개발자 참고: GET /api/faqs API 필요
const faqs = [
  {
    id: "faq-1",
    question: "요양병원? 요양원? 어디로 모셔야 할지 고민이에요.",
    answer: (
      <>
        <p className="mb-4">
          요양병원은 의료기관으로 치료가 필요하다면 요양병원으로, 요양원은 장기요양기관으로 돌봄케어가 필요하다면
          요양원으로 모시는 것이 좋아요.
        </p>
        <p className="mb-4">
          다만, 어르신의 상태 별로 달라질 수 있기 때문에 또하나의가족 맞춤요양상담팀을 통해 적합한 요양시설을
          추천받아보시는 것은 어떨까요?
        </p>
        <Link to="/consultation" className="text-blue-500 hover:underline">
          &gt; 맞춤요양 상담하기
        </Link>
      </>
    ),
  },
  {
    id: "faq-2",
    question: "요양병원 비용은 얼마인가요?",
    answer: (
      <>
        <p className="mb-4">요양병원 입원환자는 기본적으로 입원 일당 정액 수가를 적용하고 있습니다.</p>
        <p className="mb-4">
          그러나 병원마다 일정하지 않은 이유는 간병비, 재활치료 여부 등의 진료 내용과 환자 상태에 따라 차이가 발생하기
          때문입니다.
        </p>
        <p className="mb-4">
          평균적으로는 월 150만~200만 원 선이지만, 자세한 입원비용이 궁금하시다면 환자분의 상태를 알 수 있는
          의사소견서를 바탕으로 요양병원과 상담을 받아보셔야 합니다.
        </p>
      </>
    ),
  },
  {
    id: "faq-3",
    question: "요양원에 들어가려면 어떻게 하나요?",
    answer: (
      <p>
        국민건강보험공단의 80~100% 지원을 받아 입소가능한 조건은 장기요양1,2등급 또는 장기요양 3~5등급 수급자 중
        '시설급여를 인정받은 자'입니다.
      </p>
    ),
  },
  {
    id: "faq-4",
    question: "어디로 모셔야 할지 모르겠어요.",
    answer: (
      <>
        <p className="mb-4">
          처음 요양에 대한 고민이 생겼을 때, 어르신을 시설보다는 집에서 돌보는 것이 더 나을지, 또는 요양원과 요양병원 중
          어디가 좋을지 고민되실 수 있습니다.
        </p>
        <p className="mb-4">
          이때 어르신 신신 상태와 가정의 상황을 종합적으로 고려하여 요양시설과 서비스를 선택하시는 것이 중요합니다.
        </p>
        <p className="mb-4">
          또하나의가족에서는 맞춤요양상담을 통해 어르신께 가장 적합한 요양시설과 서비스를 안내해드리고 있으니, 어려움이
          있으실 때 꼭 이용해 보시길 추천드립니다!
        </p>
        <Button variant="link" className="text-blue-500 p-0 h-auto flex items-center">
          👍 맞춤요양상담 하러가기
        </Button>
      </>
    ),
  },
  {
    id: "faq-5",
    question: "방문요양보호사에게 어디까지 부탁해도 되나요?",
    answer: (
      <>
        <p className="mb-4">
          방문요양보호사는 장기요양수급자 대상으로 신체활동, 인지활동, 일상생활, 정서지원서비스를 제공해요.
        </p>
        <p className="mb-4">
          대표적으로 개인위생활동, 외출동행, 방안 청소 및 환경관리, 말벗/의사소통 도움 등이 있어요.
        </p>
        <p>
          다만, 수급자의 가족만을 위한 행위, 가족을 위한 관공서 등의 심부름 활동, 그 밖에 수급자의 일상생활에 지장이
          없는 행위는 방문요양보호사에게 요구해서는 안 돼요.
        </p>
      </>
    ),
  },
  {
    id: "faq-6",
    question: "노인유치원에서는 어떤 서비스를 제공하나요?",
    answer: (
      <>
        <p className="mb-4">
          노인유치원의 정식 명칭은 '주야간보호' 서비스로 하루 중 일정 시간 동안 어르신의 신체활동 및 심신기능을
          지원해요.
        </p>
        <p>
          더불어 집으로 모시러 가고 모셔다 드리는 송영서비스와 동년배 어르신들과 함께 다양한 즐거운 프로그램을 체험하실
          수 있어요.
        </p>
      </>
    ),
  },
  {
    id: "faq-7",
    question: "휠체어 신청을 하고 싶어요. 무료로 지원 가능한가요?",
    answer: (
      <>
        <p className="mb-4">장기요양수급자라면 연간 한도액 160만원 내에서 신청 가능해요.</p>
        <p className="mb-4">
          또하나의가족에서 어르신 성향, 장기요양인정번호, 보호자 연락처만 남겨주시면 보행기, 침대 등 사용 가능한
          품목까지 함께 확인 도와드릴게요.
        </p>
        <Link to="/consultation" className="text-blue-500 hover:underline">
          &gt; 복지용구 상담하기
        </Link>
      </>
    ),
  },
  {
    id: "faq-8",
    question: "실버타운과 요양원의 차이점은 무엇인가요?",
    answer: (
      <>
        <p className="mb-4">
          요양원은 노인의료복지시설로 돌봄이 필요한 장기요양등급 수급자가 입소하여 신체활동 및 심신기능의 유지 향상을
          위한 돌봄 서비스를 제공합니다.
        </p>
        <p className="mb-4">
          실버타운은 노인주거복지시설로 일상생활이 가능한 어르신에게 일상생활에 필요한 다양한 편의서비스를 제공합니다.
        </p>
        <p>비용·서비스·주거형태 등에 차이가 있으나, 가장 큰 차이점은 어르신의 일상생활가능 여부입니다.</p>
      </>
    ),
  },
  {
    id: "faq-9",
    question: "양로원은 누가 들어갈 수 있나요?",
    answer: (
      <>
        <p className="mb-4">양로원은 아래 내용에 해당하는 어르신이 이용가능합니다.</p>
        <ul className="list-disc pl-5 mb-4">
          <li>일상생활이 가능한 65세 이상의 어르신</li>
          <li>국민기초생활보장 수급대상자</li>
          <li>국민기초생활보장 수급대상자는 아니지만, 부양 의무자로부터 부양을 받지 못하는 어르신</li>
        </ul>
      </>
    ),
  },
  {
    id: "faq-10",
    question: "요양원 입소 시 준비물이 있나요?",
    answer: (
      <>
        <p className="mb-4">요양원 입소 준비에 필요한 사항을 안내드립니다.</p>
        <ol className="list-decimal pl-5 mb-4">
          <li>어르신의 성향과 요구 사항에 적합한 곳으로 선택하세요.</li>
          <li>입소 비용과 계약 사항을 꼼꼼히 확인하세요.</li>
          <li>시설의 위생, 프로그램, 식단, CCTV설치 여부 등 전반을 확인해보세요.</li>
          <li>응급 상황 발생 시 관대 대처 방안이 있는지 확인해보세요.</li>
          <li>전문인력 현황 및 가족 면회 여부도 확인해보세요.</li>
        </ol>
        <p className="font-semibold mb-2">[준비물]</p>
        <ol className="list-decimal pl-5 mb-4">
          <li>개인 서류 지참(장기요양인정서, 의사소견서, 신분증, 기초관계증명서)</li>
          <li>의류 및 일상용품(계절에 맞는 속옷 및 여벌), 실내화, 개인 위생용품(양치도구, 수건 등)</li>
          <li>약품 및 의료기기, 개인물품(약품 및 복약지도서, 휠체어 및 보행기, 틀니, 개인소품 등)</li>
        </ol>
      </>
    ),
  },
]

// 커스텀 아코디언 아이템 컴포넌트
function FaqItem({ question, answer, isOpen, onClick }) {
  return (
    <div className="border rounded-lg overflow-hidden mb-2">
      <button className="flex items-center justify-between w-full p-3 text-left" onClick={onClick}>
        <div className="flex items-center">
          <span className="text-blue-500 mr-2">Q</span>
          <span className="text-sm">{question}</span>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
      </button>
      {isOpen && <div className="bg-gray-50 p-4 text-sm">{answer}</div>}
    </div>
  )
}

function FaqSection() {
  const [visibleFaqs, setVisibleFaqs] = useState(3)
  const [openFaqId, setOpenFaqId] = useState(null)

  // FAQ 더 보기 기능
  const showMoreFaqs = () => {
    setVisibleFaqs(faqs.length)
  }

  // FAQ 토글 기능
  const toggleFaq = (id) => {
    setOpenFaqId(openFaqId === id ? null : id)
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium">자주 궁금해하는 질문</h2>
        </div>

        <div className="space-y-2">
          {faqs.slice(0, visibleFaqs).map((faq) => (
            <FaqItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
              isOpen={openFaqId === faq.id}
              onClick={() => toggleFaq(faq.id)}
            />
          ))}

          {visibleFaqs < faqs.length && (
            <div className="flex justify-center mt-4">
              <Button variant="outline" onClick={showMoreFaqs} className="text-sm">
                더 많은 질문 보기
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FaqSection
