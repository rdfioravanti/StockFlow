const refreshTokens = async () => {
  try {
    // Fetch the idToken and refreshToken from localStorage and cookies respectively
    let idToken = localStorage.getItem('idToken');
    let refreshTokenCookie = document.cookie.split('; ').find(row => row.startsWith('refreshToken'));
    let refreshToken = refreshTokenCookie ? refreshTokenCookie.split('=')[1] : null;

    // Make a request to the /refresh endpoint in your backend
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/refresh`, {
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
      document.cookie = `refreshToken=${data.refreshToken.encryptedToken}; Secure; SameSite=None`;
      console.log('Tokens refreshed successfully');
    } else {
      // Tokens could not be refreshed or are invalid
      throw new Error('Failed to refresh tokens');
    }
  } catch (error) {
    console.error('Error refreshing tokens:', error.message);
    
    // Delete the old tokens from localStorage and cookies
    localStorage.removeItem('idToken');
    document.cookie = 'refreshToken=; Max-Age=0; Secure; SameSite=None';

    // Handle error, e.g., redirect to login page or display error message
  }
};

export { refreshTokens };
