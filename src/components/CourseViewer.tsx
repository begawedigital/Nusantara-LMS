/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Course, Material, Quiz, StudentProgress } from '../types';
import { 
  ArrowLeft, BookOpen, Brain, CheckCircle, Circle, ArrowRight, CheckCircle2,
  FileText, Video, ExternalLink, ChevronRight, Menu, X, Play, ZoomIn, ZoomOut, Download
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import QuizPlayer from './QuizPlayer';
import { motion, AnimatePresence } from 'motion/react';

interface CourseViewerProps {
  course: Course;
  progress: StudentProgress;
  onUpdateProgress: (progress: StudentProgress) => void;
  onBackToDashboard: () => void;
  accentColor: string;
}

export default function CourseViewer({
  course,
  progress,
  onUpdateProgress,
  onBackToDashboard,
  accentColor
}: CourseViewerProps) {
  // Melacak item yang sedang aktif dibaca oleh siswa
  // 'material-[id]' atau 'quiz-[id]'
  const [activeItemId, setActiveItemId] = useState<string>(() => {
    if (course.materials.length > 0) return `material-${course.materials[0].id}`;
    if (course.quizzes.length > 0) return `quiz-${course.quizzes[0].id}`;
    return '';
  });

  // State untuk melacak menu sidebar di mobile (buka/tutup)
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [simulatedDocPage, setSimulatedDocPage] = useState(1);
  const [simulatedZoom, setSimulatedZoom] = useState(100);

  // Ambil elemen materi atau kuis terpilih berdasarkan string activeItemId
  const activeItem = useMemo(() => {
    if (activeItemId.startsWith('material-')) {
      const id = activeItemId.replace('material-', '');
      const mat = course.materials.find(m => m.id === id);
      return { type: 'material' as const, data: mat };
    } else if (activeItemId.startsWith('quiz-')) {
      const id = activeItemId.replace('quiz-', '');
      const qz = course.quizzes.find(q => q.id === id);
      return { type: 'quiz' as const, data: qz };
    }
    return null;
  }, [activeItemId, course]);

  // Ekstrak semua syllabus dalam array untuk memudahkan deteksi navigasi "Sebelumnya" & "Selanjutnya"
  const syllabusList = useMemo(() => {
    const list: { id: string; type: 'material' | 'quiz'; title: string }[] = [];
    course.materials.forEach(m => list.push({ id: `material-${m.id}`, type: 'material', title: m.title }));
    course.quizzes.forEach(q => list.push({ id: `quiz-${q.id}`, type: 'quiz', title: q.title }));
    return list;
  }, [course]);

  const activeIndexInSyllabus = useMemo(() => {
    return syllabusList.findIndex(item => item.id === activeItemId);
  }, [syllabusList, activeItemId]);

  // Warna aksen sekunder
  const getAccentColors = () => {
    switch (accentColor) {
      case 'indigo': return { text: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-600', border: 'border-indigo-600', lightBg: 'bg-indigo-50/50 dark:bg-indigo-950/20', hover: 'hover:bg-indigo-50 dark:hover:bg-indigo-950/20' };
      case 'blue': return { text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-600', border: 'border-blue-600', lightBg: 'bg-blue-50/50 dark:bg-blue-950/20', hover: 'hover:bg-blue-50 dark:hover:bg-blue-950/20' };
      case 'emerald': return { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-600', border: 'border-emerald-600', lightBg: 'bg-emerald-50/50 dark:bg-emerald-950/20', hover: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/20' };
      case 'amber': return { text: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500', border: 'border-amber-500', lightBg: 'bg-amber-50/50 dark:bg-amber-950/20', hover: 'hover:bg-amber-50 dark:hover:bg-amber-950/20' };
      case 'rose': return { text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-600', border: 'border-rose-600', lightBg: 'bg-rose-50/50 dark:bg-rose-950/20', hover: 'hover:bg-rose-50 dark:hover:bg-rose-950/20' };
      case 'violet': return { text: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-600', border: 'border-violet-600', lightBg: 'bg-violet-50/50 dark:bg-violet-950/20', hover: 'hover:bg-violet-50 dark:hover:bg-violet-950/20' };
      default: return { text: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-600', border: 'border-indigo-600', lightBg: 'bg-indigo-50/50 dark:bg-indigo-950/20', hover: 'hover:bg-indigo-50 dark:hover:bg-indigo-950/20' };
    }
  };

  const colors = getAccentColors();

  // Hitung jumlah item selesai dari total silabus
  const progressStats = useMemo(() => {
    const total = course.materials.length + course.quizzes.length;
    if (total === 0) return { pct: 0, completed: 0, total: 0 };
    
    const completed = progress.completedMaterials.length + Object.keys(progress.quizScores).length;
    const pct = Math.round((completed / total) * 100);
    return { pct, completed, total };
  }, [course, progress]);

  // Logika Menandai Selesai Konten Materi Aktif
  const handleMarkMaterialAsCompleted = (materialId: string, autoAdvance = true) => {
    if (!progress.completedMaterials.includes(materialId)) {
      const updatedCompleted = [...progress.completedMaterials, materialId];
      
      // Deteksi apakah seluruh materi & kuis sudah tuntas dipelajari
      const totalItems = course.materials.length + course.quizzes.length;
      const totalCompletedItems = updatedCompleted.length + Object.keys(progress.quizScores).length;
      const isCourseCompleted = totalCompletedItems === totalItems;

      onUpdateProgress({
        ...progress,
        completedMaterials: updatedCompleted,
        isCourseCompleted
      });
    }

    // Jika diaktifkan, langsung geser halaman ke item silabus berikutnya
    if (autoAdvance && activeIndexInSyllabus < syllabusList.length - 1) {
      setTimeout(() => {
        setActiveItemId(syllabusList[activeIndexInSyllabus + 1].id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 300);
    }
  };

  // Logika Melacak Kuis yang Berhasil Diselesaikan
  const handleQuizCompleted = (scorePercentage: number, answers: Record<string, number>) => {
    const quizId = activeItem?.type === 'quiz' ? activeItem.data?.id : '';
    if (!quizId) return;

    const isPassed = scorePercentage >= 70;
    const previousScoresObj = { ...progress.quizScores };
    
    previousScoresObj[quizId] = {
      score: scorePercentage,
      answers,
      isPassed
    };

    // Deteksi kelulusan total kursus
    const totalItems = course.materials.length + course.quizzes.length;
    const totalCompletedItems = progress.completedMaterials.length + Object.keys(previousScoresObj).length;
    const isCourseCompleted = totalCompletedItems === totalItems;

    onUpdateProgress({
      ...progress,
      quizScores: previousScoresObj,
      isCourseCompleted
    });
  };

  // Navigasi Manual Slider bawah
  const handlePrevItem = () => {
    if (activeIndexInSyllabus > 0) {
      setActiveItemId(syllabusList[activeIndexInSyllabus - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextItem = () => {
    if (activeIndexInSyllabus < syllabusList.length - 1) {
      setActiveItemId(syllabusList[activeIndexInSyllabus + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Renderer untuk Tipe Materi 'video'
  const renderVideoMaterial = (mat: Material) => {
    const isYoutube = mat.content.includes('youtube.com') || mat.content.includes('youtu.be');
    
    return (
      <div className="space-y-6">
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_#fff] border-3 border-slate-900 dark:border-white">
          {isYoutube ? (
            // Mengubah URL youtube biasa menjadi Embed URL
            <iframe
              width="100%"
              height="100%"
              src={mat.content.replace('watch?v=', 'embed/').split('&')[0]}
              title={mat.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-950">
              <Play className="h-14 w-14 text-yellow-300 mb-4 animate-bounce cursor-pointer stroke-[2.5]" />
              <h4 className="text-white text-base font-black uppercase font-display">{mat.title}</h4>
              <p className="text-gray-400 text-xs mt-2 max-w-sm font-mono uppercase">
                VIDEO EKSTERNAL SEMATAN. KLIK LINK DIBAWAH UNTUK MEMUTAR SECARA LANGSUNG DI TAB BARU.
              </p>
              <a 
                href={mat.content} 
                target="_blank" 
                rel="noreferrer" 
                className="mt-5 px-5 py-2.5 bg-yellow-300 hover:bg-yellow-200 text-slate-950 font-display font-black rounded-xl text-xs flex items-center gap-1.5 border-2 border-slate-950 shadow-[2px_2px_0px_#000] cursor-pointer neo-btn-press"
              >
                PUTAR DI URL EKSTERNAL
                <ExternalLink className="h-3.5 w-3.5 stroke-[2.5]" />
              </a>
            </div>
          )}
        </div>
        <div className="bg-white dark:bg-slate-900 border-2.5 border-slate-900 dark:border-white p-6 rounded-2xl shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_#fff]">
          <h3 className="font-display font-black text-sm sm:text-base text-slate-900 dark:text-white uppercase">DESKRIPSI VIDEO BELAJAR</h3>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed font-semibold">
            Perhatikan materi presentasi video berkualitas tinggi di atas dengan saksama. Setelah menangkap intisari teori kuncinya, klik "Tandai Selesai" di bawah untuk mencatatkan progress Anda di silabus sebelah kiri.
          </p>
        </div>
      </div>
    );
  };

  // Renderer untuk Tipe Materi unggahan berkas (PDF / Mock File doc fungsional tinggi)
  const renderDocumentMaterial = (mat: Material) => {
    const isMockUploaded = mat.fileName !== undefined;
    
    return (
      <div className="space-y-6">
        {/* Antarmuka Visual Berkas PDF Unggulan yang Sangat Tactile */}
        <div className="bg-slate-100 dark:bg-slate-950 border-3 border-slate-900 dark:border-white rounded-2.5xl overflow-hidden shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#fff] font-sans">
          
          {/* Header Kontroler PDF Document Reader */}
          <div className="bg-yellow-300 text-slate-950 border-b-3 border-slate-900 px-4 py-3.5 flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-2.5 text-left">
              <span className="p-1.5 bg-white border-2 border-slate-950 rounded-lg">
                <FileText className="h-4.5 w-4.5 text-slate-950 stroke-[2.5]" />
              </span>
              <div>
                <span className="font-display font-black text-xs sm:text-sm text-slate-950 block truncate max-w-[200px] sm:max-w-none uppercase">
                  {isMockUploaded ? mat.fileName : `${mat.title.toLowerCase().replace(/\s+/g, '_')}.pdf`}
                </span>
                <span className="text-[9px] font-mono font-bold text-slate-700 block leading-none">
                  INTEGRATED DOCUMENT READER • STABILIZED PREVIEW
                </span>
              </div>
            </div>

            {/* Kontroler Zoom & Navigasi Halaman */}
            <div className="flex items-center gap-4 text-xs font-bold">
              
              {/* Zoom Buttons */}
              <div className="flex items-center border-2 border-slate-950 rounded-xl overflow-hidden bg-white shadow-[1.5px_1.5px_0px_#000]">
                <button 
                  onClick={() => setSimulatedZoom(z => Math.max(75, z - 25))} 
                  className="p-1.5 hover:bg-slate-100 text-slate-950 focus:outline-hidden cursor-pointer border-r-1.5 border-slate-200"
                  title="Perkecil"
                >
                  <ZoomOut className="h-3.5 w-3.5 stroke-[2.5]" />
                </button>
                <span className="px-2 font-mono font-black text-[10px] text-slate-950 min-w-[34px] text-center">
                  {simulatedZoom}%
                </span>
                <button 
                  onClick={() => setSimulatedZoom(z => Math.min(150, z + 25))} 
                  className="p-1.5 hover:bg-slate-100 text-slate-950 focus:outline-hidden cursor-pointer border-l-1.5 border-slate-200"
                  title="Perbesar"
                >
                  <ZoomIn className="h-3.5 w-3.5 stroke-[2.5]" />
                </button>
              </div>

              {/* Halaman Buttons */}
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setSimulatedDocPage(p => Math.max(1, p - 1))}
                  disabled={simulatedDocPage === 1}
                  className="px-2.5 py-1.5 bg-white border-2 border-slate-950 disabled:opacity-45 hover:bg-slate-100 text-slate-950 rounded-xl font-mono font-bold disabled:cursor-not-allowed cursor-pointer shadow-[1.5px_1.5px_0px_#000]"
                >
                  SEBELUM
                </button>
                <span className="text-slate-950 font-mono font-black shrink-0">
                  {simulatedDocPage} / 3
                </span>
                <button 
                  onClick={() => setSimulatedDocPage(p => Math.min(3, p + 1))}
                  disabled={simulatedDocPage === 3}
                  className="px-2.5 py-1.5 bg-white border-2 border-slate-950 disabled:opacity-45 hover:bg-slate-100 text-slate-950 rounded-xl font-mono font-bold disabled:cursor-not-allowed cursor-pointer shadow-[1.5px_1.5px_0px_#000]"
                >
                  LANJUT
                </button>
              </div>

            </div>
          </div>

          {/* Area Kertas Putih PDF Render (Sangat Menawan!) */}
          <div className="p-6 sm:p-10 flex justify-center overflow-auto max-h-[500px]">
            <div 
              className="bg-white text-slate-950 border-3 border-slate-950 rounded-lg p-8 sm:p-10 shadow-[8px_8px_0px_#22c55e] text-left transition-all duration-300 relative aspect-[1/1.4] max-w-2xl w-full"
              style={{ transform: `scale(${simulatedZoom / 100})`, transformOrigin: 'top center' }}
            >
              
              {/* Tanda Air Digital */}
              <div className="absolute top-4 right-4 text-[9px] font-mono font-black text-slate-300 select-none tracking-widest uppercase">
                {course.title.slice(0, 20).toUpperCase()}...
              </div>

              {/* Konten Halaman Lembar PDF */}
              {simulatedDocPage === 1 && (
                <div>
                  <span className="px-2 py-0.5 text-[9px] font-mono font-black bg-yellow-300 text-slate-950 border-1.5 border-slate-950 rounded-md uppercase tracking-wider inline-block mb-2">
                    LMS PAGE 1 • INTRODUCTION
                  </span>
                  <h3 className="font-display font-black text-xl sm:text-2xl text-slate-900 border-b-2 border-dashed border-slate-350 pb-3 mb-4 leading-snug uppercase text-left">
                    {mat.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 mb-4 leading-relaxed text-left">
                    Dokumen pembelajaran ini merangkum seluruh poin kurikulum kelas instruksional "{course.title}" yang telah didesain khusus bagi para peserta didik berdikari.
                  </p>
                  
                  <div className="space-y-3 text-xs text-slate-600 leading-relaxed mt-6">
                    <p className="font-mono font-black text-slate-900 uppercase">Abstrak Pembelajaran:</p>
                    <p className="font-semibold">Buku panduan ini mengulas rincian langkah demi langkah pengerjaan modul kerja nyata. Bacalah dengan perlahan demi meningkatkan pemahaman mendasar.</p>
                    <p className="font-semibold">Gunakan tombol kemudi di kanan atas halaman pembaca elektronik (*integrated reader bar*) untuk bergulir ke lembar teori berikutnya serta membedah studi kasus dan ulasan bab.</p>
                  </div>
                </div>
              )}

              {simulatedDocPage === 2 && (
                <div>
                  <span className="px-2 py-0.5 text-[9px] font-mono font-black bg-yellow-300 text-slate-950 border-1.5 border-slate-950 rounded-md uppercase tracking-wider inline-block mb-2">
                    LMS PAGE 2 • CORE READING
                  </span>
                  <h4 className="font-display font-black text-base text-slate-900 border-b-2 border-dashed border-slate-350 pb-2 mb-3 uppercase text-left">
                    POIN PEMBAHASAN UTAMA
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold mb-4 text-left">
                    Diharapkan para siswa meluangkan waktu sejenak untuk memahami tiga aturan operasional fundamental berikut ini:
                  </p>

                  <div className="bg-slate-50 p-4 border-2 border-slate-950 rounded-xl space-y-2 text-xs text-slate-800 mb-4 font-mono">
                    <div className="flex gap-2">
                      <span className="font-black">[A]</span>
                      <span className="font-bold uppercase text-[10px]">ANALISIS LOGIKA DAN PEMETAAN PARAMETER STRUKTURAL.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-black">[B]</span>
                      <span className="font-bold uppercase text-[10px]">PENGHAMBATAN RE-RENDER TAK PERLU PADA FRAMEWORK SPA.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-black">[C]</span>
                      <span className="font-bold uppercase text-[10px]">DESAIN AKSESIBILITAS YANG BERANI DENGAN KONTRAS WARNA TINGGI.</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 font-semibold leading-relaxed text-left">
                    Sistem akan secara mandiri mengunci kemajuan belajar ini agar tidak hilang walau peramban/browser ditutup secara tidak sengaja oleh Anda.
                  </p>
                </div>
              )}

              {simulatedDocPage === 3 && (
                <div>
                  <span className="px-2 py-0.5 text-[9px] font-mono font-black bg-yellow-300 text-slate-950 border-1.5 border-slate-950 rounded-md uppercase tracking-wider inline-block mb-2">
                    LMS PAGE 3 • PENUTUP & TIPS
                  </span>
                  <h4 className="font-display font-black text-base text-slate-900 border-b-2 border-dashed border-slate-350 pb-2 mb-3 uppercase text-left">
                    IMPLEMENTASI & LATIHAN MANDIRI
                  </h4>
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed mb-3 text-left">
                    Di akhir pembacaan materi, sisihkan waktu 5-10 menit untuk melakukan ringkasan poin-poin yang baru Anda dapatkan.
                  </p>

                  <div className="border-2 border-indigo-950 bg-indigo-50 rounded-lg p-3.5 text-[10px] text-indigo-950 leading-normal font-sans">
                    <span className="font-bold block mb-1">💡 TIPS INSTRUKTUR UTAMA:</span>
                    Belajarlah di tempat yang tenang. Tidak perlu buru-buru, perjalanan belajar berakar kuat pada konsistensi. Jika sudah merasa yakin, tandai selesai halaman ini dan buka kuis pendukung!
                  </div>

                  <div className="mt-8 border-t-2 border-slate-200 pt-3 flex justify-between items-center text-[9px] font-mono text-slate-500">
                    <span>NUSANTARA DIGITAL LMS &copy; 2026.</span>
                    <span className="font-bold">LAST PAGE</span>
                  </div>
                </div>
              )}

              {/* Penunjuk halaman bawah halaman kertas */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] text-slate-500 font-black font-mono uppercase">
                HALAMAN {simulatedDocPage} DARI 3
              </div>
            </div>
          </div>

          {/* Footer Bar Reader PDF */}
          <div className="bg-white p-4 border-t-3 border-slate-900 flex flex-wrap justify-between items-center gap-3 text-xs font-mono font-black uppercase text-slate-950">
            <span className="flex items-center gap-1">
              <Download className="h-4 w-4 text-slate-950 stroke-[2.5]" />
              SIMULATED FILE SIZE: ~1.4 MB
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 border border-slate-950"></span>
              <span>SECURED LOCAL FILE CONNECTION</span>
            </div>
          </div>

        </div>

        {/* Info Box Tautan Asli Jika Link Eksternal */}
        {!isMockUploaded && mat.content.startsWith('http') && (
          <div className="p-4 bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-800 rounded-2xl flex items-center justify-between text-sm shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                <ExternalLink className="h-4 w-4" />
              </div>
              <div className="text-left">
                <span className="font-semibold text-gray-900 dark:text-white block">Tautan Dokumen Eksternal</span>
                <span className="text-xs text-gray-400 block truncate max-w-[200px] sm:max-w-xs">{mat.content}</span>
              </div>
            </div>
            <a
              href={mat.content}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all"
            >
              Buka Berkas
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-colors duration-200">
      
      {/* 1. Sub-Header navigasi kembali ke dashboard & info progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b-3 border-slate-900 dark:border-white pb-6">
        
        {/* Tombol Kembali & Judul Kelas */}
        <div className="flex items-center gap-4 text-left">
          <button
            id="btn-course-back"
            onClick={onBackToDashboard}
            className="p-3 rounded-xl border-2 border-slate-900 dark:border-white bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] hover:bg-slate-100 transition-all cursor-pointer neo-btn-press"
            title="Kembali ke Ruang Belajar"
          >
            <ArrowLeft className="h-5 w-5 stroke-[2.5]" />
          </button>
          
          <div>
            <span className="px-2 py-0.5 text-[9px] font-black bg-yellow-300 text-slate-950 border-2 border-slate-950 rounded-md uppercase tracking-wider inline-block mb-1">
              KETEGORI: {course.category.toUpperCase()}
            </span>
            <h1 className="font-display font-extrabold text-lg md:text-2xl text-slate-900 dark:text-white tracking-tight leading-none">
              {course.title}
            </h1>
          </div>
        </div>

        {/* Penanda Progress bar kecil */}
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 border-2.5 border-slate-900 dark:border-white py-2.5 px-4 rounded-xl shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] self-start md:self-auto min-w-[220px]">
          <div className="text-left flex-1">
            <div className="flex justify-between items-center text-[11px] mb-1 font-bold font-mono text-slate-600 dark:text-gray-300 uppercase">
              <span>KURIKULUM</span>
              <span className="text-indigo-600 dark:text-indigo-400">{progressStats.completed}/{progressStats.total} SELESAI</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full border border-slate-900 dark:border-white overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-350 bg-indigo-500"
                style={{ width: `${progressStats.pct}%` }}
              />
            </div>
          </div>
          
          <button
            id="btn-syllabus-toggle-mobile"
            onClick={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
            className="md:hidden p-2 bg-yellow-300 text-slate-950 border-2 border-slate-950 rounded-lg shadow-[1.5px_1.5px_0px_#000]"
            title="Daftar Materi"
          >
            <Menu className="h-4.5 w-4.5 stroke-[2.5]" />
          </button>
        </div>

      </div>

      {/* 2. Grid Layout untuk Belajar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Kolom Kiri: Sidebar Silabus Kelas (Desktop layout) */}
        <div className="hidden md:block col-span-1 bg-white dark:bg-slate-900 border-2.5 border-slate-900 dark:border-white rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_#fff] h-fit sticky top-24 max-h-[calc(100vh-130px)] overflow-y-auto no-scrollbar">
          <h3 className="font-display font-black text-xs text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b-2 border-dashed border-slate-300 dark:border-slate-700 text-left">
            DAFTAR SILABUS
          </h3>
          
          <div className="space-y-2">
            {/* 2.1 Menampilkan Materi Pembelajaran */}
            {course.materials.map((mat) => {
              const isCompleted = progress.completedMaterials.includes(mat.id);
              const isActive = activeItemId === `material-${mat.id}`;

              return (
                <button
                  key={mat.id}
                  id={`btn-syllabus-mat-${mat.id}`}
                  onClick={() => {
                    setActiveItemId(`material-${mat.id}`);
                    setSimulatedDocPage(1); // Mulai dari hal 1 kembali
                  }}
                  className={`w-full flex items-start gap-2.5 p-3 rounded-xl text-left text-xs font-bold cursor-pointer transition-all duration-150 border-2 border-slate-900 dark:border-white neo-btn-press
                    ${isActive 
                      ? 'bg-yellow-300 text-slate-950 shadow-[2px_2px_0px_0px_#000]' 
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-gray-300 hover:bg-slate-50'}`}
                >
                  <div className="shrink-0 mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
                    ) : (
                      <Circle className="h-4.5 w-4.5 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block font-extrabold truncate leading-tight uppercase font-display">{mat.title}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 font-mono uppercase">
                      {mat.type === 'video' ? '📺 Video' : mat.type === 'pdf' ? '📖 Dokumen PDF' : '📄 Teks Bacaan'} • {mat.duration}
                    </span>
                  </div>
                </button>
              );
            })}

            {/* Hub Antara materi dan kuis */}
            {course.quizzes.length > 0 && (
              <div className="my-3 border-t-2 border-dashed border-slate-300 dark:border-slate-700" />
            )}

            {/* 2.2 Menampilkan Kuis Interaktif */}
            {course.quizzes.map((quiz) => {
              const savedScoreData = progress.quizScores[quiz.id];
              const isPassed = savedScoreData?.isPassed;
              const hasTaken = savedScoreData !== undefined;
              const isActive = activeItemId === `quiz-${quiz.id}`;

              return (
                <button
                  key={quiz.id}
                  id={`btn-syllabus-quiz-${quiz.id}`}
                  onClick={() => setActiveItemId(`quiz-${quiz.id}`)}
                  className={`w-full flex items-start gap-2.5 p-3 rounded-xl text-left text-xs font-bold cursor-pointer transition-all duration-150 border-2 border-slate-900 dark:border-white neo-btn-press
                    ${isActive 
                      ? 'bg-amber-400 text-slate-950 shadow-[2px_2px_0px_0px_#000]' 
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-gray-300 hover:bg-slate-50'}`}
                >
                  <div className="shrink-0 mt-0.5">
                    {isPassed ? (
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 fill-emerald-100" />
                    ) : hasTaken ? (
                      <Circle className="h-4.5 w-4.5 text-rose-500 fill-rose-100" />
                    ) : (
                      <Brain className="h-4.5 w-4.5 text-indigo-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block font-extrabold truncate leading-tight uppercase font-display">{quiz.title}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 font-mono uppercase">
                      {hasTaken ? `Skor: ${savedScoreData.score}%` : '📝 Kuis Evaluasi'} • {quiz.questions.length} SOAL
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Mobile Dialog Overlay */}
        <AnimatePresence>
          {isSidebarOpenMobile && (
            <div className="md:hidden fixed inset-0 z-50 flex">
              <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsSidebarOpenMobile(false)} />
              
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-slate-950 p-6 border-r-3 border-slate-900 dark:border-white"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-display font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">SILLABUS KELAS</h3>
                  <button onClick={() => setIsSidebarOpenMobile(false)} className="p-1.5 rounded-lg border-2 border-slate-900 dark:border-white bg-slate-55 mr-2">
                    <X className="h-4 w-4 stroke-[2.5]" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar text-left">
                  {course.materials.map((mat) => {
                    const isCompleted = progress.completedMaterials.includes(mat.id);
                    const isActive = activeItemId === `material-${mat.id}`;

                    return (
                      <button
                        key={mat.id}
                        id={`mobile-btn-syllabus-mat-${mat.id}`}
                        onClick={() => {
                          setActiveItemId(`material-${mat.id}`);
                          setSimulatedDocPage(1);
                          setIsSidebarOpenMobile(false);
                        }}
                        className={`w-full flex items-start gap-2.5 p-3 rounded-xl border-2 border-slate-900 text-left text-xs font-bold
                          ${isActive ? 'bg-yellow-300 text-slate-950 shadow-[2px_2px_0px_#000]' : 'bg-white dark:bg-slate-800 text-slate-700'}`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {isCompleted ? <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" /> : <Circle className="h-4.5 w-4.5 text-gray-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block font-black truncate uppercase font-display">{mat.title}</span>
                          <span className="text-[10px] text-gray-400 block mt-0.5 uppercase font-mono">{mat.duration}</span>
                        </div>
                      </button>
                    );
                  })}

                  {course.quizzes.length > 0 && <div className="my-3 border-t-2 border-dashed border-slate-200 dark:border-slate-850" />}

                  {course.quizzes.map((quiz) => {
                    const savedScoreData = progress.quizScores[quiz.id];
                    const isPassed = savedScoreData?.isPassed;
                    const isActive = activeItemId === `quiz-${quiz.id}`;

                    return (
                      <button
                        key={quiz.id}
                        id={`mobile-btn-syllabus-quiz-${quiz.id}`}
                        onClick={() => {
                          setActiveItemId(`quiz-${quiz.id}`);
                          setIsSidebarOpenMobile(false);
                        }}
                        className={`w-full flex items-start gap-2.5 p-3 rounded-xl border-2 border-slate-900 text-left text-xs font-bold
                          ${isActive ? 'bg-amber-400 text-slate-950 shadow-[2px_2px_0px_#000]' : 'bg-white dark:bg-slate-800 text-slate-700'}`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {isPassed ? <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" /> : <Brain className="h-4.5 w-4.5 text-indigo-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block font-black truncate uppercase font-display">{quiz.title}</span>
                          <span className="text-[10px] text-gray-400 block mt-0.5 uppercase font-mono">{quiz.questions.length} Soal</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Kolom Kanan: Detail Viewer Konten Materi Aktif */}
        <div className="col-span-1 md:col-span-3">
          {activeItem ? (
            <div className="space-y-6">
              
              {/* 2.3 RENDER DETAIL MATERI */}
              {activeItem.type === 'material' && activeItem.data && (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-slate-900 border-3 border-slate-900 dark:border-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] text-left">
                    <div className="flex items-center gap-2.5 mb-4">
                      <span className="px-3 py-1 font-mono font-black text-[10px] uppercase tracking-wider bg-yellow-300 text-slate-950 border-2 border-slate-950 rounded-lg">
                        {activeItem.data.type === 'video' ? '📺 VIDEO' : activeItem.data.type === 'pdf' || activeItem.data.type === 'link' ? '📖 DOKUMEN' : '📄 MATERI TEORI'}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-bold uppercase">
                        ESTIMASI: {activeItem.data.duration}
                      </span>
                    </div>

                    <h2 className="font-display font-black text-2xl md:text-3xl lg:text-4xl text-slate-900 dark:text-white leading-tight mb-6 uppercase text-left">
                      {activeItem.data.title}
                    </h2>

                    <div className="h-[3px] w-14 bg-indigo-500 mb-8 rounded-full border border-slate-900" />

                    {/* Pembagian render tipe detail materi */}
                    {activeItem.data.type === 'text' && (
                      <div className="markdown-body text-slate-800 dark:text-gray-200 text-sm sm:text-base leading-relaxed">
                        <ReactMarkdown>{activeItem.data.content}</ReactMarkdown>
                      </div>
                    )}

                    {activeItem.data.type === 'video' && renderVideoMaterial(activeItem.data)}

                    {(activeItem.data.type === 'pdf' || activeItem.data.type === 'link') && renderDocumentMaterial(activeItem.data)}

                  </div>

                  {/* Wrapper Tombol Selesai & Lanjut Bawah Halaman */}
                  <div className="bg-white dark:bg-slate-950 border-3 border-slate-900 dark:border-white p-6 rounded-2xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-left">
                      <h4 className="font-display font-black text-slate-950 dark:text-white uppercase">Selesai Memahami Modul Ini?</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Tandai selesai untuk menyimpan kemajuan lokal Anda di browser.</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {progress.completedMaterials.includes(activeItem.data.id) ? (
                        <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-400 text-slate-950 border-2 border-slate-950 shadow-[2px_2px_0px_#000] text-xs font-black uppercase tracking-wider font-mono">
                          <CheckCircle className="h-4.5 w-4.5" />
                          MATERI SELESAI!
                        </div>
                      ) : (
                        <button
                          id={`btn-mat-complete-action-${activeItem.data.id}`}
                          onClick={() => handleMarkMaterialAsCompleted(activeItem.data!.id, true)}
                          className="w-full sm:w-auto px-6 py-3 rounded-xl font-display font-black text-xs sm:text-sm text-slate-950 bg-indigo-400 hover:bg-indigo-300 cursor-pointer border-2 border-slate-950 shadow-[3px_3px_0px_#000] neo-btn-press"
                        >
                          TANDAI SELESAI & LANJUT
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 2.4 RENDER DETAIL KUIS INTERAKTIF */}
              {activeItem.type === 'quiz' && activeItem.data && (
                <div className="p-1">
                  <QuizPlayer
                    quiz={activeItem.data as Quiz}
                    onComplete={handleQuizCompleted}
                    savedScore={progress.quizScores[activeItem.data.id]?.score}
                    savedAnswers={progress.quizScores[activeItem.data.id]?.answers}
                    accentColor={accentColor}
                  />
                </div>
              )}

              {/* 2.5 Slider Kontrol Navigasi Horizontal Bawah */}
              <div className="flex justify-between items-center sm:px-4 py-4 mt-6">
                <button
                  id="btn-course-prev"
                  onClick={handlePrevItem}
                  disabled={activeIndexInSyllabus <= 0}
                  className="px-5 py-2.5 border-2 border-slate-900 dark:border-white bg-white dark:bg-slate-800 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-gray-800 text-slate-950 dark:text-white disabled:cursor-not-allowed rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider inline-flex items-center gap-1.5 transition-all cursor-pointer neo-btn-press shadow-[2px_2px_0px_#000] dark:shadow-[2px_2px_0px_#fff]"
                >
                  <ArrowLeft className="h-4.5 w-4.5 stroke-[2.5]" />
                  SEBELUMNYA
                </button>

                <button
                  id="btn-course-next"
                  onClick={handleNextItem}
                  disabled={activeIndexInSyllabus >= syllabusList.length - 1}
                  className="px-5 py-2.5 border-2 border-slate-900 dark:border-white bg-white dark:bg-slate-800 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-gray-800 text-slate-950 dark:text-white disabled:cursor-not-allowed rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider inline-flex items-center gap-1.5 transition-all cursor-pointer neo-btn-press shadow-[2px_2px_0px_#000] dark:shadow-[2px_2px_0px_#fff]"
                >
                  SELANJUTNYA
                  <ArrowRight className="h-4.5 w-4.5 stroke-[2.5]" />
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border-3 border-slate-900 dark:border-white rounded-3xl p-12 text-center shadow-[6px_6px_0px_#000]">
              <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3 stroke-[2.5]" />
              <h3 className="font-display font-black text-lg text-slate-900 dark:text-white uppercase leading-none">PILIH BAGIAN SILABUS</h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-2 font-medium">Klik salah satu materi pembelajaran di silabus kiri untuk memulai belajar secara langsung.</p>
            </div>
          )}
        </div>
 
      </div>

    </div>
  );
}
