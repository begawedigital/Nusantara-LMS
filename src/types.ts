/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Interface untuk data Kuis Interaktif
export interface QuizQuestion {
  id: string;
  question: string;         // Pertanyaan kuis
  options: string[];        // Pilihan jawaban (minimal 2)
  correctAnswerIndex: number; // Index jawaban yang benar (0-based)
  explanation?: string;     // Penjelasan jawaban setelah selesai menjawab
}

export interface Quiz {
  id: string;
  title: string;            // Judul kuis
  description?: string;     // Deskripsi singkat kuis
  questions: QuizQuestion[]; // Daftar pertanyaan kuis
}

// Interface untuk Materi Pembelajaran
export interface Material {
  id: string;
  title: string;            // Judul materi
  type: 'text' | 'video' | 'pdf' | 'link'; // Tipe materi
  content: string;          // Konten materi (Markdown/teks atau URL video/PDF)
  duration: string;         // Estimasi durasi belajar, misal: "10 min" atau "15 Menit"
  fileName?: string;        // Nama berkas jika diunggah dari lokal
}

// Interface untuk Kursus/Kelas Utama
export interface Course {
  id: string;
  title: string;            // Judul kursus
  description: string;      // Deskripsi lengkap
  category: string;         // Kategori pembelajaran, misal: "Web Development", "Desain"
  level: 'Pemula' | 'Menengah' | 'Mahir'; // Tingkat kesulitan kursus
  coverUrl?: string;        // Gambar sampul kursus
  materials: Material[];    // Daftar materi dalam kursus ini
  quizzes: Quiz[];          // Daftar kuis dalam kursus ini
}

// Interface untuk Melacak Kemajuan Belajar Siswa (disimpan di LocalStorage)
export interface StudentProgress {
  courseId: string;
  completedMaterials: string[]; // List ID materi yang sudah selesai dipelajari
  quizScores: Record<string, {  // List skor kuis (quizId -> detail nilai)
    score: number;             // Skor dalam bentuk persentase (0-100)
    answers: Record<string, number>; // Menyimpan jawaban siswa (questionId -> dipilih)
    isPassed: boolean;
  }>;
  isCourseCompleted: boolean;  // Menandai jika kursus ini sudah selesai 100%
}

// Interface untuk Kustomisasi Tampilan Web (diatur lewat Dashboard Admin)
export interface LMSSettings {
  systemName: string;       // Nama platform LMS
  heroTitle: string;        // Judul utama di beranda
  heroSubtitle: string;     // Sub-judul beranda
  accentColor: string;      // Warna aksen utama (tailwind class friendly atau hex)
}
