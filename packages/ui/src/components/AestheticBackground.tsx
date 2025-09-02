"use client"

import React from 'react'

export function AestheticBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>
      
      {/* Mesh gradient overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(at 40% 20%, hsla(200, 80%, 30%, 0.3) 0px, transparent 50%),
                           radial-gradient(at 80% 0%, hsla(220, 70%, 20%, 0.3) 0px, transparent 50%),
                           radial-gradient(at 0% 50%, hsla(240, 60%, 30%, 0.3) 0px, transparent 50%),
                           radial-gradient(at 80% 80%, hsla(200, 70%, 25%, 0.3) 0px, transparent 50%),
                           radial-gradient(at 0% 100%, hsla(220, 80%, 20%, 0.3) 0px, transparent 50%)`
        }}
      />
      
      {/* Animated lines (like waves) */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="waves" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
            <path 
              d="M 0 10 Q 25 5 50 10 T 100 10" 
              stroke="rgba(255,255,255,0.03)" 
              strokeWidth="0.5" 
              fill="none"
              className="animate-wave"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#waves)" />
      </svg>
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
              opacity: Math.random() * 0.5 + 0.1
            }}
          />
        ))}
      </div>
      
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />
    </div>
  )
}