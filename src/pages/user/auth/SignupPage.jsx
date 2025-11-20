import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SignupPage.module.css';
import Step1EmailVerification from './signup-steps/Step1EmailVerification';
import Step2Password from './signup-steps/Step2Password';
import Step3PersonalInfo from './signup-steps/Step3PersonalInfo';
import {
  validateEmail,
  validateVerificationCode,
  validatePassword,
  validateConfirmPassword,
  validateNickname,
  validateName,
  validateBirthDate,
  validatePhone,
  validateAddress,
  validateDetailAddress,
} from '../../../utils/validation';
import { sendEmailCode, verifyEmailCode } from '../../../api/emailApi';
import { normalizeEmailResponse } from '../../../services/normalizeEmailResponse';
import { normalizeVerifyCodeResponse } from '../../../services/normalizeVerifyCodeResponse';
import { checkNicknameDuplicate, signUp } from '../../../api/userApi';
import { normalizeCheckNicknameResponse } from '../../../services/normalizeCheckNicknameResponse';
import { normalizeSignUpRequest } from '../../../services/normalizeSignUpRequest';
import { normalizeSignUpResponse } from '../../../services/normalizeSignUpResponse';

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0: 초기, 1: 이메일/인증번호, 2: 비밀번호, 3: 개인정보
  const [formData, setFormData] = useState({
    email: '',
    verificationCode: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    name: '',
    gender: '',
    birthDate: '',
    phone: '',
    address: '',
    detailAddress: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [validationMessages, setValidationMessages] = useState({});
  const [timer, setTimer] = useState(300); // 5분 타이머
  // Step1 관련 상태
  const [isCodeSent, setIsCodeSent] = useState(false); // 인증번호 전송 여부
  const [isCodeVerified, setIsCodeVerified] = useState(false); // 인증번호 확인 여부
  const [emailSendStatus, setEmailSendStatus] = useState(null); // 'success' | 'error' | null
  const [codeVerifyStatus, setCodeVerifyStatus] = useState(null); // 'success' | 'error' | null
  // 회원가입 관련 상태
  const [signupError, setSignupError] = useState(''); // 회원가입 에러 메시지

  const handleUnder14 = () => {
    console.log('Under 14 signup');
  };

  const handleOver14 = () => {
    console.log('Over 14 signup');
    // Step1 상태 초기화
    setIsCodeSent(false);
    setIsCodeVerified(false);
    setEmailSendStatus(null);
    setCodeVerifyStatus(null);
    setTimer(300);
    setValidationMessages({});
    setStep(1);
  };

  const handleNext = () => {
    console.log('Next step');
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    console.log('Previous step');
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // 유효성 검사 실행
    let validationResult = { isValid: null, message: '' };
    
    switch (name) {
      case 'email':
        validationResult = validateEmail(value);
        break;
      case 'verificationCode':
        // 인증번호 입력 시: 6자리 숫자가 아니면 빨간 글씨만 (초록 글씨 안 나옴)
        if (value && !/^\d{6}$/.test(value)) {
          validationResult = { isValid: false, message: '인증번호는 6자리 숫자여야 합니다.' };
        } else {
          validationResult = { isValid: null, message: '' }; // 정상 입력 시 메시지 없음
        }
        break;
      case 'password':
        validationResult = validatePassword(value);
        // 비밀번호가 변경되면 비밀번호 확인도 다시 검증
        if (formData.confirmPassword) {
          const confirmResult = validateConfirmPassword(value, formData.confirmPassword);
          setValidationMessages(prev => ({
            ...prev,
            confirmPassword: confirmResult
          }));
        }
        break;
      case 'confirmPassword':
        validationResult = validateConfirmPassword(formData.password, value);
        break;
      case 'nickname':
        // 닉네임은 입력 중 유효성 검사하지 않음 (중복확인 버튼 클릭 시에만 검사)
        validationResult = { isValid: null, message: '' };
        break;
      case 'name':
        validationResult = validateName(value);
        break;
      case 'birthDate':
        validationResult = validateBirthDate(value);
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

  // 인증번호 전송
  const handleSendCode = async () => {
    try {
      // 이메일 유효성 검사
      const emailValidation = validateEmail(formData.email);
      if (!emailValidation.isValid) {
        setValidationMessages(prev => ({
          ...prev,
          email: emailValidation
        }));
        return;
      }

      // API 호출
      const response = await sendEmailCode(formData.email);
      const normalizedData = normalizeEmailResponse(response);

      setEmailSendStatus('success');
      setIsCodeSent(true);
      setTimer(normalizedData.expiresIn); // expiresIn 초 만큼 타이머 시작
      setValidationMessages(prev => ({
        ...prev,
        email: { isValid: true, message: normalizedData.message || '인증번호가 발송되었습니다.' }
      }));
    } catch (err) {
      setEmailSendStatus('error');
      const errorMessage = err.response?.data?.message || err.message || '인증번호 전송에 실패했습니다.';
      setValidationMessages(prev => ({
        ...prev,
        email: { isValid: false, message: errorMessage }
      }));
    }
  };

  // 인증번호 재전송
  const handleResendCode = async () => {
    await handleSendCode();
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    try {
      // 인증번호 유효성 검사
      if (!formData.verificationCode || !/^\d{6}$/.test(formData.verificationCode)) {
        setValidationMessages(prev => ({
          ...prev,
          verificationCode: { isValid: false, message: '인증번호는 6자리 숫자여야 합니다.' }
        }));
        return;
      }

      // API 호출
      const response = await verifyEmailCode({
        email: formData.email,
        code: formData.verificationCode
      });
      const normalizedData = normalizeVerifyCodeResponse(response);

      if (normalizedData.verified) {
        setCodeVerifyStatus('success');
        setIsCodeVerified(true);
        setValidationMessages(prev => ({
          ...prev,
          verificationCode: { isValid: true, message: normalizedData.message || '인증번호가 확인되었습니다.' }
        }));
      } else {
        setCodeVerifyStatus('error');
        setIsCodeVerified(false);
        setValidationMessages(prev => ({
          ...prev,
          verificationCode: { isValid: false, message: normalizedData.message || '인증번호가 일치하지 않습니다.' }
        }));
      }
    } catch (err) {
      setCodeVerifyStatus('error');
      setIsCodeVerified(false);
      const errorMessage = err.response?.data?.message || err.message || '인증번호 검증에 실패했습니다.';
      setValidationMessages(prev => ({
        ...prev,
        verificationCode: { isValid: false, message: errorMessage }
      }));
    }
  };

  const handleCheckNickname = async () => {
    try {
      // 닉네임 유효성 검사
      const nicknameValidation = validateNickname(formData.nickname);
      if (!nicknameValidation.isValid) {
        setValidationMessages(prev => ({
          ...prev,
          nickname: nicknameValidation
        }));
        return;
      }

      // API 호출
      const response = await checkNicknameDuplicate(formData.nickname);
      const normalizedData = normalizeCheckNicknameResponse(response);

      if (normalizedData.available) {
        // 사용 가능한 닉네임
        setValidationMessages(prev => ({
          ...prev,
          nickname: { isValid: true, message: '사용 가능한 닉네임입니다.' }
        }));
      } else {
        // 중복된 닉네임
        setValidationMessages(prev => ({
          ...prev,
          nickname: { isValid: false, message: '이미 존재하는 닉네임입니다.' }
        }));
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || '닉네임 중복 확인에 실패했습니다.';
      setValidationMessages(prev => ({
        ...prev,
        nickname: { isValid: false, message: errorMessage }
      }));
    }
  };

  const handleSignup = async () => {
    try {
      setSignupError(''); // 에러 메시지 초기화
      
      // formData를 API 요청 형식으로 변환
      const requestData = normalizeSignUpRequest(formData);
      
      // API 호출
      const response = await signUp(requestData);
      const normalizedData = normalizeSignUpResponse(response);

      // 성공 시 WelcomePage로 이동
      if (normalizedData.userId) {
        navigate('/signup/welcome', { state: { nickname: normalizedData.nickname || formData.nickname || '닉네임' } });
      } else {
        setSignupError('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || '회원가입에 실패했습니다. 다시 시도해주세요.';
      setSignupError(errorMessage);
    }
  };

  // 타이머 효과 (인증번호 전송 후에만 작동)
  React.useEffect(() => {
    if (step === 1 && isCodeSent && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            // 시간 초과 시 메시지 표시
            setValidationMessages(prev => ({
              ...prev,
              verificationCode: { isValid: false, message: '제한 시간 지났습니다. 재전송해주세요.' }
            }));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, isCodeSent, timer]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (step === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            ←
          </button>
          <h1 className={styles.headerTitle}>회원가입</h1>
        </div>

        <div className={styles.content}>
          <div className={styles.topSection}>
            <div className={styles.logoSection}>
              <div className={styles.logo}>opale</div>
              <div className={styles.decorativeElements}>
                <div className={styles.dotPink1}></div>
                <div className={styles.dotPink2}></div>
                <div className={styles.dotBlue1}></div>
                <div className={styles.dotBlue2}></div>
                <div className={styles.starPink1}></div>
                <div className={styles.starBlue1}></div>
              </div>
            </div>

            <div className={styles.questionSection}>
              <h2 className={styles.question}>만 14세 미만 이용자입니까?</h2>
              <p className={styles.description}>
                본인에 해당하는 회원유형을 정확히 선택해 주세요.
              </p>
            </div>
          </div>

          <div className={styles.buttonSection}>
            <button className={styles.primaryButton} onClick={handleUnder14}>
              예, 만 14세 미만입니다
            </button>
            <button className={styles.secondaryLink} onClick={handleOver14}>
              아니요, 만 14세 이상입니다
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className={styles.headerTitle}>회원가입</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          {step === 1 && (
            <Step1EmailVerification
              formData={formData}
              handleInputChange={handleInputChange}
              handleSendCode={handleSendCode}
              handleResendCode={handleResendCode}
              handleVerifyCode={handleVerifyCode}
              timer={timer}
              formatTimer={formatTimer}
              validationMessages={validationMessages}
              isCodeSent={isCodeSent}
            />
          )}

          {step === 2 && (
            <Step2Password
              formData={formData}
              handleInputChange={handleInputChange}
              validationMessages={validationMessages}
              onNext={handleNext}
            />
          )}

          {step === 3 && (
            <Step3PersonalInfo
              formData={formData}
              handleInputChange={handleInputChange}
              handleCheckNickname={handleCheckNickname}
              validationMessages={validationMessages}
            />
          )}
        </div>

        {/* Step Indicators and Navigation Buttons */}
        <div className={styles.bottomSection}>
          <div className={styles.stepIndicators}>
            <div className={`${styles.stepDot} ${step >= 1 ? styles.active : ''}`}></div>
            <div className={`${styles.stepDot} ${step >= 2 ? styles.active : ''}`}></div>
            <div className={`${styles.stepDot} ${step >= 3 ? styles.active : ''}`}></div>
          </div>

          <div className={styles.navigationButtons}>
            <button
              className={styles.prevButton}
              onClick={handlePrev}
              disabled={step === 0}
            >
              이전
            </button>
            {step < 3 ? (
              <button 
                className={styles.nextButton} 
                onClick={handleNext}
                disabled={
                  (step === 1 && !isCodeVerified) ||
                  (step === 2 && (
                    !validationMessages?.password?.isValid || 
                    !validationMessages?.confirmPassword?.isValid
                  ))
                }
              >
                다음
              </button>
            ) : (
              <>
                {signupError && (
                  <div className={styles.errorMsg} style={{ marginBottom: '10px', textAlign: 'center' }}>
                    {signupError}
                  </div>
                )}
                <button 
                  className={styles.signupButton} 
                  onClick={handleSignup}
                  disabled={
                    // 닉네임: 중복확인 통과 필수 (isValid가 true이고 메시지가 '사용 가능한 닉네임입니다.'인 경우)
                    !validationMessages?.nickname ||
                    validationMessages.nickname.isValid !== true ||
                    validationMessages.nickname.message !== '사용 가능한 닉네임입니다.' ||
                    !formData.nickname?.trim() ||
                    // 성명: 유효성 검사 통과 필수 및 공백 체크
                    !validationMessages?.name ||
                    validationMessages.name.isValid !== true ||
                    !formData.name?.trim() ||
                    // 성별: 선택 필수
                    !formData.gender ||
                    // 생년월일: 유효성 검사 통과 필수 및 공백 체크
                    !validationMessages?.birthDate ||
                    validationMessages.birthDate.isValid !== true ||
                    !formData.birthDate?.trim() ||
                    // 연락처: 유효성 검사 통과 필수 및 공백 체크
                    !validationMessages?.phone ||
                    validationMessages.phone.isValid !== true ||
                    !formData.phone?.trim() ||
                    // 주소: 유효성 검사 통과 필수 및 공백 체크
                    !validationMessages?.address ||
                    validationMessages.address.isValid !== true ||
                    !formData.address?.trim() ||
                    // 상세주소: 유효성 검사 통과 필수 및 공백 체크
                    !validationMessages?.detailAddress ||
                    validationMessages.detailAddress.isValid !== true ||
                    !formData.detailAddress?.trim() ||
                    // 약관 동의: 체크 필수
                    !formData.agreeToTerms
                  }
                >
                  가입
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
