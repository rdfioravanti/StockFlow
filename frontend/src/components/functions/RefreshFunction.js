const refreshTokens = async () => {
    try {
      // Fetch the idToken and refreshToken from localStorage and cookies respectively
      const idToken = localStorage.getItem('idToken');
      const refreshTokenCookie = document.cookie.split('; ').find(row => row.startsWith('refreshToken'));
      const refreshToken = refreshTokenCookie ? refreshTokenCookie.split('=')[1] : null;
  
      // Make a request to the /refresh endpoint in your backend
      const response = await fetch('/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken, refreshToken }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to refresh tokens');
      }
  
      const data = await response.json();
  
      // Check if new tokens are received
      if (data.idToken && data.refreshToken) {
        // Update the tokens in localStorage and cookies
        localStorage.setItem('idToken', data.idToken.encryptedToken);
        document.cookie = `refreshToken=${data.refreshToken.encryptedToken}; Secure; HttpOnly`;
        console.log('Tokens refreshed successfully');
      } else {
        // Tokens could not be refreshed or are invalid
        // Delete the old tokens from localStorage and cookies
        localStorage.removeItem('idToken');
        document.cookie = 'refreshToken=; Max-Age=0; Secure; HttpOnly';
        console.error('Failed to refresh tokens');
      }
    } catch (error) {
      console.error('Error refreshing tokens:', error.message);
      // Handle error, e.g., redirect to login page or display error message
    }
  };
  
  export default refreshTokens;
  