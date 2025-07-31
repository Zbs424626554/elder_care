// 地理空间工具函数

/**
 * 计算两点之间的距离（米）
 * @param lat1 第一个点的纬度
 * @param lng1 第一个点的经度
 * @param lat2 第二个点的纬度
 * @param lng2 第二个点的经度
 * @returns 距离（米）
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // 地球半径（米）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * 计算指定范围内的点
 * @param centerLat 中心点纬度
 * @param centerLng 中心点经度
 * @param radiusKm 半径（公里）
 * @returns 边界框坐标
 */
export function getBoundingBox(
  centerLat: number,
  centerLng: number,
  radiusKm: number
): {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
} {
  const latDelta = radiusKm / 111.32; // 1度纬度约等于111.32公里
  const lngDelta = radiusKm / (111.32 * Math.cos(centerLat * Math.PI / 180));

  return {
    minLat: centerLat - latDelta,
    maxLat: centerLat + latDelta,
    minLng: centerLng - lngDelta,
    maxLng: centerLng + lngDelta
  };
}

/**
 * 验证坐标是否有效
 * @param lat 纬度
 * @param lng 经度
 * @returns 是否有效
 */
export function isValidCoordinate(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

/**
 * 格式化地址为坐标
 * @param address 地址字符串
 * @returns 坐标对象
 */
export function parseAddress(address: string): {
  province: string;
  city: string;
  district: string;
  formatted: string;
} {
  // 这里可以集成地图API来解析地址
  // 目前返回默认格式
  return {
    province: '',
    city: '',
    district: '',
    formatted: address
  };
}

/**
 * 创建MongoDB地理位置查询
 * @param lat 纬度
 * @param lng 经度
 * @param maxDistance 最大距离（米）
 * @returns MongoDB查询对象
 */
export function createGeoQuery(
  lat: number,
  lng: number,
  maxDistance: number
): any {
  return {
    'location': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        $maxDistance: maxDistance
      }
    }
  };
}

/**
 * 计算推荐分数
 * @param distance 距离（米）
 * @param rating 评分
 * @param responseRate 响应率
 * @returns 推荐分数（0-100）
 */
export function calculateRecommendationScore(
  distance: number,
  rating: number,
  responseRate: number
): number {
  // 距离权重：40%，评分权重：40%，响应率权重：20%
  const distanceScore = Math.max(0, 100 - (distance / 1000) * 10); // 每公里扣10分
  const ratingScore = rating * 20; // 5分制转100分制
  const responseRateScore = responseRate; // 已经是0-100

  return Math.round(
    distanceScore * 0.4 +
    ratingScore * 0.4 +
    responseRateScore * 0.2
  );
} 