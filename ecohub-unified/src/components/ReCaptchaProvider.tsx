import { ReactNode } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { config } from '../config/config';

interface ReCaptchaProviderProps {
  children: ReactNode;
}

const ReCaptchaProvider = ({ children }: ReCaptchaProviderProps) => {
  // Only wrap with provider if reCAPTCHA is enabled
  if (!config.security.recaptcha.enabled) {
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={config.security.recaptcha.siteKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
      }}
      container={{
        parameters: {
          badge: 'bottomright',
          theme: 'light',
        },
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};

export default ReCaptchaProvider;
