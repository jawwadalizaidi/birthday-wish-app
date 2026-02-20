import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, Copy, Check, PartyPopper, Gift, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [hobby, setHobby] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name) return;

    setIsGenerating(true);
    setIsCopied(false);

    try {
      const prompt = `Write a funny birthday card message for someone named ${name} who is turning ${age} years old and loves ${hobby}. Keep it concise, suitable for writing inside a physical greeting card. Do not include placeholder brackets or subject lines. Just the message itself.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setGeneratedMessage(response.text || 'Could not generate a message. Please try again.');
    } catch (error) {
      console.error('Error generating message:', error);
      setGeneratedMessage('An error occurred while generating the message. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center justify-center font-sans bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-xl border border-white/60">
          <div className="flex items-center gap-3 mb-2 text-orange-500">
            <PartyPopper size={24} strokeWidth={2} />
            <span className="text-sm font-bold tracking-widest uppercase">Party Time</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8 text-stone-800 leading-tight">
            Craft a <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">hilarious</span><br/>birthday wish! 🎈
          </h1>

          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Who is celebrating?</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-orange-400 focus:ring focus:ring-orange-100 transition-all outline-none bg-white/90"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Age turning</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 30"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-orange-400 focus:ring focus:ring-orange-100 transition-all outline-none bg-white/90"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Favorite Hobby</label>
              <input
                type="text"
                value={hobby}
                onChange={(e) => setHobby(e.target.value)}
                placeholder="e.g. knitting, playing golf, eating pizza..."
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-orange-400 focus:ring focus:ring-orange-100 transition-all outline-none bg-white/90"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating || !name || !age || !hobby}
              className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="animate-spin" size={20} />
                  Brewing jokes...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Laughs
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Result */}
        <div className="h-full flex flex-col">
          <AnimatePresence mode="wait">
            {generatedMessage ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] h-full flex flex-col relative border border-white/60 shadow-xl"
              >
                <div className="absolute -top-6 -right-6 text-6xl animate-bounce" style={{ animationDuration: '3s' }}>🎉</div>
                <div className="flex-1 flex items-center justify-center">
                  <p className="font-serif text-2xl md:text-3xl text-stone-800 leading-relaxed text-center whitespace-pre-wrap">
                    "{generatedMessage}"
                  </p>
                </div>
                
                <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-6 py-3 bg-stone-100 rounded-full text-stone-700 font-semibold hover:bg-stone-200 hover:shadow-md transition-all"
                  >
                    {isCopied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                    {isCopied ? 'Copied!' : 'Copy to clipboard'}
                  </button>
                  <button
                    onClick={() => handleGenerate()}
                    className="flex items-center gap-2 px-6 py-3 bg-orange-100 rounded-full text-orange-700 font-semibold hover:bg-orange-200 hover:shadow-md transition-all"
                  >
                    <RefreshCw size={18} />
                    Try another
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white/40 backdrop-blur-sm border-2 border-dashed border-orange-300/50 p-8 md:p-12 rounded-[2rem] h-full flex flex-col items-center justify-center text-center min-h-[400px] shadow-sm"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-rose-400 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20 text-white">
                  <Gift size={32} />
                </div>
                <h3 className="font-serif text-3xl text-stone-800 mb-3 font-bold">Ready for laughs?</h3>
                <p className="text-stone-600 max-w-sm text-lg">
                  Fill out the details on the left and we'll craft a hilariously personalized message for their special day.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
