import React from 'react';
import styles from '../SignupPage.module.css';
import FormInputField from '../../../../components/signup/FormInputField';
import FormInputWithButton from '../../../../components/signup/FormInputWithButton';

const Step3PersonalInfo = ({ formData, handleInputChange, handleCheckNickname, validationMessages }) => {
  const nicknameValidation = validationMessages?.nickname || { isValid: null, message: '' };
  const nameValidation = validationMessages?.name || { isValid: null, message: '' };
  const birthDateValidation = validationMessages?.birthDate || { isValid: null, message: '' };
  const phoneValidation = validationMessages?.phone || { isValid: null, message: '' };
  const addressValidation = validationMessages?.address || { isValid: null, message: '' };
  const detailAddressValidation = validationMessages?.detailAddress || { isValid: null, message: '' };

  return (
    <div className={styles.stepContent}>
      <FormInputWithButton
        label="닉네임"
        required
        name="nickname"
        type="text"
        placeholder="2자 이상 10자 이하"
        value={formData.nickname}
        onChange={handleInputChange}
        buttonText="닉네임 중복확인"
        onButtonClick={handleCheckNickname}
        validation={nicknameValidation}
      />

      <FormInputField
        label="성명"
        required
        name="name"
        type="text"
        placeholder="성명을 입력해주세요"
        value={formData.name}
        onChange={handleInputChange}
        validation={nameValidation}
      />

      <div className={styles.inputGroup}>
        <label className={styles.label}>
          성별 <span className={styles.required}>*</span>
        </label>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === 'male'}
              onChange={handleInputChange}
            />
            <span>남성</span>
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === 'female'}
              onChange={handleInputChange}
            />
            <span>여성</span>
          </label>
        </div>
      </div>

      <FormInputField
        label="생년월일"
        required
        name="birthDate"
        type="text"
        placeholder="YYYYMMdd"
        value={formData.birthDate}
        onChange={handleInputChange}
        validation={birthDateValidation}
      />

      <FormInputField
        label="연락처"
        required
        name="phone"
        type="tel"
        placeholder="01012341234"
        value={formData.phone}
        onChange={handleInputChange}
        validation={phoneValidation}
      />

      <FormInputField
        label="주소"
        required
        name="address"
        type="text"
        placeholder="주소를 입력해주세요"
        value={formData.address}
        onChange={handleInputChange}
        validation={addressValidation}
      />

      <FormInputField
        label="상세주소"
        required
        name="detailAddress"
        type="text"
        placeholder="상세주소를 입력해주세요"
        value={formData.detailAddress}
        onChange={handleInputChange}
        validation={detailAddressValidation}
      />

      <div className={styles.termsSection}>
        <textarea
          className={styles.termsText}
          readOnly
          value="Opale는 회원님께 맞춤형 공연 정보와 추천 서비스를 제공하기 위해
다음 개인정보를 수집·이용합니다.

■ 수집 항목
   이메일, 비밀번호, 이름, 생년월일, 성별, 연락처, 주소

■ 이용 목적
   - 공연 및 공연장 정보 제공
   - 관심 공연, 리뷰, 찜 기능 제공
   - 개인화 추천 및 사용자 맞춤 콘텐츠 제공
   - 공지사항 안내 및 고객센터 응대

■ 보유 및 이용 기간
   회원 탈퇴 시 즉시 삭제하며, 관련 법령에 따라 필요한 경우 일정 기간 보관합니다.

위 내용을 확인하였으며, 개인정보 수집·이용에 동의합니다.
"
        />
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
          />
          <span>위 사항에 동의합니다. <span className={styles.required}>*</span></span>
        </label>
      </div>
    </div>
  );
};

export default Step3PersonalInfo;

