/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { initialCourses, defaultSettings } from './data/initialData';
import Navbar from './components/Navbar';
import StudentDashboard from './components/StudentDashboard';
import CourseViewer from './components/CourseViewer';
import AdminDashboard from './components/AdminDashboard';
import { Course, LMSSettings, StudentProgress } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, BookOpen } from 'lucide-react';

export default function App() {
  // ==================== 1. INISIALISASI STATE UTAMA (Dukungan LocalStorage) ====================
  
  // State untuk daftar Kursus/Kelas (diambil dari localStorage jika ada, jika tidak pakai seed data awal)
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('nusantara_lms_courses');
    return saved ? JSON.parse(saved) : initialCourses;
  });

  // State kustomisasi logo & penamaan platform
  const [settings, setSettings] = useState<LMSSettings>(() => {
    const saved = localStorage.getItem('nusantara_lms_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  // State Pelacakan Progress Belajar Siswa (courseId -> StudentProgress)
  const [progress, setProgress] = useState<Record<string, StudentProgress>>(() => {
    const saved = localStorage.getItem('nusantara_lms_progress');
    return saved ? JSON.parse(saved) : {};
  });

  // State menu navigasi utamaaktif ('student' -> Ruang Belajar, 'admin' -> Dashboard Panel Admin)
  const [currentTab, setCurrentTab] = useState<'student' | 'admin'>('student');

  // State kursus aktif yang sedang dipelajari siswa (null jika sedang berada di beranda katalog)
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);

  // State Mode Gelap (Dark Mode)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('nusantara_lms_dark_mode');
    return saved === 'true'; // kembalikan true jika tersimpan true
  });


  // ==================== 2. EFek Samping (Side Effects) PENGELOLA SINCRONISASI DATA ====================

  // Efek Samping: Sinkronisasi daftar Kursus ke LocalStorage setiap kali ada perubahan data (Ubah/Tambah/Hapus)
  useEffect(() => {
    localStorage.setItem('nusantara_lms_courses', JSON.stringify(courses));
  }, [courses]);

  // Efek Samping: Sinkronisasi Kostumisasi Branding Platform
  useEffect(() => {
    localStorage.setItem('nusantara_lms_settings', JSON.stringify(settings));
  }, [settings]);

  // Efek Samping: Sinkronisasi Progress Pembelajaran Siswa
  useEffect(() => {
    localStorage.setItem('nusantara_lms_progress', JSON.stringify(progress));
  }, [progress]);

  // Efek Samping: Terapkan Tema Gelap / Terang pada elemen utama HTML document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('nusantara_lms_dark_mode', String(isDarkMode));
  }, [isDarkMode]);


  // ==================== 3. LOGIKA AKSI UTAMA PLATFORM ====================

  // Mengubah preference mode gelap/terang
  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Memperbarui Progress Siswa untuk kursus tertentu (dipanggil dari rincian materi/kuis)
  const handleUpdateCourseProgress = (courseId: string, updatedProgress: StudentProgress) => {
    setProgress(prev => ({
      ...prev,
      [courseId]: updatedProgress
    }));
  };

  // Membuka navigasi kursus tertentu untuk mulai belajar
  const handleSelectCourse = (courseId: string) => {
    setActiveCourseId(courseId);
    
    // Inisialisasi progress belajar di LocalStorage jika ini adalah pertama kali siswa masuk ke kelas bersangkutan
    if (!progress[courseId]) {
      const initialProgressObj: StudentProgress = {
        courseId,
        completedMaterials: [],
        quizScores: {},
        isCourseCompleted: false
      };
      setProgress(prev => ({
        ...prev,
        [courseId]: initialProgressObj
      }));
    }
  };

  // Mengembalikan data progress untuk kursus yang sedang aktif dibaca
  const getActiveCourseProgress = () => {
    if (!activeCourseId) return null;
    return progress[activeCourseId] || {
      courseId: activeCourseId,
      completedMaterials: [],
      quizScores: {},
      isCourseCompleted: false
    };
  };

  // Mendapatkan data kursus aktif
  const activeCourse = courses.find(c => c.id === activeCourseId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 font-sans flex flex-col">
      
      {/* Navbar Atas - Aksesible di seluruh halaman */}
      <Navbar
        currentTab={currentTab}
        setTab={(tab) => {
          setCurrentTab(tab);
          // Bila pindah ke admin atau berpindah tab, bersihkan kelas aktif agar tidak tabrakan navigasi
          if (tab === 'admin') {
            setActiveCourseId(null);
          }
        }}
        isDarkMode={isDarkMode}
        toggleDarkMode={handleToggleDarkMode}
        systemName={settings.systemName}
        accentColor={settings.accentColor}
      />

      {/* Bagian Konten Utama - Disertai transisi animasi memudar agar terasa profesional */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          
          {/* A. VIEW RUANG BELAJAR (STUDENT VIEW) */}
          {currentTab === 'student' && (
            <motion.div
              key="student-space"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {activeCourseId && activeCourse ? (
                // 1. Tampilan Detil Membaca Materi Teori & Kuis di Dalam Kelas (Course player area)
                <CourseViewer
                  course={activeCourse}
                  progress={getActiveCourseProgress()!}
                  onUpdateProgress={(prog) => handleUpdateCourseProgress(activeCourse.id, prog)}
                  onBackToDashboard={() => setActiveCourseId(null)}
                  accentColor={settings.accentColor}
                />
              ) : (
                // 2. Beranda Berupa Katalog Kelas & Progress Belajar Global Siswa
                <StudentDashboard
                  courses={courses}
                  progress={progress}
                  settings={settings}
                  onSelectCourse={handleSelectCourse}
                />
              )}
            </motion.div>
          )}

          {/* B. VIEW KELOLA ADMIN (DASHBOARD KONTROLLER) */}
          {currentTab === 'admin' && (
            <motion.div
              key="admin-space"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <AdminDashboard
                courses={courses}
                settings={settings}
                onUpdateCourses={setCourses}
                onUpdateSettings={setSettings}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer Minimalis yang Bersih dan Elegan */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-850 py-6 mt-16 text-center text-xs text-gray-400 dark:text-gray-500 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center justify-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>{settings.systemName} • Belajar Mandiri Interaktif Berbasis Lokal</span>
          </div>
          <p className="font-light">
            Sistem LMS Terdesentralisasi &copy; 2026. Data Anda disimpan aman secara privat di browser.
          </p>
        </div>
      </footer>

    </div>
  );
}
