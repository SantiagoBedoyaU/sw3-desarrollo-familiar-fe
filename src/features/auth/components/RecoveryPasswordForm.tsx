import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { authService } from '../services/AuthService';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

type RecoveryPasswordFormInputs = {
  email: string;
};

const checkBackendMessage = (err: unknown): string | null => {
  if (
    typeof err === 'object' &&
    err !== null &&
    'response' in err &&
    typeof err.response === 'object' &&
    err.response !== null &&
    'data' in err.response &&
    typeof err.response.data === 'object' &&
    err.response.data !== null &&
    'message' in err.response.data
  ) {
    const msg = err.response.data.message;
    return typeof msg === 'string' ? msg : JSON.stringify(msg);
  }
  if (typeof err === 'object' && err !== null && 'message' in err) {
    const msg = err.message;
    return typeof msg === 'string' ? msg : JSON.stringify(msg);
  }
  if (typeof err === 'string') {
    return err;
  }
  return null;
};

const RecoveryPasswordForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RecoveryPasswordFormInputs>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  let navigate = useNavigate();


  const onSubmit: SubmitHandler<RecoveryPasswordFormInputs> = async (data) => {
    setIsSubmitting(true);
    setError('');

    try {
      await authService.sendPasswordRecoveryEmail(data.email);

      setIsSuccess(true);
      navigate('/restablecer-contraseña');
    } catch (err: unknown) {
      console.error('Error al enviar el correo de recuperación:', err);
      const backendMessage = checkBackendMessage(err);
      if (backendMessage) {
        setError(`Ha ocurrido un error: ${backendMessage}`);
        void Swal.fire({
          icon: 'error',
          title: 'Error',
          text: backendMessage,
          confirmButtonText: 'Aceptar',
        });
      } else {
        setError('Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.');
      }
      navigate('/restablecer-contraseña');

    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Correo enviado</h2>
        <p className="text-gray-600 mb-6">
          Hemos enviado un correo para recuperar tu contraseña.
          Por favor, revisa tu bandeja de entrada.
        </p>
        <a
          href="/login"
          className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200"
        >
          Volver al inicio de sesión
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Recuperar Contraseña</h2>
      <p className="text-gray-600 mb-6">
        Ingresa tu correo electrónico y te enviaremos un código para restablecer tu contraseña.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'El correo electrónico es obligatorio',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Dirección de correo electrónico inválida',
              },
            })}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.email.message}
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
          {isSubmitting ? 'Enviando...' : 'Enviar código de recuperación'}
        </button>

        <div className="text-center mt-4 flex flex-col gap-4 ">
          <p>
            <a href="/login" className="text-blue-600 hover:text-blue-800 text-sm underline hover:no-underline bg-blue-50 py-2 px-4 rounded-2xl">
              Volver al inicio de sesión
            </a>
          </p>
          <p>
            <a href="/restablecer-contraseña" className="text-sm font-medium text-primary-600 hover:no-underline dark:text-primary-500 underline bg-blue-50 py-2 px-4 rounded-2xl">Restablece tu contraseña con el código de tu correo</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RecoveryPasswordForm;
