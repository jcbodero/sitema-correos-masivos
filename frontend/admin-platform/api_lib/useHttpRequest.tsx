// useHttpRequest.tsx - React hook for HttpRequest with Auth0 integration
import { getAccessToken } from '@auth0/nextjs-auth0';
import { useEffect } from 'react';

import HttpRequest from './HttpRequest.js';

export const useHttpRequest = () => {
  useEffect(() => {
    // Set a mock Auth0 instance for token management
    const mockAuth0 = {
      getAccessTokenSilently: async () => {
        try {
          const { accessToken } = await getAccessToken({});
          console.log("Token, ",accessToken);
          
          return accessToken;
        } catch (error) {
          console.error('Error getting access token:', error);
          return null;
        }
      }
    };
    

  }, []);

  return HttpRequest;
};

export default useHttpRequest;