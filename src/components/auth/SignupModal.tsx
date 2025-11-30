import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  X,
} from "lucide-react";

/**
 * MOCK AUTH CONTEXT
 * Simulates backend logic for demonstration purposes.
 */
const useAuth = () => {
  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "demo@example.com" && password === "password") {
          resolve({ user: { name: "Demo User", email } });
        } else {
          reject(
            new Error("Invalid credentials. Try demo@example.com / password")
          );
        }
      }, 1500);
    });
  };

  const signup = async (name, email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ user: { name, email } });
      }, 1500);
    });
  };

  const socialLogin = async (provider) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            name: `User from ${provider}`,
            email: `user@${provider}.com`,
          },
        });
      }, 2000);
    });
  };

  return { login, signup, socialLogin };
};

/**
 * UI COMPONENTS
 */

const InputField = React.forwardRef(
  (
    { label, type = "text", placeholder, value, onChange, icon: Icon, error },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const inputType =
      type === "password" ? (showPassword ? "text" : "password") : type;

    return (
      <div ref={ref} className="space-y-1.5">
        <label
          className={`text-xs font-semibold tracking-wide transition-colors duration-200 ${
            error
              ? "text-rose-400"
              : isFocused
              ? "text-indigo-400"
              : "text-slate-400"
          }`}
        >
          {label}
        </label>
        <div className="relative group">
          <div
            className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
              isFocused ? "text-indigo-400" : "text-slate-500"
            }`}
          >
            <Icon size={18} />
          </div>

          <input
            type={inputType}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full bg-slate-800/50 text-slate-100 pl-10 pr-10 py-3 rounded-xl border transition-all duration-300 outline-none
            ${
              error
                ? "border-rose-500/50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                : "border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-slate-600"
            }
            placeholder:text-slate-600 font-medium
          `}
            placeholder={placeholder}
          />

          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex items-center gap-1.5 text-rose-400 text-xs font-medium pl-1"
            >
              <AlertCircle size={12} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
InputField.displayName = "InputField";

const SocialButton = ({ icon: Icon, label, onClick, isLoading, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled || isLoading}
    className="flex-1 flex items-center justify-center gap-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 py-2.5 rounded-xl transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {isLoading ? (
      <Loader2 size={18} className="animate-spin text-indigo-400" />
    ) : (
      <>
        <Icon
          size={18}
          className="group-hover:scale-110 transition-transform"
        />
        <span className="text-sm font-medium">{label}</span>
      </>
    )}
  </button>
);

/**
 * MAIN APP COMPONENT
 */
export default function AuthPortal({
  onClose = () => console.log("Close clicked"),
}) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null); // 'github' | 'google' | null
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});
  const { login, signup, socialLogin } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    setErrors({});
    setSuccess("");
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const validate = () => {
    const newErrors = {};
    if (!isLogin && !formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Must be at least 6 characters";

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        setSuccess("Welcome back! Redirecting...");
      } else {
        await signup(formData.name, formData.email, formData.password);
        setSuccess("Account created successfully!");
      }
    } catch (err) {
      setErrors({ form: err.message || "Authentication failed" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    if (socialLoading || isLoading) return;

    setSocialLoading(provider);
    setErrors({});

    try {
      await socialLogin(provider);
      setSuccess(
        `Successfully authenticated with ${
          provider === "github" ? "GitHub" : "Google"
        }!`
      );
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
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-indigo-500/30 text-slate-200">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          variants={backgroundVariants}
          animate="animate"
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-indigo-600/20 rounded-full blur-[100px]"
        />
        <motion.div
          variants={backgroundVariants}
          animate="animate"
          className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] bg-purple-600/10 rounded-full blur-[100px]"
          style={{ animationDelay: "-5s" }}
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* Main Card */}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="backdrop-blur-xl bg-slate-900/60 border border-slate-700/50 shadow-2xl rounded-3xl overflow-hidden ring-1 ring-white/10 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:text-white hover:bg-white/10 transition-all duration-200 z-20"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="p-8 pb-0 text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 mb-6 shadow-lg shadow-indigo-500/30"
            >
              <User className="text-white" size={24} />
            </motion.div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-indigo-100 to-indigo-200 bg-clip-text text-transparent mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-slate-400 text-sm">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Join us today and start your journey"}
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="popLayout">
                {/* Form Error Message */}
                {errors.form && (
                  <motion.div
                    key="form-error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start gap-3"
                  >
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    {errors.form}
                  </motion.div>
                )}

                {/* Success Message */}
                {success && (
                  <motion.div
                    key="success-message"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-start gap-3"
                  >
                    <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                    {success}
                  </motion.div>
                )}

                {!isLogin && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                  >
                    <InputField
                      label="Full Name"
                      placeholder="John Doe"
                      icon={User}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
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
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    error={errors.password}
                  />
                </motion.div>

                {!isLogin && (
                  <motion.div
                    key="confirm-field"
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    className="pt-5"
                  >
                    <InputField
                      label="Confirm Password"
                      type="password"
                      placeholder="••••••••"
                      icon={Lock}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      error={errors.confirmPassword}
                    />
                  </motion.div>
                )}

                {isLogin && (
                  <motion.div
                    key="forgot-password"
                    className="flex justify-end -mt-1"
                  >
                    <button
                      type="button"
                      className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isLoading || success || socialLoading}
                className="group relative w-full flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2 overflow-hidden"
              >
                {/* Button Shine Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />

                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>{isLogin ? "Sign In" : "Create Account"}</span>
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700/50"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0f172a] bg-opacity-95 px-3 text-slate-500 tracking-wider">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <SocialButton
                  icon={Github}
                  label="Github"
                  onClick={() => handleSocialLogin("github")}
                  isLoading={socialLoading === "github"}
                  disabled={
                    isLoading ||
                    success ||
                    (socialLoading && socialLoading !== "github")
                  }
                />
                <SocialButton
                  icon={Chrome}
                  label="Google"
                  onClick={() => handleSocialLogin("google")}
                  isLoading={socialLoading === "google"}
                  disabled={
                    isLoading ||
                    success ||
                    (socialLoading && socialLoading !== "google")
                  }
                />
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="p-6 bg-slate-900/50 border-t border-slate-700/50 text-center">
            <p className="text-sm text-slate-400">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                onClick={toggleMode}
                className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>
        </div>

        {/* Decorative footer text */}
        <div className="text-center mt-8 text-slate-600 text-xs">
          <p>© 2024 Professional Inc. All rights reserved.</p>
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
