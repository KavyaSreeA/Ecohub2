import { useCallback } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { config } from '../config/config';

export const useReCaptcha = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const verifyReCaptcha = useCallback(
    async (action: string): Promise<string | null> => {
      // Skip if reCAPTCHA is disabled
      if (!config.security.recaptcha.enabled) {
        console.log('[reCAPTCHA] Disabled, skipping verification');
        return 'disabled';
      }

      if (!executeRecaptcha) {
        console.warn('[reCAPTCHA] Not ready yet');
        return null;
      }

      try {
        const token = await executeRecaptcha(action);
        console.log(`[reCAPTCHA] Token generated for action: ${action}`);
        return token;
      } catch (error) {
        console.error('[reCAPTCHA] Error:', error);
        return null;
      }
    },
    [executeRecaptcha]
  );

  return { verifyReCaptcha, isReady: !!executeRecaptcha || !config.security.recaptcha.enabled };
};
