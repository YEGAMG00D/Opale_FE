import React from 'react';
import styles from './ErrorPage.module.css';

const ErrorPage = () => {
  return (
    <div className={styles.container}>
      <h1>오류 페이지</h1>
      <p>페이지를 찾을 수 없습니다.</p>
    </div>
  );
};

export default ErrorPage;
