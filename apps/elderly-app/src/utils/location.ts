export async function getCurrentGeoPoint(): Promise<{ type: 'Point'; coordinates: [number, number] }> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        resolve({ type: 'Point', coordinates: [lng, lat] });
      },
      err => reject(err),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  });
}

