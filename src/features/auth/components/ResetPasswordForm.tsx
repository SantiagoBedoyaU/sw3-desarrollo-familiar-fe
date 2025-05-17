import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { authService } from '../services/AuthService';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

type ResetPasswordFormInputs = {
  code: string;
  newPassword: string;
  confirmPassword: string;
};

const ResetPasswordForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<ResetPasswordFormInputs>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  let navigate = useNavigate();

  const password = watch('newPassword');

  const onSubmit: SubmitHandler<ResetPasswordFormInputs> = async (data) => {
    setIsSubmitting(true);
    setError('');

    try {
      await authService.resetPassword({
        code: data.code,
        newPassword: data.newPassword
      });
      setIsSuccess(true);
      navigate('/login');
    } catch (err: unknown) {
      if (err instanceof Error && err.message) {
        setError(`Ha ocurrido un error: ${err.message}`);
        void Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message,
          confirmButtonText: 'Aceptar',
        });
      } else {
        setError('Ha ocurrido un error al restablecer la contraseña. Por favor, inténtalo de nuevo.');
      }
      console.error('Error al restablecer la contraseña:', err);

      navigate('/login');
    } finally {
      setIsSubmitting(false)
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Contraseña restablecida</h2>
        <p className="text-gray-600 mb-6">
          Tu contraseña ha sido restablecida exitosamente.
          Ahora puedes iniciar sesión con tu nueva contraseña.
        </p>
        <a
          href="/login"
          className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200"
        >
          Ir al inicio de sesión
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Restablecer Contraseña</h2>
      <p className="text-gray-600 mb-6">
        Ingresa el código de verificación que recibiste y tu nueva contraseña.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
            Código de verificación
          </label>
          <input
            id="code"
            type="text"
            {...register('code', {
              required: 'El código es obligatorio',
              pattern: {
                value: /^\d+$/,
                message: 'El código debe contener solo números',
              },
            })}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.code ? 'border-red-300' : 'border-gray-300'}`}
          />
          {errors.code && (
            <p className="mt-1 text-sm text-red-600">
              {errors.code.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Nueva contraseña
          </label>
          <input
            id="newPassword"
            type="password"
            {...register('newPassword', {
              required: 'La nueva contraseña es obligatoria',
              minLength: {
                value: 8,
                message: 'La contraseña debe tener al menos 8 caracteres',
              },
            })}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.newPassword ? 'border-red-300' : 'border-gray-300'}`}
          />
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword', {
              required: 'Debes confirmar la contraseña',
              validate: value => value === password || 'Las contraseñas no coinciden',
            })}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'}`}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2
            ${isSubmitting
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Procesando...' : 'Restablecer contraseña'}
        </button>

        <div className="text-center mt-4">
          <a href="/login" className="text-blue-600 hover:text-blue-800 text-sm">
            Volver al inicio de sesión
          </a>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
