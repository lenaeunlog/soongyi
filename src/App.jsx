import React, { useState, useEffect, useRef } from "react";
import {
  Crown, HelpCircle, X, Coins,
  BookOpen, GraduationCap, UtensilsCrossed,
  Waves, ScrollText
} from "lucide-react";

// ---------------- Error Boundary ----------------
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-screen bg-black flex items-center justify-center">
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ---------------- Mini Components ----------------

const Soongyi = ({ size = "text-6xl" }) => (
  <div className={`${size} select-none`}>
    🐒<span className="text-sm">🎀</span>
  </div>
);

function StatBar({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-bold">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded">
        <div
          className={`h-full rounded ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

// ---------------- Flower Petal ----------------

const Petal = ({ style }) => (
  <div style={style} className="absolute animate-fall">
    🌸
  </div>
);

// ---------------- Main App ----------------

function AppInner() {

  const [screen, setScreen] = useState("start");
  const [showTutorial, setShowTutorial] = useState(false);
  const audioRef = useRef(null);

  const [stats] = useState({
    intellect: 40,
    fluency: 30,
    energy: 70,
    gold: 120
  });

  // 꽃잎 생성
  const petals = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 6 + Math.random() * 4
  }));

  const handleStart = () => {
    setScreen("play");
    audioRef.current.volume = 0.6;
    audioRef.current.play().catch(() => {});
  };

  return (
    <div className="w-full h-screen bg-[#f3e9dc] flex items-center justify-center relative overflow-hidden">

      {/* BACKGROUND MUSIC */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="https://storage.googleapis.com/eunyeongsmusicfiles/Handel%20Water%20Music.mp3"
      />

      {/* PETAL STYLE */}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 0 }
          20% { opacity: 1 }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0 }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          font-size: 22px;
        }
      `}</style>

      {/* PETALS */}
      {screen === "start" && petals.map(p => (
        <Petal
          key={p.id}
          style={{
            left: `${p.left}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`
          }}
        />
      ))}

      {/* MAIN FRAME */}
      <div className="w-full max-w-5xl bg-[#fffdfa] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden z-10">

        {/* HEADER */}
        <div className="h-14 bg-[#d4af37] flex items-center justify-between px-6">

          <div className="flex items-center gap-2 text-white font-black">
            <Crown size={22} />
            Royal Ball Deluxe
          </div>

          <button
            onClick={() => setShowTutorial(true)}
            className="bg-white/20 px-4 py-1 rounded-full text-white flex items-center gap-2"
          >
            <HelpCircle size={16} /> GUIDE
          </button>

        </div>

        {/* CONTENT */}
        <div
          className="flex-1 p-6 flex flex-col bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://storage.googleapis.com/eunyeongsmusicfiles/beautiful-castle-architecture.jpg')"
          }}
        >

          {/* START */}
          {screen === "start" && (
            <div className="flex-1 flex flex-col items-center justify-center gap-8 bg-white/80 rounded-3xl">

              <h1 className="text-5xl font-black text-purple-900">
                Training Soongsoongyi
              </h1>

              <Soongyi size="text-9xl" />

              <button
                onClick={handleStart}
                className="bg-purple-700 text-white px-12 py-5 rounded-full text-xl font-black shadow-xl hover:scale-105"
              >
                START PROTOCOL
              </button>

            </div>
          )}

          {/* PLAY */}
          {screen === "play" && (
            <div className="flex flex-1 gap-6 bg-white/90 rounded-3xl p-6">

              {/* LEFT */}
              <div className="w-64 bg-white rounded-3xl p-4 shadow-xl flex flex-col gap-4">

                <div className="text-center">
                  <Soongyi size="text-5xl" />
                </div>

                <StatBar label="Intellect" value={stats.intellect} color="bg-indigo-600" />
                <StatBar label="Fluency" value={stats.fluency} color="bg-emerald-600" />
                <StatBar label="Energy" value={stats.energy} color="bg-rose-500" />

                <div className="bg-yellow-100 p-3 rounded-xl flex justify-between font-bold">
                  <Coins size={18} />
                  ${stats.gold}
                </div>

                <button
                  onClick={() => setScreen("start")}
                  className="bg-red-600 text-white py-2 rounded-xl font-bold"
                >
                  Restart
                </button>

              </div>

              {/* CENTER */}
              <div className="flex-1 bg-white rounded-3xl p-6 shadow-xl">

                <h2 className="text-3xl font-black mb-4">
                  Daily Training Menu
                </h2>

                <div className="grid grid-cols-2 gap-4">

                  <div className="bg-[#fdf5e6] p-6 rounded-2xl shadow text-center">
                    <BookOpen className="mx-auto mb-2" />
                    Elite Literature
                  </div>

                  <div className="bg-[#fdf5e6] p-6 rounded-2xl shadow text-center">
                    <GraduationCap className="mx-auto mb-2" />
                    Royal Rhetoric
                  </div>

                  <div className="bg-[#fdf5e6] p-6 rounded-2xl shadow text-center">
                    <UtensilsCrossed className="mx-auto mb-2" />
                    Imperial Cafe
                  </div>

                  <div className="bg-[#fdf5e6] p-6 rounded-2xl shadow text-center">
                    <Waves className="mx-auto mb-2" />
                    Celestial Spa
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* GUIDE */}
      {showTutorial && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl p-8 w-full max-w-xl relative">

            <button
              onClick={() => setShowTutorial(false)}
              className="absolute top-4 right-4"
            >
              <X size={28} />
            </button>

            <h2 className="text-3xl font-black mb-4 flex items-center gap-2">
              <ScrollText size={28} /> Royal Manual
            </h2>

            <p className="leading-relaxed">
              Train Soongsoongyi for 7 days.<br />
              Increase Intellect and Fluency.<br />
              Reach the Grand Ball.
            </p>

          </div>
        </div>
      )}

    </div>
  );
}

// ---------------- Export ----------------

export default function App() {
  return (
    <ErrorBoundary>
      <AppInner />
    </ErrorBoundary>
  );
}
