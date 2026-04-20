/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-x-hidden selection:bg-neon-magenta selection:text-black">
      {/* Background Decorative Glitch */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-black/90 mix-blend-difference z-0"></div>
      <div className="static-noise"></div>

      {/* Header */}
      <header className="w-full flex-none pt-12 pb-6 relative z-10 flex flex-col items-center">
        <div className="flex items-center justify-center gap-4 relative">
          <Terminal size={40} className="text-neon-magenta animate-pulse relative z-10" />
          <h1 
            data-text="SYS.SERPENT_NODE"
            className="glitch-text text-2xl md:text-4xl text-white uppercase relative z-10 tracking-tighter"
          >
            SYS.SERPENT_NODE
          </h1>
        </div>
        <p className="mt-4 font-mono text-neon-cyan text-sm tracking-widest uppercase opacity-80 border-b border-neon-magenta pb-1">
          STATUS: INJECTING_STATIC
        </p>
      </header>

      {/* Main Layout */}
      <main className="w-full max-w-7xl flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 px-4 pb-12 relative z-10 mt-4">
        
        {/* Left Col: Music Player */}
        <aside className="w-full max-w-xs lg:sticky lg:top-24 order-2 lg:order-1">
          <MusicPlayer />
        </aside>

        {/* Center: Game */}
        <div className="flex-1 flex justify-center order-1 lg:order-2 w-full">
          <SnakeGame />
        </div>

      </main>
      
      {/* Scanline Overlay */}
      <div className="crt-overlay"></div>
    </div>
  );
}
