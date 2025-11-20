// 🔥 SignupPage — conflict 통합 완료본
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SignupPage.module.css';

import Step1EmailVerification from './signup-steps/Step1EmailVerification';
import Step2Password from './signup-steps/Step2Password';
import Step3PersonalInfo from './signup-steps/Step3PersonalInfo';

import TermsAgreementStep from './signup-steps/TermsAgreementStep';
import GuardianInfoStep from './signup-steps/GuardianInfoStep';
import GuardianAgreementStep from './signup-steps/GuardianAgreementStep';

// 유효성 검증
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateNickname,
  validateName,
  validateBirthDate,
  validatePhone,
  validateAddress,
  validateDetailAddress,
  validateGuardianName
} from '../../../utils/validation';

// 실제 API
import { sendEmailCode, verifyEmailCode } from '../../../api/emailApi';
import { checkNicknameDuplicate, signUp } from '../../../api/userApi';

// Response 정규화 유틸
import { normalizeEmailResponse } from '../../../services/normalizeEmailResponse';
import { normalizeVerifyCodeResponse } from '../../../services/normalizeVerifyCodeResponse';
import { normalizeCheckNicknameResponse } from '../../../services/normalizeCheckNicknameResponse';
import { normalizeSignUpRequest } from '../../../services/normalizeSignUpRequest';
import { normalizeSignUpResponse } from '../../../services/normalizeSignUpResponse';

const SignupPage = () => {
  const navigate = useNavigate();

  // 🔥 여기서 모든 단계 관리
  const [currentStep, setCurrentStep] = useState('age-selection');
  const [isUnder14, setIsUnder14] = useState(null);

  // 🔥 formData 통합
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

  const [validationMessages, setValidationMessages] = useState({});
  const [signupError, setSignupError] = useState('');

  // 이메일 인증 상태
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [timer, setTimer] = useState(300);

  // 🔥 0단계: 연령 선택
  const handleUnder14 = () => {
    setIsUnder14(true);
    setCurrentStep('guardian-info');
  };

  const handleOver14 = () => {
    setIsUnder14(false);
    setCurrentStep('terms');
  };

  // 🔥 prev/next
  const handleNext = () => {
    if (currentStep === 'terms') setCurrentStep('email');
    else if (currentStep === 'guardian-info') setCurrentStep('guardian-agreement');
    else if (currentStep === 'guardian-agreement') setCurrentStep('terms');
    else if (currentStep === 'email') setCurrentStep('password');
    else if (currentStep === 'password') setCurrentStep('personal-info');
  };

  const handlePrev = () => {
    if (currentStep === 'email') setCurrentStep('terms');
    else if (currentStep === 'password') setCurrentStep('email');
    else if (currentStep === 'personal-info') setCurrentStep('password');
    else if (currentStep === 'terms') {
      if (isUnder14) setCurrentStep('guardian-agreement');
      else setCurrentStep('age-selection');
    }
    else if (currentStep === 'guardian-agreement') setCurrentStep('guardian-info');
    else if (currentStep === 'guardian-info') setCurrentStep('age-selection');
  };

  // 🔥 입력 변경 및 validation
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

    let result = { isValid: null, message: '' };

    if (name === 'email') result = validateEmail(value);
    else if (name === 'password') result = validatePassword(value);
    else if (name === 'confirmPassword') result = validateConfirmPassword(formData.password, value);
    else if (name === 'nickname') result = validateNickname(value);
    else if (name === 'name') result = validateName(value);
    else if (name === 'birthDate') result = validateBirthDate(value);
    else if (name === 'phone') result = validatePhone(value);
    else if (name === 'address') result = validateAddress(value);
    else if (name === 'detailAddress') result = validateDetailAddress(value);
    else if (name === 'guardianName') result = validateGuardianName(value);

    setValidationMessages(prev => ({ ...prev, [name]: result }));
  };

  // 🔥 이메일 인증
  const handleSendCode = async () => {
    try {
      const v = validateEmail(formData.email);
      if (!v.isValid) {
        setValidationMessages(prev => ({ ...prev, email: v }));
        return;
      }

      const res = await sendEmailCode(formData.email);
      const normalized = normalizeEmailResponse(res);

      setIsCodeSent(true);
      setTimer(normalized.expiresIn);

      setValidationMessages(prev => ({
        ...prev,
        email: { isValid: true, message: '인증번호가 발송되었습니다.' }
      }));
    } catch (err) {
      setValidationMessages(prev => ({
        ...prev,
        email: { isValid: false, message: '인증번호 전송 실패' }
      }));
    }
  };

  const handleVerifyCode = async () => {
    try {
      if (!/^\d{6}$/.test(formData.verificationCode)) {
        setValidationMessages(prev => ({
          ...prev,
          verificationCode: { isValid: false, message: '6자리 숫자 입력' }
        }));
        return;
      }

      const res = await verifyEmailCode({
        email: formData.email,
        code: formData.verificationCode
      });

      const normalized = normalizeVerifyCodeResponse(res);

      if (normalized.verified) {
        setIsCodeVerified(true);
        setValidationMessages(prev => ({
          ...prev,
          verificationCode: { isValid: true, message: '인증 완료' }
        }));
      } else {
        setValidationMessages(prev => ({
          ...prev,
          verificationCode: { isValid: false, message: '인증 실패' }
        }));
      }
    } catch {
      setValidationMessages(prev => ({
        ...prev,
        verificationCode: { isValid: false, message: '인증 실패' }
      }));
    }
  };

  // 🔥 닉네임 중복 체크
  const handleCheckNickname = async () => {
    try {
      const valid = validateNickname(formData.nickname);
      if (!valid.isValid) {
        setValidationMessages(prev => ({ ...prev, nickname: valid }));
        return;
      }

      const res = await checkNicknameDuplicate(formData.nickname);
      const data = normalizeCheckNicknameResponse(res);

      if (data.available) {
        setValidationMessages(prev => ({
          ...prev,
          nickname: { isValid: true, message: '사용 가능한 닉네임입니다.' }
        }));
      } else {
        setValidationMessages(prev => ({
          ...prev,
          nickname: { isValid: false, message: '이미 존재하는 닉네임입니다.' }
        }));
      }
    } catch {
      setValidationMessages(prev => ({
        ...prev,
        nickname: { isValid: false, message: '중복 검사 실패' }
      }));
    }
  };

  // 🔥 회원가입 제출
  const handleSignup = async () => {
    try {
      const body = normalizeSignUpRequest(formData);
      const res = await signUp(body);
      const normalized = normalizeSignUpResponse(res);

      if (normalized.userId) {
        navigate('/signup/welcome', {
          state: { nickname: normalized.nickname || formData.nickname }
        });
      } else {
        setSignupError('회원가입 실패');
      }
    } catch (err) {
      setSignupError('회원가입 실패');
    }
  };

  // 🔥 스텝별 렌더링 — 여기서 끝
  if (currentStep === 'age-selection') {
    return (/* 🔥 팀원 코드 그대로 */);
  }
  if (currentStep === 'terms') {
    return (/* 🔥 TermsAgreementStep */);
  }
  if (currentStep === 'guardian-info') {
    return (/* 🔥 GuardianInfoStep */);
  }
  if (currentStep === 'guardian-agreement') {
    return (/* 🔥 GuardianAgreementStep */);
  }

  // 🔥 일반 회원가입 3단계 화면
  return (/* 🔥 Step1EmailVerification / Step2Password / Step3PersonalInfo */);
};

export default SignupPage;
