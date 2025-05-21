// AdminFacilitiesEditPage.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, X } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Select } from "../components/ui/Select";
import "../styles/AdminFacilitiesNewPage.css";
import KakaoAddressSearch from "../components/admin/KakaoAddressSearch";

const AdminFacilitiesEditPage = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();

  const [facilityType, setFacilityType] = useState("");
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [loadingMarkDown, setLoadingMarkDown] = useState(false);
  const [isMarkdownSynced, setIsMarkdownSynced] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    establishedYear: "",
    address: "",
    phone: "",
    homepage: "",
    grade: "",
    facilitySize: "",
    description: "",
    weekdayHours: "",
    weekendHours: "",
    holidayHours: "",
    visitingHours: "",
    images: [],
  });

  const [emailList, setEmailList] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [loadingEmails, setLoadingEmails] = useState(false);

  const facilityTypeMap = {
    요양병원: "nursing_hospital",
    요양원: "nursing_home",
    실버타운: "silver_town",
  };
  const reverseTypeMap = {
    nursing_hospital: "요양병원",
    nursing_home: "요양원",
    silver_town: "실버타운",
  };

  useEffect(() => {
    const fetchFacility = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/facility/${id}`);
        const data = await res.json();
        setFormData({ ...data, images: [] });
        setFacilityType(reverseTypeMap[data.type]);
      } catch (err) {
        console.error("기존 시설 정보 로드 실패", err);
      }
    };
    fetchFacility();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "description") setIsMarkdownSynced(false);
  };

  const handleFacilityTypeChange = (e) => {
    const selected = e.target.value;
    setFacilityType(selected);
    setFormData((prev) => ({
      ...prev,
      type: facilityTypeMap[selected],
    }));
  };

  const handleRemoveImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    const dto = {
      type: formData.type,
      name: formData.name,
      establishedYear: Number(formData.establishedYear),
      address: formData.address,
      phone: formData.phone,
      homepage: formData.homepage,
      grade: formData.grade,
      facilitySize: formData.facilitySize,
      description: formData.description,
      weekdayHours: formData.weekdayHours,
      weekendHours: formData.weekendHours,
      holidayHours: formData.holidayHours,
      visitingHours: formData.visitingHours,
    };

    form.append(
      "dto",
      new Blob([JSON.stringify(dto)], { type: "application/json" })
    );
    formData.images.forEach((imgObj) => {
      form.append("images", imgObj.file);
    });

    // 👉 여기에 로그 찍어보자
    form
      .get("dto")
      .text()
      .then((text) => {
        console.log("DTO 내용 확인:", JSON.parse(text));
      });

    try {
      const response = await fetch(`${API_BASE_URL}/facility/${id}`, {
        method: "PUT",
        body: form,
      });

      if (response.ok) {
        alert("시설 수정 완료");
        navigate("/admin/facilities");
      } else {
        const err = await response.json();
        alert("수정 실패: " + err.message);
      }
    } catch (err) {
      console.error("수정 중 오류 발생:", err);
      alert("서버 오류 발생");
    }
  };



  const handleMarkdownConvert = async () => {
    setLoadingMarkDown(true);
    try {
      const response = await fetch("http://localhost:8000/markdown", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          raw_text: formData.description,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setFormData((prev) => ({
          ...prev,
          description: data.markdown.replace(/\\n/g, "\n"),
        }));
        setIsMarkdownSynced(true);
      } else {
        alert("마크다운 변환 실패: " + data.detail);
      }
    } catch (err) {
      console.error("에러 발생:", err);
      alert("서버 요청 실패!");
    } finally {
      setLoadingMarkDown(false);
    }
  };

  return (
    <div className="admin-facilities-new-page">
      <div className="page-header-full">
        <div className="header-inner">
          <Link to="/admin/facilities" className="flex items-center gap-1">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
            <span className="page-title">시설 수정</span>
          </Link>
        </div>
      </div>

      <div className="facility-type-wrapper">
        <label className="facility-type-label">시설 유형 *</label>
        <div className="facility-type-select">
          <Select value={facilityType} onChange={handleFacilityTypeChange}>
            <option value="">종류</option>
            <option value="요양병원">요양병원</option>
            <option value="요양원">요양원</option>
            <option value="실버타운">실버타운</option>
          </Select>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="facility-form">
      <div
  className="form-section"
  style={{ backgroundColor: "#ffffff", borderRadius: "8px", padding: "1.5rem" }}
>

          <div className="form-group">
            <label>시설명 *</label>
           <Input
  name="name"
  placeholder="시설 이름을 입력하세요"
  value={formData.name}
  onChange={handleChange}
  style={{ backgroundColor: "#fff", borderRadius: "6px" }} // 👈 여기
/>

          </div>

          <div className="form-group">
            <label>설립년도 *</label>
            <Input
              name="establishedYear"
              placeholder="설립년도로 입력하세요"
              value={formData.establishedYear}
              onChange={handleChange}
            />
          </div>

          <div className="form-group address-row">
  <label>주소 *</label>
  <div className="address-input-group">
    <Input
      name="address"
      placeholder="시설 주소를 입력하세요"
      value={formData.address}
      onChange={handleChange}
    />
  <Button
  type="button"
  onClick={() => setShowAddressSearch(true)}
  className="facility-action-button facility-submit-button"
  style={{
    borderRadius: "8px",         // ✅ 둥글기
    padding: "0.5rem 1rem",      // ✅ 버튼 안 여백
    fontWeight: "500",
  }}
>
  주소 찾기
</Button>

  </div>
</div>


          <div className="form-row">
            <div className="form-group">
              <label>연락처</label>
              <Input
                name="phone"
                placeholder="연락처를 입력하세요"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>홈페이지</label>
              <Input
                name="homepage"
                placeholder="홈페이지 URL을 입력하세요"
                value={formData.homepage}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>평가등급</label>
              <Select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
              >
                <option value="">등급을 선택하세요</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="등급제외">등급제외</option>
              </Select>
            </div>
            <div className="form-group">
              <label>병원 규모</label>
              <Select
                name="facilitySize"
                value={formData.facilitySize}
                onChange={handleChange}
              >
                <option value="">규모를 선택하세요</option>
                <option value="LARGE">대형</option>
                <option value="MEDIUM">중형</option>
                <option value="SMALL">소형</option>
              </Select>
            </div>
          </div>

          <div className="form-group">
            <label>시설 설명</label>
            <Textarea
              name="description"
              placeholder="시설에 대한 설명을 입력하세요"
              value={formData.description}
              onChange={handleChange}
              rows="15"
            />
            <Button
              type="button"
              className="markdown-preview-button"
              onClick={handleMarkdownConvert}
              disabled={loadingMarkDown || isMarkdownSynced}
            >
              {loadingMarkDown
                ? "변환 중..."
                : isMarkdownSynced
                ? "변환 완료"
                : "시설 설명 마크다운으로 변환"}
            </Button>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>평일 운영시간</label>
              <Input
                name="weekdayHours"
                placeholder="예: 09:00 - 18:00"
                value={formData.weekdayHours}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>주말 운영시간</label>
              <Input
                name="weekendHours"
                placeholder="예: 10:00 - 15:00"
                value={formData.weekendHours}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>공휴일 운영시간</label>
              <Input
                name="holidayHours"
                placeholder="예: 10:00 - 15:00"
                value={formData.holidayHours}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>면회시간</label>
              <Input
                name="visitingHours"
                placeholder="예: 13:30 - 17:00"
                value={formData.visitingHours}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

       <div
  className="form-section1"
  style={{
    backgroundColor: "#ffffff", // ✅ 전체 박스 흰 배경
    borderRadius: "8px",
    padding: "1.5rem",
    marginTop: "2rem",
  }}
>
  <h2>시설 이미지</h2>

  {/* 업로드 박스 */}
  <div
    className="image-upload-area"
    style={{
      backgroundColor: "#ffffff",
      border: "1px dashed #ccc",
      borderRadius: "8px",
      padding: "1.5rem",
      textAlign: "center",
      cursor: "pointer",
    }}
    onClick={() =>
      document.getElementById("image-upload-input").click()
    }
  >
    <img
      src="/icons/upload-photo.png"
      alt="사진 업로드"
      className="image-upload-icon-img"
      style={{ margin: "0 auto", width: "48px", height: "48px" }}
    />
    <div
      className="image-upload-text"
      style={{ color: "#666", marginTop: "0.5rem", fontSize: "0.9rem" }}
    >
      이미지를 업로드하세요 (최대 5MB)
    </div>
    <input
      id="image-upload-input"
      type="file"
      accept="image/*"
      multiple
      style={{ display: "none" }}
      onChange={(e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        }));
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...newImages],
        }));
      }}
    />
  </div>

  {/* 이미지 미리보기 */}
  {formData.images.length > 0 && (
    <div
      className="image-preview-list"
      style={{
        display: "flex",
        gap: "0.5rem",
        flexWrap: "wrap",
        marginTop: "1rem",
      }}
    >
      {formData.images.map((image, index) => (
        <div key={index} style={{ position: "relative" }}>
          <img
            src={image.preview}
            alt="업로드 이미지"
            className="uploaded-image"
            style={{
              width: "120px",
              height: "120px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
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
              cursor: "pointer",
            }}
          >
            <X className="w-5 h-5 text-red-500" />
          </button>
        </div>
      ))}
    </div>
  )}

  {/* 버튼 영역 포함 */}
  <div
    className="form-actions"
    style={{
      display: "flex",
      justifyContent: "flex-end",
      gap: "0.5rem",
      marginTop: "2rem",
    }}
  >
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
      시설 수정
    </Button>
  </div>
</div>

      </form>

      {showAddressSearch && (
        <KakaoAddressSearch
          onComplete={(address) => {
            setFormData((prev) => ({ ...prev, address }));
            setShowAddressSearch(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminFacilitiesEditPage;
