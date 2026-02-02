import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Coins,
  Crown,
  HelpCircle,
  X,
  CheckCircle2,
  Music,
  MessageCircle,
  ChevronRight,
  Landmark,
  BookOpen,
  GraduationCap,
  UtensilsCrossed,
  Waves,
  AlertTriangle,
  RefreshCw,
  Sparkle,
  Trophy,
  Headphones,
  ScrollText,
  StarHalf
} from 'lucide-react';

// -------------------- Error Boundary --------------------
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(_) {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.error("App crashed:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-screen bg-[#f3e9dc] flex items-center justify-center p-6 text-[#5d4037]">
          <div className="max-w-lg w-full bg-[#fffdfa] rounded-[2.5rem] border-[8px] border-[#d4af37] border-double shadow-2xl p-8 text-center">
            <div className="text-[64px] mb-4">🐒⚠️</div>
            <h2 className="text-2xl font-black mb-3">앱이 잠깐 오류로 멈췄어요</h2>
            <p className="text-sm opacity-80 leading-relaxed mb-6">
              태블릿 브라우저(특히 Safari/WebView)에서 가끔 렌더링/오디오/메모리 문제로 런타임 에러가 나면 흰 화면이 됩니다.
              새로고침하면 대부분 복구됩니다.
            </p>
            <button
              className="gold-shimmer text-white px-10 py-4 rounded-full font-black text-lg shadow-[0_8px_0_#4a3705] uppercase border-2 border-white/40 active:translate-y-2"
              onClick={() => window.location.reload()}
            >
              새로고침
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- StatBar Component ---
function StatBar({ label, val, max, color, threshold }) {
  const percent = Math.min(100, (val / max) * 100);
  const isQualified = threshold ? val >= threshold : true;
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1">
        <span className="text-[11px] font-black text-[#a67c52] uppercase tracking-tighter flex items-center gap-1">
          {label}{' '}
          {threshold && (
            isQualified
              ? <CheckCircle2 size={10} className="text-emerald-600" />
              : <StarHalf size={10} className="text-rose-400" />
          )}
        </span>
        <span className={`text-[15px] font-black ${threshold && !isQualified ? 'text-rose-600' : 'text-[#5d4037]'}`}>{val}</span>
      </div>
      <div className="h-2.5 bg-white rounded-full border border-[#d4af37]/20 overflow-hidden relative shadow-inner">
        <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${percent}%` }}>
          <div className="absolute inset-0 bg-white/30 progress-shimmer" style={{ animation: 'shimmer 2s linear infinite' }}></div>
        </div>
      </div>
    </div>
  );
}

const Soongyi = ({ size = "text-[60px]", className = "" }) => (
  <div className={`relative inline-block leading-none select-none ${size} ${className}`}>
    🐒
    <span className="absolute -bottom-1 -right-2 text-[0.5em] drop-shadow-sm rotate-12">🎀</span>
  </div>
);

const CherryBlossomPetal = ({ style, className }) => (
  <div style={style} className={className}>
    <svg viewBox="0 0 100 100" fill="#D4BFFF" className="w-full h-full drop-shadow-[0_2px_3px_rgba(0,0,0,0.2)] opacity-70">
      <path d="M50 20 C65 5 95 10 95 45 C95 75 65 95 50 85 C35 95 5 75 5 45 C5 10 35 5 50 20 Z" />
    </svg>
  </div>
);

const INTRO_STEPS = [
  { text: "My name is Soongsoongyi. I am destined for the Royal Court.", emote: "🎀🐒" },
  { text: "Prince Soongyi awaits me in London for the Grand Ball. I miss him dearly.", emote: "🐒✈️" },
  { text: "Prince Soongyi welcomes princesses with refined English skills.", emote: "🐒📚" },
  { text: "7 days remain. I must transform into a true princess.", emote: "🐒✨" },
  { text: "Royal Tutor, let the magnificent symphony of my life begin.", emote: "👑🐒" }
];

const MUSIC_LIBRARY = {
  start: [],
  intro: ["https://storage.googleapis.com/eunyeongsmusicfiles/Por%20una%20Cabeza%20-%20C.%20Gardel%2C%20Tango%20for%20violin%20and%20cello%20(arr.%20Duo-B).mp3"],
  schedule: ["https://storage.googleapis.com/eunyeongsmusicfiles/Handel%20Water%20Music.mp3"],
  ball: ["https://storage.googleapis.com/eunyeongsmusicfiles/Dark%20Waltz%20Music%20-%20Vampire%20Masquerade%20collection.mp3"],
  success: ["https://storage.googleapis.com/eunyeongsmusicfiles/H%C3%A4ndel%20Messiah%20-%20Hallelujah%20Chorus.mp3"],
  neutral: ["https://storage.googleapis.com/eunyeongsmusicfiles/Beethoven%20-%20Moonlight%20Sonata%20(FULL).mp3"],
  fail: ["https://storage.googleapis.com/eunyeongsmusicfiles/Navy%20CIS%20-%20Soundtrack%20~%20Abby%C2%B4s%20Song%20from%20Kate%C2%B4s%20Funeral.mp3"],
  waltz: ["https://storage.googleapis.com/eunyeongsmusicfiles/The%20Most%20Beautiful%20Waltz%20Music%20%5BFaxTRX9oAV4%5D.mp3"],
  hiphop: ["https://storage.googleapis.com/eunyeongsmusicfiles/Still%20D.R.E.%20(Instrumental)%20%5B3MufzuaKfZg%5D.mp3"]
};

const BALL_DIALOGUES = [
  {
    prince: "Welcome to London, my lady. The city seems brighter since your arrival. How do you find your stay here?",
    options: [
      { text: "The grand halls of London are as poetic as your grace, Your Highness.", type: "elegant" },
      { text: "It's busier than a jungle feast! My heart is jumping like a frog.", type: "funny" },
      { text: "Why is everyone wearing hats? Is the sun too strong for their brains?", type: "clueless" }
    ]
  },
  {
    prince: "You look radiant tonight. That gown suits your noble spirit perfectly. Where did you find such a masterpiece?",
    options: [
      { text: "It is but a shadow compared to the warmth of your hospitality.", type: "elegant" },
      { text: "Thanks! It has extra hidden pockets for snacks. Want a banana?", type: "funny" },
      { text: "I found it hanging on a long rope outside someone's house. It's a bit itchy.", type: "clueless" }
    ]
  },
  {
    prince: "My lady, they say that in the heart of a princess, there is a secret garden. Tell me, what does love mean to a noble soul like you?",
    options: [
      { text: "Love is the eternal harmony of two souls dancing under the stars of destiny.", type: "elegant" },
      { text: "It's like finding a bunch of bananas that never rot. Pure happiness!", type: "funny" },
      { text: "I don't know. Is love a kind of bug? Does it taste like dirt?", type: "clueless" }
    ]
  },
  {
    prince: "The orchestra is beginning a waltz. Would you care for a dance? The moon itself would be jealous of us.",
    options: [
      { text: "I would be honored to glide across the floor with the moon's equal.", type: "elegant" },
      { text: "Dance? Is that the thing where we shake our butts and scream? Let's go!", type: "funny" }
    ]
  }
];

const ALL_QUESTIONS = {
  lit: [
    { id: 'l1', q: "Which word means the opposite of 'difficult'?", a: ["Easy", "Strong", "Hard"], correct: 0 },
    { id: 'l2', q: "What is the correct plural form of the word 'box'?", a: ["Boxes", "Boxs", "Boxen"], correct: 0 },
    { id: 'l3', q: "Which of the following is not a fruit?", a: ["Carrot", "Apple", "Grape"], correct: 0 },
    { id: 'l4', q: "What is the opposite word of 'always'?", a: ["Never", "Often", "Usually"], correct: 0 },
    { id: 'l5', q: "What do you call a person who teaches students at school?", a: ["Teacher", "Doctor", "Singer"], correct: 0 },
    { id: 'l6', q: "Which word means 'very large' or 'huge'?", a: ["Enormous", "Small", "Little"], correct: 0 },
    { id: 'l7', q: "What is the capital city of South Korea?", a: ["Seoul", "Busan", "Incheon"], correct: 0 },
    { id: 'l8', q: "Which month is the last month of the year?", a: ["December", "January", "October"], correct: 0 },
    { id: 'l9', q: "Which animal lives in the water and has sharp teeth?", a: ["Shark", "Tiger", "Eagle"], correct: 0 },
    { id: 'l10', q: "What is the past tense form of the verb 'go'?", a: ["Went", "Gone", "Goes"], correct: 0 },
    { id: 'l11', q: "What is the opposite word of 'rich'?", a: ["Poor", "Happy", "Sad"], correct: 0 },
    { id: 'l12', q: "Where can you go to borrow many books?", a: ["Library", "Bank", "Park"], correct: 0 },
    { id: 'l13', q: "What is the opposite word of 'fast'?", a: ["Slow", "Quick", "High"], correct: 0 },
    { id: 'l14', q: "Which of these animals can fly in the sky?", a: ["Bat", "Lion", "Monkey"], correct: 0 },
    { id: 'l15', q: "What color is a typical ripe banana?", a: ["Yellow", "Red", "Blue"], correct: 0 },
    { id: 'l16', q: "What is the opposite word of 'strong'?", a: ["Weak", "Hard", "Tall"], correct: 0 },
    { id: 'l17', q: "What is the correct plural form of 'tooth'?", a: ["Teeth", "Tooths", "Teeths"], correct: 0 },
    { id: 'l18', q: "What is the opposite word of 'clean'?", a: ["Dirty", "Clear", "Nice"], correct: 0 },
    { id: 'l19', q: "What do we call a baby cat?", a: ["Kitten", "Puppy", "Chick"], correct: 0 },
    { id: 'l20', q: "What is the opposite word of 'short'?", a: ["Long", "Fat", "Thin"], correct: 0 },
    { id: 'l21', q: "Which of the following is a vegetable?", a: ["Potato", "Melon", "Orange"], correct: 0 },
    { id: 'l22', q: "What do you call a person who cooks food in a restaurant?", a: ["Chef", "Nurse", "Pilot"], correct: 0 },
    { id: 'l23', q: "What is the opposite word of 'safe'?", a: ["Dangerous", "Good", "Easy"], correct: 0 },
    { id: 'l24', q: "Which item do you wear on your head?", a: ["Cap", "Sock", "Belt"], correct: 0 },
    { id: 'l25', q: "What is the opposite word of 'empty'?", a: ["Full", "Open", "New"], correct: 0 },
    { id: 'l26', q: "Which month comes right after June?", a: ["July", "May", "August"], correct: 0 }
  ],
  talk: [
    { id: 't1', q: "How old are you this year?", a: ["I am 13 years old.", "I am fine.", "I am happy."], correct: 0 },
    { id: 't2', q: "Can you help me with my homework?", a: ["Sure, no problem.", "I am a student.", "Yes, it is."], correct: 0 },
    { id: 't3', q: "What do you want to be in the future?", a: ["I want to be a chef.", "I like pizza.", "I am eating."], correct: 0 },
    { id: 't4', q: "How do I get to the central park?", a: ["Turn left at the corner.", "It is 3 o'clock.", "I like walking."], correct: 0 },
    { id: 't5', q: "Whose hairbrush is this on the table?", a: ["It is mine.", "It is me.", "It is I."], correct: 0 },
    { id: 't6', q: "It was nice to meet you today.", a: ["Nice to meet you, too.", "I am sorry.", "Goodbye."], correct: 0 },
    { id: 't7', q: "What time is it right now?", a: ["It is 7 o'clock.", "It is a watch.", "It is time."], correct: 0 },
    { id: 't8', q: "Where is the local bookstore located?", a: ["It is next to the bank.", "It is blue.", "It is high."], correct: 0 },
    { id: 't9', q: "May I take your order now?", a: ["Yes, a pizza please.", "I have a fork.", "The plate is here."], correct: 0 },
    { id: 't10', q: "When is your birthday?", a: ["It is May 5th.", "I am at home.", "I like cake."], correct: 0 },
    { id: 't11', q: "How are you doing today?", a: ["I am doing fine.", "I am five.", "I am a boy."], correct: 0 },
    { id: 't12', q: "Do you like eating Italian pizza?", a: ["Yes, I do.", "Yes, I am.", "Yes, I can."], correct: 0 },
    { id: 't13', q: "What is your favorite color?", a: ["I like green.", "I am great.", "It is grass."], correct: 0 },
    { id: 't14', q: "Can you swim in the deep pool?", a: ["No, I can't.", "No, I don't.", "No, I'm not."], correct: 0 },
    { id: 't15', q: "What are you doing at the moment?", a: ["I am reading a book.", "I read a book.", "I reads a book."], correct: 0 },
    { id: 't16', q: "Where are you from originally?", a: ["I am from Korea.", "I am in Korea.", "I am on Korea."], correct: 0 },
    { id: 't17', q: "Is this your yellow bag?", a: ["Yes, it is.", "Yes, this is.", "Yes, I am."], correct: 0 },
    { id: 't18', q: "I hope you have a nice day!", a: ["You too.", "Yes.", "Hello."], correct: 0 },
    { id: 't19', q: "Excuse me, where is the restroom?", a: ["It is over there.", "Yes?", "I am fine."], correct: 0 },
    { id: 't20', q: "What's up with you lately?", a: ["Not much.", "No.", "None."], correct: 0 },
    { id: 't21', q: "What is he doing in the garden?", a: ["He is sleeping.", "He sleeps.", "He sleep."], correct: 0 },
    { id: 't22', q: "Whose dog is barking outside?", a: ["It is hers.", "It is she.", "It is her."], correct: 0 },
    { id: 't23', q: "Why are you late for the class?", a: ["Because I missed the bus.", "So I am late.", "But I am here."], correct: 0 },
    { id: 't24', q: "Can I have a glass of water?", a: ["Here you are.", "I'm sorry.", "You are not."], correct: 0 },
    { id: 't25', q: "How much is this red shirt?", a: ["It is 10 dollars.", "It is 10 meters.", "It is 10 years."], correct: 0 },
    { id: 't26', q: "Do you have a pen I can borrow?", a: ["Yes, I do.", "Yes, I am.", "Yes, I have."], correct: 0 },
    { id: 't27', q: "Thank you for your great help.", a: ["You're welcome.", "I like you.", "My name is Tom."], correct: 0 }
  ],
  work: [
    { id: 'w1', q: "I usually go to bed ___ 10 p.m.", a: ["at", "on", "in"], correct: 0 },
    { id: 'w2', q: "She ___ breakfast every morning.", a: ["eats", "eat", "eating"], correct: 0 },
    { id: 'w3', q: "I have a ___ in my stomach because I'm hungry.", a: ["pain", "banana", "coin"], correct: 0 },
    { id: 'w4', q: "Please don't ___ the animals in the zoo.", a: ["touch", "touched", "touching"], correct: 0 },
    { id: 'w5', q: "Please ___ the door because it is cold.", a: ["close", "open", "sit"], correct: 0 },
    { id: 'w6', q: "He is ___ to music in his room now.", a: ["listening", "listens", "listen"], correct: 0 },
    { id: 'w7', q: "You must ___ your hands before you eat.", a: ["wash", "washing", "washed"], correct: 0 },
    { id: 'w8', q: "My father works as a doctor at the ___.", a: ["hospital", "farm", "park"], correct: 0 },
    { id: 'w9', q: "We ___ soccer together yesterday afternoon.", a: ["played", "play", "playing"], correct: 0 },
    { id: 'w10', q: "I would like ___ buy some fresh milk.", a: ["to", "for", "at"], correct: 0 },
    { id: 'w11', q: "I ___ a middle school student.", a: ["am", "is", "are"], correct: 0 },
    { id: 'w12', q: "He ___ a very big dog at home.", a: ["has", "have", "having"], correct: 0 },
    { id: 'w13', q: "___ you like drinking cold milk?", a: ["Do", "Are", "Does"], correct: 0 },
    { id: 'w14', q: "She ___ to school by bus every day.", a: ["goes", "go", "going"], correct: 0 },
    { id: 'w15', q: "This is ___ apple I bought today.", a: ["an", "a", "then"], correct: 0 },
    { id: 'w16', q: "They ___ playing soccer in the park now.", a: ["are", "is", "am"], correct: 0 },
    { id: 'w17', q: "I ___ my room carefully yesterday.", a: ["cleaned", "clean", "cleaning"], correct: 0 },
    { id: 'w18', q: "___ you at home last night?", a: ["Were", "Are", "Was"], correct: 0 },
    { id: 'w19', q: "We ___ many interesting books to read.", a: ["have", "has", "having"], correct: 0 },
    { id: 'w21', q: "Please don't ___ in the hallway.", a: ["run", "running", "runs"], correct: 0 },
    { id: 'w22', q: "___ the window, it's too hot here.", a: ["Open", "Opening", "Opened"], correct: 0 },
    { id: 'w23', q: "It is time ___ us to have lunch.", a: ["for", "to", "at"], correct: 0 },
    { id: 'w24', q: "She ___ not a very tall girl.", a: ["is", "am", "are"], correct: 0 },
    { id: 'w25', q: "I ___ my house keys last night.", a: ["lost", "lose", "losing"], correct: 0 },
    { id: 'w26', q: "Where ___ you yesterday morning?", a: ["were", "was", "are"], correct: 0 },
    { id: 'w27', q: "He is much ___ than I am.", a: ["taller", "tall", "tallest"], correct: 0 }
  ]
}

function AppInner() {
  const [screen, setScreen] = useState('start');
  const [day, setDay] = useState(1);
  const [stats, setStats] = useState({ intellect: 20, fluency: 10, gold: 50, energy: 60 });
  const [log, setLog] = useState(['Royal Protocol Initialized. Welcome, Royal Tutor.']);
  const [introIdx, setIntroIdx] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [ballStep, setBallStep] = useState(0);
  const [elegantCount, setElegantCount] = useState(0);
  const [usedQuestionIds, setUsedQuestionIds] = useState([]);
  const [performanceTimer, setPerformanceTimer] = useState(0);
  const [isPerforming, setIsPerforming] = useState(false);

  const [monkeyClickCount, setMonkeyClickCount] = useState(0);
  const [curriculumClickCount, setCurriculumClickCount] = useState(0);
  const [dayClickCount, setDayClickCount] = useState(0);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [imperialSparkles, setImperialSparkles] = useState(false);

  const [wrongFeedback, setWrongFeedback] = useState(false);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [feedbackStatus, setFeedbackStatus] = useState(null);
  const [showBonusGift, setShowBonusGift] = useState(false);
  const [quizQueue, setQuizQueue] = useState([]);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(-1);
  const [correctCount, setCorrectCount] = useState(0);
  const [activeAct, setActiveAct] = useState(null);

  const dayRef = useRef(day);
  const statsRef = useRef(stats);
  const usedIdsRef = useRef(usedQuestionIds);
  const elegantRef = useRef(elegantCount);
  const screenRef = useRef(screen);

  useEffect(() => { dayRef.current = day; }, [day]);
  useEffect(() => { statsRef.current = stats; }, [stats]);
  useEffect(() => { usedIdsRef.current = usedQuestionIds; }, [usedQuestionIds]);
  useEffect(() => { elegantRef.current = elegantCount; }, [elegantCount]);
  useEffect(() => { screenRef.current = screen; }, [screen]);

  const bgmRef = useRef(null);
  const synthCtxRef = useRef(null);
  const currentUrlRef = useRef("");
  const lastBgmKeyRef = useRef("");
  const abortBgmAttemptRef = useRef({ aborted: false });
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const userInteractedRef = useRef(false);

  const fallbackLoopRef = useRef({ playing: false, osc: null, gain: null, intervalId: null });
  const hasWindow = typeof window !== 'undefined';

  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  const timeoutsRef = useRef([]);
  const safeSetTimeout = useCallback((fn, ms) => {
    if (!hasWindow) return null;
    const id = window.setTimeout(() => {
      timeoutsRef.current = timeoutsRef.current.filter(x => x !== id);
      fn();
    }, ms);
    timeoutsRef.current.push(id);
    return id;
  }, [hasWindow]);

  const clearAllTimeouts = useCallback(() => {
    if (!hasWindow) return;
    timeoutsRef.current.forEach(id => window.clearTimeout(id));
    timeoutsRef.current = [];
  }, [hasWindow]);

  const pendingEndRef = useRef(null);
  const endTransitionTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (hasWindow && endTransitionTimeoutRef.current) {
        window.clearTimeout(endTransitionTimeoutRef.current);
        endTransitionTimeoutRef.current = null;
      }
    };
  }, [hasWindow]);

  const playSfx = useCallback((type) => {
    if (!synthCtxRef.current || !isAudioInitialized) return;
    const ctx = synthCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const now = ctx.currentTime;

    if (type === 'correct') {
      const harpNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
      harpNotes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.15);
        g.gain.setValueAtTime(0, now + i * 0.15);
        g.gain.linearRampToValueAtTime(0.2, now + i * 0.15 + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 2.8);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + 3.0);
      });
    } else if (type === 'wrong') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'start') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      [440, 554, 659, 880].forEach((freq, i) => {
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
      });
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  }, [isAudioInitialized]);

  const initSynth = useCallback(async () => {
    if (!hasWindow) return null;
    if (!synthCtxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      synthCtxRef.current = new Ctx();
    }
    if (synthCtxRef.current && synthCtxRef.current.state === 'suspended') {
      try { await synthCtxRef.current.resume(); } catch (_) {}
    }
    return synthCtxRef.current;
  }, [hasWindow]);

  const stopFallbackBgm = useCallback(() => {
    const cur = fallbackLoopRef.current;
    if (!cur.playing) return;
    try {
      if (hasWindow && cur.intervalId) window.clearInterval(cur.intervalId);
      const ctx = synthCtxRef.current;
      if (cur.gain && ctx) {
        cur.gain.gain.cancelScheduledValues(ctx.currentTime);
        cur.gain.gain.setValueAtTime(0, ctx.currentTime);
      }
      if (cur.osc) {
        cur.osc.stop();
        cur.osc.disconnect();
      }
    } catch (_) {}
    fallbackLoopRef.current = { playing: false, osc: null, gain: null, intervalId: null };
  }, [hasWindow]);

  const startFallbackBgm = useCallback(async () => {
    try {
      if (!hasWindow) return;
      if (fallbackLoopRef.current.playing) return;
      const ctx = await initSynth();
      if (!ctx) return;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.connect(ctx.destination);
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      osc.connect(gain);
      osc.start();
      const intervalId = window.setInterval(() => {
        const t = ctx.currentTime;
        try {
          gain.gain.cancelScheduledValues(t);
          gain.gain.setValueAtTime(gain.gain.value, t);
          gain.gain.linearRampToValueAtTime(0.03, t + 0.25);
          gain.gain.linearRampToValueAtTime(0.02, t + 0.75);
        } catch (_) {}
      }, 900);
      fallbackLoopRef.current = { playing: true, osc, gain, intervalId };
    } catch (_) {}
  }, [hasWindow, initSynth]);

  const tryLoadAndPlay = useCallback(async (url) => {
    const a = bgmRef.current;
    if (!a || !url || !hasWindow) return false;
    const localAbortToken = abortBgmAttemptRef.current;

    return await new Promise((resolve) => {
      let settled = false;
      const cleanup = () => {
        a.removeEventListener("canplaythrough", onReady);
        a.removeEventListener("canplay", onReady);
        a.removeEventListener("loadeddata", onReady);
        a.removeEventListener("error", onError);
      };
      const done = (ok) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeoutId);
        cleanup();
        resolve(ok);
      };
      const onError = () => done(false);
      const onReady = async () => {
        if (!isMountedRef.current) return done(false);
        if (localAbortToken.aborted) return done(false);
        try {
          const p = a.play();
          if (p && typeof p.then === "function") {
            p.then(() => done(true)).catch(() => done(false));
          } else {
            done(true);
          }
        } catch (_) {
          done(false);
        }
      };

      const timeoutId = window.setTimeout(() => done(false), 9000);
      a.addEventListener("canplaythrough", onReady);
      a.addEventListener("canplay", onReady);
      a.addEventListener("loadeddata", onReady);
      a.addEventListener("error", onError);

      try {
        a.pause();
        a.currentTime = 0;
        a.preload = "auto";
        a.loop = true;
        a.muted = false;
        a.volume = 0.65;
        a.src = url;
        a.load();
        try {
          const p = a.play();
          if (p && typeof p.then === "function") {
            p.then(() => done(true)).catch(() => {});
          }
        } catch (_) {}
      } catch (_) {
        done(false);
      }
    });
  }, [hasWindow]);

  const playBgmSmart = useCallback(async (bgmKey, force = false) => {
    if (!bgmRef.current || !hasWindow) return;
    if (!force && !userInteractedRef.current) return;
    if (!isAudioInitialized && !force) return;

    if (!force && lastBgmKeyRef.current === bgmKey) return;

    abortBgmAttemptRef.current.aborted = true;
    abortBgmAttemptRef.current = { aborted: false };
    stopFallbackBgm();

    const entry = MUSIC_LIBRARY[bgmKey];
    const candidates = Array.isArray(entry) ? entry : (entry ? [entry] : []);

    if (candidates.length === 0) {
      lastBgmKeyRef.current = bgmKey;
      if (bgmKey !== 'start') await startFallbackBgm();
      return;
    }

    for (const url of candidates) {
      if (!isMountedRef.current) return;
      if (abortBgmAttemptRef.current.aborted) return;

      if (currentUrlRef.current === url) {
        try { bgmRef.current.play().catch(() => {}); } catch (_) {}
        lastBgmKeyRef.current = bgmKey;
        return;
      }

      const ok = await tryLoadAndPlay(url);
      if (!isMountedRef.current) return;
      if (abortBgmAttemptRef.current.aborted) return;

      if (ok) {
        lastBgmKeyRef.current = bgmKey;
        currentUrlRef.current = url;
        stopFallbackBgm();
        return;
      }
    }

    if (bgmKey !== 'start') await startFallbackBgm();
  }, [hasWindow, isAudioInitialized, startFallbackBgm, stopFallbackBgm, tryLoadAndPlay]);

  useEffect(() => {
    if (!userInteractedRef.current) return;
    if (!isAudioInitialized) return;

    let key = screenRef.current;
    if (key === 'play') key = 'schedule';
    if (key === 'performance-waltz') key = 'waltz';
    if (key === 'performance-hiphop') key = 'hiphop';
    playBgmSmart(key);
  }, [screen, isAudioInitialized, playBgmSmart]);

  const handleStartInteraction = useCallback(async () => {
    userInteractedRef.current = true;
    if (!isAudioInitialized) {
      const ctx = await initSynth();
      if (!isMountedRef.current) return;
      setIsAudioInitialized(true);
      if (ctx) playSfx('start');
      if (bgmRef.current) {
        try {
          bgmRef.current.muted = false;
          bgmRef.current.volume = 0.65;
          const p = bgmRef.current.play();
          if (p && typeof p.then === "function") {
            p.then(() => bgmRef.current.pause()).catch(() => {});
          } else {
            bgmRef.current.pause();
          }
        } catch (_) {}
      }
    }
    await playBgmSmart('intro', true);
    if (!isMountedRef.current) return;
    setScreen('intro');
  }, [initSynth, isAudioInitialized, playBgmSmart, playSfx]);

  const handleRestartGame = useCallback(() => {
    clearAllTimeouts();
    abortBgmAttemptRef.current.aborted = true;
    abortBgmAttemptRef.current = { aborted: false };

    playSfx('click');

    if (hasWindow && endTransitionTimeoutRef.current) {
      window.clearTimeout(endTransitionTimeoutRef.current);
      endTransitionTimeoutRef.current = null;
    }
    pendingEndRef.current = null;

    setScreen('start');
    setDay(1);
    setStats({ intellect: 20, fluency: 10, gold: 50, energy: 60 });
    setBallStep(0);
    setElegantCount(0);
    setLog(['Royal Protocol Initialized. Welcome, Royal Tutor.']);
    setCurrentQuizIdx(-1);
    setIntroIdx(0);
    setShowBonusGift(false);
    setSelectedIdx(null);
    setFeedbackStatus(null);
    setWrongFeedback(false);
    setMistakeCount(0);
    setCorrectCount(0);
    setActiveAct(null);
    setUsedQuestionIds([]);
    setMonkeyClickCount(0);
    setCurriculumClickCount(0);
    setDayClickCount(0);
    setLogoClickCount(0);
    setImperialSparkles(false);
    setPerformanceTimer(0);
    setIsPerforming(false);

    lastBgmKeyRef.current = "";
    currentUrlRef.current = "";

    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.src = "";
    }
    stopFallbackBgm();
  }, [playSfx, stopFallbackBgm, hasWindow, clearAllTimeouts]);

  const applyAction = useCallback((act, count) => {
    const multiplier = 0.2 + (count * 0.3);

    let intelG = 0, fluG = 0, eneC = 0, goldC = 0;
    if (act.id === 'lit') { intelG = Math.round(25 * multiplier); eneC = -10; }
    else if (act.id === 'talk') { fluG = Math.round(25 * multiplier); eneC = -10; }
    else if (act.id === 'work') { intelG = 5; fluG = 5; goldC = 50; eneC = -15; }
    else if (act.id === 'rest') { eneC = 35; goldC = -30; }

    const curDay = dayRef.current;

    setStats(prev => {
      const nextStats = {
        intellect: prev.intellect + intelG,
        fluency: prev.fluency + fluG,
        gold: prev.gold + goldC,
        energy: Math.min(100, Math.max(0, prev.energy + eneC))
      };

      if (curDay >= MAX_DAYS) {
        pendingEndRef.current = { nextStats };
      }
      return nextStats;
    });

    setLog(p => [`[DAY ${curDay}] ${act.name} completed.`, ...p.slice(0, 15)]);

    if (curDay < MAX_DAYS) {
      setDay(d => Math.min(MAX_DAYS, d + 1));
    }
  }, []);

  useEffect(() => {
    if (!hasWindow) return;
    if (screen !== 'play') return;
    if (day !== MAX_DAYS) return;
    if (!pendingEndRef.current?.nextStats) return;

    if (endTransitionTimeoutRef.current) {
      window.clearTimeout(endTransitionTimeoutRef.current);
      endTransitionTimeoutRef.current = null;
    }

    const { nextStats } = pendingEndRef.current;
    pendingEndRef.current = null;

    endTransitionTimeoutRef.current = window.setTimeout(() => {
      const ok = (nextStats.intellect >= 90 && nextStats.fluency >= 90 && nextStats.energy >= 50);
      setScreen(ok ? 'ball' : 'neutral');
      endTransitionTimeoutRef.current = null;
    }, 1000);

    return () => {
      if (endTransitionTimeoutRef.current) {
        window.clearTimeout(endTransitionTimeoutRef.current);
        endTransitionTimeoutRef.current = null;
      }
    };
  }, [day, screen, hasWindow, stats]);

  const handleActionClick = useCallback((act) => {
    playSfx('click');

    const curStats = statsRef.current;
    if (curStats.gold < (act.id === 'rest' ? 30 : 0)) {
      setLog(prev => ['[ALERT] Not enough gold in the treasury!', ...prev.slice(0, 15)]);
      playSfx('wrong');
      return;
    }

    if (act.id === 'rest') {
      applyAction(act, 4);
      return;
    }

    const pool = ALL_QUESTIONS[act.id] || ALL_QUESTIONS.lit;
    const used = usedIdsRef.current;
    const available = pool.filter(q => !used.includes(q.id));
    const targetPool = (available.length >= 4 ? available : pool).slice().sort(() => 0.5 - Math.random());

    const selection = targetPool.slice(0, 4).map(q => {
      const originalCorrectText = q.a[q.correct];
      const shuffledAnswers = [...q.a].sort(() => 0.5 - Math.random());
      const newCorrectIdx = shuffledAnswers.indexOf(originalCorrectText);
      return { ...q, a: shuffledAnswers, correct: newCorrectIdx };
    });

    setQuizQueue(selection);
    setCurrentQuizIdx(0);
    setCorrectCount(0);
    setMistakeCount(0);
    setActiveAct(act);
    setSelectedIdx(null);
    setFeedbackStatus(null);
    setWrongFeedback(false);
  }, [applyAction, playSfx]);

  const handleQuizAnswer = useCallback((idx, isCorrect) => {
    if (selectedIdx !== null || wrongFeedback) return;
    setSelectedIdx(idx);

    if (!isCorrect) {
      playSfx('wrong');
      setFeedbackStatus('wrong');

      setMistakeCount(prevMist => {
        const newMistakes = prevMist + 1;

        if (newMistakes >= 4) {
          setWrongFeedback(true);
          safeSetTimeout(() => {
            setCurrentQuizIdx(-1);
            setScreen('fail');
            setWrongFeedback(false);
            setSelectedIdx(null);
            setFeedbackStatus(null);
          }, 1200);
        } else {
          setWrongFeedback(true);
          safeSetTimeout(() => {
            setWrongFeedback(false);
            setSelectedIdx(null);
            setFeedbackStatus(null);
          }, 1500);
        }
        return newMistakes;
      });

      return;
    }

    playSfx('correct');
    setFeedbackStatus('correct');

    const currentQ = quizQueue[currentQuizIdx];
    if (currentQ?.id) {
      setUsedQuestionIds(prev => (prev.includes(currentQ.id) ? prev : [...prev, currentQ.id]));
    }

    safeSetTimeout(() => {
      setCorrectCount(prevCorrect => {
        const nextCorrect = prevCorrect + 1;

        setSelectedIdx(null);
        setFeedbackStatus(null);

        if (currentQuizIdx < 3) {
          setCurrentQuizIdx(i => i + 1);
        } else {
          const actToApply = activeAct;
          setCurrentQuizIdx(-1);
          if (nextCorrect === 4) setShowBonusGift(true);
          if (actToApply) applyAction(actToApply, nextCorrect);
        }
        return nextCorrect;
      });
    }, 800);
  }, [activeAct, applyAction, currentQuizIdx, playSfx, quizQueue, selectedIdx, wrongFeedback, safeSetTimeout]);

  const handleClaimGift = useCallback(() => {
    playSfx('start');
    setStats(s => ({ ...s, gold: s.gold + 10, energy: Math.min(100, s.energy + 5) }));
    setLog(l => ["[ROYAL GIFT] Reward Claimed: +$10, +5 Energy!", ...l.slice(0, 15)]);
    setShowBonusGift(false);
  }, [playSfx]);

  const handleBallChoice = useCallback((type) => {
    playSfx('click');
    if (type === 'elegant') setElegantCount(prev => prev + 1);

    setBallStep(prev => {
      const next = prev + 1;
      if (next >= 4) setScreen('dance-choice');
      return Math.min(4, next);
    });
  }, [playSfx]);

  const startActualPerformance = useCallback((_type) => {
    playSfx('start');
    setIsPerforming(true);
    if (bgmRef.current) bgmRef.current.play().catch(() => {});
  }, [playSfx]);

  const handleDanceMusic = useCallback((choice) => {
    playSfx('click');
    setIsPerforming(false);
    if (choice === 'classical') {
      setScreen('performance-waltz');
      setPerformanceTimer(60);
    } else if (choice === 'hiphop') {
      setScreen('performance-hiphop');
      setPerformanceTimer(60);
    } else {
      setScreen('neutral');
    }
  }, [playSfx]);

  useEffect(() => {
    let intervalId;
    if (!hasWindow) return;
    if (isPerforming && performanceTimer > 0) {
      intervalId = window.setInterval(() => {
        setPerformanceTimer(prev => {
          if (prev <= 1) {
            const e = elegantRef.current;
            if (e === 4) setScreen('success');
            else if (e === 3) setScreen('neutral');
            else setScreen('fail');
            setIsPerforming(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [performanceTimer, isPerforming, hasWindow]);

  const shuffledBallOptions = useMemo(() => {
    if (screen !== 'ball' || !BALL_DIALOGUES[ballStep]) return [];
    return [...BALL_DIALOGUES[ballStep].options].sort(() => Math.random() - 0.5);
  }, [ballStep, screen]);

  const petals = useMemo(() => [...Array(40)].map((_, i) => ({
    key: i,
    left: `${Math.random() * 100}%`,
    dur: 4 + Math.random() * 4,
    delay: Math.random() * 5
  })), []);

  const handleImgError = useCallback((e) => {
    try {
      e.currentTarget.style.display = 'none';
    } catch (_) {}
  }, []);

  return (
    <div className="w-full h-screen bg-[#f3e9dc] flex items-center justify-center font-serif overflow-hidden p-2 relative selection:bg-[#d4af37]/30 text-[#5d4037]">
      <audio ref={bgmRef} loop playsInline preload="none" style={{ display: 'none' }} />

      {/*
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Noto+Serif:wght@400;700&display=swap');
        @keyframes fall { 0% { transform: translateY(-5vh) rotate(0); opacity: 0; } 20% { opacity: 0.7; } 100% { transform: translateY(105vh) rotate(360deg); opacity: 0; } }
        .animate-fall { animation: fall linear infinite; }
        .royal-title { font-family: 'Pinyon Script', cursive; text-shadow: 0 4px 10px rgba(74, 20, 140, 0.3); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #b8860b, #ffd700); border-radius: 10px; }
        .gold-shimmer { background: linear-gradient(90deg, #8b6508, #daa520, #ffd700, #daa520, #8b6508); background-size: 200% auto; animation: shimmer 3s linear infinite; }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes floating { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
        .animate-floating { animation: floating 3s infinite ease-in-out; }
        @keyframes zigzag-dance {
            0%   { transform: translate(-15vw, 0); }
            25%  { transform: translate(5vw, -10vh); }
            50%  { transform: translate(15vw, 0); }
            75%  { transform: translate(-5vw, 10vh); }
            100% { transform: translate(-15vw, 0); }
        }
        @keyframes coupled-sway {
            0%, 100% { transform: rotate(-5deg); }
            50% { transform: rotate(5deg); }
        }
        @keyframes waltz-rise-fall {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-30px); }
        }
        @keyframes twerk {
            0%, 100% { transform: translateY(0) rotate(0deg) scaleY(1); }
            25% { transform: translateY(-25px) rotate(-10deg) scaleY(0.8); }
            50% { transform: translateY(0) rotate(0deg) scaleY(1.2); }
            75% { transform: translateY(-25px) rotate(10deg) scaleY(0.8); }
        }
        .dancing { animation: twerk 0.41s infinite ease-in-out; }
      `}</style>
      */} 

      {showBonusGift && (
        <div className="absolute inset-0 z-[1000] flex flex-col items-center justify-center bg-black/50 backdrop-blur-md transition-opacity duration-500">
          <div onClick={handleClaimGift} className="text-[160px] animate-gift drop-shadow-[0_30px_60px_rgba(0,0,0,0.4)] cursor-pointer hover:scale-110 active:scale-95 transition-transform select-none mb-6">🎁</div>
          <div className="bg-[#fffdfa] px-12 py-8 rounded-[3rem] border-[8px] border-double border-[#d4af37] shadow-2xl text-center transform -rotate-1 max-w-sm">
            <h3 className="text-4xl font-black text-[#5d4037] mb-2 italic">ROYAL BLESSING!</h3>
            <p className="text-xl font-bold text-[#8b4513] uppercase tracking-widest animate-pulse">Tap the gift to claim!</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl bg-[#fffdfa] rounded-[3.5rem] border-[12px] border-[#d4af37] shadow-[0_40px_80px_rgba(0,0,0,0.25)] flex flex-col relative h-full max-h-[95vh] border-double overflow-hidden z-10">

        <div className="h-14 bg-[#d4af37] flex items-center justify-between px-8 shrink-0 border-b-4 border-[#b8860b] z-[150] shadow-md">
          <div className="flex items-center gap-4 text-white cursor-pointer" onClick={() => { playSfx('click'); setLogoClickCount(prev => { const n = prev + 1; if (n >= 10) setImperialSparkles(true); return n; }); }}>
            <Crown size={24} className="animate-pulse" />
            <span className={`text-[14px] font-black tracking-[0.3em] uppercase italic ${imperialSparkles ? 'rainbow-text' : ''}`}>Royal Ball Deluxe v9.8 {imperialSparkles && '✨'}</span>
          </div>
          <button onClick={() => { playSfx('click'); setShowTutorial(true); }} className="bg-white/20 hover:bg-white/40 px-5 py-1.5 rounded-full text-white text-[12px] font-bold flex items-center gap-2 transition-all">
            <HelpCircle size={16} /> ROYAL GUIDE
          </button>
        </div>

        <div className="flex-1 flex flex-col bg-[#fdf5e6] overflow-hidden relative">

          {screen === 'start' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden h-full z-[20]">
              <div className="absolute inset-0 pointer-events-none">
                {petals.map(p => (
                  <CherryBlossomPetal key={p.key} className="absolute top-0 animate-fall w-6 h-6" style={{ left: p.left, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }} />
                ))}
              </div>
              <div className="absolute inset-0 opacity-40">
                <img
                  src="https://drive.google.com/thumbnail?id=1qlvoBIuqJee_KiZ4fMZ2EL6rAKrLi7c6&sz=w1600"
                  className="w-full h-full object-cover"
                  alt="garden"
                  loading="eager"
                  decoding="async"
                  onError={handleImgError}
                />
              </div>
              <div className="text-center z-10 mb-6 max-w-2xl">
                <h1 className="text-[3rem] md:text-[4.5rem] royal-title text-[#4a148c] leading-tight pb-4">Training Soongsoongyi</h1>
                <div className="mt-2 text-[#8b4513] font-black tracking-[0.5em] uppercase text-[12px]">The Grand Imperial Ball</div>
              </div>
              <Soongyi size="text-[130px]" className="animate-bounce mb-10 z-10" />
              <button onClick={handleStartInteraction} className="z-20 gold-shimmer text-white px-16 py-5 rounded-full text-2xl font-black shadow-[0_10px_0_#6b4a06] hover:scale-105 active:translate-y-2 uppercase tracking-widest border-2 border-white/40">Start Protocol</button>
            </div>
          )}

          {screen === 'intro' && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#fdf5e6] z-[20] relative text-center">
              <div className="absolute inset-0 opacity-60">
                <img
                  src="https://drive.google.com/thumbnail?id=1BVJTLAoghOaYHB-Qor3VwFxAqDn8tFA8&sz=w1600"
                  className="w-full h-full object-cover"
                  alt="background"
                  loading="eager"
                  decoding="async"
                  onError={handleImgError}
                />
              </div>
              <Soongyi size="text-[140px]" className="mb-4 z-10 animate-floating" />
              <div className="w-full max-w-xl bg-white/90 backdrop-blur-md rounded-[3rem] p-10 border-[6px] border-[#d4af37] border-double z-10 shadow-2xl relative">
                <p className="text-2xl font-serif font-bold text-[#5d4037] italic leading-relaxed">"{INTRO_STEPS[introIdx].text}"</p>
                <div className="mt-10 flex justify-end">
                  <button
                    onClick={() => { playSfx('click'); introIdx < 4 ? setIntroIdx(introIdx + 1) : setScreen('play'); }}
                    className="flex items-center gap-2 bg-[#5d4037] text-white px-10 py-4 rounded-2xl font-black text-xl hover:bg-[#8b4513] uppercase shadow-lg transition-transform active:scale-95"
                  >
                    Continue <ChevronRight size={22} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {screen === 'play' && (
            <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 bg-[#faf3e0] relative z-[20] overflow-hidden">
              <div className="w-full md:w-72 flex flex-col border-4 border-[#d4af37]/30 rounded-[2.5rem] shadow-xl shrink-0 h-full bg-[#f5efe1]/90 p-5 overflow-y-auto custom-scrollbar">
                <div className="bg-white p-5 rounded-[2.5rem] border-4 border-[#d4af37] text-center shadow-lg mb-6">
                  <div
                    onClick={() => {
                      playSfx('click');
                      setMonkeyClickCount(prev => {
                        const n = prev + 1;
                        if (n === 7) {
                          setStats(s => ({ ...s, intellect: 100, fluency: 100, gold: s.gold + 100 }));
                          setLog(l => ['[SECRET] Golden Banana Blessing!', ...l.slice(0, 10)]);
                          playSfx('start');
                        }
                        return n;
                      });
                    }}
                    className="cursor-pointer transition-transform active:scale-110"
                  >
                    <Soongyi size="text-[70px]" className="mb-2" />
                  </div>
                  <div
                    className="bg-[#d4af37] text-white text-2xl font-black py-1.5 rounded-full shadow-md cursor-pointer"
                    onClick={() => {
                      playSfx('click');
                      setDayClickCount(prev => {
                        const n = prev + 1;
                        if (n === 3) {
                          setStats(s => ({ ...s, energy: Math.min(100, s.energy + 20) }));
                          setLog(l => ['[SECRET] Spirit Tea! +20 Energy', ...l.slice(0, 10)]);
                          playSfx('correct');
                        }
                        return n;
                      });
                    }}
                  >
                    Day {day}/7
                  </div>
                </div>
                <div className="space-y-5 mb-6">
                  <StatBar label="Intellect" val={stats.intellect} max={100} color="bg-indigo-600" threshold={90} />
                  <StatBar label="Fluency" val={stats.fluency} max={100} color="bg-emerald-600" threshold={90} />
                  <StatBar label="Energy" val={stats.energy} max={100} color="bg-rose-500" threshold={50} />
                  <div className="bg-white p-3 rounded-2xl border-2 border-[#d4af37]/20 flex justify-between items-center shadow-sm">
                    <Coins size={20} className="text-[#d4af37]" />
                    <span className="text-[#8b4513] text-xl font-black">${stats.gold}</span>
                  </div>
                </div>
                <button onClick={handleRestartGame} className="bg-[#d32f2f] text-white py-2.5 rounded-2xl font-black uppercase text-[11px] flex items-center justify-center gap-2 hover:bg-red-700 transition-colors shadow-md active:translate-y-1 mb-6">
                  <RefreshCw size={14} /> Restart Protocol
                </button>
                <div className="flex-1 bg-[#3d2b1f] p-4 rounded-3xl border-2 border-[#c19a6b]/40 shadow-inner flex flex-col min-h-[150px] overflow-hidden">
                  <div className="text-[11px] font-black text-[#ffd700] uppercase mb-2 flex items-center gap-2 border-b border-[#c19a6b]/30 pb-2">
                    <MessageCircle size={14} /> Activity Log
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar text-white/90 text-[11px] italic leading-relaxed">
                    {log.map((l, i) => <div key={i} className="mb-2 border-l-2 border-[#ffd700]/40 pl-2">{l}</div>)}
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-white/60 border-4 border-[#d4af37]/30 rounded-[3.5rem] p-8 backdrop-blur-lg shadow-2xl flex flex-col overflow-hidden">
                <div className="flex justify-between items-center mb-8 border-b-4 border-double border-[#d4af37]/30 pb-4 flex-wrap gap-2">
                  <h3
                    className="text-3xl font-black text-[#5d4037] italic uppercase flex items-center gap-3 cursor-pointer"
                    onClick={() => {
                      playSfx('click');
                      setCurriculumClickCount(prev => {
                        const n = prev + 1;
                        if (n === 5) {
                          setStats(s => ({ ...s, gold: s.gold + 150 }));
                          setLog(l => ['[SECRET] Scholarship Grant! +$150', ...l.slice(0, 10)]);
                          playSfx('start');
                        }
                        return n;
                      });
                    }}
                  >
                    <Landmark size={32} className="text-[#d4af37]" /> Curriculum
                  </h3>
                  <div className="text-[12px] font-bold text-[#8b4513] animate-pulse uppercase">Target: Int 90 | Flu 90 | Ene 50</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
                  {[
                    { id: 'lit', name: 'Elite Literature', icon: <BookOpen size={24} />, desc: "Focus on Intellect." },
                    { id: 'talk', name: 'Royal Rhetoric', icon: <GraduationCap size={24} />, desc: "Focus on Fluency." },
                    { id: 'work', name: 'Imperial Cafe', icon: <UtensilsCrossed size={24} />, desc: "Earn Gold | Ene -15." },
                    { id: 'rest', name: 'Celestial Spa', icon: <Waves size={24} />, desc: "Cost $30 | Ene +35." }
                  ].map(act => (
                    <button key={act.id} onClick={() => handleActionClick(act)} className="bg-white/90 p-6 rounded-[3rem] border-4 border-transparent hover:border-[#d4af37] text-center shadow-xl active:scale-95 group transition-all flex flex-col items-center justify-center">
                      <div className="p-4 bg-[#fdf5e6] rounded-[1.5rem] mb-4 text-[#d4af37] group-hover:scale-110 transition-transform shadow-sm">{act.icon}</div>
                      <div className="text-xl font-black text-[#5d4037] mb-2">{act.name}</div>
                      <div className="text-[12px] font-bold text-[#8b4513] opacity-70 uppercase">{act.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentQuizIdx >= 0 && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
              <div className="bg-[#fffdfa] rounded-[3.5rem] border-[8px] border-[#d4af37] w-full max-w-lg relative shadow-2xl p-8 border-double">
                <button
                  onClick={() => {
                    playSfx('click');
                    clearAllTimeouts();
                    setCurrentQuizIdx(-1);
                    setSelectedIdx(null);
                    setFeedbackStatus(null);
                    setWrongFeedback(false);
                  }}
                  className="absolute -top-4 -right-4 p-3 text-white bg-[#5d4037] rounded-full border-4 border-[#d4af37]"
                >
                  <X size={24} />
                </button>
                {wrongFeedback && <div className="absolute inset-0 bg-red-900/95 z-50 flex flex-col items-center justify-center p-8 text-white rounded-[3.5rem]"><AlertTriangle size={64} className="animate-bounce mb-4" /><h2 className="text-4xl font-black uppercase italic">TRY AGAIN!</h2></div>}
                <h2 className="text-xl font-black text-center text-[#5d4037] mb-4 border-b-4 border-double border-[#d4af37]/20 pb-2 flex items-center justify-center gap-3"><Music size={20} className="text-[#d4af37]" /> STEP {currentQuizIdx + 1}/4</h2>
                <div className="bg-[#fdf5e6] p-6 rounded-[2rem] text-center mb-6 shadow-inner border-2 border-[#d4af37]/10"><p className="text-xl font-bold italic text-gray-700">"{quizQueue[currentQuizIdx]?.q}"</p></div>
                <div className="space-y-3">
                  {quizQueue[currentQuizIdx]?.a.map((opt, i) => (
                    <button
                      key={i}
                      disabled={selectedIdx !== null}
                      onClick={() => handleQuizAnswer(i, i === quizQueue[currentQuizIdx].correct)}
                      className={`w-full text-left px-6 py-4 rounded-[1.5rem] border-[3px] font-black text-base transition-all flex justify-between items-center ${
                        selectedIdx === i
                          ? (feedbackStatus === 'correct' ? 'bg-emerald-600 text-white border-emerald-800' : 'bg-rose-600 text-white border-rose-800')
                          : 'bg-white border-gray-100 hover:border-[#d4af37]/40 shadow-sm'
                      }`}
                    >
                      <span>{String.fromCharCode(65 + i)}. {opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {screen === 'ball' && (
            <div className="flex-1 flex flex-col items-center justify-center p-4 bg-[#1a1a2e] z-[20] relative overflow-y-auto">
              <div className="text-center z-10 w-full max-w-xl bg-white/5 backdrop-blur-2xl rounded-[3rem] p-8 border-4 border-[#d4af37] shadow-2xl">
                <div className="text-[60px] mb-6 flex justify-center gap-4 animate-bounce">👸👑<Soongyi size="text-[60px]" /></div>
                <h2 className="text-3xl royal-title text-[#ffd700] mb-6 border-b-2 border-[#d4af37]/30 pb-2">The Royal Conversation</h2>
                <div className="bg-white/10 p-6 rounded-[2rem] mb-6 border border-white/10 shadow-inner"><p className="text-lg text-white font-serif italic leading-snug">"{BALL_DIALOGUES[ballStep]?.prince}"</p></div>
                <div className="grid grid-cols-1 gap-3 w-full">
                  {shuffledBallOptions.map((opt, i) => (
                    <button key={`${ballStep}-${i}`} onClick={() => handleBallChoice(opt.type)} className="bg-white/5 hover:bg-[#d4af37] text-white hover:text-black py-4 px-6 rounded-[1.2rem] font-black text-sm transition-all border border-[#d4af37]/30 group flex items-center justify-between text-left">
                      <span>{opt.text}</span><ChevronRight size={18} className="opacity-0 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {screen === 'dance-choice' && (
            <div className="flex-1 flex flex-col items-center justify-center p-4 z-[20] relative bg-cover bg-center" style={{ backgroundImage: "url('https://storage.googleapis.com/eunyeongsmusicfiles/beautiful-castle-architecture.jpg')" }}>
              <div className="absolute inset-0 bg-black/50"></div>
              <div className="w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-[2.5rem] border-[6px] border-double border-[#d4af37] p-8 z-20 shadow-2xl text-center">
                <p className="text-xl font-bold text-[#5d4037] mb-8 leading-relaxed">"Prince Soongyi wants to dance with Soongsoongyi. Which music would you choose for them?"</p>
                <div className="grid grid-cols-1 gap-4">
                  <button onClick={() => handleDanceMusic('classical')} className="bg-[#d4af37] text-white py-4 rounded-2xl font-black hover:bg-[#b8860b] transition-all text-lg shadow-lg border-2 border-white/20">Classical Waltz music</button>
                  <button onClick={() => handleDanceMusic('hiphop')} className="bg-[#d4af37] text-white py-4 rounded-2xl font-black hover:bg-[#b8860b] transition-all text-lg shadow-lg border-2 border-white/20">Hip hop music</button>
                  <button onClick={() => handleDanceMusic('reject')} className="bg-[#d4af37] text-white py-4 rounded-2xl font-black hover:bg-[#b8860b] transition-all text-lg shadow-lg border-2 border-white/20">Soongsoongyi rejects his offer to dance.</button>
                </div>
              </div>
            </div>
          )}

          {screen === 'performance-waltz' && (
            <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
              <div className="absolute inset-0 z-1" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('https://storage.googleapis.com/eunyeongsmusicfiles/beautiful-castle-architecture.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div className="absolute inset-0 z-2 pointer-events-none" style={{ background: "radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)" }}></div>

              {!isPerforming ? (
                <div onClick={() => startActualPerformance('waltz')} className="z-[100] bg-white/95 p-12 rounded-[5rem] cursor-pointer text-center shadow-2xl border-4 border-[#d4af37] hover:scale-105 transition-transform">
                  <div className="text-3xl font-black text-gray-800">Start Performance 🎵</div>
                  <div className="text-sm text-gray-500 mt-2 italic">An elegant 1-minute grand waltz</div>
                </div>
              ) : (
                <div className="z-10 w-full h-full flex items-center justify-center overflow-hidden">
                  <div className="couple-container animate-[zigzag-dance_15s_infinite_linear]">
                    <div className="dance-pivot relative flex items-center justify-center gap-12 animate-[coupled-sway_4s_infinite_ease-in-out]">
                      <div className="flex flex-col items-center drop-shadow-2xl animate-[waltz-rise-fall_3s_infinite_ease-in-out] delay-0">
                        <div className="text-[80px] mb-[-40px] z-50">👑</div>
                        <div className="text-[150px]">🐒</div>
                      </div>
                      <div className="flex flex-col items-center drop-shadow-2xl animate-[waltz-rise-fall_3s_infinite_ease-in-out] delay-500">
                        <div className="text-[150px] relative">
                          🐒
                          <div className="absolute bottom-[20px] right-[-20px] text-[60px] rotate-[-15deg] z-50">🎀</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[100] bg-white/90 px-8 py-3 rounded-full font-black shadow-xl text-[#4a148c] animate-pulse">Waltz: {performanceTimer}s</div>
                </div>
              )}
            </div>
          )}

          {screen === 'performance-hiphop' && (
            <div className="flex-1 relative overflow-hidden bg-black flex flex-col items-center justify-center">
              <div className="absolute inset-0 z-1" style={{ backgroundImage: "url('https://storage.googleapis.com/eunyeongsmusicfiles/beautiful-castle-architecture.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div className="absolute inset-0 z-2 pointer-events-none bg-black/40"></div>

              {!isPerforming ? (
                <div onClick={() => startActualPerformance('hiphop')} className="z-[100] bg-white/95 p-12 rounded-[5rem] cursor-pointer text-center shadow-2xl border-4 border-[#d4af37] hover:scale-105 transition-transform">
                  <div className="text-3xl font-black text-gray-800">Start Performance 🎵</div>
                  <div className="text-sm text-gray-500 mt-2 italic">The grand hip hop is ready</div>
                </div>
              ) : (
                <div className="relative z-10 flex justify-around items-end w-full max-w-4xl h-[500px]">
                  <div className="monkey-group dancing flex flex-col items-center relative">
                    <div className="text-[80px] mb-[-40px] z-20">👑</div>
                    <div className="text-[180px]">🐒</div>
                  </div>
                  <div className="monkey-group dancing flex flex-col items-center relative">
                    <div className="text-[180px]">🐒</div>
                    <div className="absolute bottom-[25px] right-[-35px] text-[70px] z-20">🎀</div>
                  </div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 z-[100] bg-white/90 px-8 py-3 rounded-full font-black shadow-xl text-[#4834d4] animate-pulse">Hip Hop: {performanceTimer}s</div>
                </div>
              )}
            </div>
          )}

          {['success', 'neutral', 'fail'].includes(screen) && (
            <div className="flex-1 flex flex-col items-center p-10 text-center bg-white z-[20] overflow-y-auto custom-scrollbar h-full">
              <div className="text-[100px] mb-6 animate-bounce flex-shrink-0">
                {screen === 'success' ? '👑👸🌹' : screen === 'neutral' ? '📜🏠📜' : '🐒🌪️🧐'}
              </div>
              <h2 className="text-5xl royal-title mb-6 text-[#4a148c] flex-shrink-0">
                {screen === 'success' ? 'Supreme Royal Grand Lady' : screen === 'neutral' ? 'The Jungle Philosopher' : 'The Fallen Noble Exile'}
              </h2>
              <div className="text-lg max-w-3xl italic text-gray-700 mb-8 bg-[#fdf5e6] p-10 rounded-[3rem] border-8 border-double border-[#d4af37] shadow-xl text-left leading-relaxed">
                {screen === 'success' && "Soongsoongyi has become a living legend of the London social scene! Her flawless grammar and impeccable Oxbridge poise dazzled everyone in the Royal Court. Prince Soongyi was so deeply moved by her noble spirit and heart of gold that he proposed instantly under a shower of rose petals. Together, they established the Soong-Imperial Trust, ensuring every primate has access to high-quality bananas and an Oxford education. They ruled both the social scene and the banana plantations in perfect harmony for eternity, becoming a symbol of grace and wisdom for generations to come."}
                {screen === 'neutral' && "Although Soongsoongyi didn't quite manage to wear the royal crown perfectly in London, she has emerged as the most intellectual figure in the entire jungle. She built a grand academy made of bamboo and ivory, teaching Shakespeare and teatime etiquettes to her fellow students. The jungle is no longer a place of wild chaos, but a refined domain of poetry and high-quality Earl Grey tea. She is widely respected as the Great Sage of the West, and though she occasionally gazes at the London stars with a wistful sigh, she is truly happy bringing culture to her home."}
                {screen === 'fail' && "Alas! The protocol was breached too many times, and the scandal of her grammar mistakes or social clumsiness reached the ears of the King. Soongsoongyi has been exiled from the Royal Court for her lack of linguistic and social refinement. She now lives in a remote, mossy tree, wearing a cracked monocle and writing tragic poems on banana peels using old berry juice. The Prince wept as her carriage left for the wild, but social etiquette is absolute. She is now known as the 'Fallen Muse of the Forest', a haunting reminder that a noble heart needs a noble tongue to survive the cold London winters."}
              </div>
              <button onClick={handleRestartGame} className="gold-shimmer text-white px-20 py-6 rounded-full font-black text-3xl shadow-[0_10px_0_#4a3705] transition-all uppercase border-4 border-white/40 active:translate-y-2 mb-8 flex-shrink-0">Restart Protocol</button>
            </div>
          )}
        </div>
      </div>

      {showTutorial && (
        <div className="absolute inset-0 bg-black/98 z-[400] flex items-center justify-center p-4 backdrop-blur-3xl font-serif">
          <div className="bg-[#fffdfa] rounded-[5rem] border-[14px] border-[#c19a6b] w-full max-w-4xl p-8 relative shadow-2xl h-[90vh] flex flex-col border-double overflow-hidden">
            <button onClick={() => { playSfx('click'); setShowTutorial(false); }} className="absolute top-6 right-6 p-3 text-gray-400 hover:text-rose-500 transition-all z-10"><X size={36} /></button>
            <h2 className="text-4xl md:text-5xl font-black text-[#8b4513] uppercase mb-8 border-b-4 border-[#c19a6b]/30 pb-4 flex items-center gap-6"><ScrollText size={48} /> Royal Manual v9.8</h2>
            <div className="flex-1 overflow-y-auto space-y-12 custom-scrollbar px-6 text-xl text-gray-700 leading-relaxed pb-8">
              <section className="space-y-4">
                <h3 className="text-3xl font-black text-[#8b0000] border-l-8 border-[#8b0000] pl-6 italic uppercase">I. The Noble Social Ascent</h3>
                <p className="italic bg-[#fdf5e6] p-6 rounded-2xl border border-[#d4af37]/20 shadow-inner">Esteemed Tutor, your noble mission is to refine Soongsoongyi into a paragon of the high imperial society within 7 suns. Every academic pursuit, every piece of literature read, and every etiquette choice made will echo through the majestic halls of the Empire. Do not falter, for the Prince's heart and the future of the dynasty await your guidance. Eunyeong teacher also wishes you peace and success.</p>
              </section>
              <section className="space-y-4">
                <h3 className="text-3xl font-black text-[#8b0000] border-l-8 border-[#8b0000] pl-6 italic uppercase">II. Imperial Qualifications & Penalties</h3>
                <p className="text-lg mb-4">To stand beside the Prince at the Grand Ball, Soongsoongyi must meet the following minimum requirements by the end of Day 7:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-black text-center">
                  <div className="bg-indigo-50 p-6 rounded-3xl border-2 border-indigo-100 shadow-sm"><div className="text-indigo-800 text-3xl">Int 90+</div><div className="text-xs uppercase mt-2 font-bold italic">Mastery of Literature</div></div>
                  <div className="bg-emerald-50 p-6 rounded-3xl border-2 border-emerald-100 shadow-sm"><div className="text-emerald-800 text-3xl">Flu 90+</div><div className="text-xs uppercase mt-2 font-bold italic">Rhetorical Excellence</div></div>
                  <div className="bg-rose-50 p-6 rounded-3xl border-2 border-emerald-100 shadow-sm"><div className="text-rose-800 text-3xl">Ene 50+</div><div className="text-xs uppercase mt-2 font-bold italic">Noble Stamina</div></div>
                </div>
                <div className="p-5 bg-rose-50 border-2 border-rose-100 rounded-2xl text-rose-800 text-base leading-relaxed">
                  <p className="font-bold flex items-center gap-2 mb-2"><AlertTriangle size={20}/> ROYAL WARNINGS:</p>
                  <ul className="list-disc pl-5 space-y-1 italic">
                    <li>Four grammatical errors in a single curriculum session will result in immediate protocol failure and exile.</li>
                    <li>If stat requirements are not met by Night 7, you will trigger the "Jungle Philosopher" ending.</li>
                    <li>Excessive fatigue (0 Energy) will hinder Soongsoongyi's learning capabilities.</li>
                  </ul>
                </div>
              </section>
              <section className="space-y-4">
                <h3 className="text-3xl font-black text-emerald-700 border-l-8 border-emerald-700 pl-6 italic uppercase">III. Forbidden Secret Protocols</h3>
                <p className="text-lg opacity-80">Only the most observant tutors can invoke these ancient blessings:</p>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white p-6 rounded-2xl border-2 border-emerald-100 shadow-md flex items-center gap-4 hover:scale-[1.02] transition-transform">
                    <Sparkle className="text-emerald-500 shrink-0" size={32} />
                    <div>
                      <p className="font-black text-emerald-900 text-xl">Monkey Spirit Resonance</p>
                      <p className="text-sm opacity-80 italic">Touch the status bar monkey 7 times to invoke an Imperial Blessing: +100 Intellect, +100 Fluency, and +$100 Gold.</p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border-2 border-emerald-100 shadow-md flex items-center gap-4 hover:scale-[1.02] transition-transform">
                    <Trophy className="text-emerald-500 shrink-0" size={32} />
                    <div>
                      <p className="font-black text-emerald-900 text-xl">Imperial Scholarship</p>
                      <p className="text-sm opacity-80 italic">Tap the "Curriculum" header 5 times. The Royal Treasury will award a $150 stipend for your academic dedication.</p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border-2 border-emerald-100 shadow-md flex items-center gap-4 hover:scale-[1.02] transition-transform">
                    <Headphones className="text-emerald-500 shrink-0" size={32} />
                    <div>
                      <p className="font-black text-emerald-900 text-xl">Celestial Afternoon Tea</p>
                      <p className="text-sm opacity-80 italic">Gazing at the Date/Day indicator 3 times will soothe Soongsoongyi's soul, restoring 20 Vitality (Energy) instantly.</p>
                    </div>
                  </div>
                </div>
              </section>
              <section className="space-y-4">
                <h3 className="text-3xl font-black text-[#4a148c] border-l-8 border-[#4a148c] pl-6 italic uppercase">IV. The Grand Finale & Conversation</h3>
                <p className="italic bg-[#f3e9dc] p-6 rounded-2xl border border-[#d4af37]/20 shadow-inner">On the 8th day, the Grand Ball commences. Your conversational choices with the Prince are paramount. To achieve the <strong>Success Ending</strong>, you must choose the 'Elegant' response in all 4 dialogues. A single lapse in social grace will lead to a Neutral fate, while two or more clumsy remarks will result in a tragic Failure.</p>
              </section>
            </div>
            <button onClick={() => { playSfx('start'); setShowTutorial(false); }} className="mt-4 bg-[#5d4037] text-white py-6 rounded-[3rem] font-black text-3xl uppercase shadow-2xl hover:bg-black active:scale-95 border-b-8 border-black transition-all">I ACCEPT YOUR OFFER!</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      const MAX_DAYS = 7;
      <AppInner />
    </ErrorBoundary>
  );
}
