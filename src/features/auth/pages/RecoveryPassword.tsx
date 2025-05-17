import React from 'react';
import RecoveryPasswordForm from '../components/RecoveryPasswordForm';

const RecoveryPassword: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <RecoveryPasswordForm />
      </div>
    </div>
  );
};

export default RecoveryPassword;
