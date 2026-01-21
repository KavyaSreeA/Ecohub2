import { useCallback } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { config } from '../config/config';

interface ReCaptchaConfig {
  enabled: boolean;
  fallbackOnError?: boolean;
  siteKey: string;
  secretKey: string;
}

export const useReCaptcha = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const recaptchaConfig = config.security.recaptcha as ReCaptchaConfig;

  const verifyReCaptcha = useCallback(
    async (action: string): Promise<{ token: string | null; shouldProceed: boolean }> => {
      // Skip if reCAPTCHA is disabled
      if (!recaptchaConfig.enabled) {
        console.log('[reCAPTCHA] Disabled, skipping verification');
        return { token: 'disabled', shouldProceed: true };
      }

      // If reCAPTCHA not ready but fallback is enabled
      if (!executeRecaptcha) {
        console.warn('[reCAPTCHA] Not ready yet');
        if (recaptchaConfig.fallbackOnError) {
          console.log('[reCAPTCHA] Fallback enabled, proceeding without verification');
          return { token: null, shouldProceed: true };
        }
        return { token: null, shouldProceed: false };
      }

      try {
        const token = await executeRecaptcha(action);
        console.log(`[reCAPTCHA] Token generated for action: ${action}`);
        return { token, shouldProceed: true };
      } catch (error) {
        console.error('[reCAPTCHA] Error:', error);
        // If fallback is enabled, allow proceeding even on error
        if (recaptchaConfig.fallbackOnError) {
          console.log('[reCAPTCHA] Fallback enabled, proceeding despite error');
          return { token: null, shouldProceed: true };
        }
        return { token: null, shouldProceed: false };
      }
    },
    [executeRecaptcha, recaptchaConfig]
  );

  // Legacy function for backward compatibility
  const verifyReCaptchaLegacy = useCallback(
    async (action: string): Promise<string | null> => {
      const result = await verifyReCaptcha(action);
      // If fallback is enabled, return a fallback token when verification fails
      if (result.shouldProceed && !result.token) {
        return 'fallback-allowed';
      }
      return result.token;
    },
    [verifyReCaptcha]
  );

  const isReady = !!executeRecaptcha || !recaptchaConfig.enabled || recaptchaConfig.fallbackOnError;

  return { 
    verifyReCaptcha: verifyReCaptchaLegacy, 
    verifyWithFallback: verifyReCaptcha,
    isReady,
    fallbackEnabled: recaptchaConfig.fallbackOnError || false
  };
};
