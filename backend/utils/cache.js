// In-Memory Cache Store for 50k+ Concurrent Customer Scaling
let cachedSettings = null;
let cachedProducts = null;
const cachedProductDetails = new Map(); // id -> product details JSON

// Invalidation helpers
const invalidateSettingsCache = () => {
  cachedSettings = null;
};
const invalidateProductsCache = (id = null) => {
  cachedProducts = null;
  if (id) {
    cachedProductDetails.delete(id);
  } else {
    cachedProductDetails.clear();
  }
};

export const setCachedSettings = (val) => { cachedSettings = val; };
export const setCachedProducts = (val) => { cachedProducts = val; };

export { cachedSettings, cachedProducts, cachedProductDetails, invalidateSettingsCache, invalidateProductsCache };
