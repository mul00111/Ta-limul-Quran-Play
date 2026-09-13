import React, { useState } from 'react';
import { X, Play, Info, ArrowRight, Gamepad2, Puzzle, Volume2, VolumeX } from 'lucide-react';
import { meemSakinWords, meemSakinRules } from '../data/meemSakinData';
import { playQariText, playWordWithHijjaAndPronunciation, stopAllQariAudio } from '../utils/qariAudioService';
import { motion, AnimatePresence } from 'motion/react';
import { MeemSakinGameModal } from './MeemSakinGameModal';
import { MeemSakinPuzzleGameModal } from './MeemSakinPuzzleGameModal';

interface MeemSakinLessonModalProps {
  onBack: () => void;
  onOpenGamesHub?: () => void;
}

export function MeemSakinLessonModal({ onBack, onOpenGamesHub }: MeemSakinLessonModalProps) {
  const [activeRule, setActiveRule] = useState<string>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<any | null>(null);
  const [showGameModal, setShowGameModal] = useState<boolean>(false);
  const [showPuzzleModal, setShowPuzzleModal] = useState<boolean>(false);
  const [pronunciationMode, setPronunciationMode] = useState<'rawani' | 'hijja'>('rawani');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const filteredWords = activeRule === 'all' 
    ? meemSakinWords 
    : meemSakinWords.filter(w => {
        if (activeRule === 'idgham') return w.rule === 'Idgham Shafawi';
        if (activeRule === 'ikhfa') return w.rule === 'Ikhfa Shafawi';
        if (activeRule === 'izhar') return w.rule === 'Izhar Shafawi';
        return true;
      });

  const handlePlay = (word: any) => {
    if (isMuted) return;
    if (playingId === word.id) return;
    setPlayingId(word.id);
    setSelectedWord(word);
    
    if (pronunciationMode === 'hijja') {
      playWordWithHijjaAndPronunciation(word.spellingHijja, word.arabic);
      setTimeout(() => setPlayingId(null), 2000);
    } else {
      playQariText(word.arabic, () => setPlayingId(null));
    }
  };

  const getRuleColor = (ruleName: string) => {
    switch (ruleName) {
      case 'Idgham Shafawi': return 'bg-green-100 text-green-800 border-green-300';
      case 'Ikhfa Shafawi': return 'bg-red-100 text-red-800 border-red-300';
      case 'Izhar Shafawi': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-[#fcfaf5] border-4 border-emerald-600/80 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 font-urdu" dir="rtl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="inline-block px-8 py-2 rounded-full bg-emerald-700 text-white font-black text-base sm:text-lg shadow-lg border-2 border-emerald-500">
          سبق ۱۱: میم ساکن کے قواعد
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center">
          {/* Audio Mute Button */}
          <button
            onClick={() => {
              const newMuted = !isMuted;
              setIsMuted(newMuted);
              if (newMuted) stopAllQariAudio();
            }}
            className={`p-2.5 rounded-full border-2 transition-all shadow-sm ${
              isMuted ? 'bg-rose-100 text-rose-700 border-rose-300' : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
            }`}
            title={isMuted ? 'آواز بند ہے' : 'آواز چالو ہے'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Pronunciation Mode Toggle */}
          <div className="bg-slate-900/90 rounded-full p-1 border border-amber-500/40 flex items-center shadow-inner">
            <button
              onClick={() => setPronunciationMode('rawani')}
              className={`px-4 py-1.5 rounded-full font-urdu text-sm transition-all ${
                pronunciationMode === 'rawani'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              روانی
            </button>
            <button
              onClick={() => setPronunciationMode('hijja')}
              className={`px-4 py-1.5 rounded-full font-urdu text-sm transition-all ${
                pronunciationMode === 'hijja'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              ہجے
            </button>
          </div>

          {/* Puzzle Button */}
          <button
            onClick={() => setShowPuzzleModal(true)}
            className="px-4 py-2 rounded-2xl font-urdu font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-500 hover:to-amber-600 transition-all shadow-md flex items-center gap-2 border-2 border-amber-300 cursor-pointer"
          >
            <Puzzle className="w-4 h-4" />
            مقناطیسی پزل
          </button>

          {/* Games Button */}
          <button
            onClick={() => setShowGameModal(true)}
            className="px-4 py-2 rounded-2xl font-urdu font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md flex items-center gap-2 border-2 border-emerald-400 cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4" />
            صوتی و بصری گیمز 🎯
          </button>

          {/* Back Button */}
          <button
            onClick={() => {
              stopAllQariAudio();
              onBack();
            }}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black border border-amber-500/30 hover:border-amber-400 shrink-0 shadow-lg cursor-pointer"
            title="واپس جائیں"
          >
            <ArrowRight className="w-4 h-4 text-amber-400" />
            <span>واپسی</span>
          </button>
        </div>
      </div>

      {/* Filters & Rules */}
      <div className="p-4 bg-emerald-50 border-b border-emerald-100 rounded-2xl">
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          <button
            onClick={() => setActiveRule('all')}
            className={`px-5 py-2.5 rounded-xl font-urdu text-lg transition-all cursor-pointer ${
              activeRule === 'all' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            تمام قواعد
          </button>
          {meemSakinRules.map(rule => (
            <button
              key={rule.id}
              onClick={() => setActiveRule(rule.id)}
              className={`px-5 py-2.5 rounded-xl font-urdu text-lg transition-all cursor-pointer ${
                activeRule === rule.id 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              {rule.title}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeRule !== 'all' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {meemSakinRules.filter(r => r.id === activeRule).map(rule => (
                <div key={rule.id} className={`p-4 rounded-xl border ${rule.color} flex items-start gap-4`}>
                  <Info className="w-6 h-6 shrink-0 mt-1" />
                  <p className="font-urdu text-lg leading-relaxed">{rule.description}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-4">
        
        {/* Main Grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 rounded-2xl border border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWords.map((word) => (
              <motion.button
                key={word.id}
                layout
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePlay(word)}
                className={`relative p-6 rounded-2xl border-2 transition-all group overflow-hidden cursor-pointer ${
                  playingId === word.id 
                    ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100' 
                    : selectedWord?.id === word.id
                    ? 'border-emerald-300 bg-white shadow-md'
                    : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md'
                }`}
              >
                <div className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-urdu border ${getRuleColor(word.rule)}`}>
                  {word.rule === 'Idgham Shafawi' && 'ادغامِ شفوی'}
                  {word.rule === 'Ikhfa Shafawi' && 'اخفائے شفوی'}
                  {word.rule === 'Izhar Shafawi' && 'اظہارِ شفوی'}
                </div>
                
                <div className="h-24 flex items-center justify-center mt-4 mb-2">
                  <span className="text-4xl md:text-5xl font-arabic text-slate-800 leading-tight">
                    {word.arabic}
                  </span>
                </div>
                
                {playingId === word.id && (
                  <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center backdrop-blur-[1px]">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                      <div className="w-6 h-6 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Details Sidebar */}
        <div className="w-full md:w-80 bg-white border border-slate-200 rounded-2xl p-6 overflow-y-auto shadow-sm flex flex-col items-center text-center">
          {selectedWord ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full"
            >
              <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-urdu border mb-6 ${getRuleColor(selectedWord.rule)}`}>
                {selectedWord.rule === 'Idgham Shafawi' && 'ادغامِ شفوی'}
                {selectedWord.rule === 'Ikhfa Shafawi' && 'اخفائے شفوی'}
                {selectedWord.rule === 'Izhar Shafawi' && 'اظہارِ شفوی'}
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-6 relative overflow-hidden">
                <div className="text-4xl md:text-5xl font-arabic text-slate-800 leading-loose mb-2">
                  {selectedWord.arabic}
                </div>
                <div className="text-emerald-600 font-urdu text-xl mt-4">
                  {selectedWord.urduTranslation}
                </div>
              </div>
              
              <button
                onClick={() => handlePlay(selectedWord)}
                disabled={playingId === selectedWord.id}
                className="w-full py-4 rounded-xl bg-emerald-600 text-white font-urdu text-xl flex items-center justify-center gap-2 hover:bg-emerald-700 disabled:opacity-70 transition-colors shadow-lg shadow-emerald-200 mb-6 cursor-pointer"
              >
                <Play className="w-5 h-5" fill="currentColor" />
                {playingId === selectedWord.id ? 'پڑھا جا رہا ہے...' : 'تلاوت سنیں'}
              </button>

              <div className="text-right w-full">
                <h3 className="text-slate-500 font-urdu text-lg mb-3 flex items-center gap-2 justify-end border-b pb-2">
                  <Info className="w-4 h-4" /> ہجے (Spelling)
                </h3>
                <p className="font-urdu text-xl leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {selectedWord.spellingHijja}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
              <Info className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-urdu text-xl text-center">
                تفصیلات اور ہجے دیکھنے کے لیے<br/>کسی بھی لفظ پر کلک کریں
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Game Modal */}
      {showGameModal && (
        <MeemSakinGameModal
          isOpen={showGameModal}
          onClose={() => setShowGameModal(false)}
        />
      )}

      {/* Puzzle Modal */}
      {showPuzzleModal && (
        <MeemSakinPuzzleGameModal
          isOpen={showPuzzleModal}
          onClose={() => setShowPuzzleModal(false)}
        />
      )}
    </div>
  );
}
