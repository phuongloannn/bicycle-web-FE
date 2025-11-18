"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ NÚT TEST LOGIN
  const testDirect = () => {
    setEmail("admin@example.com");
    setPassword("admin123");
    handleSignIn();
  };

  const handleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Login failed");
        return;
      }

      const data = await response.json();

      if (data.accessToken) {
  // Lưu token & user
  localStorage.setItem("token", data.accessToken);
  localStorage.setItem("user", JSON.stringify(data.user));
  document.cookie = `token=${data.accessToken}; path=/; max-age=86400; SameSite=Lax`;

  // ✅ REDIRECT ĐẾN TRANG CHỦ (đã tồn tại)
  window.location.href = "/";
}
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeftIcon /> Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-md">Sign In</h1>
        <p className="text-sm text-gray-500 mb-4">Enter your email and password to sign in!</p>

        {/* NÚT TEST LOGIN */}
        <div className="mb-4 p-4 bg-green-100 border border-green-400 rounded-lg">
          <button
            onClick={testDirect}
            className="bg-green-500 text-white px-4 py-2 rounded font-bold"
          >
            🚀 Test Login Auto
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <Label>Email *</Label>
            <Input
              type="email"
              value={email}
              placeholder="admin@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label>Password *</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Checkbox checked={isChecked} onChange={setIsChecked} />
              <span className="text-gray-700">Keep me logged in</span>
            </div>
            <Link href="/reset-password" className="text-sm text-brand-500">
              Forgot password?
            </Link>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button className="w-full" size="sm" onClick={handleSignIn} disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <p className="text-sm text-center mt-5">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-brand-500">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
