import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router';

interface SignUpPageProps {
  onNavigateToLogin?: () => void;
  onSignUpSuccess?: (name: string, email: string) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onNavigateToLogin,
  onSignUpSuccess,
}) => {
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!agreedToTerms) {
      setError('You must accept the terms of service.');
      return;
    }

    setIsLoading(true);

    // Simulate Registration Request
    setTimeout(() => {
      setIsLoading(false);
      if (onSignUpSuccess) {
        onSignUpSuccess(fullName, email);
      } else {
        alert(`Account created successfully for ${fullName}`);
      }
    }, 1200);
  };

  return (
    <div className='min-h-screen bg-[#FFFFFF] text-[#171A20] font-sans flex flex-col justify-between p-6 sm:p-10'>
      {/* Top Brand Logo Header */}
      <header className='w-full max-w-md mx-auto flex justify-center items-center py-2'>
        <span className='text-[17px] font-medium tracking-tight text-[#171A20]'>
          Growth OS
        </span>
      </header>

      {/* Main Sign Up Card Form */}
      <main className='w-full max-w-[400px] mx-auto my-auto space-y-8 animate-fadeIn'>
        <div className='space-y-2 text-center sm:text-left'>
          <h1 className='text-3xl font-semibold tracking-tight text-[#171A20]'>
            Create Account
          </h1>
          <p className='text-sm text-[#5C5E62]'>
            Start tracking habits, notes, and goals with your private OS.
          </p>
        </div>

        {error && (
          <div className='p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Full Name Input */}
          <div className='space-y-1.5'>
            <label
              htmlFor='fullName'
              className='block text-xs font-semibold uppercase tracking-wider text-[#5C5E62]'
            >
              Full Name
            </label>
            <input
              id='fullName'
              type='text'
              required
              placeholder='Alex Morgan'
              value={fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFullName(e.target.value)
              }
              className='w-full h-11 bg-[#F4F4F4] border border-transparent rounded-lg px-4 text-sm text-[#171A20] placeholder-[#5C5E62]/60 focus:bg-white focus:border-[#171A20] focus:outline-none transition-all duration-200'
            />
          </div>

          {/* Email Input */}
          <div className='space-y-1.5'>
            <label
              htmlFor='signUpEmail'
              className='block text-xs font-semibold uppercase tracking-wider text-[#5C5E62]'
            >
              Email Address
            </label>
            <input
              id='signUpEmail'
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

          {/* Password Input */}
          <div className='space-y-1.5'>
            <label
              htmlFor='signUpPassword'
              className='block text-xs font-semibold uppercase tracking-wider text-[#5C5E62]'
            >
              Password
            </label>
            <div className='relative'>
              <input
                id='signUpPassword'
                type={showPassword ? 'text' : 'password'}
                required
                placeholder='At least 8 characters'
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

          {/* Terms Checkbox */}
          <div className='flex items-start gap-3 pt-2'>
            <input
              id='terms'
              type='checkbox'
              checked={agreedToTerms}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAgreedToTerms(e.target.checked)
              }
              className='mt-1 w-4 h-4 rounded border-[#D0D1D2] text-[#171A20] focus:ring-[#171A20] cursor-pointer'
            />
            <label
              htmlFor='terms'
              className='text-xs text-[#5C5E62] leading-tight cursor-pointer'
            >
              I agree to the{' '}
              <a href='#terms' className='text-[#171A20] underline'>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href='#privacy' className='text-[#171A20] underline'>
                Privacy Policy
              </a>
              .
            </label>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={isLoading}
            className='w-full h-11 bg-[#171A20] hover:bg-[#393C41] active:bg-[#2D58CC] text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 mt-2'
          >
            {isLoading ? (
              <span className='inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin' />
            ) : (
              <>
                <span>Get Started</span>
                <CheckCircle2 className='w-4 h-4' />
              </>
            )}
          </button>
        </form>

        {/* Navigation Link to Login */}
        <p className='text-center text-xs text-[#5C5E62]'>
          Already have an account?{' '}
          <Link
            to='/login'
            className='text-[#3E6AE1] hover:underline font-medium cursor-pointer'
          >
            Sign In
          </Link>
        </p>
      </main>

      {/* Footer Minimal Notice */}
      <footer className='w-full max-w-md mx-auto text-center text-xs text-[#5C5E62] py-2'>
        <span>Growth OS Inc. © {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
};

export default SignUpPage;
