import React from 'react';
import ResetPasswordForm from '../components/ResetPasswordForm';

const ResetPassword: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ResetPassword;
