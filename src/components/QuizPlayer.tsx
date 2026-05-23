/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Quiz, QuizQuestion } from '../types';
import { Brain, CheckCircle2, XCircle, ArrowRight, RotateCcw, AlertTriangle, Lightbulb, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuizPlayerProps {
  quiz: Quiz;
  onComplete: (scorePercentage: number, answers: Record<string, number>) => void;
  savedScore?: number;
  savedAnswers?: Record<string, number>;
  accentColor: string;
}

export default function QuizPlayer({
  quiz,
  onComplete,
  savedScore,
  savedAnswers,
  accentColor
}: QuizPlayerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false);
  
  // Melacak lembar jawaban kuis siswa
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>(savedAnswers || {});
  const [isFinished, setIsFinished] = useState(savedScore !== undefined);
  const [sessionScore, setSessionScore] = useState<number>(savedScore || 0);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;

  // Mendapatkan warna dasar berdasarkan preferensi aksen utama
  const getPrimaryButtonClass = () => {
    switch (accentColor) {
      case 'indigo': return 'bg-indigo-600 hover:bg-indigo-700 text-indigo-600 focus:ring-indigo-500';
      case 'blue': return 'bg-blue-600 hover:bg-blue-700 text-blue-600 focus:ring-blue-500';
      case 'emerald': return 'bg-emerald-600 hover:bg-emerald-700 text-emerald-600 focus:ring-emerald-500';
      case 'amber': return 'bg-amber-500 hover:bg-amber-600 text-amber-500 focus:ring-amber-500';
      case 'rose': return 'bg-rose-600 hover:bg-rose-700 text-rose-600 focus:ring-rose-500';
      case 'violet': return 'bg-violet-600 hover:bg-violet-700 text-violet-600 focus:ring-violet-500';
      default: return 'bg-indigo-600 hover:bg-indigo-700 text-indigo-600 focus:ring-indigo-500';
    }
  };

  const getPrimaryTextClass = () => {
    switch (accentColor) {
      case 'indigo': return 'text-indigo-600 dark:text-indigo-400';
      case 'blue': return 'text-blue-600 dark:text-blue-400';
      case 'emerald': return 'text-emerald-600 dark:text-emerald-400';
      case 'amber': return 'text-amber-500 dark:text-amber-400';
      case 'rose': return 'text-rose-600 dark:text-rose-400';
      case 'violet': return 'text-violet-600 dark:text-violet-400';
      default: return 'text-indigo-600 dark:text-indigo-400';
    }
  };

  const getLightBgClass = () => {
    switch (accentColor) {
      case 'indigo': return 'bg-indigo-50 dark:bg-indigo-950/25 border-indigo-100 dark:border-indigo-900/30';
      case 'blue': return 'bg-blue-50 dark:bg-blue-950/25 border-blue-100 dark:border-blue-900/30';
      case 'emerald': return 'bg-emerald-50 dark:bg-emerald-950/25 border-emerald-100 dark:border-emerald-900/30';
      case 'amber': return 'bg-amber-50 dark:bg-amber-950/25 border-amber-100 dark:border-amber-900/30';
      case 'rose': return 'bg-rose-50 dark:bg-rose-950/25 border-rose-100 dark:border-rose-900/30';
      case 'violet': return 'bg-violet-50 dark:bg-violet-950/25 border-violet-100 dark:border-violet-900/30';
      default: return 'bg-indigo-50 dark:bg-indigo-950/25 border-indigo-100 dark:border-indigo-900/30';
    }
  };

  // Logika Menangani Pilihan Jawaban
  const handleSelectOption = (optionIndex: number) => {
    if (hasCheckedAnswer) return; // Tidak boleh ganti jawaban jika sudah di-submit/cek
    setSelectedOptionIndex(optionIndex);
  };

  // Verifikasi Jawaban Pertanyaan Saat ini
  const handleCheckAnswer = () => {
    if (selectedOptionIndex === null) return;
    
    // Simpan jawaban kuis siswa
    const updatedAnswers = {
      ...userAnswers,
      [currentQuestion.id]: selectedOptionIndex
    };
    setUserAnswers(updatedAnswers);
    setHasCheckedAnswer(true);
  };

  // Navigasi ke Pertanyaan Selanjutnya atau Selesaikan Kuis
  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      
      // Reset state untuk pertanyaan baru
      const nextQuestionId = quiz.questions[currentQuestionIndex + 1].id;
      const previouslySavedIndex = userAnswers[nextQuestionId];
      setSelectedOptionIndex(previouslySavedIndex !== undefined ? previouslySavedIndex : null);
      setHasCheckedAnswer(previouslySavedIndex !== undefined);
    } else {
      // Hitung skor akhir persentase (0 - 100)
      let correctCount = 0;
      quiz.questions.forEach((q) => {
        if (userAnswers[q.id] === q.correctAnswerIndex) {
          correctCount += 1;
        }
      });
      
      const rawScore = (correctCount / totalQuestions) * 100;
      const score = Math.round(rawScore);
      
      setSessionScore(score);
      setIsFinished(true);
      
      // Laporkan ke parent component untuk melacak progress siswa secara real-time
      onComplete(score, userAnswers);
    }
  };

  // Menyetel ulang pengerjaan kuis dari awal (materi kuis interaktif)
  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setHasCheckedAnswer(false);
    setUserAnswers({});
    setIsFinished(false);
    setSessionScore(0);
  };

  // Keadaan jika kuis sudah diselesaikan & menampilkan ringkasan kelulusan
  if (isFinished) {
    const isPassed = sessionScore >= 70;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 border-3 border-slate-900 dark:border-white p-8 sm:p-10 rounded-3xl shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] text-center max-w-2xl mx-auto my-6"
      >
        <div className="flex justify-center mb-6">
          <div className={`p-4 rounded-xl border-2 border-slate-950 ${isPassed ? 'bg-emerald-400 text-slate-950' : 'bg-rose-400 text-white'} shadow-[3px_3px_0px_#000]`}>
            <Trophy className="h-14 w-14 stroke-[2.5]" />
          </div>
        </div>

        <span className="px-3 py-1 text-[10px] font-black bg-yellow-300 text-slate-950 border-2 border-slate-950 rounded-lg uppercase tracking-widest inline-block font-mono mb-2">
          REKAP SKOR AKHIR
        </span>
        
        <h2 className="font-display font-black text-2xl md:text-3xl text-slate-900 dark:text-white uppercase">
          {isPassed ? 'KELAS BERHASIL DITAKLUKKAN!' : 'JANGAN MENYERAH, COBA LAGI!'}
        </h2>
        
        <p className="text-slate-600 dark:text-gray-300 text-xs sm:text-sm mt-3 max-w-md mx-auto font-medium">
          {isPassed 
            ? 'Anda telah menguasai seluruh konsep inti pada bab materi ini dengan gemilang! Kelas ini kini tercatat selesai.'
            : 'Belum mencapai ambang batas kelulusan (minimal 70%). Yuk tinjau penjelasan modul lalu asah kembali ingatan Anda.'}
        </p>

        {/* Display Skor Digital */}
        <div className="my-8 inline-flex flex-col items-center justify-center p-6 bg-yellow-300 border-3 border-slate-950 text-slate-950 rounded-3xl shadow-[5px_5px_0px_#000] rotate-[-1.5deg]">
          <span className="text-6xl font-mono font-black tracking-tighter leading-none">
            {sessionScore}%
          </span>
          <span className="text-[10px] font-black mt-2.5 px-3 py-0.5 border-1.5 border-slate-950 rounded-full uppercase bg-white">
            {isPassed ? 'DINYATAKAN LULUS (≥70%)' : 'BELUM MEMENUHI SYARAT REKOMENDASI'}
          </span>
        </div>

        {/* Tally Jawaban Sederhana */}
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8 text-sm">
          <div className="p-3 bg-white dark:bg-slate-800 border-2 border-slate-950 dark:border-white rounded-xl text-center shadow-[2px_2px_0px_#000]">
            <span className="text-slate-500 dark:text-gray-400 block font-black font-mono text-xs uppercase">TOTAL SOAL</span>
            <span className="text-lg font-black text-slate-900 dark:text-white font-mono">{totalQuestions} Butir</span>
          </div>
          <div className="p-3 bg-white dark:bg-slate-800 border-2 border-slate-950 dark:border-white rounded-xl text-center shadow-[2px_2px_0px_#000]">
            <span className="text-slate-500 dark:text-gray-400 block font-black font-mono text-xs uppercase">AKURASI BENAR</span>
            <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
              {Math.round((sessionScore / 100) * totalQuestions)} Soal
            </span>
          </div>
        </div>

        {/* Tombol aksi */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            id="btn-quiz-retry"
            onClick={handleResetQuiz}
            className="w-full sm:w-auto px-6 py-3 border-2 border-slate-950 dark:border-white bg-yellow-300 hover:bg-yellow-200 text-slate-950 rounded-xl font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer neo-btn-press shadow-[3px_3px_0px_#000]"
          >
            <RotateCcw className="h-4.5 w-4.5 stroke-[2.5]" />
            KERJAKAN MULAI AWAL
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-4 text-left">
      {/* Tracker Status Bar Bagian Atas */}
      <div className="bg-white dark:bg-slate-900 border-3 border-slate-900 dark:border-white rounded-2xl p-6 shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#fff] mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-indigo-100 text-indigo-950 border-2 border-indigo-950 flex items-center justify-center font-bold">
              <Brain className="h-5 w-5 stroke-[2.5]" />
            </span>
            <span className="text-xs font-black text-slate-900 dark:text-white tracking-widest uppercase block font-mono">
              KUIS EVALUASI MANDIRI
            </span>
          </div>
          
          <span className="text-xs font-black text-slate-950 bg-yellow-300 border-2 border-slate-950 px-3 py-1 rounded-lg shadow-[1.5px_1.5px_0px_#000] font-mono uppercase">
            SOAL {currentQuestionIndex + 1} / {totalQuestions}
          </span>
        </div>

        {/* Progress Bar Atas kuis */}
        <div className="w-full bg-slate-200 dark:bg-gray-800 h-3 rounded-full border-2 border-slate-950 dark:border-white overflow-hidden shadow-[inset_1px_1px_0px_rgba(0,0,0,0.1)]">
          <div
            className="h-full transition-all duration-300 bg-indigo-500"
            style={{ width: `${((currentQuestionIndex) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Konten Pertanyaan */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-slate-900 border-3 border-slate-900 dark:border-white rounded-2xl p-6 sm:p-8 shadow-[5px_5px_0px_#000] dark:shadow-[5px_5px_0px_0px_#fff]"
        >
          {/* Judul Pertanyaan */}
          <h3 className="font-display font-black text-lg md:text-2xl text-slate-900 dark:text-white leading-snug mb-8 uppercase text-left border-b-2 border-dashed border-slate-200 dark:border-slate-800 pb-4">
            {currentQuestion.question}
          </h3>

          {/* Opsi Pilihan Jawaban */}
          <div className="space-y-4 mb-8 text-left">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOptionIndex === index;
              const isCorrectOption = index === currentQuestion.correctAnswerIndex;
              
              // Menghitung status warna dinamis setelah dicek
              let optionStyle = 'border-slate-900 dark:border-white bg-white dark:bg-slate-800 text-slate-800 dark:text-gray-200 shadow-[2.5px_2.5px_0px_0px_#000] dark:shadow-[2.5px_2.5px_0px_#fff]';
              let Icon = null;
              
              if (isSelected) {
                optionStyle = 'border-slate-900 bg-indigo-100 dark:bg-indigo-950 dark:border-white text-indigo-950 dark:text-indigo-200 font-extrabold shadow-[2.5px_2.5px_0px_0px_#000] cursor-pointer ring-1 ring-slate-950';
              }
 
              if (hasCheckedAnswer) {
                if (isCorrectOption) {
                  // Selalu tandai jawaban yang benar dengan warna hijau solid setelah dicek
                  optionStyle = 'border-slate-950 dark:border-white bg-emerald-400 text-slate-950 font-black ring-2 ring-slate-950 shadow-[2px_2px_0px_#000]';
                  Icon = <CheckCircle2 className="h-5 w-5 text-slate-950 shrink-0 fill-white" />;
                } else if (isSelected) {
                  // Berikan warna merah solid jika jawaban terpilih ternyata salah
                  optionStyle = 'border-slate-950 dark:border-white bg-rose-400 text-slate-950 font-black ring-2 ring-slate-950 shadow-[2px_2px_0px_#000]';
                  Icon = <XCircle className="h-5 w-5 text-slate-950 shrink-0 fill-white" />;
                } else {
                  // Opsi tak terpilih dan salah diredupkan
                  optionStyle = 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-400 dark:text-gray-600 opacity-50 shadow-none cursor-not-allowed';
                }
              }

              return (
                <button
                  key={index}
                  id={`btn-quiz-option-${currentQuestionIndex}-${index}`}
                  onClick={() => handleSelectOption(index)}
                  disabled={hasCheckedAnswer}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left text-sm font-bold transition-all duration-150 leading-relaxed cursor-pointer neo-btn-press ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    {/* Lingkaran Abjad Opsi (A, B, C, D) */}
                    <div className={`h-6.5 w-6.5 rounded-full flex items-center justify-center shrink-0 text-xs font-black uppercase border-1.5 border-slate-950
                      ${isSelected ? 'bg-yellow-300 text-slate-950' : 'bg-slate-100 dark:bg-slate-750 text-slate-700 dark:text-slate-350'}`}
                    >
                      {String.fromCharCode(64 + index + 1)}
                    </div>
                    <span className="font-sans leading-tight">{option}</span>
                  </div>
                  {Icon}
                </button>
              );
            })}
          </div>

          {/* Kotak Card Penjelasan Ulasan Jawaban (Hanya muncul setelah dicek) */}
          {hasCheckedAnswer && currentQuestion.explanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-xl border-2 border-indigo-900 bg-indigo-50/55 dark:bg-indigo-950/40 text-slate-900 dark:text-indigo-200 mb-8 flex gap-3 text-sm text-left shadow-[2px_2px_0px_#000]"
            >
              <Lightbulb className="h-5.5 w-5.5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5 stroke-[2.5]" />
              <div>
                <span className="font-display font-black text-xs tracking-wider uppercase block mb-1">PEMBAHASAN TEORI & DETIL:</span>
                <p className="text-slate-700 dark:text-gray-300 text-xs sm:text-sm font-medium leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            </motion.div>
          )}

          {/* Tombol Aksi Kuis */}
          <div className="flex justify-end p-2 border-t-2 border-dashed border-slate-200 dark:border-slate-800 pt-5">
            {!hasCheckedAnswer ? (
              <button
                id="btn-quiz-check"
                onClick={handleCheckAnswer}
                disabled={selectedOptionIndex === null}
                className={`px-6 py-3 rounded-xl font-display font-black text-xs sm:text-sm uppercase tracking-wide transition-all border-2 border-slate-950 dark:border-white shadow-[2px_2px_0px_#000] dark:shadow-[2px_2px_0px_#fff] flex items-center gap-2 cursor-pointer neo-btn-press
                  ${selectedOptionIndex !== null 
                    ? 'bg-yellow-300 text-slate-950' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-gray-500 cursor-not-allowed border-dashed shadow-none'}`}
              >
                Cek Jawaban Anda
                <ArrowRight className="h-4.5 w-4.5 stroke-[2.5]" />
              </button>
            ) : (
              <button
                id="btn-quiz-next"
                onClick={handleNextQuestion}
                className="px-6 py-3 rounded-xl font-display font-black text-xs sm:text-sm uppercase tracking-wide text-slate-950 bg-indigo-400 hover:bg-indigo-300 transition-all border-2 border-slate-950 shadow-[2px_2px_0px_#000] flex items-center gap-2 cursor-pointer neo-btn-press"
              >
                {currentQuestionIndex < totalQuestions - 1 ? 'Soal Berikutnya' : 'Selesaikan Kuis'}
                <ArrowRight className="h-4.5 w-4.5 stroke-[2.5]" />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
