
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Floating label input with show/hide password
function FloatingLabelInput({ id, type, label, value, onChange, error }: {
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isActive = isFocused || value.length > 0;
  const inputType = type === "password" && showPassword ? "text" : type;
  return (
    <div className="relative">
      <Input
        id={id}
        type={inputType}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`h-14 pt-6 pb-2 bg-secondary/50 border border-input rounded-lg transition-all duration-300 focus:border-ring focus:ring-2 focus:ring-ring/20 text-foreground placeholder-transparent ${error ? "border-destructive focus:border-destructive focus:ring-destructive/20" : ""}`}
        placeholder={label}
        autoComplete={type === "password" ? "current-password" : "on"}
        aria-invalid={error ? true : undefined}
      />
      <label
        htmlFor={id}
        className={`absolute left-3 transition-all duration-300 pointer-events-none ${isActive ? "top-2 text-xs text-ring bg-card px-1" : "top-1/2 transform -translate-y-1/2 text-muted-foreground"} ${error && isActive ? "text-destructive" : ""}`}
      >
        {label}
      </label>
      {type === "password" && (
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [shakeForm, setShakeForm] = useState(false);

  useEffect(() => {
    if (shakeForm) {
      const timer = setTimeout(() => setShakeForm(false), 500);
      return () => clearTimeout(timer);
    }
  }, [shakeForm]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    if (email === "admin@mail.com" && password === "password123") {
      setIsLoggedIn(true);
    } else {
      setError("Login Gagal: Email atau password yang Anda masukkan salah.");
      setShakeForm(true);
    }
    setIsLoading(false);
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center animate-pulse">
            <svg className="w-10 h-10 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Selamat Datang, Admin!</h2>
          <p className="text-muted-foreground">Dashboard admin sedang dimuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background grid lg:grid-cols-2">
      {/* Left Column - Branding */}
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 p-12">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="w-32 h-32 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-8">
            <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Admin Portal</h1>
          <p className="text-xl text-muted-foreground max-w-md">
            Selamat datang di panel administrasi. Kelola sistem Anda dengan mudah dan aman.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Secure Access</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>Real-time Analytics</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Advanced Controls</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-fade-in">
          <Card className={`bg-card/95 backdrop-blur border-border ${shakeForm ? "animate-shake" : ""}`}>
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-3xl font-bold text-card-foreground">Admin Login</CardTitle>
              <CardDescription className="text-muted-foreground">
                Masukkan kredensial admin Anda untuk mengakses dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-6">
                <FloatingLabelInput
                  id="email"
                  type="email"
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!error}
                />
                <FloatingLabelInput
                  id="password"
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!error}
                />
                {error && (
                  <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 animate-fade-in">
                    <p className="text-sm text-destructive font-medium">{error}</p>
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 font-semibold transition-all duration-300 hover:scale-[1.02] disabled:scale-100"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sedang Login...</span>
                    </div>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Demo credentials: <span className="font-mono bg-secondary px-2 py-1 rounded">admin@mail.com</span> / <span className="font-mono bg-secondary px-2 py-1 rounded">password123</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdminLoginPage;