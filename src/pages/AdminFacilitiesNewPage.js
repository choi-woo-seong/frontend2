"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ChevronLeft, X } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Textarea } from "../components/ui/Textarea"
import { Select } from "../components/ui/Select"
import "../styles/AdminFacilitiesNewPage.css"

const AdminFacilitiesNewPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("basic")
  const [facilityType, setFacilityType] = useState("요양병원")
  const [formData, setFormData] = useState({
    name: "",
    establishedYear: "",
    address: "",
    phone: "",
    homepage: "",
    description: "",
    weekdayHours: "",
    weekendHours: "",
    holidayHours: "",
    visitingHours: "",
    images: [],
    basicFee: "",
    nursingFee: "",
    mealFee: "",
    programFee: "",
    extraItems: [{ name: "", amount: "" }], // ✅ 이렇게!
    medicalStaff: [{ position: "", name: "", specialty: "" }], 
    medicalEquipments: [{ name: "" }], // ✅ 의료 장비 기본 1개 추가
    insuranceRate: "50%",
    finalEstimate: "",
    rating: "",
    totalBeds: "",
    generalBeds: "",
    vipBeds: "",
    isolationBeds: "",
    medicalEquipment: "",
    specialty: []
  })
  // --- 추가: 의료 장비 핸들링 함수들 만들기
const handleAddMedicalEquipment = () => {
  setFormData(prev => ({
    ...prev,
    medicalEquipments: [...(prev.medicalEquipments || []), { name: "" }]
  }))
}

const handleMedicalEquipmentChange = (index, value) => {
  const updatedEquipments = formData.medicalEquipments.map((equipment, i) =>
    i === index ? { ...equipment, name: value } : equipment
  )
  setFormData(prev => ({ ...prev, medicalEquipments: updatedEquipments }))
}

