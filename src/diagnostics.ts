import { api } from './services/api';

/**
 * Expose diagnostic tools to window for production debugging
 * Open browser console and run: window.rayyanDiag.checkSupabase()
 */
export const initDiagnostics = async () => {
  // Make API temporarily available to window for diagnostics
  (window as any).rayyanDiag = {
    checkSupabase: api.diagnostic.checkDatabase,
    async getProductCount() {
      try {
        const products = await api.products.getAll();
        console.log(`Total products loaded: ${products.length}`);
        console.log('Sample product:', products[0]);
        return { count: products.length, sample: products[0] };
      } catch (err) {
        console.error('Error loading products:', err);
        return { error: String(err) };
      }
    },
  };

  if (import.meta.env.DEV) {
    console.log('📊 Diagnostics available: window.rayyanDiag.checkSupabase() and window.rayyanDiag.getProductCount()');
  }
};
