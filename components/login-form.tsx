"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package, Eye, EyeOff, Lock, User } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface LoginFormProps {
  onLogin: (credentials: { username: string; password: string }) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate login process
    setTimeout(() => {
      // Demo credentials - in real app, this would be validated against a backend
      if (username === "admin" && password === "admin123") {
        toast({
          title: "Login Successful",
          description: "Welcome to PharmaCare Pro!",
        })
        onLogin({ username, password })
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive",
        })
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <>
      {/* Keyframe animations */}
      <style>{`
        @keyframes blob-move-1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33%       { transform: translate(40px, -60px) scale(1.08); }
          66%       { transform: translate(-30px, 30px) scale(0.94); }
        }
        @keyframes blob-move-2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33%       { transform: translate(-50px, 40px) scale(1.06); }
          66%       { transform: translate(35px, -25px) scale(0.96); }
        }
        @keyframes blob-move-3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33%       { transform: translate(30px, 50px) scale(0.92); }
          66%       { transform: translate(-20px, -40px) scale(1.1); }
        }
        @keyframes blob-move-4 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50%       { transform: translate(-40px, -30px) scale(1.05); }
        }
        .blob-1 { animation: blob-move-1 10s ease-in-out infinite; }
        .blob-2 { animation: blob-move-2 13s ease-in-out infinite; }
        .blob-3 { animation: blob-move-3 11s ease-in-out infinite; }
        .blob-4 { animation: blob-move-4 15s ease-in-out infinite; }
      `}</style>

      {/* Full-screen background */}
      <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-sky-50">

        {/* Animated mesh gradient blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="blob-1 absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-teal-200 opacity-50 blur-3xl" />
          <div className="blob-2 absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-sky-200 opacity-50 blur-3xl" />
          <div className="blob-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-blue-100 opacity-60 blur-3xl" />
          <div className="blob-4 absolute bottom-10 left-10 w-[280px] h-[280px] rounded-full bg-cyan-200 opacity-40 blur-2xl" />
        </div>

        {/* Glassmorphism Login Card */}
        <div className="relative z-10 w-full max-w-md">
          <div className="rounded-2xl border border-white/40 bg-white/70 shadow-2xl backdrop-blur-lg px-8 py-10">

            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 shadow-lg">
                <Package className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">PharmaCare Pro</h1>
              <p className="mt-1 text-sm text-gray-500">Sign in to your pharmacy management system</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Username */}
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-white/80 border-white/60 focus:bg-white transition-colors"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/80 border-white/60 focus:bg-white transition-colors"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gray-900 text-white hover:bg-gray-700 active:scale-[0.98] transition-all duration-150 mt-2 h-11 text-sm font-semibold rounded-lg shadow-md"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing in...
                  </span>
                ) : "Sign In"}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-7 text-center text-xs text-gray-400 space-y-0.5">
              <p className="font-medium text-gray-500">Demo Credentials</p>
              <p>Username: <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">admin</span></p>
              <p>Password: <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">admin123</span></p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
