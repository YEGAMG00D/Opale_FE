import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UpdateMyInfoPage.module.css';
import FormInputField from '../../../components/signup/FormInputField';
import FormInputWithButton from '../../../components/signup/FormInputWithButton';
import { validateNickname, validatePhone, validateAddress, validateDetailAddress } from '../../../utils/validation';
import { fetchMyInfo, updateMyInfo, checkNicknameDuplicate } from '../../../api/userApi';

const UpdateMyInfoPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nickname: '',
    phone: '',
    address: '',
    detailAddress: '',
  });
  const [validationMessages, setValidationMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const [originalNickname, setOriginalNickname] = useState(''); // 원래 닉네임 저장 (중복 확인 스킵용)

  // 페이지 진입 시 본인 정보 조회
  useEffect(() => {
    const loadMyInfo = async () => {
      try {
        setLoading(true);
        const userInfo = await fetchMyInfo();
        
        const loadedData = {
          nickname: userInfo.nickname || '',
          phone: userInfo.phone || '',
          address: userInfo.address1 || '',
          detailAddress: userInfo.address2 || '',
        };
        
        setFormData(loadedData);
        setOriginalNickname(userInfo.nickname || '');
        
        // 모든 필드에 대해 유효성 검사 실행 (원래 값이므로 모두 유효한 것으로 처리)
        setValidationMessages({
          nickname: { isValid: true, message: '현재 사용 중인 닉네임입니다.' },
          phone: validatePhone(loadedData.phone),
          address: validateAddress(loadedData.address),
          detailAddress: validateDetailAddress(loadedData.detailAddress),
        });
      } catch (err) {
        console.error('본인 정보 조회 실패:', err);
        alert('본인 정보를 불러오는데 실패했습니다.');
        navigate('/my');
      } finally {
        setLoading(false);
      }
    };

    loadMyInfo();
  }, [navigate]);

  // 닉네임 중복 확인 핸들러
  const handleCheckNickname = async () => {
    const nickname = formData.nickname.trim();
    
    // 유효성 검사 먼저 실행
    const nicknameValidation = validateNickname(nickname);
    if (!nicknameValidation.isValid) {
      setValidationMessages(prev => ({
        ...prev,
        nickname: nicknameValidation
      }));
      return;
    }

    // 원래 닉네임과 같으면 중복 확인 스킵
    if (nickname === originalNickname) {
      setValidationMessages(prev => ({
        ...prev,
        nickname: { isValid: true, message: '현재 사용 중인 닉네임입니다.' }
      }));
      return;
    }

    try {
      const result = await checkNicknameDuplicate(nickname);
      
      if (result.available) {
        setValidationMessages(prev => ({
          ...prev,
          nickname: { isValid: true, message: '사용 가능한 닉네임입니다.' }
        }));
      } else {
        setValidationMessages(prev => ({
          ...prev,
          nickname: { isValid: false, message: '이미 사용 중인 닉네임입니다.' }
        }));
      }
    } catch (err) {
      console.error('닉네임 중복 확인 실패:', err);
      setValidationMessages(prev => ({
        ...prev,
        nickname: { isValid: false, message: '닉네임 중복 확인에 실패했습니다.' }
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 유효성 검사 실행
    let validationResult = { isValid: null, message: '' };
    
    switch (name) {
      case 'nickname':
        validationResult = validateNickname(value);
        break;
      case 'phone':
        validationResult = validatePhone(value);
        break;
      case 'address':
        validationResult = validateAddress(value);
        break;
      case 'detailAddress':
        validationResult = validateDetailAddress(value);
        break;
      default:
        break;
    }

    setValidationMessages(prev => ({
      ...prev,
      [name]: validationResult
    }));

    // 닉네임이 변경되면 중복 확인 상태 초기화 (원래 닉네임이 아닌 경우)
    if (name === 'nickname' && value !== originalNickname) {
      setValidationMessages(prev => ({
        ...prev,
        nickname: { isValid: null, message: '' }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 최종 유효성 검사
    const isNicknameValid = validationMessages?.nickname?.isValid === true;
    const isPhoneValid = validationMessages?.phone?.isValid === true;
    const isAddressValid = validationMessages?.address?.isValid === true;
    const isDetailAddressValid = validationMessages?.detailAddress?.isValid === true;

    if (!isNicknameValid || !isPhoneValid || !isAddressValid || !isDetailAddressValid) {
      alert('입력한 정보를 확인해주세요.');
      return;
    }

    // 닉네임이 변경되었는데 중복 확인을 안 한 경우
    if (formData.nickname !== originalNickname && validationMessages?.nickname?.isValid !== true) {
      alert('닉네임 중복 확인을 해주세요.');
      return;
    }

    try {
      const updateData = {
        nickname: formData.nickname,
        phone: formData.phone,
        address1: formData.address,
        address2: formData.detailAddress
      };

      await updateMyInfo(updateData);
      alert('개인 정보가 변경되었습니다.');
      navigate('/my');
    } catch (err) {
      console.error('개인 정보 변경 실패:', err);
      alert(err.message || '개인 정보 변경에 실패했습니다.');
    }
  };

  const isFormValid = 
    validationMessages?.nickname?.isValid === true &&
    validationMessages?.phone?.isValid === true &&
    validationMessages?.address?.isValid === true &&
    validationMessages?.detailAddress?.isValid === true;

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.title}>
          <h1>개인 정보 변경</h1>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center' }}>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>개인 정보 변경</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.stepContent}>
            <FormInputWithButton
              label="닉네임"
              required
              name="nickname"
              type="text"
              placeholder="닉네임을 입력해주세요 (2-10자)"
              value={formData.nickname}
              onChange={handleInputChange}
              buttonText="닉네임 중복확인"
              onButtonClick={handleCheckNickname}
              validation={validationMessages?.nickname || { isValid: null, message: '' }}
            />

            <FormInputField
              label="연락처"
              required
              name="phone"
              type="tel"
              placeholder="01012345678 (11자리 숫자)"
              value={formData.phone}
              onChange={handleInputChange}
              validation={validationMessages?.phone || { isValid: null, message: '' }}
            />

            <FormInputField
              label="주소"
              required
              name="address"
              type="text"
              placeholder="주소를 입력해주세요"
              value={formData.address}
              onChange={handleInputChange}
              validation={validationMessages?.address || { isValid: null, message: '' }}
            />

            <FormInputField
              label="상세주소"
              required
              name="detailAddress"
              type="text"
              placeholder="상세주소를 입력해주세요"
              value={formData.detailAddress}
              onChange={handleInputChange}
              validation={validationMessages?.detailAddress || { isValid: null, message: '' }}
            />
          </div>
        </div>

        <div className={styles.buttonSection}>
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            정보 변경
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateMyInfoPage;
