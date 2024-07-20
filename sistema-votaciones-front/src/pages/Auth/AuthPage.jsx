import React, { useState } from 'react';
import { Login } from '../../components/Login/Login';
import { Register } from '../../components/Register/Register';
import './AuthPage.css';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleAuthPage = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div className="auth-container">
      {isLogin ? (
        <Login switchAuthHandler={handleAuthPage} />
      ) : (
        <Register switchAuthHandler={handleAuthPage} />
      )}
    </div>
  );
};
