import React from 'react';

const LaunchingPage = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100vw',
      height: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
      textAlign: 'center',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '800px',
        width: '90%',
        padding: '4rem 3rem',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        border: '1px solid #e9ecef'
      }}>
        <div style={{
          fontSize: '8rem',
          marginBottom: '2rem',
          color: '#6c757d',
          lineHeight: '1'
        }}>
          ⚪
        </div>
        
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '700',
          background: 'linear-gradient(45deg, #ff9a9e, #fecfef, #fecfef, #a8edea, #fed6e3)',
          backgroundSize: '300% 300%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '0.2rem',
          lineHeight: '1.2',
          animation: 'gradientShift 3s ease-in-out infinite',
          padding: '0.5rem 0'
        }}>
          Comming Soon
        </h1>
        
        <p style={{
          fontSize: '1.4rem',
          color: '#6c757d',
          marginBottom: '2.5rem',
          lineHeight: '1.6'
        }}>
          더 나은 서비스를 위해 열심히 준비하고 있습니다.
        </p>
        
        <div style={{
          fontSize: '1.1rem',
          color: '#b8c5d1',
          marginBottom: '0.5rem',
          lineHeight: '1.5',
          fontStyle: 'italic',
          maxWidth: '900px',
          textAlign: 'center'
        }}>
          {/* 여기에 사이트 설명을 작성해주세요 */}
          Discover, explore, and connect with the world of performances<br />
          — all in one place with Opale.
        </div>
        
        <div style={{
          fontSize: '1.1rem',
          color: '#adb5bd',
          fontWeight: '500'
        }}>
          YEGAM
        </div>
      </div>
      
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default LaunchingPage;
