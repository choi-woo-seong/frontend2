'use client';

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import '../styles/AdminFacilitiesNewPage.css';

const AdminFacilitiesNewPage = () => {
  const navigate = useNavigate();

  const [facilityType, setFacilityType] = useState('요양병원');

  const [formData, setFormData] = useState({
    name: '',
    establishedYear: '',
    address: '',
    phone: '',
    homepage: '',
    description: '',
    weekdayHours: '',
    weekendHours: '',
    holidayHours: '',
    visitingHours: '',
    images: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRemoveImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert('시설 등록 완료');
    navigate('/admin/facilities');
  };

  // 📌 메일 불러오기 관련 -----------------
  const [emailList, setEmailList] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [loadingEmails, setLoadingEmails] = useState(false);

  const fetchEmails = () => {
    setLoadingEmails(true);
    fetch('http://localhost:8000/emails')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success' && Array.isArray(data.files)) {
          setEmailList(data.files);
        } else {
          console.error('이메일 데이터가 올바르지 않음', data);
        }
      })
      .catch((err) => {
        console.error('이메일 불러오기 실패', err);
      })
      .finally(() => {
        setLoadingEmails(false);
      });
  };
  // ----------------------------------------

  return (
    <div className='admin-facilities-new-page'>
      <div className='page-header-full'>
        <div className='header-inner'>
          <Link to='/admin/facilities' className='flex items-center gap-1'>
            <ChevronLeft className='h-5 w-5 text-gray-600' />
            <span className='page-title'>새 시설 등록</span>
          </Link>
        </div>
      </div>

      <div className='facility-type-wrapper'>
        <label className='facility-type-label'>시설 유형 *</label>
        <div className='facility-type-select'>
          <Select value={facilityType} onChange={(e) => setFacilityType(e.target.value)}>
            <option value='요양병원'>요양병원</option>
            <option value='요양원'>요양원</option>
            <option value='실버타운'>실버타운</option>
          </Select>
        </div>
      </div>

      {/* ✅ 이메일 불러오기 영역 */}
      <div className='form-section email-fetch-section'>
        <h3 className='email-title-text'>메일에서 불러오기</h3>

        <div className='form-row'>
          <div className='form-group' style={{ flex: 1 }}>
            <Button type='button' onClick={fetchEmails} className='email-fetch-button' disabled={loadingEmails}>
              {loadingEmails ? '불러오는 중...' : '이메일 불러오기'}
            </Button>
          </div>
        </div>

        {emailList.length > 0 && (
          <>
            <div className='form-row' style={{ marginTop: '1rem' }}>
              <div className='form-group' style={{ flex: 2 }}>
                <label>이메일 선택</label>
                <Select value={selectedEmail} onChange={(e) => setSelectedEmail(e.target.value)}>
                  <option value=''>이메일을 선택하세요</option>
                  {emailList.map((email, index) => (
                    <option key={index} value={email.email_subject}>
                      {email.email_subject}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <Button type='button' onClick={() => alert('이메일 적용하기 기능은 나중에 추가됩니다.')} disabled={!selectedEmail}>
                이메일 내용 적용하기
              </Button>
            </div>
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className='facility-form'>
        <div className='form-section'>
          <div className='form-group'>
            <label>시설명 *</label>
            <Input name='name' placeholder='시설 이름을 입력하세요' value={formData.name} onChange={handleChange} />
          </div>

          <div className='form-group'>
            <label>설립년도</label>
            <Input name='establishedYear' placeholder='설립년도로 입력하세요' value={formData.establishedYear} onChange={handleChange} />
          </div>

          <div className='form-group'>
            <label>주소 *</label>
            <Input name='address' placeholder='시설 주소를 입력하세요' value={formData.address} onChange={handleChange} />
          </div>

          <div className='form-row'>
            <div className='form-group'>
              <label>연락처</label>
              <Input name='phone' placeholder='연락처를 입력하세요' value={formData.phone} onChange={handleChange} />
            </div>
            <div className='form-group'>
              <label>홈페이지</label>
              <Input name='homepage' placeholder='홈페이지 URL을 입력하세요' value={formData.homepage} onChange={handleChange} />
            </div>
          </div>

          <div className='form-group'>
            <label>시설 설명</label>
            <Textarea name='description' placeholder='시설에 대한 설명을 입력하세요' value={formData.description} onChange={handleChange} />
          </div>

          <div className='form-row'>
            <div className='form-group'>
              <label>평일 운영시간</label>
              <Input name='weekdayHours' placeholder='예: 09:00 - 18:00' value={formData.weekdayHours} onChange={handleChange} />
            </div>
            <div className='form-group'>
              <label>주말 운영시간</label>
              <Input name='weekendHours' placeholder='예: 10:00 - 15:00' value={formData.weekendHours} onChange={handleChange} />
            </div>
          </div>

          <div className='form-row'>
            <div className='form-group'>
              <label>공휴일 운영시간</label>
              <Input name='holidayHours' placeholder='예: 10:00 - 15:00' value={formData.holidayHours} onChange={handleChange} />
            </div>
            <div className='form-group'>
              <label>면회시간</label>
              <Input name='visitingHours' placeholder='예: 13:30 - 17:00' value={formData.visitingHours} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className='form-section1'>
          <h2>시설 이미지</h2>
          <div className='image-upload-area' onClick={() => document.getElementById('image-upload-input').click()}>
            <img src='/icons/upload-photo.png' alt='사진 업로드' className='image-upload-icon-img' />
            <div className='image-upload-text'>이미지를 업로드하세요 (최대 5MB)</div>
            <input
              id='image-upload-input'
              type='file'
              accept='image/*'
              multiple
              style={{ display: 'none' }}
              onChange={(e) => {
                const files = Array.from(e.target.files);
                const newImages = files.map((file) => ({ file, preview: URL.createObjectURL(file) }));
                setFormData({ ...formData, images: [...formData.images, ...newImages] });
              }}
            />
          </div>
          {formData.images.length > 0 && (
            <div className='image-preview-list' style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              {formData.images.map((image, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <img src={image.preview} alt='업로드 이미지' className='uploaded-image' style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                  <button
                    type='button'
                    onClick={() => handleRemoveImage(index)}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      background: 'transparent',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                    }}
                  >
                    <X className='w-5 h-5 text-red-500' />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='form-actions' style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem' }}>
          <Button type='button' onClick={() => navigate('/admin/facilities')} className='facility-action-button facility-cancel-button'>
            취소
          </Button>
          <Button type='submit' className='facility-action-button facility-submit-button'>
            시설 등록
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminFacilitiesNewPage;
