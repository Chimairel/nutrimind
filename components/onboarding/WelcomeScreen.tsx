import { ArrowRight } from 'lucide-react';

export default function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col h-full items-center justify-center text-center px-4 space-y-8 animate-in fade-in zoom-in-95 duration-700">
      <div className="space-y-5">
        <div className="mx-auto w-24 h-24 bg-green-100 rounded-[2rem] flex items-center justify-center shadow-inner mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-green-200/50 to-transparent" />
          <span className="text-4xl relative z-10">🥑</span>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">NutriMind</h1>
        <p className="text-gray-500 text-[15px] max-w-xs mx-auto leading-relaxed font-medium">
          Your personal AI nutritionist tailored specifically for authentic Filipino cuisine.
        </p>
      </div>

      <button 
        onClick={onStart}
        className="group flex w-full max-w-sm items-center justify-center space-x-2 bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 active:scale-[0.98] transition-all shadow-xl shadow-green-600/20 focus:outline-none focus:ring-2 focus:ring-green-600/50"
      >
        <span>Get Started</span>
        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
}
