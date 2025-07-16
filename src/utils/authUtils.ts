const getTokens = () => {
  const authToken = localStorage.getItem('authToken');
  const refreshToken = localStorage.getItem('refreshToken');
  return { authToken, refreshToken };
}

const storeTokens = (authToken: string, refreshToken: string) => {
  localStorage.setItem('authToken', authToken);
  localStorage.setItem('refreshToken', refreshToken);
};  

const clearTokens = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
};


const ApiMethods = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
}

export { getTokens, storeTokens, clearTokens, ApiMethods };