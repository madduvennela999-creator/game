import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, RadioReceiver } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { DUMMY_TRACKS } from '../lib/audio';

export default function MusicPlayer() {
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIdx];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((e) => {
          console.log("ERR: AUTO-EXEC BLOCK:", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIdx]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const playNext = () => {
    setCurrentTrackIdx((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };
  
  const playPrev = () => {
    setCurrentTrackIdx((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="flex flex-col gap-4 p-4 border-2 border-neon-cyan bg-black/80 rounded-none relative">
      <div className="absolute top-0 right-0 p-1 bg-neon-cyan text-black text-[10px] uppercase font-bold">
        [AUDIO_SUBROUTINE]
      </div>
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={playNext}
        loop={false}
      />
      
      <div className="flex flex-col gap-2 mt-4 items-start border-l-4 border-neon-magenta pl-3">
        <h2 className="text-neon-cyan font-bold tracking-widest text-xs uppercase opacity-70">
          SEQ: {currentTrackIdx + 1}/{DUMMY_TRACKS.length}
        </h2>
        <div className="flex flex-col items-start w-full group relative overflow-hidden">
          <div className="relative leading-none py-2 flex flex-col items-start text-left w-full">
            <span className="text-neon-magenta font-pixel text-xs tracking-tighter truncate w-full" data-text={currentTrack.title}>
              {currentTrack.title}
            </span>
            <span className="text-neon-cyan font-mono text-sm mt-2 flex items-center gap-2">
              <RadioReceiver size={14} className="animate-pulse" />
              {currentTrack.artist}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 justify-between mt-2 border-t border-b border-neon-cyan/30 py-4">
        <button 
          onClick={playPrev}
          className="p-1 text-neon-cyan hover:bg-neon-cyan hover:text-black transition-colors rounded-none outline-none border border-transparent hover:border-current"
        >
          <SkipBack size={20} />
        </button>
        <button 
          onClick={togglePlay}
          className="px-6 py-2 bg-transparent border-2 border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-black transition-colors uppercase font-bold font-mono text-sm tracking-widest flex items-center gap-2"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          {isPlaying ? "HALT" : "EXEC"}
        </button>
        <button 
          onClick={playNext}
          className="p-1 text-neon-cyan hover:bg-neon-cyan hover:text-black transition-colors rounded-none outline-none border border-transparent hover:border-current"
        >
          <SkipForward size={20} />
        </button>
      </div>

      <div className="flex items-center gap-3 w-full px-1">
        <button onClick={toggleMute} className="text-neon-cyan hover:text-white">
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.05"
          value={volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            setIsMuted(false);
          }}
          className="w-full accent-neon-magenta h-1 bg-zinc-900 appearance-none cursor-crosshair border border-neon-cyan/20"
        />
      </div>
      
      <div className="mt-2 pt-2 flex flex-col gap-1">
        <h3 className="text-neon-cyan/50 font-mono text-[10px] font-bold uppercase mb-2 tracking-[0.2em] border-b border-neon-cyan/20 pb-1">
          &gt; DATA_STREAMS
        </h3>
        {DUMMY_TRACKS.map((t, i) => (
          <div 
            key={t.id} 
            onClick={() => {
              setCurrentTrackIdx(i);
              setIsPlaying(true);
            }}
            className={`flex items-center justify-between text-xs cursor-crosshair font-mono px-2 py-1.5 transition-colors border-l-2 ${
              i === currentTrackIdx 
              ? 'border-neon-magenta bg-neon-magenta/10 text-white' 
              : 'border-transparent text-neon-cyan/60 hover:bg-neon-cyan/10 hover:text-neon-cyan hover:border-neon-cyan'
            }`}
          >
            <span className="truncate pr-2">
              <span className="opacity-50 mr-2">0{i+1}.</span>
              {t.title}
            </span>
            {i === currentTrackIdx && isPlaying && (
              <div className="flex items-end gap-[1px] h-3">
                <div className="w-[3px] bg-neon-magenta animate-pulse h-full"></div>
                <div className="w-[3px] bg-neon-magenta animate-pulse h-2/3 delay-75"></div>
                <div className="w-[3px] bg-neon-magenta animate-pulse h-4/5 delay-150"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
