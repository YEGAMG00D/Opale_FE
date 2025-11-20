import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SignupPage.module.css';
import Step1EmailVerification from './signup-steps/Step1EmailVerification';
import Step2Password from './signup-steps/Step2Password';
import Step3PersonalInfo from './signup-steps/Step3PersonalInfo';
import TermsAgreementStep from './signup-steps/TermsAgreementStep';
import GuardianInfoStep from './signup-steps/GuardianInfoStep';
import GuardianAgreementStep from './signup-steps/GuardianAgreementStep';
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
  validateGuardianName,
} from '../../../utils/validation';

const SignupPage = () => {
  const navigate = useNavigate();
  // currentStep: 'age-selection' | 'terms' | 'guardian-info' | 'guardian-agreement' | 'email' | 'password' | 'personal-info'
  const [currentStep, setCurrentStep] = useState('age-selection');
  const [isUnder14, setIsUnder14] = useState(null); // null | true | false
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
    guardianName: '',
    guardianAgreed: false,
  });
  const [errors, setErrors] = useState({});
  const [validationMessages, setValidationMessages] = useState({});
  const [timer, setTimer] = useState(300); // 5분 타이머
  // Step1 관련 상태
  const [isCodeSent, setIsCodeSent] = useState(false); // 인증번호 전송 여부
  const [isCodeVerified, setIsCodeVerified] = useState(false); // 인증번호 확인 여부
  const [emailSendStatus, setEmailSendStatus] = useState(null); // 'success' | 'error' | null
  const [codeVerifyStatus, setCodeVerifyStatus] = useState(null); // 'success' | 'error' | null

  const handleUnder14 = () => {
    setIsUnder14(true);
    setCurrentStep('guardian-info');
  };

  const handleOver14 = () => {
    setIsUnder14(false);
    setCurrentStep('terms');
  };

  const handleNext = () => {
    console.log('Next step');
    if (currentStep === 'terms') {
      setCurrentStep('email');
      // Step1 상태 초기화
      setIsCodeSent(false);
      setIsCodeVerified(false);
      setEmailSendStatus(null);
      setCodeVerifyStatus(null);
      setTimer(300);
      setValidationMessages({});
    } else if (currentStep === 'guardian-info') {
      setCurrentStep('guardian-agreement');
    } else if (currentStep === 'guardian-agreement') {
      setCurrentStep('terms');
    } else if (currentStep === 'email') {
      setCurrentStep('password');
    } else if (currentStep === 'password') {
      setCurrentStep('personal-info');
    }
  };

  const handlePrev = () => {
    console.log('Previous step');
    if (currentStep === 'email') {
      setCurrentStep('terms');
    } else if (currentStep === 'password') {
      setCurrentStep('email');
    } else if (currentStep === 'personal-info') {
      setCurrentStep('password');
    } else if (currentStep === 'terms') {
      if (isUnder14) {
        setCurrentStep('guardian-agreement');
      } else {
        setCurrentStep('age-selection');
        setIsUnder14(null);
      }
    } else if (currentStep === 'guardian-agreement') {
      setCurrentStep('guardian-info');
    } else if (currentStep === 'guardian-info') {
      setCurrentStep('age-selection');
      setIsUnder14(null);
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
        validationResult = validateNickname(value);
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
      case 'guardianName':
        validationResult = validateGuardianName(value);
        break;
      default:
        break;
    }

    setValidationMessages(prev => ({
      ...prev,
      [name]: validationResult
    }));
  };

  // 인증번호 전송 (개발용: 항상 200 응답)
  const handleSendCode = async () => {
    // TODO: 실제 API 호출로 교체
    // const response = await sendVerificationCode(formData.email);
    
    // 개발용: 항상 성공 응답
    const mockResponse = { status: 200 };
    
    if (mockResponse.status === 200) {
      setEmailSendStatus('success');
      setIsCodeSent(true);
      setTimer(300); // 5분 타이머 시작
      setValidationMessages(prev => ({
        ...prev,
        email: { isValid: true, message: '인증번호를 전송하였습니다.' }
      }));
    } else {
      setEmailSendStatus('error');
      setValidationMessages(prev => ({
        ...prev,
        email: { isValid: false, message: '전송 실패하였습니다.' }
      }));
    }
  };

  // 인증번호 재전송
  const handleResendCode = async () => {
    await handleSendCode();
  };

  // 인증번호 확인 (개발용: 항상 200 응답)
  const handleVerifyCode = async () => {
    // TODO: 실제 API 호출로 교체
    // const response = await verifyCode(formData.email, formData.verificationCode);
    
    // 개발용: 항상 성공 응답
    const mockResponse = { status: 200 };
    
    if (mockResponse.status === 200) {
      setCodeVerifyStatus('success');
      setIsCodeVerified(true);
      setValidationMessages(prev => ({
        ...prev,
        verificationCode: { isValid: true, message: '인증번호가 확인되었습니다.' }
      }));
    } else {
      setCodeVerifyStatus('error');
      setValidationMessages(prev => ({
        ...prev,
        verificationCode: { isValid: false, message: '인증번호가 일치하지 않습니다.' }
      }));
    }
  };

  const handleCheckNickname = () => {
    console.log('Check nickname duplication');
  };

  const handleSignup = () => {
    console.log('Signup', formData);
    navigate('/signup/welcome', { state: { nickname: formData.nickname || '닉네임' } });
  };

  // 타이머 효과 (인증번호 전송 후에만 작동)
  React.useEffect(() => {
    if (currentStep === 'email' && isCodeSent && timer > 0) {
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
  }, [currentStep, isCodeSent, timer]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // 14세 미만/이상 선택 화면
  if (currentStep === 'age-selection') {
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

  // 약관동의 화면 (14세 이상)
  if (currentStep === 'terms') {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={handlePrev}>
            ←
          </button>
          <h1 className={styles.headerTitle}>약관동의</h1>
        </div>

        <div className={styles.content}>
          <div className={styles.card}>
            <TermsAgreementStep
              formData={formData}
              handleInputChange={handleInputChange}
              onNext={handleNext}
            />
          </div>
        </div>
      </div>
    );
  }

  // 보호자 정보 입력 화면 (14세 미만)
  if (currentStep === 'guardian-info') {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={handlePrev}>
            ←
          </button>
          <h1 className={styles.headerTitle}>보호자 정보 입력</h1>
        </div>

        <div className={styles.content}>
          <div className={styles.card}>
            <GuardianInfoStep
              formData={formData}
              handleInputChange={handleInputChange}
              validationMessages={validationMessages}
              onNext={handleNext}
            />
          </div>
        </div>
      </div>
    );
  }

  // 어린이 동의 화면 (14세 미만)
  if (currentStep === 'guardian-agreement') {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={handlePrev}>
            ←
          </button>
          <h1 className={styles.headerTitle}>보호자 정보 입력</h1>
        </div>

        <div className={styles.content}>
          <div className={styles.card}>
            <GuardianAgreementStep
              formData={formData}
              handleInputChange={handleInputChange}
              onNext={handleNext}
            />
          </div>
        </div>
      </div>
    );
  }

  // 이메일, 비밀번호, 개인정보 입력 화면
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handlePrev}>
          ←
        </button>
        <h1 className={styles.headerTitle}>회원가입</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          {currentStep === 'email' && (
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

          {currentStep === 'password' && (
            <Step2Password
              formData={formData}
              handleInputChange={handleInputChange}
              validationMessages={validationMessages}
            />
          )}

          {currentStep === 'personal-info' && (
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
            <div className={`${styles.stepDot} ${currentStep === 'email' || currentStep === 'password' || currentStep === 'personal-info' ? styles.active : ''}`}></div>
            <div className={`${styles.stepDot} ${currentStep === 'password' || currentStep === 'personal-info' ? styles.active : ''}`}></div>
            <div className={`${styles.stepDot} ${currentStep === 'personal-info' ? styles.active : ''}`}></div>
          </div>

          <div className={styles.navigationButtons}>
            <button
              className={styles.prevButton}
              onClick={handlePrev}
              disabled={currentStep === 'age-selection'}
            >
              이전
            </button>
            {currentStep === 'personal-info' ? (
              <button 
                className={styles.signupButton} 
                onClick={handleSignup}
                disabled={
                  !validationMessages?.nickname?.isValid ||
                  !validationMessages?.name?.isValid ||
                  !formData.gender ||
                  !validationMessages?.birthDate?.isValid ||
                  !validationMessages?.phone?.isValid ||
                  !validationMessages?.address?.isValid ||
                  !validationMessages?.detailAddress?.isValid ||
                  !formData.agreeToTerms
                }
              >
                가입
              </button>
            ) : (
              <button 
                className={styles.nextButton} 
                onClick={handleNext}
                disabled={
                  (currentStep === 'email' && !isCodeVerified) ||
                  (currentStep === 'password' && (
                    !validationMessages?.password?.isValid || 
                    !validationMessages?.confirmPassword?.isValid
                  ))
                }
              >
                다음
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
