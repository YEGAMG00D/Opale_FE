import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UpdateMyInfoPage.module.css';
import FormInputField from '../../../components/signup/FormInputField';
import { validateNickname, validatePhone, validateAddress, validateDetailAddress } from '../../../utils/validation';

const UpdateMyInfoPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nickname: '',
    phone: '',
    address: '',
    detailAddress: '',
  });
  const [validationMessages, setValidationMessages] = useState({});

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

    // TODO: 실제 API 호출로 교체
    // const response = await updateMyInfo({
    //   nickname: formData.nickname,
    //   phone: formData.phone,
    //   address: formData.address,
    //   detailAddress: formData.detailAddress
    // });

    // 개발용: 성공 가정
    console.log('개인 정보 변경 요청:', {
      nickname: formData.nickname,
      phone: formData.phone,
      address: formData.address,
      detailAddress: formData.detailAddress
    });

    alert('개인 정보가 변경되었습니다.');
    navigate('/my');
  };

  const isFormValid = 
    validationMessages?.nickname?.isValid === true &&
    validationMessages?.phone?.isValid === true &&
    validationMessages?.address?.isValid === true &&
    validationMessages?.detailAddress?.isValid === true;

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>개인 정보 변경</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.stepContent}>
            <FormInputField
              label="닉네임"
              required
              name="nickname"
              type="text"
              placeholder="닉네임을 입력해주세요 (2-10자)"
              value={formData.nickname}
              onChange={handleInputChange}
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
