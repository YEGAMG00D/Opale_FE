import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SignupPage.module.css';
import Step1EmailVerification from './signup-steps/Step1EmailVerification';
import Step2Password from './signup-steps/Step2Password';
import Step3PersonalInfo from './signup-steps/Step3PersonalInfo';

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
  const [timer, setTimer] = useState(300); // 5분 타이머

  const handleUnder14 = () => {
    console.log('Under 14 signup');
  };

  const handleOver14 = () => {
    console.log('Over 14 signup');
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
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleResendCode = () => {
    console.log('Resend verification code');
    setTimer(300);
  };

  const handleVerifyCode = () => {
    console.log('Verify code');
  };

  const handleCheckNickname = () => {
    console.log('Check nickname duplication');
  };

  const handleSignup = () => {
    console.log('Signup', formData);
    navigate('/signup/welcome', { state: { nickname: formData.nickname || '닉네임' } });
  };

  // 타이머 효과
  React.useEffect(() => {
    if (step === 1 && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

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
              handleResendCode={handleResendCode}
              handleVerifyCode={handleVerifyCode}
              timer={timer}
              formatTimer={formatTimer}
            />
          )}

          {step === 2 && (
            <Step2Password
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}

          {step === 3 && (
            <Step3PersonalInfo
              formData={formData}
              handleInputChange={handleInputChange}
              handleCheckNickname={handleCheckNickname}
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
              disabled={step === 1}
            >
              이전
            </button>
            {step < 3 ? (
              <button className={styles.nextButton} onClick={handleNext}>
                다음
              </button>
            ) : (
              <button className={styles.signupButton} onClick={handleSignup}>
                가입
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
