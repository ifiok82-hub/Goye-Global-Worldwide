import React, { useState, useEffect } from 'react';
import { X, Play, RefreshCw, AlertTriangle, ExternalLink, Loader2 } from 'lucide-react';

interface VideoModalPlayerProps {
  videoUrl: string | null;
  title: string;
  onClose: () => void;
  ctaText?: string;
  onCtaClick?: () => void;
}

export default function VideoModalPlayer({
  videoUrl,
  title,
  onClose,
  ctaText,
  onCtaClick
}: VideoModalPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [videoUrl]);

  if (!videoUrl) return null;

  // Helper function to format video URLs (e.g. YouTube watch URLs to embed)
  const getEmbedUrl = (rawUrl: string): { type: 'iframe' | 'video'; formattedUrl: string } => {
    const trimmed = rawUrl.trim();

    // Check if direct video file
    if (
      trimmed.endsWith('.mp4') ||
      trimmed.endsWith('.webm') ||
      trimmed.endsWith('.ogg') ||
      trimmed.includes('.m3u8') ||
      trimmed.includes('s3.amazonaws.com')
    ) {
      return { type: 'video', formattedUrl: trimmed };
    }

    // YouTube URLs
    if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
      let youtubeId = '';
      if (trimmed.includes('embed/')) {
        youtubeId = trimmed.split('embed/')[1]?.split('?')[0];
      } else if (trimmed.includes('watch?v=')) {
        youtubeId = trimmed.split('watch?v=')[1]?.split('&')[0];
      } else if (trimmed.includes('youtu.be/')) {
        youtubeId = trimmed.split('youtu.be/')[1]?.split('?')[0];
      }

      if (youtubeId) {
        return {
          type: 'iframe',
          formattedUrl: `https://www.youtube.com/embed/${youtubeId}?autoplay=1&playsinline=1&rel=0`
        };
      }
    }

    // Vimeo URLs
    if (trimmed.includes('vimeo.com')) {
      const vimeoId = trimmed.split('vimeo.com/')[1]?.split('?')[0];
      if (vimeoId && !isNaN(Number(vimeoId))) {
        return {
          type: 'iframe',
          formattedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1&playsinline=1`
        };
      }
    }

    // Default: treat as embed iframe
    return { type: 'iframe', formattedUrl: trimmed };
  };

  const { type, formattedUrl } = getEmbedUrl(videoUrl);

  return (
    <div 
      className="fixed inset-0 bg-black/95 z-[9999999] flex items-center justify-center p-3 sm:p-6 backdrop-blur-md pointer-events-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-4xl bg-[#111] border-2 border-[#FFD700] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(255,215,0,0.3)] relative flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-[#FFD700] text-black px-5 py-3.5 flex items-center justify-between font-black text-sm md:text-base border-b border-yellow-600">
          <div className="flex items-center gap-2 truncate pr-2">
            <div className="w-7 h-7 bg-black text-[#FFD700] rounded-full flex items-center justify-center text-xs">
              <Play size={14} fill="currentColor" />
            </div>
            <span className="truncate">{title || 'Video Player'}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-black hover:bg-gray-900 text-[#FFD700] rounded-full flex items-center justify-center font-bold text-sm transition cursor-pointer border border-black/20"
            title="Close Video"
          >
            <X size={18} />
          </button>
        </div>

        {/* Video Stage / Container */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          {isLoading && !hasError && (
            <div className="absolute inset-0 z-10 bg-black/80 flex flex-col items-center justify-center gap-3 text-[#FFD700]">
              <Loader2 className="w-10 h-10 animate-spin" />
              <p className="text-xs font-bold tracking-wide">Loading HD Video Stream...</p>
            </div>
          )}

          {hasError ? (
            <div className="p-6 text-center flex flex-col items-center justify-center gap-3 text-white">
              <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-2xl flex items-center justify-center border border-red-500/40">
                <AlertTriangle size={28} />
              </div>
              <h4 className="font-extrabold text-base">Video Unavailable or Offline</h4>
              <p className="text-gray-400 text-xs max-w-md">
                The video stream could not be loaded. Please check your network connection or view via direct link.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                <button
                  onClick={() => {
                    setHasError(false);
                    setIsLoading(true);
                  }}
                  className="px-4 py-2 bg-[#222] hover:bg-[#333] text-white rounded-xl text-xs font-bold border border-[#444] flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw size={14} /> Retry Playback
                </button>
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#FFD700] text-black rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-yellow-400 cursor-pointer"
                >
                  <ExternalLink size={14} /> Open Video External
                </a>
              </div>
            </div>
          ) : type === 'video' ? (
            <video
              src={formattedUrl}
              controls
              autoPlay
              playsInline
              // @ts-ignore
              webkit-playsinline="true"
              preload="metadata"
              controlsList="nodownload"
              onLoadedData={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
              className="w-full h-full object-contain"
            />
          ) : (
            <iframe
              src={formattedUrl}
              title={title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
            />
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#111] p-4 border-t border-[#222] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-400 text-xs font-medium text-center sm:text-left">
            Official Sirwise AI Web3 Academy • 190+ Countries Supported
          </p>
          {ctaText && onCtaClick && (
            <button
              onClick={() => {
                onClose();
                onCtaClick();
              }}
              className="w-full sm:w-auto px-6 py-3 bg-[#FFD700] hover:bg-yellow-400 text-black font-black text-sm rounded-xl transition cursor-pointer shadow-lg border border-yellow-500"
            >
              {ctaText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
