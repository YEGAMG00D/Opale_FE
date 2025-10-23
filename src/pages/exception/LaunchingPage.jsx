import React from 'react';

const LaunchingPage = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'Pretendard Variable, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      textAlign: 'center',
      margin: 0,
      padding: '2rem 1.5rem',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '380px',
        padding: '3rem 2rem',
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e9ecef'
      }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: '1.5rem',
          color: '#6c757d',
          lineHeight: '1'
        }}>
          ⚪
        </div>
        
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: '700',
          background: 'linear-gradient(45deg, #ff9a9e, #fecfef, #fecfef, #a8edea, #fed6e3)',
          backgroundSize: '300% 300%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '0.5rem',
          lineHeight: '1.2',
          animation: 'gradientShift 3s ease-in-out infinite',
          padding: '0.3rem 0'
        }}>
          Comming Soon
        </h1>
        
        <p style={{
          fontSize: '1rem',
          color: '#6c757d',
          marginBottom: '2rem',
          lineHeight: '1.5'
        }}>
          더 나은 서비스를 위해 열심히 준비하고 있습니다.
        </p>
        
        <div style={{
          fontSize: '0.9rem',
          color: '#b8c5d1',
          marginBottom: '1rem',
          lineHeight: '1.4',
          fontStyle: 'italic'
        }}>
          Discover, explore, and connect with the world of performances<br />
          — all in one place with Opale.
        </div>
        
        <div style={{
          fontSize: '0.9rem',
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
