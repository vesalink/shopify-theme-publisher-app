import axios from 'axios';

const cachedFetch = payload_url => {
  try {
    const cached = sessionStorage.getItem(payload_url);
    if (cached !== null) {
      return Promise.resolve({
        status: 200,
        data: JSON.parse(cached),
        stored: true
      });
    }
  } catch (e) {
    // oops
  }
  return axios({
    method: 'get',
    url: payload_url,
    headers: []
  });
};

const pushCache = (key, cache_data) => {
  try {
    if (!cache_data.stored) {
      sessionStorage.setItem(key, JSON.stringify(cache_data.data));
    }
  } catch (e) {
    // oops
  }
};

const refreshCache = refresh_key => {
  try {
    Object.keys(sessionStorage).forEach(key => {
      if (key.indexOf(refresh_key) !== -1) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (e) {
    // oops
  }
};

export { cachedFetch, pushCache, refreshCache };
