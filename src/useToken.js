import { useState, useEffect } from 'react';
import axios from 'axios'

const setHeaderToken = (token) => {
  axios.defaults.headers.common = {'Authorization': token ? `Bearer ${token}`: ''}
}

export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);

    return userToken
  };

  const [token, setToken] = useState(getToken());

  useEffect(() => {
    setHeaderToken(token);
  }, [token])

  const saveToken = userToken => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken);
  };

  return {
    setToken: saveToken,
    token
  }
}