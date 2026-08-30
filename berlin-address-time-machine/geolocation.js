export const DEFAULT_GEOLOCATION_OPTIONS = Object.freeze({
  enableHighAccuracy: false,
  timeout: 10000,
  maximumAge: 600000,
});

export class GeolocationError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'GeolocationError';
    this.code = code;
  }
}

export function requestCurrentLocation({
  geolocation = globalThis.navigator?.geolocation,
  options = DEFAULT_GEOLOCATION_OPTIONS,
} = {}) {
  if (!geolocation || typeof geolocation.getCurrentPosition !== 'function') {
    return Promise.reject(new GeolocationError('unavailable', 'Location is not available in this browser.'));
  }
  return new Promise((resolve, reject) => {
    geolocation.getCurrentPosition(resolve, (error) => {
      const code = error?.code === 1 ? 'denied' : error?.code === 2 ? 'unavailable' : error?.code === 3 ? 'timeout' : 'unknown';
      reject(new GeolocationError(code, 'The browser did not provide a location.'));
    }, options);
  });
}
