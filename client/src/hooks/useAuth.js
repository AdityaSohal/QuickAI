import { useAuth as useClerkAuth } from '@clerk/clerk-react';

export const useAuth = () => {
  const { getToken, isSignedIn, user } = useClerkAuth();

  const getAuthToken = async () => {
    try {
      if (!isSignedIn) {
        throw new Error('User not authenticated');
      }
      return await getToken();
    } catch (error) {
      console.error('Error getting auth token:', error);
      throw error;
    }
  };

  return {
    getToken: getAuthToken,
    isSignedIn,
    user
  };
}; 