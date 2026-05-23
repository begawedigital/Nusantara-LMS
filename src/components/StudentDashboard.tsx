/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Course, StudentProgress, LMSSettings } from '../types';
import { Search, BookOpen, Brain, Sparkles, FolderOpen, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface StudentDashboardProps {
  courses: Course[];
  progress: Record<string, StudentProgress>;
  settings: LMSSettings;
  onSelectCourse: (courseId: string) => void;
}

export default function StudentDashboard({
  courses,
  progress,
  settings,
  onSelectCourse
}: StudentDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Menentukan warna aksen Tailwind berdasarkan preferensi admin
  const getAccentColorClass = () => {
    switch (settings.accentColor) {
      case 'indigo': return 'from-indigo-600 to-violet-600 bg-indigo-600 hover:bg-indigo-700 text-indigo-600 text-indigo-400 border-indigo-200 focus:ring-indigo-500';
      case 'blue': return 'from-blue-600 to-indigo-600 bg-blue-600 hover:bg-blue-700 text-blue-600 text-blue-400 border-blue-200 focus:ring-blue-500';
      case 'emerald': return 'from-emerald-600 to-teal-600 bg-emerald-600 hover:bg-emerald-700 text-emerald-600 text-emerald-400 border-emerald-200 focus:ring-emerald-500';
      case 'amber': return 'from-amber-500 to-orange-600 bg-amber-500 hover:bg-amber-600 text-amber-500 text-amber-400 border-amber-200 focus:ring-amber-500';
      case 'rose': return 'from-rose-600 to-pink-600 bg-rose-600 hover:bg-rose-700 text-rose-600 text-rose-400 border-rose-200 focus:ring-rose-500';
      case 'violet': return 'from-violet-600 to-purple-600 bg-violet-600 hover:bg-violet-700 text-violet-600 text-violet-400 border-violet-200 focus:ring-violet-500';
      default: return 'from-indigo-600 to-violet-600 bg-indigo-600 hover:bg-indigo-700 text-indigo-600 text-indigo-400 border-indigo-200 focus:ring-indigo-500';
    }
  };

  const getAccentBadgeClass = (category: string, isActive: boolean) => {
    if (isActive) {
      switch (settings.accentColor) {
        case 'indigo': return 'bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none';
        case 'blue': return 'bg-blue-600 text-white shadow-md shadow-blue-100 dark:shadow-none';
        case 'emerald': return 'bg-emerald-600 text-white shadow-md shadow-emerald-100 dark:shadow-none';
        case 'amber': return 'bg-amber-500 text-white shadow-md shadow-amber-100 dark:shadow-none';
        case 'rose': return 'bg-rose-600 text-white shadow-md shadow-rose-100 dark:shadow-none';
        case 'violet': return 'bg-violet-600 text-white shadow-md shadow-violet-100 dark:shadow-none';
        default: return 'bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none';
      }
    }
    return 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50';
  };

  // 1. Ekstrak Kategori Unik dari semua kursus terdaftar
  const categories = useMemo(() => {
    const list = new Set<string>();
    courses.forEach(c => { if (c.category) list.add(c.category); });
    return ['Semua', ...Array.from(list)];
  }, [courses]);

  // 2. Filter Kursus Berdasarkan Pencarian dan Kategori
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'Semua' || course.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [courses, searchQuery, selectedCategory]);

  // 3. Hitung Statistik Progress Belajar Siswa Aktif
  const stats = useMemo(() => {
    let completedLessonsCount = 0;
    let completedQuizzesCount = 0;
    let coursesCompletedCount = 0;

    Object.values(progress).forEach(prog => {
      completedLessonsCount += prog.completedMaterials.length;
      completedQuizzesCount += Object.keys(prog.quizScores).length;
      if (prog.isCourseCompleted) {
        coursesCompletedCount += 1;
      }
    });

    return {
      completedLessons: completedLessonsCount,
      completedQuizzes: completedQuizzesCount,
      completedCourses: coursesCompletedCount
    };
  }, [progress]);

  // Utility untuk menghitung persentase progress kustom dari sebuah kursus
  const calculateCourseProgress = (course: Course) => {
    const prog = progress[course.id];
    if (!prog) return 0;
    
    const totalItems = course.materials.length + course.quizzes.length;
    if (totalItems === 0) return 0;

    const completedItems = prog.completedMaterials.length + Object.keys(prog.quizScores).length;
    return Math.round((completedItems / totalItems) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-200">
      
      {/* 1. Hero Hub Header Section (Desain Elegan Bebas AI-Template, Neo-Brutalisme Kreatif) */}
      <div className="relative rounded-3xl overflow-hidden mb-12 bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-14 px-6 sm:px-12 border-3 border-slate-900 dark:border-white shadow-[6px_6px_0px_0px_#0f172a] dark:shadow-[6px_6px_0px_0px_#fff]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.25),transparent_40%)]" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap gap-2.5 items-center mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-yellow-300 text-slate-950 border-2 border-slate-950 neo-badge-sticker">
              <Sparkles className="h-3.5 w-3.5 animate-spin text-slate-950" />
              100% BEBAS AKSES INSTAN
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-400 text-slate-950 border-2 border-slate-950 neo-badge-sticker">
              ⚡ TANPA LOG IN
            </span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-6xl tracking-tight leading-none mb-5 uppercase text-yellow-300">
            {settings.heroTitle}
          </h1>
          <p className="text-gray-200 text-sm sm:text-base md:text-xl leading-relaxed mb-8 font-semibold font-sans">
            {settings.heroSubtitle}
          </p>
          
          <div className="flex flex-wrap gap-5 items-center mt-4 border-t-3 border-dotted border-slate-700/60 pt-6">
            <div className="flex items-center gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm text-gray-200 font-bold">Auto-Save Aktif di Browser Anda</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
              <BookOpen className="h-5 w-5 text-indigo-300 shrink-0" />
              <span className="text-xs sm:text-sm text-gray-200 font-bold">Belajar Mandiri Interaktif Lokal</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Ringkasan Pelacakan Progress Belajar Aktif (Neo-Brutalist Box Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        {/* Card Ringkasan 1 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-3 border-slate-900 dark:border-white shadow-[5px_5px_0px_0px_#0f172a] dark:shadow-[5px_5px_0px_0px_#fff] flex items-center gap-5 transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:neo-shadow-primary duration-150">
          <div className="p-4 rounded-xl bg-indigo-400 text-slate-950 border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
            <Award className="h-8 w-8 stroke-[2.5]" />
          </div>
          <div className="text-left">
            <span className="text-xs text-gray-400 block font-bold uppercase tracking-wider font-mono">Materi Selesai</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1 leading-none font-display">
              {stats.completedLessons} <span className="text-xs font-normal text-gray-500 font-mono">konten</span>
            </h3>
          </div>
        </div>

        {/* Card Ringkasan 2 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-3 border-slate-900 dark:border-white shadow-[5px_5px_0px_0px_#0f172a] dark:shadow-[5px_5px_0px_0px_#fff] flex items-center gap-5 transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:neo-shadow-emerald duration-150">
          <div className="p-4 rounded-xl bg-emerald-400 text-slate-950 border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
            <Brain className="h-8 w-8 stroke-[2.5]" />
          </div>
          <div className="text-left">
            <span className="text-xs text-gray-400 block font-bold uppercase tracking-wider font-mono">Kuis Lulus</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1 leading-none font-display">
              {stats.completedQuizzes} <span className="text-xs font-normal text-gray-500 font-mono">aktif</span>
            </h3>
          </div>
        </div>

        {/* Card Ringkasan 3 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-3 border-slate-900 dark:border-white shadow-[5px_5px_0px_0px_#0f172a] dark:shadow-[5px_5px_0px_0px_#fff] flex items-center gap-5 transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:neo-shadow-amber duration-150">
          <div className="p-4 rounded-xl bg-amber-400 text-slate-950 border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
            <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
          </div>
          <div className="text-left">
            <span className="text-xs text-gray-400 block font-bold uppercase tracking-wider font-mono">Kelas Tuntas</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1 leading-none font-display">
              {stats.completedCourses} <span className="text-xs font-normal text-gray-500 font-mono">kelas</span>
            </h3>
          </div>
        </div>

      </div>

      {/* 3. Panel Pencarian & Filter Kategori (Retro Search Block) */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-5 bg-amber-50/40 dark:bg-slate-950/40 border-3 border-slate-900 dark:border-white p-5 rounded-2xl">
        
        {/* Kolom Pencarian */}
        <div className="relative flex-1 max-w-md text-left">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-900 dark:text-gray-300 stroke-[2.5]" />
          <input
            id="input-search-kursus"
            type="text"
            placeholder="Cari materi pembelajaran atau kelas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-900 dark:border-white bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-yellow-400 text-xs sm:text-sm font-semibold placeholder-slate-400 dark:placeholder-gray-500"
          />
        </div>

        {/* Pills Kategori */}
        <div className="flex flex-wrap gap-2 items-center text-left">
          <span className="text-xs text-slate-900 dark:text-white font-extrabold mr-1 flex items-center gap-1 font-mono uppercase">
            <FolderOpen className="h-4 w-4 text-indigo-500 stroke-[2.5]" />
            FILTER:
          </span>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  id={`btn-cat-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-display font-black cursor-pointer neo-btn-press tracking-wide border-2 border-slate-900 transition-all duration-150
                    ${isActive 
                      ? 'bg-yellow-300 text-slate-900 shadow-[2px_2px_0px_0px_#000]' 
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-gray-300 hover:bg-slate-100'}`}
                >
                  {cat.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* 4. Daftar Katalog Kursus */}
      <h2 className="font-display font-black text-2xl md:text-3xl text-slate-900 dark:text-white mb-8 flex items-center gap-2 uppercase tracking-tight text-left">
        <span className="bg-indigo-400 p-1.5 rounded-lg border-2 border-slate-900 text-slate-900 inline-block font-bold">
          <BookOpen className="h-5 w-5 stroke-[2.5]" />
        </span>
        KATALOG KELAS ({filteredCourses.length})
      </h2>

      {filteredCourses.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border-3 border-slate-900 dark:border-white rounded-3xl p-12 text-center shadow-[6px_6px_0px_0px_#0f172a] dark:shadow-[6px_6px_0px_0px_#fff]">
          <BookOpen className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4 stroke-[1.5]" />
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase font-display">Tidak ada kelas ditemukan</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 max-w-md mx-auto font-medium">
            Coba ganti kata kunci pencarian Anda atau tambahkan kelas baru melalui dashboard administrator.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => {
            const progressPct = calculateCourseProgress(course);
            const isCompleted = progressPct === 100;
            const hasStarted = progressPct > 0;

            return (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="group bg-white dark:bg-slate-900 border-3 border-slate-900 dark:border-white rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_#070a13] dark:shadow-[6px_6px_0px_0px_#fff] hover:shadow-[3px_3px_0px_0px_#070a13] dark:hover:shadow-[3px_3px_0px_0px_#fff] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200 flex flex-col h-full"
              >
                {/* Visual Cover Kursus */}
                <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden border-b-3 border-slate-900 dark:border-white">
                  {course.coverUrl ? (
                    <img
                      src={course.coverUrl}
                      alt={course.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-white/70" />
                    </div>
                  )}
                  {/* Badge tingkat kesulitan */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-xl text-xs font-black tracking-wide border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase
                      ${course.level === 'Pemula' ? 'bg-emerald-400 text-slate-950' : 
                        course.level === 'Menengah' ? 'bg-amber-400 text-slate-950' : 
                        'bg-rose-400 text-white'}`}
                    >
                      {course.level}
                    </span>
                  </div>
                  {/* Badge Kategori */}
                  <div className="absolute bottom-4 left-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-white border-2 border-white/25 text-[11px] font-mono font-bold uppercase tracking-wide">
                      {course.category}
                    </span>
                  </div>
                </div>

                {/* Body Detil Informasi */}
                <div className="p-6 flex-1 flex flex-col bg-amber-50/10 dark:bg-slate-900/40">
                  <h3 className="font-display font-black text-lg md:text-xl text-slate-900 dark:text-white tracking-tight leading-snug hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase text-left">
                    {course.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-gray-300 text-xs sm:text-sm mt-3 line-clamp-3 leading-relaxed flex-1 font-medium font-sans text-left">
                    {course.description}
                  </p>

                  {/* Keterangan total materi */}
                  <div className="flex items-center gap-4 text-xs font-extrabold text-slate-700 dark:text-gray-400 mt-5 border-t-3 border-dotted border-slate-900/20 dark:border-slate-100/10 pt-4 font-mono">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4 text-indigo-500" />
                      {course.materials.length} MATERI
                    </span>
                    <span className="flex items-center gap-1">
                      <Brain className="h-4 w-4 text-emerald-500" />
                      {course.quizzes.length} KUIS
                    </span>
                  </div>

                  {/* Visual Tracker Kemajuan */}
                  {hasStarted && (
                    <div className="mt-5 pt-3 border-t-2 border-dashed border-slate-900/20 dark:border-slate-100/10">
                      <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                        <span className="text-slate-500 dark:text-gray-400 font-bold uppercase">PROGRES BELAJAR</span>
                        <span className={`font-black ${isCompleted ? 'text-emerald-500' : 'text-indigo-600 dark:text-indigo-400'}`}>
                          {progressPct}% {isCompleted && 'TAMAT! 🎉'}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-gray-800 h-3 rounded-full border-2 border-slate-900 dark:border-white overflow-hidden shadow-[inset_1px_1px_0px_rgba(0,0,0,0.1)]">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-400' : 'bg-indigo-500'}`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Tombol Aksi Masuk Kelas */}
                  <button
                    id={`btn-course-enter-${course.id}`}
                    onClick={() => onSelectCourse(course.id)}
                    className={`w-full mt-6 py-3 rounded-xl cursor-pointer font-display font-black tracking-wider text-xs sm:text-sm transition-all text-slate-950 uppercase border-2 border-slate-950 neo-btn-press flex items-center justify-center gap-2
                      ${isCompleted 
                        ? 'bg-emerald-400 shadow-[3px_3px_0px_0px_#000] hover:bg-emerald-300' 
                        : hasStarted
                          ? 'bg-indigo-400 shadow-[3px_3px_0px_0px_#000] hover:bg-indigo-300 text-slate-950'
                          : 'bg-yellow-300 shadow-[3px_3px_0px_0px_#000] hover:bg-yellow-200'}`}
                  >
                    <span>
                      {isCompleted ? 'Tinjau Silabus' : hasStarted ? 'Lanjutkan Kelas' : 'Belajar Sekarang!'}
                    </span>
                    <ArrowRight className="h-4.5 w-4.5 stroke-[2.5]" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
