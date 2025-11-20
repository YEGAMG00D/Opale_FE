import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UpdateMyInfoPage.module.css';
import FormInputField from '../../../components/signup/FormInputField';
import FormInputWithButton from '../../../components/signup/FormInputWithButton';
import { validateNickname, validatePhone, validateAddress, validateDetailAddress, validatePassword, validateConfirmPassword } from '../../../utils/validation';
import { fetchMyInfo, updateMyInfo, checkNicknameDuplicate, changePassword } from '../../../api/userApi';

const UpdateMyInfoPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nickname: '',
    phone: '',
    address: '',
    detailAddress: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [validationMessages, setValidationMessages] = useState({});
  const [passwordValidationMessages, setPasswordValidationMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const [originalNickname, setOriginalNickname] = useState(''); // 원래 닉네임 저장 (중복 확인 스킵용)
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // 페이지 진입 시 본인 정보 조회
  useEffect(() => {
    const loadMyInfo = async () => {
      try {
        setLoading(true);
        const info = await fetchMyInfo();
        setUserInfo(info);
        
        const loadedData = {
          nickname: info.nickname || '',
          phone: info.phone || '',
          address: info.address1 || '',
          detailAddress: info.address2 || '',
        };
        
        setFormData(loadedData);
        setOriginalNickname(info.nickname || '');
        
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

  // 비밀번호 변경 핸들러
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    // 유효성 검사 실행
    let validationResult = { isValid: null, message: '' };
    
    switch (name) {
      case 'currentPassword':
        if (!value.trim()) {
          validationResult = { isValid: false, message: '현재 비밀번호를 입력해주세요.' };
        } else {
          validationResult = { isValid: true, message: '' };
        }
        break;
      case 'newPassword':
        validationResult = validatePassword(value);
        // 새 비밀번호가 변경되면 비밀번호 확인도 다시 검증
        if (passwordData.confirmPassword) {
          const confirmResult = validateConfirmPassword(value, passwordData.confirmPassword);
          setPasswordValidationMessages(prev => ({
            ...prev,
            confirmPassword: confirmResult
          }));
        }
        break;
      case 'confirmPassword':
        validationResult = validateConfirmPassword(passwordData.newPassword, value);
        break;
      default:
        break;
    }

    setPasswordValidationMessages(prev => ({
      ...prev,
      [name]: validationResult
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // 최종 유효성 검사
    const isCurrentPasswordValid = passwordValidationMessages?.currentPassword?.isValid === true;
    const isNewPasswordValid = passwordValidationMessages?.newPassword?.isValid === true;
    const isConfirmPasswordValid = passwordValidationMessages?.confirmPassword?.isValid === true;

    if (!isCurrentPasswordValid || !isNewPasswordValid || !isConfirmPasswordValid) {
      alert('입력한 정보를 확인해주세요.');
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      alert('비밀번호가 변경되었습니다.');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordValidationMessages({});
      setShowPasswordSection(false);
    } catch (err) {
      console.error('비밀번호 변경 실패:', err);
      
      // 현재 비밀번호가 틀린 경우
      if (err.response?.status === 400 || err.response?.status === 401) {
        setPasswordValidationMessages(prev => ({
          ...prev,
          currentPassword: { isValid: false, message: '현재 비밀번호가 올바르지 않습니다.' }
        }));
        alert('현재 비밀번호가 올바르지 않습니다.');
      } else {
        alert(err.message || '비밀번호 변경에 실패했습니다.');
      }
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
        <h1>회원정보 변경</h1>
      </div>

      <div className={styles.content}>
        {/* 회원정보 표시 섹션 */}
        {userInfo && (
          <div className={styles.infoSection}>
            <h2 className={styles.sectionTitle}>회원정보</h2>
            <div className={styles.infoCard}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>이메일</span>
                <span className={styles.infoValue}>{userInfo.email || '-'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>닉네임</span>
                <span className={styles.infoValue}>{userInfo.nickname || '-'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>연락처</span>
                <span className={styles.infoValue}>{userInfo.phone || '-'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>주소</span>
                <span className={styles.infoValue}>
                  {userInfo.address1 || '-'} {userInfo.address2 ? ` ${userInfo.address2}` : ''}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 정보 변경 섹션 */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>정보 변경</h2>
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

        {/* 비밀번호 변경 섹션 */}
        <div className={styles.card}>
          <div className={styles.passwordSectionHeader}>
            <h2 className={styles.cardTitle}>비밀번호 변경</h2>
            <button
              className={styles.toggleButton}
              onClick={() => setShowPasswordSection(!showPasswordSection)}
            >
              {showPasswordSection ? '접기' : '펼치기'}
            </button>
          </div>
          {showPasswordSection && (
            <div className={styles.stepContent}>
              <FormInputField
                label="현재 비밀번호"
                required
                name="currentPassword"
                type="password"
                placeholder="현재 비밀번호를 입력해주세요"
                value={passwordData.currentPassword}
                onChange={handlePasswordInputChange}
                validation={passwordValidationMessages?.currentPassword || { isValid: null, message: '' }}
                showPasswordToggle={true}
              />

              <FormInputField
                label="새 비밀번호"
                required
                name="newPassword"
                type="password"
                placeholder="비밀번호는 영문, 숫자, 특수문자를 포함한 8자"
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
                validation={passwordValidationMessages?.newPassword || { isValid: null, message: '' }}
                showPasswordToggle={true}
              />

              <FormInputField
                label="새 비밀번호 확인"
                required
                name="confirmPassword"
                type="password"
                placeholder="새 비밀번호를 다시 입력해주세요"
                value={passwordData.confirmPassword}
                onChange={handlePasswordInputChange}
                validation={passwordValidationMessages?.confirmPassword || { isValid: null, message: '' }}
                showPasswordToggle={true}
              />

              <div className={styles.passwordButtonSection}>
                <button
                  className={styles.submitButton}
                  onClick={handlePasswordSubmit}
                  disabled={
                    !passwordValidationMessages?.currentPassword?.isValid ||
                    !passwordValidationMessages?.newPassword?.isValid ||
                    !passwordValidationMessages?.confirmPassword?.isValid
                  }
                >
                  비밀번호 변경
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateMyInfoPage;
