import { useAuth as useClerkAuth } from '@clerk/clerk-react';

export const useAuth = () => {
  const { getToken, isSignedIn, user } = useClerkAuth();

  /**
   * The function `getAuthToken` checks if the user is signed in and returns an authentication token if
   * they are.
   * @returns The `getAuthToken` function is returning the result of the `getToken()` function if the
   * user is authenticated (signed in). If the user is not signed in, it will throw an error with the
   * message 'User not authenticated'.
   */
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