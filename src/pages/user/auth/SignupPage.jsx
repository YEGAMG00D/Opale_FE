import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SignupPage.module.css';

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
          {/* Step 1: 이메일/인증번호 */}
          {step === 1 && (
            <div className={styles.stepContent}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  이메일 <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWithButton}>
                  <input
                    type="email"
                    name="email"
                    className={styles.input}
                    placeholder="user@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className={styles.smallButton}
                    onClick={handleResendCode}
                  >
                    인증번호 재전송
                  </button>
                </div>
                <p className={styles.successMsg}>인증번호를 전송하였습니다.</p>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  인증번호 <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWithButton}>
                  <input
                    type="text"
                    name="verificationCode"
                    className={styles.input}
                    placeholder="123456"
                    value={formData.verificationCode}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className={styles.smallButton}
                    onClick={handleVerifyCode}
                  >
                    인증번호 확인
                  </button>
                </div>
                <div className={styles.errorContainer}>
                  <p className={styles.errorMsg}>인증번호가 일치하지 않습니다.</p>
                  <span className={styles.timer}>{formatTimer(timer)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: 비밀번호 */}
          {step === 2 && (
            <div className={styles.stepContent}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  비밀번호 <span className={styles.required}>*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  className={styles.input}
                  placeholder="비밀번호는 영문, 숫자, 특수문자를 포함한 8자"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  비밀번호 확인 <span className={styles.required}>*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className={styles.input}
                  placeholder="비밀번호 확인"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <p className={styles.errorMsg}>비밀번호와 일치하지 않습니다.</p>
              </div>
            </div>
          )}

          {/* Step 3: 개인정보 */}
          {step === 3 && (
            <div className={styles.stepContent}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  닉네임 <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWithButton}>
                  <input
                    type="text"
                    name="nickname"
                    className={styles.input}
                    placeholder="2자 이상 10자 이하"
                    value={formData.nickname}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className={styles.smallButton}
                    onClick={handleCheckNickname}
                  >
                    닉네임 중복확인
                  </button>
                </div>
                <p className={styles.successMsg}>사용가능한 닉네임입니다.</p>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  성명 <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className={styles.input}
                  placeholder="Value"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

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

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  생년월일 <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="birthDate"
                  className={styles.input}
                  placeholder="YYYYMMdd"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                />
                <p className={styles.errorMsg}>인증번호가 일치하지 않습니다.</p>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  연락처 <span className={styles.required}>*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  className={styles.input}
                  placeholder="01012341234"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <p className={styles.errorMsg}>인증번호가 일치하지 않습니다.</p>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  주소 <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  className={styles.input}
                  placeholder="Value"
                  value={formData.address}
                  onChange={handleInputChange}
                />
                <p className={styles.errorMsg}>인증번호가 일치하지 않습니다.</p>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  상세주소 <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="detailAddress"
                  className={styles.input}
                  placeholder="Value"
                  value={formData.detailAddress}
                  onChange={handleInputChange}
                />
                <p className={styles.errorMsg}>인증번호가 일치하지 않습니다.</p>
              </div>

              <div className={styles.termsSection}>
                <textarea
                  className={styles.termsText}
                  readOnly
                  value="opale에서는 ~~~할 수 있습니다."
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
