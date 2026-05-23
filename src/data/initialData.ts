/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Course, LMSSettings } from '../types';

// Data kustomisasi tampilan awal LMS
export const defaultSettings: LMSSettings = {
  systemName: "Nusantara LMS",
  heroTitle: "Satu Platform, Sejuta Keterampilan",
  heroSubtitle: "Akses materi pembelajaran interaktif, tingkatkan skill Anda melalui kuis menantang, dan pantau perkembangan belajar Anda secara langsung—tanpa perlu registrasi.",
  accentColor: "indigo" // indigo, blue, emerald, amber, rose, violet dll
};

// Data kursus awal untuk demonstrasi sistem yang fungsional penuh sejak pertama dibuka
export const initialCourses: Course[] = [
  {
    id: "course-web-dasar",
    title: "Dasar Pemrograman Web dan Tailwind CSS",
    description: "Pelajari cara membangun halaman web yang modern, responsif, dan estetik menggunakan HTML5, CSS3, serta framework Tailwind CSS terbaru langsung dari nol.",
    category: "Web Development",
    level: "Pemula",
    coverUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    materials: [
      {
        id: "mat-html5",
        title: "Panduan Dasar HTML5 & Struktur Semantik",
        type: "text",
        duration: "10 Menit",
        content: `### Apa itu HTML5?
HTML adalah singkatan dari **HyperText Markup Language**. Ini adalah bahasa markup standar yang digunakan untuk membuat dan menyusun struktur halaman web.

#### Struktur Dasar HTML5:
\`\`\`html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Situs Pertamaku</title>
</head>
<body>
    <header>
        <h1>Selamat Datang di Dunia Web!</h1>
    </header>
    <nav>
        <ul>
            <li><a href="#home">Beranda</a></li>
        </ul>
    </nav>
    <main>
        <article>
            <h2>Mengenal Tag HTML</h2>
            <p>HTML disusun oleh elemen-elemen yang disebut "tag" contohnya p, h1, div, section, dan header.</p>
        </article>
    </main>
    <footer>
        <p>&copy; 2026 Nusantara LMS</p>
    </footer>
</body>
</html>
\`\`\`

#### Elemen Semantik Utama:
1. \`<header>\` - Untuk bagian kepala/navigasi utama halaman atau artikel.
2. \`<nav>\` - Menampung link navigasi.
3. \`<main>\` - Memuat konten utama halaman (hanya ada 1 per halaman).
4. \`<section>\` - Mengelompokkan konten yang sejenis.
5. \`<article>\` - Bagian konten mandiri yang dapat didistribusikan secara terpisah (seperti blog post).
6. \`<footer>\` - Bagian kaki situs yang biasanya memuat hak cipta atau kontak.`
      },
      {
        id: "mat-tailwind",
        title: "Desain Cepat & Responsif dengan Tailwind CSS",
        type: "text",
        duration: "15 Menit",
        content: `### Mengapa Menggunakan Tailwind CSS?
Tailwind CSS adalah framework CSS yang mengusung konsep **Utility-First**. Anda tidak perlu menulis file CSS terpisah untuk memberikan style, sebagai gantinya Anda langsung menuliskan kelas-kelas utilitas yang sudah disediakan di dalam tag HTML.

#### Contoh Perbandingan:

**CSS Tradisional:**
\`\`\`css
.button-custom {
  background-color: #3b82f6;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
}
\`\`\`

**Tailwind CSS:**
\`\`\`html
<button class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
  Tombol Kustom
</button>
\`\`\`

#### Fitur Utama Tailwind CSS:
* **Sangat Responsif**: Cukup tambahkan prefix seperti \`md:\`, \`lg:\` di depan kelas untuk mengatur ukuran layar. Contoh: \`w-full md:w-1/2\`.
* **Dukungan Hover & Active**: Mengubah gaya saat kursor melayang diatas tombol menggunakan \`hover:bg-blue-600\`.
* **Mode Gelap Bawaan**: Gunakan prefix \`dark:\` untuk merancang komponen yang tampak menawan di malam hari!`
      },
      {
        id: "mat-flexbox",
        title: "Pemahaman Konsep CSS Flexbox & Box Model",
        type: "text",
        duration: "12 Menit",
        content: `### Apa itu Flexbox?
Flexbox (Flexible Box Layout) dirancang untuk membantu menyusun tata letak baris atau kolom secara dinamis dan responsif, sangat cocok untuk menyusun navigasi, card menu, dan sidebar halaman web.

#### Sumbu Flexbox:
1. **Main Axis (Sumbu Utama)**: Diatur oleh properti \`flex-row\` (horizontal) atau \`flex-col\` (vertikal).
2. **Cross Axis (Sumbu Silang)**: Sumbu yang tegak lurus dengan sumbu utama.

#### Kelas Penting Tailwind untuk Flexbox:
* \`flex\`: Mengaktifkan mode flexbox pada kontainer induk.
* \`flex-col\` / \`flex-row\`: Menentukan arah aliran item anak.
* \`justify-between\` / \`justify-center\`: Mengatur posisi horizontal item anak di sumbu utama.
* \`items-center\`: Membuat item anak sejajar secara vertikal di sumbu silang.

#### Contoh Penerapan Kontainer Tengah Sempurna:
\`\`\`html
<div class="flex h-64 justify-center items-center bg-gray-100 rounded-lg">
  <div class="p-6 bg-white shadow rounded">Saya ada di tengah-tengah!</div>
</div>
\`\`\``
      }
    ],
    quizzes: [
      {
        id: "quiz-web-dasar",
        title: "Kuis Kompetensi Dasar Pemrograman Web",
        description: "Uji pemahaman Anda mengenai struktur HTML semantik, cara kerja utility-first CSS, dan dasar CSS Flexbox.",
        questions: [
          {
            id: "q-1",
            question: "Manakah tag semantik HTML5 yang paling tepat untuk memuat tautan menu navigasi utama?",
            options: [
              "<nav>",
              "<section>",
              "<header>",
              "<menu-link>"
            ],
            correctAnswerIndex: 0,
            explanation: "Tag <nav> dirancang khusus untuk mendefinisikan blok navigasi link utama pada struktur halaman web."
          },
          {
            id: "q-2",
            question: "Dalam Tailwind CSS, bagaimanakah cara mengatur agar sebuah elemen memiliki lebar penuh di handphone namun berukuran setengah (50%) di monitor besar?",
            options: [
              "class=\"w-half md:w-full\"",
              "class=\"w-full md:w-1/2\"",
              "class=\"w-full lg:w-half\"",
              "class=\"sm:w-100 lg:w-50\""
            ],
            correctAnswerIndex: 1,
            explanation: "Dengan menggunakan class responsif Tailwind, 'w-full' (lebar 100%) berlaku secara default (mobile), sedangkan 'md:w-1/2' atau setengah lebar (50%) baru aktif pada layar ukuran medium ke atas."
          },
          {
            id: "q-3",
            question: "Bagaimanakah cara membuat kontainer flexbox menyusun item-item di dalamnya secara vertikal ke bawah menggunakan Tailwind?",
            options: [
              "class=\"flex flex-row\"",
              "class=\"flex flex-y\"",
              "class=\"flex flex-col\"",
              "class=\"flex flex-direction-down\""
            ],
            correctAnswerIndex: 2,
            explanation: "Class 'flex-col' mengatur sumbu utama secara vertikal (flex-direction: column) sehingga item ditumpuk dari atas ke bawah."
          }
        ]
      }
    ]
  },
  {
    id: "course-uiux-basic",
    title: "Prinsip Dasar Desain UI/UX & Wireframing",
    description: "Pelajari cara merancang antarmuka aplikasi yang intuitif, ramah pengguna, serta estetis berdasarkan prinsip kegunaan (usability) dan riset perilaku pengguna.",
    category: "Desain UI/UX",
    level: "Pemula",
    coverUrl: "https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&w=800&q=80",
    materials: [
      {
        id: "mat-uiux-intro",
        title: "Perbedaan UI dan UX Serta Pentingnya Bagi Produk",
        type: "text",
        duration: "8 Menit",
        content: `### Apa Perbedaan UI dan UX?
Meskipun sering digabungkan, **User Interface (UI)** dan **User Experience (UX)** merujuk pada aspek desain yang berbeda.

#### User Experience (UX) - Pengalaman Pengguna
UX adalah keseluruhan pengalaman yang dirasakan oleh seorang pengguna saat berinteraksi dengan suatu produk digital (aplikasi, web, software). Fokus UX adalah kemudahan, efisiensi, dan kejelasan alur proses.
* **Pertanyaan UX**: Apakah pengguna dapat menyelesaikan tujuan mereka dengan cepat? Apakah menunya membingungkan?
* **Tugas UX**: Riset pengguna, pembuatan user persona, pembuatan user flow, serta usability testing.

#### User Interface (UI) - Antarmuka Pengguna
UI adalah bagian visual atau estetika aplikasi yang dilihat langsung oleh mata pengguna. Ini mencakup pemilihan warna, tipografi, susunan tata letak, gambar, tombol, dan animasi interaksi.
* **Pertanyaan UI**: Apakah kombinasi warna ini nyaman di mata? Apakah ukuran tombolnya proporsional?
* **Tugas UI**: Perancangan mockup visual, sistem desain (design system), tipografi perpustakaan warna, dan mikro-interaksi.`
      },
      {
        id: "mat-wireframing",
        title: "Seni Membuat Wireframe: Dari Coretan Hingga Komponen",
        type: "text",
        duration: "11 Menit",
        content: `### Apa itu Wireframe?
Wireframe adalah sketsa hitam-putih dua dimensi kasar yang menyajikan struktur tata letak awal suatu halaman web atau aplikasi sebelum proses pewarnaan desain kosmetik diterapkan.

#### Jenis-Jenis Wireframe:
1. **Low-fidelity (Lo-Fi)**: Berupa coretan tangan kasar menggunakan kertas atau pulpen. Sangat cepat dibuat untuk sekadar bertukar ide (brainstorming).
2. **Mid-fidelity (Mid-Fi)**: Menggunakan software desain (seperti Figma atau Balsamiq) tetapi hanya berupa bentuk kotak abu-abu, teks sederhana, dan tanpa gambar asli.
3. **High-fidelity (Hi-Fi)**: Sudah sangat mendekati produk asli karena sudah memiliki warna, ikon, gambar, dan tipografi yang direncanakan.

#### Elemen Utama dalam Mendesain Wireframe:
* **Grid & Layout**: Menjaga konsistensi jarak antar elemen agar terlihat rapi dan seimbang.
* **Informational Hierarchy**: Menempatkan elemen terpenting di posisi paling atas atau dibuat lebih mencolok agar pandangan pengguna pertama kali mengarah ke sana.
* **Sinyal Aktivitas**: Menyertakan tombol ajakan bertindak (Call-To-Action / CTA) yang diletakkan secara kontras.`
      }
    ],
    quizzes: [
      {
        id: "quiz-uiux-basic",
        title: "Kuis Pemahaman Fundamental UI/UX",
        description: "Evaluasi diri Anda mengenai konsep perbedaan peran UI/UX serta alur pengerjaan wireframe.",
        questions: [
          {
            id: "q-u1",
            question: "Manakah di bawah ini yang merupakan domain utama tanggung jawab desainer UX?",
            options: [
              "Menentukan kode warna merek & animasi transisi tombol",
              "Merancang riset pengguna, visualisasi user flow, dan evaluasi kemudahan navigasi",
              "Menulis kode pemrograman aplikasi agar dapat dirilis ke server",
              "Mengubah file gambar menjadi aset berformat SVG"
            ],
            correctAnswerIndex: 1,
            explanation: "UX berfokus penuh pada riset, struktur interaksi, kenyamanan alur klik, sedangkan preferensi warna visual adalah domain UI desainer."
          },
          {
            id: "q-u2",
            question: "Mengapa desainer sangat disarankan membuat Low-Fidelity Wireframe sebelum membuat desain penuh?",
            options: [
              "Agar klien membayar lebih mahal karena melihat proses yang panjang",
              "Karena desainer tidak tahu cara mendesain menggunakan warna",
              "Untuk menguji layout dasar halaman dengan cepat tanpa distorasi estetika warna atau gambar",
              "Agar tidak perlu mempelajari software desain moderen"
            ],
            correctAnswerIndex: 2,
            explanation: "Low-Fidelity Wireframe memudahkan tim mendiskusikan informasi & struktur navigasi pokok tanpa terdistraksi atau berdebat panjang soal pilihan warna atau gambar."
          }
        ]
      }
    ]
  }
];
