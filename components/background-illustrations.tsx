"use client"

interface BackgroundIllustrationsProps {
  variant?: "auth" | "dashboard" | "landing"
}

export function BackgroundIllustrations({ variant = "landing" }: BackgroundIllustrationsProps) {
  const getIllustrations = () => {
    switch (variant) {
      case "auth":
        return (
          <>
            {/* Floating fruit emojis for auth page */}
            <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce">🍓</div>
            <div className="absolute top-20 right-20 text-5xl opacity-15 animate-pulse">🍑</div>
            <div className="absolute bottom-20 left-20 text-7xl opacity-10 animate-bounce delay-1000">🍇</div>
            <div className="absolute bottom-10 right-10 text-4xl opacity-25 animate-pulse delay-500">🥝</div>
            <div className="absolute top-1/2 left-5 text-5xl opacity-15 animate-bounce delay-700">🍊</div>
            <div className="absolute top-1/3 right-5 text-6xl opacity-20 animate-pulse delay-300">🍌</div>
          </>
        )
      case "dashboard":
        return (
          <>
            {/* Subtle dashboard decorations */}
            <div className="absolute top-5 right-5 text-3xl opacity-10">🌟</div>
            <div className="absolute bottom-5 left-5 text-3xl opacity-10">✨</div>
            <div className="absolute top-1/4 left-2 text-2xl opacity-5">🎯</div>
            <div className="absolute bottom-1/4 right-2 text-2xl opacity-5">📊</div>
          </>
        )
      case "landing":
      default:
        return (
          <>
            {/* Landing page illustrations */}
            <div className="absolute top-16 left-16 text-8xl opacity-15 animate-float">🍎</div>
            <div className="absolute top-32 right-12 text-6xl opacity-20 animate-float-delayed">🍊</div>
            <div className="absolute bottom-24 left-8 text-7xl opacity-10 animate-float-slow">🍌</div>
            <div className="absolute bottom-16 right-24 text-5xl opacity-25 animate-float">🥭</div>
            <div className="absolute top-1/2 left-4 text-4xl opacity-15 animate-float-delayed">🫐</div>
            <div className="absolute top-2/3 right-8 text-6xl opacity-20 animate-float-slow">🍇</div>

            {/* Geometric shapes */}
            <div className="absolute top-20 left-1/3 w-16 h-16 bg-yellow-200 opacity-20 rotate-45 animate-spin-slow"></div>
            <div className="absolute bottom-32 right-1/3 w-12 h-12 bg-pink-200 opacity-15 rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-8 h-20 bg-blue-200 opacity-10 rotate-12 animate-bounce-slow"></div>
          </>
        )
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {getIllustrations()}

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