const handleRemoveMedicalEquipment = (index) => {
  const updatedEquipments = formData.medicalEquipments.filter((_, i) => i !== index)
  setFormData(prev => ({ ...prev, medicalEquipments: updatedEquipments }))
}
  

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const handleRemoveImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, images: updatedImages }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
    alert("시설 등록 완료")
    navigate("/admin/facilities")
  }
  

  const handleSpecialtyChange = (e) => {
    const { value, checked } = e.target
    if (checked) {
      setFormData({ ...formData, specialty: [...formData.specialty, value] })
    } else {
      setFormData({ ...formData, specialty: formData.specialty.filter(item => item !== value) })
    }
  }

  const handleAddExtraItem = () => {
    setFormData({
      ...formData,
      extraItems: [...formData.extraItems, { name: "", amount: "" }]
    })
  }

  const handleExtraItemChange = (index, field, value) => {
    const updatedItems = formData.extraItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    )
    setFormData({ ...formData, extraItems: updatedItems })
  }

  const handleRemoveExtraItem = (index) => {
    const updatedItems = formData.extraItems.filter((_, i) => i !== index)
    setFormData({ ...formData, extraItems: updatedItems })
  }

  // ✅ 이거 AdminFacilitiesNewPage 컴포넌트 안에 handleSubmit 위쪽에 넣어
  const handleAddMedicalStaff = () => {
    setFormData((prev) => ({
      ...prev,
      medicalStaff: [...prev.medicalStaff, { position: "", name: "", specialty: "" }],
    }))
  }
  
  const handleMedicalStaffChange = (index, field, value) => {
    const updatedStaff = formData.medicalStaff.map((staff, i) =>
      i === index ? { ...staff, [field]: value } : staff
    )
    setFormData((prev) => ({ ...prev, medicalStaff: updatedStaff }))
  }
  
  const handleRemoveMedicalStaff = (index) => {
    const updatedStaff = formData.medicalStaff.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, medicalStaff: updatedStaff }))
  }
    // — 요양원용 비용 계산 state & 유틸 함수 추가 —
  const roomOptions = [
    { value: "general", label: "일반실 (4인실)", sub: "급여(31일 기준)", price: 0 },
    { value: "semi",    label: "상급병실/2인실", sub: "급여(2인실비)",    price: 1240000 },
    { value: "premium", label: "상급병실/3인실", sub: "급여(3인실비)",    price: 620000 },
  ]
  const [selectedRoom, setSelectedRoom] = useState(roomOptions[0].value)
  const salaryCost = 598393
  const formatWon = n =>
    n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  const ownBurden = roomOptions.find(r => r.value === selectedRoom).price
  const totalCost = salaryCost + ownBurden

  


  return (
    <div className="admin-facilities-new-page">
      <div className="page-header-full">
        <div className="header-inner">
          <Link to="/admin/facilities" className="flex items-center gap-1">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
            <span className="page-title">새 시설 등록</span>
          </Link>
        </div>
      </div>

      <div className="facility-type-wrapper">
        <label className="facility-type-label">시설 유형 *</label>
        <div className="facility-type-select">
          <Select value={facilityType} onChange={(e) => setFacilityType(e.target.value)}>
            <option value="요양병원">요양병원</option>
            <option value="요양원">요양원</option>
            <option value="실버타운">실버타운</option>
          </Select>
        </div>
      </div>

      <div className="tab-menu">
        <button className={activeTab === "basic" ? "tab active" : "tab"} onClick={() => handleTabChange("basic")}>기본 정보</button>
        <button className={activeTab === "cost" ? "tab active" : "tab"} onClick={() => handleTabChange("cost")}>요금 정보</button>
        <button className={activeTab === "type" ? "tab active" : "tab"} onClick={() => handleTabChange("type")}>시설 유형별 정보</button>
      </div>

      <form onSubmit={handleSubmit} className="facility-form">
        {activeTab === "basic" && (
          <>
            <div className="form-section">
            <div className="form-group">
                <label>시설명 *</label>
                <Input name="name" placeholder="시설 이름을 입력하세요" value={formData.name} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>설립년도</label>
                <Input name="establishedYear" placeholder="설립년도로 입력하세요 (예: 2020)" value={formData.establishedYear} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>주소 *</label>
                <Input name="address" placeholder="시설 주소를 입력하세요" value={formData.address} onChange={handleChange} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>연락처</label>
                  <Input name="phone" placeholder="연락처를 입력하세요" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>홈페이지</label>
                  <Input name="homepage" placeholder="홈페이지 URL을 입력하세요" value={formData.homepage} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label>시설 설명</label>
                <Textarea name="description" placeholder="시설에 대한 설명을 입력하세요" value={formData.description} onChange={handleChange} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>평일 운영시간</label>
                  <Input name="weekdayHours" placeholder="예: 09:00 - 18:00" value={formData.weekdayHours} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>주말 운영시간</label>
                  <Input name="weekendHours" placeholder="예: 10:00 - 15:00" value={formData.weekendHours} onChange={handleChange} />
                </div>
                
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>공휴일 운영시간</label>
                  <Input name="holidayHours" placeholder="예: 10:00 - 15:00" value={formData.holidayHours} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>면회시간</label>
                  <Input name="visitingHours" placeholder="예: 13:30 - 17:00" value={formData.visitingHours} onChange={handleChange} />
                </div>
                
              </div>

            </div>
            <div className="form-section1">
              <h2>시설 이미지</h2>
              <div className="image-upload-area" onClick={() => document.getElementById("image-upload-input").click()}>
                <img src="/icons/upload-photo.png" alt="사진 업로드" className="image-upload-icon-img" />
                <div className="image-upload-text">이미지를 업로드하세요 (최대 5MB)</div>
                <input id="image-upload-input" type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => {
                  const files = Array.from(e.target.files)
                  const newImages = files.map((file) => ({ file, preview: URL.createObjectURL(file) }))
                  setFormData({ ...formData, images: [...formData.images, ...newImages] })
                }} />
              </div>
              {formData.images.length > 0 && (
                 <div
                 className="image-preview-list"
                 style={{
                   display: "flex",
                   gap: "0.5rem",
                   flexWrap: "wrap",
                   marginTop: "1rem"    // 🔥 여기 추가!!
                 }}
               >
               
                 {formData.images.map((image, index) => (
                   <div key={index} style={{ position: "relative" }}>
                     <img src={image.preview} alt="업로드 이미지" className="uploaded-image" style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px" }} />
                     
                     <button
                       type="button"
                       onClick={() => handleRemoveImage(index)}
                       style={{
                         position: "absolute",
                         top: "4px",
                         right: "4px",
                         background: "transparent",
                         border: "none",
                         padding: 0,
                         margin: 0,
                         cursor: "pointer"
                       }}
                     >
                       <X className="w-5 h-5 text-red-500" />
                     </button>
                   </div>
                 ))}
               </div>
               
                )}


            </div>
          </>
        )}

