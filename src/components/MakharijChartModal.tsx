import React from 'react';
import { motion } from 'motion/react';
import { Volume2, ArrowRight } from 'lucide-react';
import { playUrduText, playQariText } from '../utils/qariAudioService';
import { getMakharijLocalization } from '../utils/makharijChartLocalization';
import { LanguageCode } from '../types';

interface MakharijChartModalProps {
  onClose: () => void;
  currentLang?: LanguageCode;
}

export const MakharijChartModal: React.FC<MakharijChartModalProps> = ({ onClose, currentLang = 'ur' }) => {
  const mLoc = getMakharijLocalization(currentLang);
  const isRtl = currentLang === 'ur' || currentLang === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`bg-[#fcfaf5] text-zinc-900 border-4 border-amber-600 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 relative ${isRtl ? 'font-urdu' : 'font-sans'}`}
      >
        {/* Top Navigation / Close Button */}
        <div className="flex items-center justify-between pb-2 border-b border-amber-300/40">
          <button
            onClick={onClose}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black border border-amber-500/30 hover:border-amber-400 shrink-0 shadow-lg cursor-pointer"
            title={mLoc.backBtn}
          >
            <ArrowRight className={`w-4 h-4 text-amber-400 ${!isRtl ? 'rotate-180' : ''}`} />
            <span>{mLoc.backBtn}</span>
          </button>
          <span className="text-xs text-amber-900 font-bold bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            {mLoc.chartBadge}
          </span>
        </div>

        {/* Top Header */}
        <div className="text-center space-y-2 border-b-2 border-amber-400/60 pb-4">
          <p className="text-xs sm:text-sm font-arabic text-emerald-800 leading-relaxed">
            {mLoc.bismillah}
          </p>
          <div className="inline-block px-8 py-2 rounded-full bg-emerald-700 text-white font-black text-lg sm:text-xl shadow-lg border-2 border-emerald-500">
            {mLoc.chartTitle}
          </div>
        </div>

        {/* Intro Definition Box */}
        <div className="bg-amber-100/90 border-2 border-amber-400 rounded-2xl p-4 text-xs sm:text-sm text-zinc-900 leading-loose shadow-inner space-y-2">
          <p className="font-bold text-emerald-900">
            <span className="text-emerald-800 ml-1">{mLoc.meaningLabel}</span> {mLoc.meaningText}
          </p>
          <p>
            {mLoc.countText}
          </p>
        </div>

        {/* Comprehensive Table */}
        <div className="overflow-x-auto rounded-2xl border-2 border-amber-500 shadow-md">
          <table className={`w-full border-collapse bg-white ${isRtl ? 'text-right' : 'text-left'}`}>
            <thead>
              <tr className="bg-emerald-800 text-white text-xs sm:text-sm font-black">
                <th className={`p-3 ${isRtl ? 'border-l' : 'border-r'} border-emerald-700`}>{mLoc.tableHeadCategory}</th>
                <th className={`p-3 ${isRtl ? 'border-l' : 'border-r'} border-emerald-700 text-center`}>{mLoc.tableHeadHuruf}</th>
                <th className={`p-3 ${isRtl ? 'border-l' : 'border-r'} border-emerald-700`}>{mLoc.tableHeadTitle}</th>
                <th className={`p-3 ${isRtl ? 'border-l' : 'border-r'} border-emerald-700`}>{mLoc.tableHeadDesc}</th>
                <th className="p-3 text-center">{mLoc.tableHeadAudio}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-200 text-xs sm:text-sm">
              {mLoc.items.map((row, index) => (
                <tr key={index} className="hover:bg-amber-50/60 transition-colors">
                  <td className={`p-3 font-bold text-amber-950 ${isRtl ? 'border-l' : 'border-r'} border-amber-200 whitespace-nowrap`}>
                    {row.category}
                  </td>
                  <td className={`p-3 font-arabic font-black text-base sm:text-lg text-emerald-800 text-center ${isRtl ? 'border-l' : 'border-r'} border-amber-200`}>
                    {row.huruf}
                  </td>
                  <td className={`p-3 font-bold text-cyan-900 ${isRtl ? 'border-l' : 'border-r'} border-amber-200 whitespace-nowrap`}>
                    {row.title}
                  </td>
                  <td className={`p-3 text-zinc-800 leading-relaxed ${isRtl ? 'border-l' : 'border-r'} border-amber-200`}>
                    {row.desc}
                  </td>
                  <td className="p-3 text-center whitespace-nowrap">
                    <button
                      onClick={() => {
                        if (currentLang === 'ur') {
                          playUrduText(`${row.title}، حروف ${row.huruf}۔ ${row.desc}`);
                        } else {
                          playQariText(row.huruf);
                        }
                      }}
                      className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold border border-emerald-300 transition-colors cursor-pointer inline-flex items-center gap-1 text-xs"
                      title={mLoc.listenBtn}
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{mLoc.listenBtn}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="text-center pt-2">
          <p className="text-xs text-zinc-600 font-bold">
            Madani Qaidah | Authentic Makharij-ul-Huruf Chart
          </p>
        </div>

        <div className="flex justify-center pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm shadow-lg cursor-pointer"
          >
            {mLoc.closeBtn}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
