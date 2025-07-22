import React from 'react';

const LoginButton: React.FC = () => {
  const handleLogin = () => {
    window.location.href = 'https://api.logansinclairdevelopment.com/auth/google';
  };

  return (
    <button onClick={handleLogin}>
      Login with Google
    </button>
  );
};

export default LoginButton; 