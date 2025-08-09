"use client";

import React, { useState, useEffect } from "react";
import { quotes } from "@/lib/quotes";
import { toast } from "./Toast";
import { handleAuth } from "@/app/actions/auth";
import { validateEmail, validatePasswordStrength } from "@/lib/validations";

export default function AuthModal() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = validatePasswordStrength(password);
  const isEmailValid = validateEmail(email);
  const isFormValid = isEmailValid && passwordStrength.valid && agreeTerms;

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000); // 5 sec
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    if (!isFormValid) return toast.error("Please complete all validations");

    const result = await handleAuth({ email, password, isLogin });
    if (result.success) {
      toast.success(result.message);
      // Clear form or redirect
    } else {
      toast.error(result.message);
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login to WKT3" : "Register for WKT3"}
        </h2>

        <div className="mb-4 text-sm italic text-gray-600 text-center">
          “{quotes[quoteIndex]}”
        </div>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-sm text-blue-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="text-sm mb-2">
          Strength:{" "}
          <span className={`font-bold ${passwordStrength.color}`}>
            {passwordStrength.label}
          </span>
        </div>

        <label className="flex items-center mb-4 text-sm">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mr-2"
          />
          I agree to the{" "}
          <a href="/terms" className="text-blue-500 underline">
            Terms & Conditions
          </a>
        </label>

        <button
          disabled={!isFormValid}
          onClick={handleSubmit}
          className={`w-full p-2 rounded text-white ${
            isFormValid ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <div className="mt-4 text-center text-sm">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <button
            className="text-blue-500 underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
