import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Coins, Crown, HelpCircle, X, CheckCircle2, Music, MessageCircle, ChevronRight,
  Landmark, BookOpen, GraduationCap, UtensilsCrossed, Waves, AlertTriangle,
  RefreshCw, Sparkle, Trophy, Headphones, ScrollText, StarHalf
} from 'lucide-react';

// -------------------- Error Boundary --------------------
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.error("App crashed:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-screen bg-black flex items-center justify-center text-white">
          <button
            className="bg-red-600 px-6 py-3 rounded-xl font-bold"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// -------------------- MAIN APP --------------------

function AppInner() {

  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <div className="w-full h-screen bg-[#f3e9dc] flex items-center justify-center">

      {/* MAIN BOX */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="h-14 bg-[#d4af37] flex items-center justify-between px-8">
          <div className="flex items-center gap-3 text-white font-bold">
            <Crown size={22} />
            Royal Ball Deluxe
          </div>

          <button
            onClick={() => setShowTutorial(true)}
            className="bg-white/20 hover:bg-white/40 px-5 py-2 rounded-full text-white text-sm font-bold flex items-center gap-2"
          >
            <HelpCircle size={16} /> ROYAL GUIDE
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex items-center justify-center text-4xl font-bold">
          정상 실행 테스트 화면
        </div>

      </div>

      {/* =================== FIXED TUTORIAL =================== */}

      {showTutorial && (
        <div className="absolute inset-0 bg-black/90 z-[400] flex items-center justify-center p-4 backdrop-blur-3xl">

          {/* 🔥 여기 div 빠져있던 거 FIX */}
          <div className="bg-[#fffdfa] rounded-[5rem] border-[14px] border-[#c19a6b] w-full max-w-4xl p-8 relative shadow-2xl h-[90vh] flex flex-col border-double overflow-hidden">

            <button
              onClick={() => setShowTutorial(false)}
              className="absolute top-6 right-6 p-3 text-gray-400 hover:text-rose-500"
            >
              <X size={36} />
            </button>

            <h2 className="text-4xl font-black text-[#8b4513] uppercase mb-8 border-b-4 border-[#c19a6b]/30 pb-4 flex items-center gap-6">
              <ScrollText size={48} /> Royal Manual v9.8
            </h2>

            <div className="flex-1 overflow-y-auto space-y-8 px-6 text-xl text-gray-700">

              <section>
                <h3 className="text-2xl font-black mb-3">I. The Noble Social Ascent</h3>
                <p>
                  Esteemed Tutor, your noble mission is to refine Soongsoongyi into a paragon
                  of the high imperial society within 7 suns.
                </p>
              </section>

              <section>
                <h3 className="text-2xl font-black mb-3">II. Imperial Qualifications</h3>
                <ul className="list-disc pl-6">
                  <li>Intellect 90+</li>
                  <li>Fluency 90+</li>
                  <li>Energy 50+</li>
                </ul>
              </section>

            </div>

            <button
              onClick={() => setShowTutorial(false)}
              className="mt-4 bg-[#5d4037] text-white py-4 rounded-[3rem] font-black text-2xl shadow-xl hover:bg-black"
            >
              I ACCEPT YOUR OFFER!
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

// -------------------- EXPORT --------------------

export default function App() {
  return (
    <ErrorBoundary>
      <AppInner />
    </ErrorBoundary>
  );
}
