import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { loginRequest } from '~/lib/auth';

interface LoginPageProps {
  onNavigateToSignUp?: () => void;
  onLoginSuccess?: (email: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateToSignUp,
  onLoginSuccess,
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      await loginRequest(email, password);
      if (onLoginSuccess) onLoginSuccess(email);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-[#FFFFFF] text-[#171A20] font-sans flex flex-col justify-between p-6 sm:p-10'>
      {/* Top Brand Logo Header */}
      <header className='w-full max-w-md mx-auto flex justify-center items-center py-2'>
        <span className='text-[17px] font-medium tracking-tight text-[#171A20]'>
          Growth OS
        </span>
      </header>

      {/* Main Login Card Form */}
      <main className='w-full max-w-[400px] mx-auto my-auto space-y-8 animate-fadeIn'>
        <div className='space-y-2 text-center sm:text-left'>
          <h1 className='text-3xl font-semibold tracking-tight text-[#171A20]'>
            Sign In
          </h1>
          <p className='text-sm text-[#5C5E62]'>
            Enter your credentials to access your personal workspace.
          </p>
        </div>

        {error && (
          <div className='p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-5'>
          {/* Email Input Field */}
          <div className='space-y-1.5'>
            <label
              htmlFor='email'
              className='block text-xs font-semibold uppercase tracking-wider text-[#5C5E62]'
            >
              Email Address
            </label>
            <input
              id='email'
              type='email'
              required
              placeholder='name@domain.com'
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              className='w-full h-11 bg-[#F4F4F4] border border-transparent rounded-lg px-4 text-sm text-[#171A20] placeholder-[#5C5E62]/60 focus:bg-white focus:border-[#171A20] focus:outline-none transition-all duration-200'
            />
          </div>

          {/* Password Input Field */}
          <div className='space-y-1.5'>
            <div className='flex justify-between items-center'>
              <label
                htmlFor='password'
                className='block text-xs font-semibold uppercase tracking-wider text-[#5C5E62]'
              >
                Password
              </label>
              <button
                type='button'
                className='text-xs text-[#3E6AE1] hover:underline'
                onClick={() => alert('Password reset link sent!')}
              >
                Forgot?
              </button>
            </div>

            <div className='relative'>
              <input
                id='password'
                type={showPassword ? 'text' : 'password'}
                required
                placeholder='••••••••'
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                className='w-full h-11 bg-[#F4F4F4] border border-transparent rounded-lg pl-4 pr-11 text-sm text-[#171A20] placeholder-[#5C5E62]/60 focus:bg-white focus:border-[#171A20] focus:outline-none transition-all duration-200'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5C5E62] hover:text-[#171A20] transition-colors'
                aria-label='Toggle password visibility'
              >
                {showPassword ? (
                  <EyeOff className='w-4 h-4' />
                ) : (
                  <Eye className='w-4 h-4' />
                )}
              </button>
            </div>
          </div>

          {/* Primary Submit Button */}
          <button
            type='submit'
            disabled={isLoading}
            className='w-full h-11 bg-[#171A20] hover:bg-[#393C41] active:bg-[#2D58CC] text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50'
          >
            {isLoading ? (
              <span className='inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin' />
            ) : (
              <>
                
                  <span>Sign In</span>
                  <ArrowRight className='w-4 h-4' />
                
              </>
            )}
          </button>
        </form>

        {/* Divider & Social Sign In */}
        <div className='space-y-4 pt-2'>
          <div className='relative flex items-center justify-center'>
            <div className='w-full border-t border-[#EEEEEE]' />
            <span className='absolute bg-white px-3 text-[11px] font-semibold text-[#5C5E62] uppercase tracking-wider'>
              Or continue with
            </span>
          </div>

          <button
            type='button'
            onClick={() => alert('Google authentication initiated')}
            className='w-full h-11 bg-white border border-[#D0D1D2] hover:border-[#171A20] text-[#171A20] rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2'
          >
            <svg className='w-4 h-4' viewBox='0 0 24 24'>
              <path
                fill='#4285F4'
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
              />
              <path
                fill='#34A853'
                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
              />
              <path
                fill='#FBBC05'
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z'
              />
              <path
                fill='#EA4335'
                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z'
              />
            </svg>
            <span>Google</span>
          </button>
          {/* Navigation Link to Login */}
          <p className='text-center text-xs text-[#5C5E62]'>
            Don't have an account?{' '}
            <Link
              to='/signup'
              className='text-[#3E6AE1] hover:underline font-medium cursor-pointer'
            >
              Sign Up
            </Link>
          </p>
        </div>
      </main>

      {/* Footer Minimal Notice */}
      <footer className='w-full max-w-md mx-auto text-center text-xs text-[#5C5E62] py-2'>
        <span>Growth OS Inc. © {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
};

export default LoginPage;
