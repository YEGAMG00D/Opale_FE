/**
 * 사용자의 현재 GPS 위치를 가져오는 함수
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('GPS를 지원하지 않는 브라우저입니다.'));
      return;
    }

    const options = {
      enableHighAccuracy: true, // 높은 정확도 사용
      timeout: 10000, // 10초 타임아웃
      maximumAge: 0, // 캐시 사용 안 함
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('✅ GPS 위치 획득:', { latitude, longitude });
        resolve({ latitude, longitude });
      },
      (error) => {
        let errorMessage = '위치 정보를 가져올 수 없습니다.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '위치 정보 사용 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '위치 정보를 사용할 수 없습니다.';
            break;
          case error.TIMEOUT:
            errorMessage = '위치 정보 요청 시간이 초과되었습니다.';
            break;
        }
        
        console.error('❌ GPS 위치 획득 실패:', errorMessage);
        reject(new Error(errorMessage));
      },
      options
    );
  });
};

/**
 * 기본 위치 (서울 시청) 반환
 * GPS를 사용할 수 없을 때 사용
 */
export const getDefaultLocation = () => {
  return {
    latitude: 37.5665,
    longitude: 126.9780,
  };
};