{activeTab === "cost" && (
          <div className="form-section">
            {facilityType === "요양원" ? (
              <>
                <div className="form-group">
                  <label>식재료비</label>
                  <Input
                    name="mealFee_ri"
                    placeholder="예: 3,700원 * 3식 (월 31일 기준)"
                    value={formData.mealFee_ri}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>간식비</label>
                  <Input
                    name="treatFee"
                    placeholder="예: 1,000원 * 1회 (월 31일 기준)"
                    value={formData.treatFee}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>상급침실 사용료</label>
                  <Input
                    name="bedFee"
                    placeholder="예: 2인실 5,000원 / 1인실 8,000원 (월 31일 기준)"
                    value={formData.bedFee}
                    onChange={handleChange}
                  />
                </div>
              </>
            ) : facilityType === "실버타운" ? (
              <>
                <div className="form-group">
                  <label>보증금</label>
                  <Input
                    name="deposit"
                    placeholder="예: 50,000,000원 (퇴소 시 전액 반환)"
                    value={formData.deposit}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>월 입소비 (1인실)</label>
                  <Input
                    name="singleRoomFee"
                    placeholder="예: 7,000,000원"
                    value={formData.singleRoomFee}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>월 입소비 (2인실)</label>
                  <Input
                    name="doubleRoomFee"
                    placeholder="예: 5,200,000원"
                    value={formData.doubleRoomFee}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>개인간병 이용시 비용</label>
                  <Input
                    name="nursingExtraFee"
                    placeholder="예: 별도 산정 (간병인 식사 무상 제공)"
                    value={formData.nursingExtraFee}
                    onChange={handleChange}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>기본 이용료 (원/월)</label>
                    <Input
                      name="basicFee"
                      placeholder="기본 이용료를 입력하세요"
                      value={formData.basicFee}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>간병비 (원/월)</label>
                    <Input
                      name="nursingFee"
                      placeholder="간병비를 입력하세요"
                      value={formData.nursingFee}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>식대 (원/월)</label>
                    <Input
                      name="mealFee"
                      placeholder="식대를 입력하세요"
                      value={formData.mealFee}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>프로그램 비용 (원/월)</label>
                    <Input
                      name="programFee"
                      placeholder="프로그램 비용을 입력하세요"
                      value={formData.programFee}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {formData.extraItems.map((item, idx) => (
                  <div className="form-row" key={idx} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>{idx === 0 ? "추가 비용 항목" : ""}</label>
                      <Input
                        placeholder="항목명"
                        value={item.name}
                        onChange={e => handleExtraItemChange(idx, "name", e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1, position: "relative" }}>
                      {idx === 0 && (
                        <Button type="button" variant="outline" onClick={handleAddExtraItem}>
                          + 항목 추가
                        </Button>
                      )}
                      <Input
                        placeholder="금액 (원/월)"
                        value={item.amount}
                        onChange={e => handleExtraItemChange(idx, "amount", e.target.value)}
                      />
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveExtraItem(idx)}
                          style={{ position: "absolute", top: 8, right: 8, background: "transparent", border: "none", cursor: "pointer" }}
                        >
                          <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="form-group">
                  <label>건강보험 적용률 (%)</label>
                  <Select name="insuranceRate" value={formData.insuranceRate} onChange={handleChange}>
                    <option value="50%">50%</option>
                    <option value="70%">70%</option>
                    <option value="80%">80%</option>
                  </Select>
                </div>
                <div className="form-group">
                  <label>최종 예상 비용 (원/월)</label>
                  <Input
                    name="finalEstimate"
                    placeholder="최종 예상 비용을 입력하세요"
                    value={formData.finalEstimate}
                    onChange={handleChange}
                  />
                </div>
                <p className="help-text" style={{ marginTop: 8, fontSize: 13, color: "#6b7280" }}>
                  * 건강보험 적용 후 예상되는 최종 비용을 입력하세요.
                </p>
              </>
            )}
          </div>
        )}



{activeTab === "type" && (
  <div className="form-section">
    {/* 평가등급 (all types) */}
    <div className="form-group">
      <label>평가등급</label>
      <Select name="rating" value={formData.rating} onChange={handleChange}>
        <option value="">등급 선택</option>
        <option value="1등급">1등급</option>
        <option value="2등급">2등급</option>
        <option value="3등급">3등급</option>
        <option value="4등급">4등급</option>
        <option value="5등급">5등급</option>
      </Select>
    </div>

    {/* 병상 정보 + 규모 분류 (all types) */}
    <div className="form-group">
      <label>병상 정보</label>
       {/* TODO: 추후 API 연동으로 'bedSizeCategory' 값을 받아와 표시하도록 변경 */}
{formData.totalBeds && (
  // // 예시 API 호출 (나중에 활성화하세요)
  // useEffect(() => {
  //   const cnt = parseInt(formData.totalBeds, 10)
  //   fetch(`/api/bed-size-category?count=${cnt}`)
  //     .then(res => res.json())
  //     .then(data => setBedSizeCategory(data.category))
  // }, [formData.totalBeds])

  <span className="text-gray-500">
    {/* API에서 받아온 값 사용: {bedSizeCategory} */}
    {(() => {
      const cnt = parseInt(formData.totalBeds, 10)
      if (cnt <= 4) return "소형"
      if (cnt <= 9) return "중형"
      return "대형"
    })()}
  </span>
)}

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Input
          name="totalBeds"
          placeholder="총 병상"
          value={formData.totalBeds}
          onChange={handleChange}
        />
      </div>
      <div className="form-row" style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
        <Input
          name="generalBeds"
          placeholder="일반 병상"
          value={formData.generalBeds}
          onChange={handleChange}
        />
        <Input
          name="vipBeds"
          placeholder="상급 병상"
          value={formData.vipBeds}
          onChange={handleChange}
        />
        <Input
          name="isolationBeds"
          placeholder="격리 병상"
          value={formData.isolationBeds}
          onChange={handleChange}
        />
      </div>
    </div>

    {facilityType === "요양병원" && (
      <>
        {/* 의료진 정보 (요양병원만) */}
        <div className="form-group">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label>의료진 정보</label>
            <Button
              type="button"
              variant="outline"
              onClick={handleAddMedicalStaff}
              className="add-extra-item-btn"
              style={{ marginBottom: "0.5rem" }}
            >
              + 의료진 추가
            </Button>
          </div>
          {formData.medicalStaff.map((staff, idx) => (
            <div
              key={idx}
              className="form-row"
              style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", position: "relative" }}
            >
              <Input
                placeholder="직책"
                value={staff.position}
                onChange={e => handleMedicalStaffChange(idx, "position", e.target.value)}
              />
              <Input
                placeholder="이름"
                value={staff.name}
                onChange={e => handleMedicalStaffChange(idx, "name", e.target.value)}
              />
              <Input
                placeholder="전문분야"
                value={staff.specialty}
                onChange={e => handleMedicalStaffChange(idx, "specialty", e.target.value)}
              />
              {idx > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveMedicalStaff(idx)}
                  style={{ position: "absolute", top: 4, right: 4, background: "transparent", border: "none", cursor: "pointer" }}
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* 의료 장비 (요양병원만) */}
        <div className="form-group">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label>의료 장비</label>
            <Button
              type="button"
              variant="outline"
              onClick={handleAddMedicalEquipment}
              className="add-extra-item-btn"
              style={{ marginBottom: "0.5rem" }}
            >
              + 장비 추가
            </Button>
          </div>
          {formData.medicalEquipments.map((eq, idx) => (
            <div
              key={idx}
              className="form-row"
              style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", position: "relative", alignItems: "center" }}
            >
              <Input
                placeholder="장비명 입력 (예: MRI)"
                value={eq.name}
                onChange={e => handleMedicalEquipmentChange(idx, e.target.value)}
              />
              {idx > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveMedicalEquipment(idx)}
                  style={{ position: "absolute", top: 4, right: 4, background: "transparent", border: "none", cursor: "pointer" }}
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                </button>
              )}
            </div>
          ))}
        </div>
      </>
    )}
  </div>
)}



<div className="form-actions" style={{ display: "flex", gap: "0.5rem", marginTop: "2rem" }}>
  <Button
    type="button"
    onClick={() => navigate("/admin/facilities")}
    className="facility-action-button facility-cancel-button"
  >
    취소
  </Button>
  <Button
    type="submit"
    className="facility-action-button facility-submit-button"
  >
    시설 등록
  </Button>
</div>

      </form>
    </div>
  )
}

export default AdminFacilitiesNewPage
