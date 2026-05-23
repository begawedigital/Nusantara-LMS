/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, ShieldAlert, Sun, Moon, GraduationCap } from 'lucide-react';

interface NavbarProps {
  currentTab: 'student' | 'admin';
  setTab: (tab: 'student' | 'admin') => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  systemName: string;
  accentColor: string;
}

export default function Navbar({
  currentTab,
  setTab,
  isDarkMode,
  toggleDarkMode,
  systemName,
  accentColor
}: NavbarProps) {
  
  // Mengembalikan kelas warna tailwind dinamis berdasarkan konfigurasi admin
  const getAccentClass = () => {
    switch (accentColor) {
      case 'indigo': return 'text-slate-900 dark:text-white bg-indigo-400 border-2 border-slate-900 dark:border-white shadow-[2px_2px_0px_0px_#070a13] dark:shadow-[2px_2px_0px_0px_#fff]';
      case 'blue': return 'text-slate-900 dark:text-white bg-blue-400 border-2 border-slate-900 dark:border-white shadow-[2px_2px_0px_0px_#070a13] dark:shadow-[2px_2px_0px_0px_#fff]';
      case 'emerald': return 'text-slate-900 dark:text-white bg-emerald-400 border-2 border-slate-900 dark:border-white shadow-[2px_2px_0px_0px_#070a13] dark:shadow-[2px_2px_0px_0px_#fff]';
      case 'amber': return 'text-slate-900 dark:text-white bg-amber-400 border-2 border-slate-900 dark:border-white shadow-[2px_2px_0px_0px_#070a13] dark:shadow-[2px_2px_0px_0px_#fff]';
      case 'rose': return 'text-slate-900 dark:text-white bg-rose-450 border-2 border-slate-900 dark:border-white shadow-[2px_2px_0px_0px_#070a13] dark:shadow-[2px_2px_0px_0px_#fff]';
      case 'violet': return 'text-slate-900 dark:text-white bg-violet-400 border-2 border-slate-900 dark:border-white shadow-[2px_2px_0px_0px_#070a13] dark:shadow-[2px_2px_0px_0px_#fff]';
      default: return 'text-slate-900 dark:text-white bg-indigo-400 border-2 border-slate-900 dark:border-white shadow-[2px_2px_0px_0px_#070a13] dark:shadow-[2px_2px_0px_0px_#fff]';
    }
  };

  const getActiveTabClass = (tab: 'student' | 'admin') => {
    if (currentTab === tab) {
      switch (accentColor) {
        case 'indigo': return 'border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white bg-indigo-400 shadow-[3px_3px_0px_0px_#070a13] dark:shadow-[3px_3px_0px_0px_#fff]';
        case 'blue': return 'border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white bg-blue-400 shadow-[3px_3px_0px_0px_#070a13] dark:shadow-[3px_3px_0px_0px_#fff]';
        case 'emerald': return 'border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white bg-emerald-400 shadow-[3px_3px_0px_0px_#070a13] dark:shadow-[3px_3px_0px_0px_#fff]';
        case 'amber': return 'border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white bg-amber-400 shadow-[3px_3px_0px_0px_#070a13] dark:shadow-[3px_3px_0px_0px_#fff]';
        case 'rose': return 'border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white bg-rose-400 shadow-[3px_3px_0px_0px_#070a13] dark:shadow-[3px_3px_0px_0px_#fff]';
        case 'violet': return 'border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white bg-violet-400 shadow-[3px_3px_0px_0px_#070a13] dark:shadow-[3px_3px_0px_0px_#fff]';
        default: return 'border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white bg-indigo-400 shadow-[3px_3px_0px_0px_#070a13] dark:shadow-[3px_3px_0px_0px_#fff]';
      }
    }
    return 'border-2 border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-slate-900 dark:hover:border-white hover:shadow-[3px_3px_0px_0px_#070a13] dark:hover:shadow-[3px_3px_0px_0px_#fff]';
  };

  return (
    <nav className="sticky top-0 z-50 bg-amber-50/70 dark:bg-gray-950/80 backdrop-blur-md border-b-3 border-slate-900 dark:border-white transition-colors duration-200 py-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo Samping */}
          <div className="flex items-center">
            <div className={`p-2 rounded-xl mr-3 ${getAccentClass()} flex items-center justify-center`}>
              <GraduationCap className="h-6 w-6 stroke-[2.5]" />
            </div>
            <span className="font-display font-extrabold text-lg md:text-2xl tracking-tight text-slate-900 dark:text-white uppercase">
              {systemName}
            </span>
            <div className="ml-2 hidden sm:inline-block">
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-white dark:bg-gray-800 text-slate-900 dark:text-white rounded-full border-2 border-slate-900 dark:border-white shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[1.5px_1.5px_0px_0px_rgba(255,255,255,1)]">
                v1.1 SPA
              </span>
            </div>
          </div>

          {/* Navigasi Menu Tengah/Kiri */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Tab Ruang Belajar (Siswa) */}
            <button
              id="nav-tab-belajar"
              onClick={() => setTab('student')}
              className={`flex items-center px-3.5 py-2 md:px-4 md:py-2.5 rounded-xl font-display font-bold text-[11px] sm:text-xs tracking-wide transition-all duration-150 cursor-pointer neo-btn-press ${getActiveTabClass('student')}`}
            >
              <BookOpen className="h-4 w-4 sm:mr-2 stroke-[2.5]" />
              <span className="hidden sm:inline">Ruang Belajar</span>
              <span className="sm:hidden">Belajar</span>
            </button>

            {/* Tab Panel Admin */}
            <button
              id="nav-tab-admin"
              onClick={() => setTab('admin')}
              className={`flex items-center px-3.5 py-2 md:px-4 md:py-2.5 rounded-xl font-display font-bold text-[11px] sm:text-xs tracking-wide transition-all duration-150 cursor-pointer neo-btn-press ${getActiveTabClass('admin')}`}
            >
              <ShieldAlert className="h-4 w-4 sm:mr-2 stroke-[2.5]" />
              <span className="hidden sm:inline">Dashboard Admin</span>
              <span className="sm:hidden">Admin</span>
            </button>

            <div className="h-8 w-[2px] bg-slate-900 dark:bg-white mx-1 sm:mx-2" />

            {/* Tombol Mode Gelap */}
            <button
              id="button-toggle-theme"
              onClick={toggleDarkMode}
              className="p-2 md:p-2.5 rounded-xl border-2 border-slate-900 dark:border-white bg-white dark:bg-gray-800 text-slate-900 dark:text-white shadow-[2px_2px_0px_0px_#070a13] dark:shadow-[2px_2px_0px_0px_#fff] hover:bg-gray-100 dark:hover:bg-gray-750 transition-all cursor-pointer neo-btn-press"
              title={isDarkMode ? 'Aktifkan Mode Terang' : 'Aktifkan Mode Gelap'}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-amber-400 stroke-[2.5]" />
              ) : (
                <Moon className="h-5 w-5 stroke-[2.5]" />
              )}
            </button>

          </div>

        </div>
      </div>
    </nav>
  );
}
