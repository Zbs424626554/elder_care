// 检查定位权限状态
export function checkLocationPermission(): Promise<'granted' | 'denied' | 'prompt'> {
  return new Promise((resolve) => {
    if (!navigator.permissions) {
      // 如果不支持权限API，假设需要提示
      resolve('prompt');
      return;
    }

    navigator.permissions.query({ name: 'geolocation' as PermissionName })
      .then(result => {
        resolve(result.state as 'granted' | 'denied' | 'prompt');
      })
      .catch(() => {
        resolve('prompt');
      });
  });
}

export async function getCurrentGeoPoint(): Promise<{ type: 'Point'; coordinates: [number, number] }> {
  return new Promise((resolve, reject) => {
    // 检查浏览器是否支持地理定位
    if (!navigator.geolocation) {
      reject(new Error('浏览器不支持地理定位'));
      return;
    }

    // 快速定位策略：3秒超时，优先使用缓存
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        // 定位成功
        resolve({ type: 'Point', coordinates: [lng, lat] });
      },
      err => {
        let errorMessage = '定位失败';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = '定位权限被拒绝';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = '定位信息不可用';
            break;
          case err.TIMEOUT:
            errorMessage = '定位超时';
            break;
          default:
            errorMessage = `定位失败: ${err.message}`;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: false, // 低精度模式，更快
        timeout: 3000, // 3秒超时，确保快速响应
        maximumAge: 600000 // 允许使用10分钟内的缓存位置
      }
    );
  });
}

// 备用定位方法：使用IP地址定位
export async function getLocationByIP(): Promise<{ type: 'Point'; coordinates: [number, number] }> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();

    if (data.latitude && data.longitude) {
      return { type: 'Point', coordinates: [data.longitude, data.latitude] };
    } else {
      throw new Error('IP定位服务返回无效数据');
    }
  } catch (error) {
    throw new Error('IP定位失败');
  }
}

// 综合定位方法：优先使用GPS，失败时使用IP定位
export async function getLocationWithFallback(): Promise<{ type: 'Point'; coordinates: [number, number] }> {
  try {
    // 首先尝试GPS定位
    return await getCurrentGeoPoint();
  } catch (gpsError) {
    try {
      // GPS失败时使用IP定位
      return await getLocationByIP();
    } catch (ipError) {
      throw new Error(`定位失败: GPS(${gpsError.message}), IP(${ipError.message})`);
    }
  }
}

