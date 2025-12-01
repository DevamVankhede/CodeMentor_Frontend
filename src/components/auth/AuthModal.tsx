import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Github,
  Chrome,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { authAPI } from '@/lib/auth';

/**
 * TYPE DEFINITIONS
 */
interface InputFieldProps {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: LucideIcon;
  error?: string;
}

interface SocialButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}

interface AuthPortalProps {
  isOpen?: boolean;
  onClose?: () => void;
  defaultMode?: 'login' | 'signup';
}



/**
 * UI COMPONENTS
 */

const InputField = React.forwardRef<HTMLDivElement, InputFieldProps>(({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
  error
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div ref={ref} className="space-y-1">
      <label className={`text-[10px] uppercase font-bold tracking-wider transition-colors duration-200 ${error ? 'text-rose-400' : isFocused ? 'text-indigo-400' : 'text-slate-400'
        }`}>
        {label}
      </label>
      <div className="relative group">
        <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${isFocused ? 'text-indigo-400' : 'text-slate-500'
          }`}>
          <Icon size={16} />
        </div>

        <input
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full bg-slate-800/50 text-slate-100 pl-9 pr-9 py-2.5 rounded-xl border transition-all duration-300 outline-none text-sm
            ${error
              ? 'border-rose-500/50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
              : 'border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-slate-600'
            }
            placeholder:text-slate-600 font-medium
          `}
          placeholder={placeholder}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-1.5 text-rose-400 text-[10px] font-medium pl-1"
          >
            <AlertCircle size={10} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
InputField.displayName = "InputField";

const SocialButton: React.FC<SocialButtonProps> = ({ icon: Icon, label, onClick, isLoading, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled || isLoading}
    className="flex-1 flex items-center justify-center gap-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 py-2 rounded-xl transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {isLoading ? (
      <Loader2 size={16} className="animate-spin text-indigo-400" />
    ) : (
      <>
        <Icon size={16} className="group-hover:scale-110 transition-transform" />
        <span className="text-xs font-medium">{label}</span>
      </>
    )}
  </button>
);

/**
 * MAIN APP COMPONENT
 */
export default function AuthPortal({ isOpen = true, onClose = () => console.log('Close clicked'), defaultMode = 'login' }: AuthPortalProps) {
  const [isLogin, setIsLogin] = useState(defaultMode === 'login');
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'github' | 'google' | null>(null);
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  // Form State - MUST be before any conditional returns
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Update mode when defaultMode changes
  React.useEffect(() => {
    setIsLogin(defaultMode === 'login');
  }, [defaultMode]);

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setErrors({});
    setSuccess('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!isLogin && !formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Must be at least 6 characters";

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Login failed');
        }

        const data = await response.json();
        localStorage.setItem('auth_token', data.token);

        setSuccess('Welcome back! Redirecting...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Signup failed');
        }

        const data = await response.json();
        localStorage.setItem('auth_token', data.token);

        setSuccess('Account created successfully!');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      }
    } catch (err) {
      const error = err as Error;
      setErrors({ form: error.message || "Authentication failed" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    if (socialLoading || isLoading) return;

    setSocialLoading(provider);
    setErrors({});

    try {
      // Implement OAuth flow with your backend
      setErrors({ form: `${provider} login coming soon!` });
    } catch (err) {
      setErrors({ form: `${provider} login failed` });
    } finally {
      setSocialLoading(null);
    }
  };

  // Background Animation Variants
  const backgroundVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 90, 0],
      opacity: [0.3, 0.5, 0.3],
      transition: {
        duration: 15,
        repeat: Infinity as number,
        ease: "linear" as const
      }
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-y-auto font-sans selection:bg-indigo-500/30 text-slate-200">

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          variants={backgroundVariants}
          animate="animate"
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-indigo-600/20 rounded-full blur-[100px]"
        />
        <motion.div
          variants={backgroundVariants}
          animate="animate"
          className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] bg-purple-600/10 rounded-full blur-[100px]"
          style={{ animationDelay: '-5s' }}
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* Main Card */}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[380px] relative z-10 my-auto"
      >
        <div className="bg-card border border-border shadow-2xl rounded-2xl overflow-hidden relative">

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full text-slate-500 hover:text-white hover:bg-white/10 transition-all duration-200 z-20"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="p-5 pb-0 text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 mb-3 shadow-lg shadow-indigo-500/30"
            >
              <User className="text-white" size={20} />
            </motion.div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-indigo-100 to-indigo-200 bg-clip-text text-transparent mb-1">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-400 text-xs">
              {isLogin
                ? 'Enter your credentials to access your account'
                : 'Join us today and start your journey'}
            </p>
          </div>

          {/* Form */}
          <div className="p-5">
            <form onSubmit={handleSubmit} className="space-y-3">
              <AnimatePresence mode="popLayout">
                {/* Form Error Message */}
                {errors.form && (
                  <motion.div
                    key="form-error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2"
                  >
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    {errors.form}
                  </motion.div>
                )}

                {/* Success Message */}
                {success && (
                  <motion.div
                    key="success-message"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2"
                  >
                    <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                    {success}
                  </motion.div>
                )}

                {!isLogin && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                  >
                    <InputField
                      label="Full Name"
                      placeholder="John Doe"
                      icon={User}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      error={errors.name}
                    />
                  </motion.div>
                )}

                <motion.div key="email-field">
                  <InputField
                    label="Email Address"
                    type="email"
                    placeholder="name@company.com"
                    icon={Mail}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={errors.email}
                  />
                </motion.div>

                <motion.div key="password-field">
                  <InputField
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    icon={Lock}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    error={errors.password}
                  />
                </motion.div>

                {!isLogin && (
                  <motion.div
                    key="confirm-field"
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    className="pt-2"
                  >
                    <InputField
                      label="Confirm Password"
                      type="password"
                      placeholder="••••••••"
                      icon={Lock}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      error={errors.confirmPassword}
                    />
                  </motion.div>
                )}

                {isLogin && (
                  <motion.div key="forgot-password" className="flex justify-end -mt-1">
                    <button type="button" className="text-[10px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                      Forgot password?
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isLoading || !!success || !!socialLoading}
                className="group relative w-full flex items-center justify-center gap-2 py-2.5 px-8 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2 overflow-hidden text-sm"
              >
                {/* Button Shine Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />

                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700/50"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-[#0f172a] bg-opacity-95 px-2 text-slate-500 tracking-wider">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pb-1">
                <SocialButton
                  icon={Github}
                  label="Github"
                  onClick={() => handleSocialLogin('github')}
                  isLoading={socialLoading === 'github'}
                  disabled={isLoading || !!success || (!!socialLoading && socialLoading !== 'github')}
                />
                <SocialButton
                  icon={Chrome}
                  label="Google"
                  onClick={() => handleSocialLogin('google')}
                  isLoading={socialLoading === 'google'}
                  disabled={isLoading || !!success || (!!socialLoading && socialLoading !== 'google')}
                />
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="p-4 bg-salate-900/50 border-t border-slate-700/50 text-center">
            <p className="text-xs text-slate-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={toggleMode}
                className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}