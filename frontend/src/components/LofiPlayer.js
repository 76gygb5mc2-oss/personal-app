import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Typography, IconButton, Slider } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { D, FONTS } from '../theme';

const STATIONS = [
  {
    name: 'Lo-fi Chill Beats',
    emoji: '🌿',
    url: 'https://streams.ilovemusic.de/iloveradio17.mp3',
  },
  {
    name: 'Jazz & Coffee',
    emoji: '☕',
    url: 'https://streaming.radio.co/s3f4a5b6c7/listen',
  },
  {
    name: 'Deep Focus',
    emoji: '🧠',
    url: 'https://streams.ilovemusic.de/iloveradio2.mp3',
  },
  {
    name: 'Forest Ambience',
    emoji: '🌲',
    url: 'https://streams.ilovemusic.de/iloveradio10.mp3',
  },
];

export default function LofiPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [stationIdx, setStationIdx] = useState(0);
  const [volume, setVolume] = useState(0.35);
  const [muted, setMuted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visualizer, setVisualizer] = useState([3,5,7,4,6,8,5,3,7,6,4,5,8,3,6]);

  const station = STATIONS[stationIdx];

  // Animate visualizer bars
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setVisualizer(prev => prev.map(() => Math.floor(Math.random() * 10) + 2));
    }, 180);
    return () => clearInterval(interval);
  }, [playing]);

  // Apply volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setLoading(true);
    audio.src = station.url;
    audio.volume = muted ? 0 : volume;
    audio.play()
      .then(() => { setPlaying(true); setLoading(false); })
      .catch(() => {
        // Try next station if this one fails
        setLoading(false);
        nextStation();
      });
  }, [station, volume, muted]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  const togglePlay = () => {
    if (playing) pause();
    else play();
  };

  const nextStation = () => {
    pause();
    setStationIdx(i => (i + 1) % STATIONS.length);
  };

  // Auto-play new station when idx changes and was playing
  const wasPlayingRef = useRef(false);
  useEffect(() => {
    if (wasPlayingRef.current) {
      setTimeout(() => play(), 100);
    }
  }, [stationIdx]);

  useEffect(() => {
    wasPlayingRef.current = playing;
  }, [playing]);

  return (
    <>
      <audio ref={audioRef} preload="none" />

      {/* Collapsed pill */}
      {!expanded && (
        <Box
          onClick={() => setExpanded(true)}
          sx={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 999,
            display: 'flex', alignItems: 'center', gap: 1.2,
            px: 2, py: 1,
            bgcolor: 'rgba(13,38,24,0.92)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${playing ? 'rgba(148,204,171,0.35)' : 'rgba(148,204,171,0.14)'}`,
            borderRadius: 99,
            boxShadow: playing ? '0 0 20px rgba(148,204,171,0.15), 0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.4)',
            cursor: 'pointer',
            transition: 'all 0.3s',
            '&:hover': { borderColor: 'rgba(148,204,171,0.5)', transform: 'translateY(-2px)' },
          }}
        >
          {/* Visualizer or icon */}
          {playing ? (
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: 16 }}>
              {visualizer.slice(0, 5).map((h, i) => (
                <Box key={i} sx={{
                  width: 2.5, height: h, borderRadius: 2,
                  bgcolor: D.text2, opacity: 0.8,
                  transition: 'height 0.18s ease',
                }} />
              ))}
            </Box>
          ) : (
            <MusicNoteIcon sx={{ fontSize: 16, color: D.text3 }} />
          )}
          <Typography sx={{ fontSize: '0.75rem', color: playing ? D.text2 : D.text3, fontWeight: 600 }}>
            {playing ? station.name : 'Lo-fi'}
          </Typography>
          <IconButton
            size="small"
            onClick={e => { e.stopPropagation(); togglePlay(); }}
            sx={{ p: 0.4, color: playing ? D.text2 : D.text3 }}
          >
            {loading ? (
              <Box sx={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${D.text2}`, borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', '@keyframes spin': { to: { transform: 'rotate(360deg)' } } }} />
            ) : playing ? <PauseIcon sx={{ fontSize: 16 }} /> : <PlayArrowIcon sx={{ fontSize: 16 }} />}
          </IconButton>
        </Box>
      )}

      {/* Expanded player */}
      {expanded && (
        <Box sx={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 999,
          width: 280,
          bgcolor: 'rgba(10,28,18,0.96)',
          backdropFilter: 'blur(28px)',
          border: `1px solid rgba(255,255,255,0.12)`,
          borderRadius: 4,
          boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 30px rgba(148,204,171,0.08)',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pt: 1.5, pb: 1 }}>
            <MusicNoteIcon sx={{ fontSize: 14, color: D.text3, mr: 0.8 }} />
            <Typography sx={{ fontSize: '0.7rem', color: D.text3, letterSpacing: 2, textTransform: 'uppercase', flex: 1 }}>
              Lo-fi Radio
            </Typography>
            <IconButton size="small" onClick={() => setExpanded(false)} sx={{ color: 'rgba(232,245,238,0.3)', p: 0.3 }}>
              <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {/* Visualizer bar */}
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '2.5px', height: 32, px: 2, mb: 1 }}>
            {visualizer.map((h, i) => (
              <Box key={i} sx={{
                width: '100%', maxWidth: 10, height: playing ? h * 2.8 : 4, borderRadius: 2,
                bgcolor: playing ? D.text2 : 'rgba(255,255,255,0.12)',
                opacity: playing ? 0.7 + (i % 3) * 0.1 : 0.4,
                transition: 'height 0.18s ease',
              }} />
            ))}
          </Box>

          {/* Station name */}
          <Box sx={{ px: 2.5, pb: 1 }}>
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: D.text1, lineHeight: 1.2 }}>
              {station.emoji} {station.name}
            </Typography>
            <Typography sx={{ fontSize: '0.72rem', color: D.text3, mt: 0.3 }}>
              {playing ? '▶ Streaming live' : loading ? '⟳ Loading...' : '⏸ Paused'}
            </Typography>
          </Box>

          {/* Stations list */}
          <Box sx={{ px: 2, pb: 1 }}>
            {STATIONS.map((s, i) => (
              <Box key={i} onClick={() => { setStationIdx(i); if (playing) setTimeout(() => play(), 100); }}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1,
                  py: 0.6, px: 1, borderRadius: 2, cursor: 'pointer',
                  bgcolor: stationIdx === i ? 'rgba(255,255,255,0.06)' : 'transparent',
                  border: `1px solid ${stationIdx === i ? 'rgba(255,255,255,0.12)' : 'transparent'}`,
                  mb: 0.3, transition: 'all 0.15s',
                  '&:hover': { bgcolor: 'rgba(71,133,89,0.1)' },
                }}>
                <Typography sx={{ fontSize: '0.85rem' }}>{s.emoji}</Typography>
                <Typography sx={{ fontSize: '0.78rem', color: stationIdx === i ? D.text2 : D.text3, fontWeight: stationIdx === i ? 700 : 400, flex: 1 }}>
                  {s.name}
                </Typography>
                {stationIdx === i && playing && (
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '1.5px', height: 10 }}>
                    {[4,7,5].map((h, j) => (
                      <Box key={j} sx={{ width: 2, height: h, borderRadius: 1, bgcolor: D.text2, animation: `bounce${j} 0.6s ease infinite alternate`, '@keyframes bounce0': { to: { height: 10 } }, '@keyframes bounce1': { to: { height: 6 } }, '@keyframes bounce2': { to: { height: 9 } } }} />
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Box>

          {/* Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pb: 2, gap: 1 }}>
            <IconButton onClick={togglePlay} sx={{
              color: D.text1, bgcolor: playing ? 'rgba(71,133,89,0.3)' : 'rgba(71,133,89,0.15)',
              border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 2, p: 0.8,
              '&:hover': { bgcolor: 'rgba(71,133,89,0.4)' },
            }}>
              {loading ? (
                <Box sx={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${D.text2}`, borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
              ) : playing ? <PauseIcon sx={{ fontSize: 20 }} /> : <PlayArrowIcon sx={{ fontSize: 20 }} />}
            </IconButton>

            <IconButton onClick={nextStation} sx={{ color: D.text3, p: 0.6, '&:hover': { color: D.text2 } }}>
              <SkipNextIcon sx={{ fontSize: 18 }} />
            </IconButton>

            <IconButton onClick={() => setMuted(m => !m)} sx={{ color: muted ? 'rgba(232,245,238,0.2)' : D.text3, p: 0.6, '&:hover': { color: D.text2 } }}>
              {muted ? <VolumeOffIcon sx={{ fontSize: 16 }} /> : <VolumeUpIcon sx={{ fontSize: 16 }} />}
            </IconButton>

            <Slider
              value={muted ? 0 : volume * 100}
              onChange={(_, v) => { setVolume(v / 100); setMuted(false); }}
              size="small"
              sx={{
                flex: 1, color: D.bg4,
                '& .MuiSlider-thumb': { width: 10, height: 10, bgcolor: D.text2 },
                '& .MuiSlider-track': { bgcolor: D.bg4 },
                '& .MuiSlider-rail': { bgcolor: 'rgba(148,204,171,0.15)' },
              }}
            />
          </Box>
        </Box>
      )}
    </>
  );
}
