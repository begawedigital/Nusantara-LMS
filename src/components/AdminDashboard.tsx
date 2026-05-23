/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Course, Material, Quiz, QuizQuestion, LMSSettings, StudentProgress } from '../types';
import { 
  Plus, Edit, Trash2, BookOpen, Brain, Settings, Users, Check, Save, 
  ChevronDown, ChevronUp, FileText, Video, Link as LinkIcon, UploadCloud, Trash,
  Layers, Lightbulb, CheckSquare, Sparkles, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminDashboardProps {
  courses: Course[];
  settings: LMSSettings;
  onUpdateCourses: (courses: Course[]) => void;
  onUpdateSettings: (settings: LMSSettings) => void;
}

export default function AdminDashboard({
  courses,
  settings,
  onUpdateCourses,
  onUpdateSettings
}: AdminDashboardProps) {
  // Menu tab aktif di dalam Dashboard Admin
  const [activeTab, setActiveTab] = useState<'courses' | 'appearance' | 'students'>('courses');
  
  // State untuk manajemen Kursus
  const [selectedCourseForEdit, setSelectedCourseForEdit] = useState<Course | null>(null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  // Form State untuk Kursus (Tambah / Edit)
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseCategory, setCourseCategory] = useState('');
  const [courseLevel, setCourseLevel] = useState<'Pemula' | 'Menengah' | 'Mahir'>('Pemula');
  const [courseCoverUrl, setCourseCoverUrl] = useState('');

  // State Kelola Materi (Tambah / Edit)
  const [isAddingMaterial, setIsAddingMaterial] = useState<string | null>(null); // courseId
  const [matTitle, setMatTitle] = useState('');
  const [matType, setMatType] = useState<'text' | 'video' | 'pdf' | 'link'>('text');
  const [matDuration, setMatDuration] = useState('10 Menit');
  const [matContent, setMatContent] = useState('');
  const [matFileName, setMatFileName] = useState<string | null>(null);

  // State Kelola Kuis & Pertanyaan (Tambah / Edit)
  const [isAddingQuiz, setIsAddingQuiz] = useState<string | null>(null); // courseId
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');

  const [isAddingQuestion, setIsAddingQuestion] = useState<{ courseId: string; quizId: string } | null>(null);
  const [qQuestion, setQQuestion] = useState('');
  const [qOptions, setQOptions] = useState<string[]>(['', '', '', '']);
  const [qCorrectIndex, setQCorrectIndex] = useState(0);
  const [qExplanation, setQExplanation] = useState('');

  // State Pengaturan Tampilan
  const [tempSettings, setTempSettings] = useState<LMSSettings>({ ...settings });
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Simulasi progress log siswa tambahan untuk pengisian monitoring administrator
  const simulatedStudents: { name: string; courseTitle: string; progress: number; testScore: string; date: string }[] = [
    { name: "Ahmad Fauzi", courseTitle: "Dasar Pemrograman Web dan Tailwind CSS", progress: 100, testScore: "95% (Lulus)", date: "24 Mei 2026" },
    { name: "Rara Anindya", courseTitle: "Dasar Pemrograman Web dan Tailwind CSS", progress: 66, testScore: "Sedang Belajar", date: "23 Mei 2026" },
    { name: "Budi Santoso", courseTitle: "Prinsip Dasar Desain UI/UX & Wireframing", progress: 100, testScore: "75% (Lulus)", date: "22 Mei 2026" },
    { name: "Eka Wahyuni", courseTitle: "Prinsip Dasar Desain UI/UX & Wireframing", progress: 33, testScore: "Sedang Belajar", date: "20 Mei 2026" }
  ];

  // Helper untuk menampilkan notifikasi mengambang (toast) singkat
  const triggerToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3000);
  };

  // ==================== DAFTAR LOGIKA CRUD KURSUS ====================
  
  // Setel form ke mode Edit Kursus
  const handleEditCourseClick = (course: Course) => {
    setSelectedCourseForEdit(course);
    setIsAddingCourse(true);
    setCourseTitle(course.title);
    setCourseDescription(course.description);
    setCourseCategory(course.category);
    setCourseLevel(course.level);
    setCourseCoverUrl(course.coverUrl || '');
  };

  // Batalkan form pendaftaran kursus
  const handleCancelCourseForm = () => {
    setIsAddingCourse(false);
    setSelectedCourseForEdit(null);
    setCourseTitle('');
    setCourseDescription('');
    setCourseCategory('');
    setCourseLevel('Pemula');
    setCourseCoverUrl('');
  };

  // Simpan penambahan atau perubahan Kursus
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle || !courseDescription || !courseCategory) {
      alert("Harap lengkapi semua field utama!");
      return;
    }

    // fallback cover image jika dikosongkan
    const finalCover = courseCoverUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80";

    if (selectedCourseForEdit) {
      // MODE EDIT
      const updated = courses.map(c => {
        if (c.id === selectedCourseForEdit.id) {
          return {
            ...c,
            title: courseTitle,
            description: courseDescription,
            category: courseCategory,
            level: courseLevel,
            coverUrl: finalCover
          };
        }
        return c;
      });
      onUpdateCourses(updated);
      triggerToast("Kursus berhasil diperbarui!");
    } else {
      // MODE TAMBAH BARU
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        title: courseTitle,
        description: courseDescription,
        category: courseCategory,
        level: courseLevel,
        coverUrl: finalCover,
        materials: [],
        quizzes: []
      };
      onUpdateCourses([...courses, newCourse]);
      triggerToast("Kursus baru berhasil ditambahkan!");
    }

    handleCancelCourseForm();
  };

  // Hapus Kursus secara total
  const handleDeleteCourse = (courseId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kursus ini beserta seluruh materi dan kuis di dalamnya?")) {
      const updated = courses.filter(c => c.id !== courseId);
      onUpdateCourses(updated);
      triggerToast("Kursus berhasil dihapus!");
      if (expandedCourseId === courseId) setExpandedCourseId(null);
    }
  };

  // ==================== DAFTAR LOGIKA CRUD MATERI ====================

  // Mengunggah berkas lokal simulasi fungsional tinggi
  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMatFileName(file.name);
      setMatTitle(file.name.split('.').slice(0, -1).join('.'));
      setMatType('pdf'); // default unggah diubah ke tipe dokumen PDF
      triggerToast(`Berkas "${file.name}" berhasil diunggah ke sistem.`);
    }
  };

  // Simpan Materi Baru
  const handleSaveMaterial = (e: React.FormEvent, courseId: string) => {
    e.preventDefault();
    if (!matTitle) {
      alert("Harap isi judul materi pembelajaran!");
      return;
    }

    const newMaterial: Material = {
      id: `mat-${Date.now()}`,
      title: matTitle,
      type: matType,
      duration: matDuration,
      content: matContent || `### ${matTitle}\nMateri baru berhasil dimuat.`
    };

    if (matFileName) {
      newMaterial.fileName = matFileName;
    }

    const updated = courses.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          materials: [...c.materials, newMaterial]
        };
      }
      return c;
    });

    onUpdateCourses(updated);
    triggerToast("Materi baru berhasil diunggah!");
    
    // Reset state form materi
    setIsAddingMaterial(null);
    setMatTitle('');
    setMatType('text');
    setMatDuration('10 Menit');
    setMatContent('');
    setMatFileName(null);
  };

  const handleDeleteMaterial = (courseId: string, materialId: string) => {
    if (confirm("Hapus materi pembelajaran ini?")) {
      const updated = courses.map(c => {
        if (c.id === courseId) {
          return {
            ...c,
            materials: c.materials.filter(m => m.id !== materialId)
          };
        }
        return c;
      });
      onUpdateCourses(updated);
      triggerToast("Materi berhasil dihapus.");
    }
  };

  // ==================== DAFTAR LOGIKA CRUD KUIS & SOAL ====================

  // Tambah Kuis Baru ke Kursus
  const handleSaveQuiz = (e: React.FormEvent, courseId: string) => {
    e.preventDefault();
    if (!quizTitle) {
      alert("Harap masukkan judul kuis!");
      return;
    }

    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      title: quizTitle,
      description: quizDescription,
      questions: []
    };

    const updated = courses.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          quizzes: [...c.quizzes, newQuiz]
        };
      }
      return c;
    });

    onUpdateCourses(updated);
    triggerToast("Kuis baru berhasil diaktifkan! Silakan tambahkan butir pertanyaan.");
    
    setIsAddingQuiz(null);
    setQuizTitle('');
    setQuizDescription('');
  };

  const handleDeleteQuiz = (courseId: string, quizId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus evaluasi kuis ini?")) {
      const updated = courses.map(c => {
        if (c.id === courseId) {
          return {
            ...c,
            quizzes: c.quizzes.filter(q => q.id !== quizId)
          };
        }
        return c;
      });
      onUpdateCourses(updated);
      triggerToast("Kuis berhasil dihapus.");
    }
  };

  const handleSaveQuestion = (e: React.FormEvent, courseId: string, quizId: string) => {
    e.preventDefault();
    if (!qQuestion) return;

    // Pastikan pilihan jawaban diisi lengkap
    if (qOptions.some(opt => opt.trim() === '')) {
      alert("Harap lengkapi keempat pilihan jawaban!");
      return;
    }

    const newQuestion: QuizQuestion = {
      id: `q-${Date.now()}`,
      question: qQuestion,
      options: [...qOptions],
      correctAnswerIndex: qCorrectIndex,
      explanation: qExplanation
    };

    const updated = courses.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          quizzes: c.quizzes.map(q => {
            if (q.id === quizId) {
              return {
                ...q,
                questions: [...q.questions, newQuestion]
              };
            }
            return q;
          })
        };
      }
      return c;
    });

    onUpdateCourses(updated);
    triggerToast("Pertanyaan baru berhasil ditambahkan!");

    // Reset Form Pertanyaan
    setIsAddingQuestion(null);
    setQQuestion('');
    setQOptions(['', '', '', '']);
    setQCorrectIndex(0);
    setQExplanation('');
  };

  const handleDeleteQuestion = (courseId: string, quizId: string, questionId: string) => {
    if (confirm("Hapus butir pertanyaan kuis ini?")) {
      const updated = courses.map(c => {
        if (c.id === courseId) {
          return {
            ...c,
            quizzes: c.quizzes.map(q => {
              if (q.id === quizId) {
                return {
                  ...q,
                  questions: q.questions.filter(qt => qt.id !== questionId)
                };
              }
              return q;
            })
          };
        }
        return c;
      });
      onUpdateCourses(updated);
      triggerToast("Pertanyaan kuis berhasil dihapus.");
    }
  };

  // ==================== DAFTAR LOGIKA PENGATURAN TAMPILAN ====================
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(tempSettings);
    triggerToast("Kustomisasi tampilan platform berhasil disimpan secara permanen!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-200">
      
      {/* 1. Header & Deskripsi Panel Admin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-150 dark:border-gray-800 mb-8 gap-4">
        <div className="text-left">
          <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            Pusat Pengendali Administrator
          </div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-gray-900 dark:text-white mt-1">
            Dashboard Editor LMS
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1 max-w-xl">
            Kelola silabus, unggah bahan belajar mandiri, atur kuis interaktif, ubah branding nama/banner web, serta monitor hasil pembelajaran siswa di komputer ini secara lokal.
          </p>
        </div>

        {/* Tab Menu Horizontal Atas Dashboard */}
        <div className="flex rounded-xl p-1 bg-gray-100 dark:bg-gray-850 border border-gray-200/50 dark:border-gray-800 self-start md:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5
              ${activeTab === 'courses' ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-xs' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Kelas & Materi
          </button>
          
          <button
            onClick={() => setActiveTab('appearance')}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5
              ${activeTab === 'appearance' ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-xs' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <Settings className="h-3.5 w-3.5" />
            Tampilan Platform
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5
              ${activeTab === 'students' ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-xs' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <Users className="h-3.5 w-3.5" />
            Kemajuan Siswa
          </button>
        </div>
      </div>

      {/* Notifikasi Toast Singkat */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold"
          >
            <Check className="h-4 w-4" />
            {successToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* =================================================================== */}
      {/* TAB 1: MANAJEMEN KURSUS & SILABUS BELAJAR BARU */}
      {/* =================================================================== */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          
          <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800 p-4 rounded-xl">
            <h3 className="font-display font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
              Daftar Kelas Pembelajaran ({courses.length})
            </h3>
            
            {!isAddingCourse && (
              <button
                onClick={() => setIsAddingCourse(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-shadow shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Tambah Kelas Baru
              </button>
            )}
          </div>

          {/* Form Pembuatan / Penguasaan Detail Kursus Baru */}
          {isAddingCourse && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-900 p-6 rounded-2xl shadow-md text-left"
            >
              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-6">
                {selectedCourseForEdit ? 'Ubah Informasi Detail Kelas' : 'Daftarkan Kelas Pembelajaran Baru'}
              </h3>
              
              <form onSubmit={handleSaveCourse} className="space-y-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Judul Kelas */}
                  <div className="space-y-1 text-left">
                    <label className="font-bold text-gray-900 dark:text-gray-200">Judul Kelas / Kursus <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Belajar Python Dasar"
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  
                  {/* Kategori */}
                  <div className="space-y-1 text-left">
                    <label className="font-bold text-gray-900 dark:text-gray-200">Kategori Bidang Ilmu <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Web Development, Data Science, Desain"
                      value={courseCategory}
                      onChange={(e) => setCourseCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tingkat Kesulitan */}
                  <div className="space-y-1 text-left">
                    <label className="font-bold text-gray-900 dark:text-gray-200">Tingkat Kesulitan <span className="text-red-500">*</span></label>
                    <select
                      value={courseLevel}
                      onChange={(e) => setCourseLevel(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="Pemula">Pemula</option>
                      <option value="Menengah">Menengah</option>
                      <option value="Mahir">Mahir</option>
                    </select>
                  </div>

                  {/* URL Gambar Sampul */}
                  <div className="space-y-1 text-left">
                    <label className="font-bold text-gray-900 dark:text-gray-200">URL Gambar Sampul (Opsional)</label>
                    <input
                      type="url"
                      placeholder="Contoh: https://images.unsplash.com/..."
                      value={courseCoverUrl}
                      onChange={(e) => setCourseCoverUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Deskripsi Lengkap */}
                <div className="space-y-1 text-left">
                  <label className="font-bold text-gray-900 dark:text-gray-200">Ringkasan Deskripsi Kelas <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tuliskan tujuan dan bahasan kelas secara detail dan ramah bagi calon siswa..."
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Tombol aksi */}
                <div className="flex gap-3 justify-end pt-3 border-t border-gray-100 dark:border-gray-750">
                  <button
                    type="button"
                    onClick={handleCancelCourseForm}
                    className="px-4 py-2 border border-gray-200 dark:border-gray-750 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl font-semibold text-gray-600 dark:text-gray-300 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="h-4 w-4" />
                    Simpan Kelas
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* List Kursus Tersedia (Dua Arah Accordion) */}
          <div className="space-y-4">
            {courses.map((course) => {
              const isExpanded = expandedCourseId === course.id;

              return (
                <div
                  key={course.id}
                  className="bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-850 rounded-2xl overflow-hidden shadow-xs transition-colors"
                >
                  {/* Header Row Kursus */}
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-900/20 border-b border-gray-50 dark:border-gray-850">
                    <div className="flex items-start sm:items-center gap-3.5 text-left">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
                        <img 
                          src={course.coverUrl} 
                          alt="" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 leading-none">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/55 dark:text-indigo-400 capitalize">
                            {course.level}
                          </span>
                          <span className="text-[10px] font-medium text-gray-400">
                            {course.category}
                          </span>
                        </div>
                        <h4 className="font-display font-bold text-sm sm:text-base text-gray-900 dark:text-white mt-1">
                          {course.title}
                        </h4>
                      </div>
                    </div>

                    {/* Tombol aksi Edit, Hapus, Kelola Konten */}
                    <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
                      <button
                        onClick={() => handleEditCourseClick(course)}
                        className="p-2 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg bg-white dark:bg-gray-850 cursor-pointer"
                        title="Ubah Kelas"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-2 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-rose-600 rounded-lg bg-white dark:bg-gray-850 cursor-pointer"
                        title="Hapus Kelas"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                        className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg bg-white dark:bg-gray-850 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isExpanded ? 'Tutup Silabus' : 'Kelola Silabus'}</span>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Konten Submenu Kelola Silabus (Materi & Kuis) */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-6 border-t border-gray-100 dark:border-gray-700/50 text-left bg-gray-50/20 dark:bg-gray-900/10 space-y-8"
                    >
                      {/* ==================================== */}
                      {/* SUB-SEKSI A: KELOLA MATERI PEMBELAJARAN */}
                      {/* ==================================== */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-3.5 border border-gray-100 dark:border-gray-750 rounded-xl">
                          <h5 className="font-display font-bold text-xs sm:text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                            <FileText className="h-4.5 w-4.5 text-indigo-500" />
                            Kelola Materi Pembelajaran ({course.materials.length})
                          </h5>
                          
                          {!isAddingMaterial && (
                            <button
                              onClick={() => {
                                setIsAddingMaterial(course.id);
                                setMatFileName(null);
                              }}
                              className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-650 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              Tambah Materi
                            </button>
                          )}
                        </div>

                        {/* Form Pengunggahan / Pembuatan Materi Baru */}
                        {isAddingMaterial === course.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-850 p-5 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4 shadow-inner"
                          >
                            <h6 className="font-bold text-xs sm:text-sm text-indigo-600 dark:text-indigo-400">
                              Buat Konten Pembelajaran / Unggah Materi Berkas
                            </h6>

                            {/* 1. Area Dropzone Unggah Berkas Fungsional yang Sangat Menarik */}
                            <div className="border-2 border-dashed border-gray-200 dark:border-gray-750 hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer rounded-xl p-5 text-center transition-colors relative">
                              <input 
                                type="file" 
                                id={`file-upload-input-${course.id}`}
                                accept=".pdf,.mp4,.txt,.doc"
                                onChange={handleSimulatedFileUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                              />
                              <UploadCloud className="h-8 w-8 text-indigo-400 mx-auto mb-2" />
                              <span className="font-bold text-xs text-gray-700 dark:text-gray-300 block mb-0.5">
                                {matFileName ? `Berkas terpilih: ${matFileName}` : 'Klik untuk Unggah Berkas Materi Teori (PDF/MP4)'}
                              </span>
                              <span className="text-[10px] text-gray-400 block">
                                Mendukung jenis berkas PDF pembelajaran, video mp4, atau ringkasan materi (.txt)
                              </span>
                            </div>

                            <form onSubmit={(e) => handleSaveMaterial(e, course.id)} className="space-y-4 text-xs">
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Judul Materi */}
                                <div className="space-y-1">
                                  <label className="font-bold text-gray-700 dark:text-gray-300">Judul Materi Pembelajaran <span className="text-red-500">*</span></label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Mengatur Grid Layout pada CSS"
                                    value={matTitle}
                                    onChange={(e) => setMatTitle(e.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                  />
                                </div>

                                {/* Estimasi Durasi */}
                                <div className="space-y-1">
                                  <label className="font-bold text-gray-700 dark:text-gray-300">Estimasi Durasi Belajar <span className="text-red-500">*</span></label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Contoh: 10 Menit, 15 Menit"
                                    value={matDuration}
                                    onChange={(e) => setMatDuration(e.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Tipe Materi */}
                                <div className="space-y-1">
                                  <label className="font-bold text-gray-700 dark:text-gray-300">Tipe Konten Pembelajaran <span className="text-red-500">*</span></label>
                                  <select
                                    value={matType}
                                    onChange={(e) => setMatType(e.target.value as any)}
                                    className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                  >
                                    <option value="text">Teori Tekstual (Format Markdown Lengkap)</option>
                                    <option value="video">Url Semat Video (YouTube Embed)</option>
                                    <option value="pdf">Berkas Elektronik (Simulasi PDF Dokumen)</option>
                                    <option value="link">Tautan Referensi Web Eksternal</option>
                                  </select>
                                </div>

                                {/* URL Input (Hanya jika video atau pdf di luar unggah lokal) */}
                                {matType !== 'text' && (
                                  <div className="space-y-1 animate-fadeIn">
                                    <label className="font-bold text-gray-700 dark:text-gray-300">Tautan Materi / URL Video <span className="text-red-500">*</span></label>
                                    <input
                                      type="text"
                                      placeholder={matType === 'video' ? 'Contoh: https://www.youtube.com/watch?v=R9I85RhI7Cg' : 'Contoh: https://link-ke-dokumen.pdf'}
                                      value={matContent}
                                      onChange={(e) => setMatContent(e.target.value)}
                                      className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                    />
                                  </div>
                                )}
                              </div>

                              {/* Text Area Teori Markdown (Hanya jika tipe tekstual teori) */}
                              {matType === 'text' && (
                                <div className="space-y-1 text-left">
                                  <label className="font-bold text-gray-700 dark:text-gray-300">Konten Penulisan Teori (Mendukung Markdown)</label>
                                  <textarea
                                    rows={5}
                                    placeholder="Tulis materi teori menggunakan sintaks Markdown dasar seperti # Header, **Bold**, atau ```html <code>```..."
                                    value={matContent}
                                    onChange={(e) => setMatContent(e.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-xs"
                                  />
                                </div>
                              )}

                              {/* Tombol Simpan */}
                              <div className="flex justify-end gap-2.5 pt-2 border-t border-gray-100 dark:border-gray-750">
                                <button
                                  type="button"
                                  onClick={() => setIsAddingMaterial(null)}
                                  className="px-3.5 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 text-gray-600 dark:text-gray-300 cursor-pointer"
                                >
                                  Batal
                                </button>
                                <button
                                  type="submit"
                                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold cursor-pointer"
                                >
                                  Unggah Materi Belajar
                                </button>
                              </div>

                            </form>
                          </motion.div>
                        )}

                        {/* List tabel materi fungsional */}
                        <div className="space-y-2.5">
                          {course.materials.length === 0 ? (
                            <p className="text-gray-400 text-xs italic bg-white dark:bg-gray-800 p-4 border rounded-xl text-center">
                              Belum ada materi pembelajaran didaftarkan pada kelas ini.
                            </p>
                          ) : (
                            course.materials.map((mat) => (
                              <div
                                key={mat.id}
                                className="bg-white dark:bg-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-850 p-3 rounded-xl border border-gray-100 dark:border-gray-750 flex items-center justify-between text-xs transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded bg-indigo-50 dark:bg-indigo-950/25 text-indigo-500 shrink-0">
                                    {mat.type === 'video' ? <Video className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                                  </div>
                                  <div className="text-left">
                                    <span className="font-semibold text-gray-900 dark:text-white block">{mat.title}</span>
                                    <span className="text-[10px] text-gray-400 font-medium">
                                      Estimasi: {mat.duration} • Tipe: <span className="uppercase text-[9px] font-bold text-indigo-500">{mat.type}</span>
                                      {mat.fileName && ` • Unggahan: ${mat.fileName}`}
                                    </span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleDeleteMaterial(course.id, mat.id)}
                                  className="p-1.5 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-gray-400 dark:text-gray-500 rounded-md shrink-0 cursor-pointer"
                                  title="Hapus Materi"
                                >
                                  <Trash className="h-4 w-4" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>

                      </div>

                      {/* ==================================== */}
                      {/* SUB-SEKSI B: KELOLA KUIS INTERAKTIF */}
                      {/* ==================================== */}
                      <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-3.5 border border-gray-100 dark:border-gray-750 rounded-xl">
                          <h5 className="font-display font-bold text-xs sm:text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                            <Brain className="h-4.5 w-4.5 text-emerald-500" />
                            Kelola Kuis Evaluasi Mandiri ({course.quizzes.length})
                          </h5>
                          
                          {!isAddingQuiz && (
                            <button
                              onClick={() => setIsAddingQuiz(course.id)}
                              className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-650 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              Buat Kuis
                            </button>
                          )}
                        </div>

                        {/* Form Pengisian Judul Kuis */}
                        {isAddingQuiz === course.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-850 p-5 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4 shadow-inner text-xs"
                          >
                            <h6 className="font-bold text-amber-500 text-left">Konfigurasi Kuis Evaluasi Terbaru</h6>
                            <form onSubmit={(e) => handleSaveQuiz(e, course.id)} className="space-y-3.5">
                              <div className="space-y-1 text-left">
                                <label className="font-bold text-gray-700 dark:text-gray-300">Judul Kuis <span className="text-red-500">*</span></label>
                                <input
                                  type="text"
                                  required
                                  placeholder="Contoh: Kuis Kompetensi Layout Dasar Web"
                                  value={quizTitle}
                                  onChange={(e) => setQuizTitle(e.target.value)}
                                  className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                />
                              </div>

                              <div className="space-y-1 text-left">
                                <label className="font-bold text-gray-700 dark:text-gray-300">Deskripsi Petunjuk Kuis</label>
                                <input
                                  type="text"
                                  placeholder="Tulis instruksi pengerjaan singkat..."
                                  value={quizDescription}
                                  onChange={(e) => setQuizDescription(e.target.value)}
                                  className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                />
                              </div>

                              <div className="flex justify-end gap-2 pt-2">
                                <button
                                  type="button"
                                  onClick={() => setIsAddingQuiz(null)}
                                  className="px-3.5 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 dark:border-gray-700 text-gray-500 cursor-pointer"
                                >
                                  Batal
                                </button>
                                <button
                                  type="submit"
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold cursor-pointer"
                                >
                                  Aktifkan Kuis
                                </button>
                              </div>
                            </form>
                          </motion.div>
                        )}

                        {/* List Kuis beserta sub-daftar Pertanyaan */}
                        <div className="space-y-4">
                          {course.quizzes.length === 0 ? (
                            <p className="text-gray-400 text-xs italic bg-white dark:bg-gray-800 p-4 border rounded-xl text-center">
                              Belum ada kuis didaftarkan pada kelas ini.
                            </p>
                          ) : (
                            course.quizzes.map((quiz) => (
                              <div
                                key={quiz.id}
                                className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-104 dark:border-gray-750 text-left space-y-4"
                              >
                                <div className="flex items-center justify-between border-b pb-2">
                                  <div>
                                    <span className="font-bold text-gray-900 dark:text-white text-xs block">{quiz.title}</span>
                                    <span className="text-[10px] text-gray-400">{quiz.questions.length} dari total pertanyaan aktif</span>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => setIsAddingQuestion({ courseId: course.id, quizId: quiz.id })}
                                      className="px-2.5 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-150 text-indigo-600 dark:text-indigo-400 font-bold rounded-lg text-[10px] sm:text-xs flex items-center gap-1 cursor-pointer"
                                    >
                                      <Plus className="h-3.5 w-3.5" />
                                      Tambah Soal
                                    </button>
                                    
                                    <button
                                      onClick={() => handleDeleteQuiz(course.id, quiz.id)}
                                      className="p-1 text-gray-400 hover:text-rose-500 rounded cursor-pointer"
                                      title="Hapus Kuis secara Total"
                                    >
                                      <Trash className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>

                                {/* Form Tambah Pertanyaan Spesifik ke Kuis ini */}
                                {isAddingQuestion?.quizId === quiz.id && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-gray-50/50 dark:bg-gray-900/40 p-4 rounded-xl border border-gray-150 text-xs space-y-3"
                                  >
                                    <span className="font-bold text-indigo-600 flex items-center gap-1">
                                      <HelpCircle className="h-4 w-4" />
                                      Butir Pertanyaan Kuis Terbaru
                                    </span>
                                    
                                    <form onSubmit={(e) => handleSaveQuestion(e, course.id, quiz.id)} className="space-y-4">
                                      {/* Judul Pertanyaan */}
                                      <div className="space-y-1">
                                        <label className="font-semibold text-gray-700 dark:text-gray-300">Teks Pertanyaan <span className="text-red-500">*</span></label>
                                        <input
                                          type="text"
                                          required
                                          placeholder="Contoh: Apa kepanjangan dari istilah HTML?"
                                          value={qQuestion}
                                          onChange={(e) => setQQuestion(e.target.value)}
                                          className="w-full p-2 rounded-lg border bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
                                        />
                                      </div>

                                      {/* Opsi Jawaban (A, B, C, D) */}
                                      <div className="space-y-2">
                                        <label className="font-semibold text-gray-700 block">Isi 4 Pilihan Jawaban <span className="text-red-500">*</span></label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                          {qOptions.map((opt, oIdx) => (
                                            <div key={oIdx} className="flex items-center gap-1.5">
                                              <span className="font-bold text-gray-400 uppercase">{String.fromCharCode(65 + oIdx)}:</span>
                                              <input
                                                type="text"
                                                required
                                                placeholder={`Jawaban Pilihan ${String.fromCharCode(65 + oIdx)}`}
                                                value={opt}
                                                onChange={(e) => {
                                                  const copy = [...qOptions];
                                                  copy[oIdx] = e.target.value;
                                                  setQOptions(copy);
                                                }}
                                                className="flex-1 p-2 border rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
                                              />
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Kunci Jawaban Semat Index */}
                                      <div className="space-y-1">
                                        <label className="font-semibold text-gray-700 dark:text-gray-300">Jawaban Pilihan yang Benar <span className="text-red-500">*</span></label>
                                        <select
                                          value={qCorrectIndex}
                                          onChange={(e) => setQCorrectIndex(Number(e.target.value))}
                                          className="w-full p-2 border rounded-lg bg-white dark:bg-gray-950 text-gray-905"
                                        >
                                          <option value={0}>Pilihan A</option>
                                          <option value={1}>Pilihan B</option>
                                          <option value={2}>Pilihan C</option>
                                          <option value={3}>Pilihan D</option>
                                        </select>
                                      </div>

                                      {/* Penjelasan Pembahasan */}
                                      <div className="space-y-1">
                                        <label className="font-semibold text-gray-700 dark:text-gray-300">Ulasan & Jawaban Penjelasan (Opsional)</label>
                                        <input
                                          type="text"
                                          placeholder="Ulasan detail mengapa opsi ini secara rasional adalah yang paling akurat..."
                                          value={qExplanation}
                                          onChange={(e) => setQExplanation(e.target.value)}
                                          className="w-full p-2 border rounded-lg bg-white dark:bg-gray-955 text-gray-900 dark:text-white"
                                        />
                                      </div>

                                      {/* Save Button */}
                                      <div className="flex justify-end gap-2">
                                        <button
                                          type="button"
                                          onClick={() => setIsAddingQuestion(null)}
                                          className="px-3.5 py-1.5 border rounded-lg hover:bg-gray-50 dark:border-gray-700 text-gray-500 cursor-pointer"
                                        >
                                          Batal
                                        </button>
                                        <button
                                          type="submit"
                                          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold cursor-pointer"
                                        >
                                          Simpan Soal
                                        </button>
                                      </div>
                                    </form>
                                  </motion.div>
                                )}

                                {/* Tampilan List Pertanyaan kuis yang sudah dibuat */}
                                <div className="space-y-2">
                                  {quiz.questions.length === 0 ? (
                                    <p className="text-gray-400 text-[11px] italic text-center">Belum ada butir pertanyaan aktif. Tambahkan soal pertamamu!</p>
                                  ) : (
                                    quiz.questions.map((qst, qstIdx) => (
                                      <div
                                        key={qst.id}
                                        className="bg-gray-50 dark:bg-gray-900/40 p-3 rounded-lg border border-gray-100 dark:border-gray-800 flex items-start justify-between text-xs transition-shadow"
                                      >
                                        <div className="text-left pr-4">
                                          <span className="font-bold text-gray-700 dark:text-gray-300 block mb-0.5">Soal {qstIdx + 1}: {qst.question}</span>
                                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[10px] text-gray-400">
                                            <span>Opsi: {qst.options.join(', ')}</span>
                                            <span className="font-bold text-emerald-500 dark:text-emerald-400">
                                              Kunci: Opsi {String.fromCharCode(65 + qst.correctAnswerIndex)}
                                            </span>
                                          </div>
                                        </div>

                                        <button
                                          onClick={() => handleDeleteQuestion(course.id, quiz.id, qst.id)}
                                          className="p-1.5 hover:text-rose-500 hover:bg-rose-55 dark:hover:bg-rose-950/30 text-gray-400 rounded cursor-pointer"
                                          title="Hapus Pertanyaan"
                                        >
                                          <Trash className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                      </div>

                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: EDIT KUSTOMISASI TAMPILAN LMS (BRANDING & BANNER) */}
      {/* =================================================================== */}
      {activeTab === 'appearance' && (
        <div className="bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-800 p-8 sm:p-10 rounded-2xl shadow-xs text-left max-w-2xl mx-auto my-4 transition-colors">
          <div className="flex items-center gap-2 mb-6">
            <span className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500">
              <Settings className="h-5 w-5" />
            </span>
            <div className="text-left">
              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white leading-tight">
                Sesuaikan Tampilan Utama
              </h3>
              <p className="text-gray-400 text-xs mt-0.5">Atur nama instansi/platform, header, sub-judul, dan warna aksen secara instan.</p>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            {/* Nama LMS */}
            <div className="space-y-1 text-left">
              <label className="font-bold text-gray-900 dark:text-gray-200">Nama Platform LMS <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={tempSettings.systemName}
                onChange={(e) => setTempSettings({ ...tempSettings, systemName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-950 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Warna Aksen Platform */}
            <div className="space-y-2 text-left">
              <label className="font-bold text-gray-900 dark:text-gray-200 block">Pilih Warna Sorotan Branding</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {[
                  { value: 'indigo', label: 'Indigo', color: 'bg-indigo-600' },
                  { value: 'blue', label: 'Blue', color: 'bg-blue-600' },
                  { value: 'emerald', label: 'Emerald', color: 'bg-emerald-600' },
                  { value: 'amber', label: 'Amber', color: 'bg-amber-500' },
                  { value: 'rose', label: 'Rose', color: 'bg-rose-600' },
                  { value: 'violet', label: 'Violet', color: 'bg-violet-600' }
                ].map((col) => (
                  <button
                    key={col.value}
                    type="button"
                    onClick={() => setTempSettings({ ...tempSettings, accentColor: col.value })}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-[11px] font-semibold cursor-pointer
                      ${tempSettings.accentColor === col.value 
                        ? 'border-indigo-500 bg-indigo-55/10 text-indigo-900 dark:text-white ring-1 ring-indigo-500' 
                        : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900'}`}
                  >
                    <span className={`h-4 w-4 rounded-full ${col.color} block`} />
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hero Banner Title */}
            <div className="space-y-1 text-left">
              <label className="font-bold text-gray-900 dark:text-gray-200">Judul Utama Hero Banner <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={tempSettings.heroTitle}
                onChange={(e) => setTempSettings({ ...tempSettings, heroTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-950 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Hero Subtitle */}
            <div className="space-y-1 text-left">
              <label className="font-bold text-gray-900 dark:text-gray-200">Dukungan Deskripsi Sub-Judul <span className="text-red-500">*</span></label>
              <textarea
                required
                rows={3}
                value={tempSettings.heroSubtitle}
                onChange={(e) => setTempSettings({ ...tempSettings, heroSubtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-955 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Tombol Simpan */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-750 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Save className="h-4.5 w-4.5" />
                Simpan Konfigurasi Tampilan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 3: VISUAL MONITORING PROGRES SISWA LOKAL SIMULATIF */}
      {/* =================================================================== */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-800 p-6 rounded-2xl shadow-xs text-left">
            <h3 className="font-display font-bold text-base text-gray-905 dark:text-white mb-2">
              Log Monitoring Progres Siswa Aktif
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xl">
              Daftar di bawah memantau riwayat siswa yang melakukan kegiatan belajar mandiri. Karena status diatur tanpa registrasi, sistem ini mencatat pencapaian siswa melalui ID progres peramban secara anonim, dikombinasikan dengan data simulatif analitik.
            </p>
          </div>

          {/* Tabel monitoring */}
          <div className="overflow-x-auto shadow-xs border border-gray-100 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-800">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-gray-50/80 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Nama Siswa / ID</th>
                  <th className="px-6 py-3.5">Kursus Terpilih</th>
                  <th className="px-6 py-3.5">Kemajuan (%)</th>
                  <th className="px-6 py-3.5">Hasil Evaluasi Kuis Terbaik</th>
                  <th className="px-6 py-3.5">Aktivitas Terakhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                {/* 1. Baris Siswa Utama Lokal Saat ini */}
                <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-850 bg-indigo-50/5 dark:bg-indigo-950/5 font-medium leading-relaxed">
                  <td className="px-6 py-4 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 block animate-pulse" title="Siswa Aktif Saat ini di Komputer Ini" />
                    <div>
                      <span className="block font-bold text-gray-900 dark:text-white">Pelajar Lokal (Komputer Ini)</span>
                      <span className="text-[10px] text-gray-450 Block uppercase tracking-widest font-semibold text-indigo-500">Anda</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">Semua Kursus Aktif</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">Real-time</span>
                      <span className="text-gray-400 font-normal">(Auto-save)</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-semibold text-[10px]">
                      Sesuai Kuis
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 font-normal">Baru Saja</td>
                </tr>

                {/* 2. Baris Siswa Pengisian Simulatif untuk Evaluasi Visual */}
                {simulatedStudents.map((stud, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-850">
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{stud.name}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{stud.courseTitle}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500" 
                            style={{ width: `${stud.progress}%` }} 
                          />
                        </div>
                        <span className="font-bold">{stud.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px]
                        ${stud.testScore.includes('Lulus') ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-gray-100 text-gray-550 dark:bg-gray-700'}`}>
                        {stud.testScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-normal">{stud.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
