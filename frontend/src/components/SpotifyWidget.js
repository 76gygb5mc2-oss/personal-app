import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, LinearProgress } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SpotifyIcon from '@mui/icons-material/QueueMusic';
import { G } from '../theme';

const CLIENT_ID = '5289d825e3404c259d7507f7c1b2ab53';
const REDIRECT_URI = window.location.origin + '/spotify-callback';
const SCOPES = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'user-read-email',
  'user-read-private',
].join(' ');

// PKCE helpers
async function generatePKCE() {
  const verifier = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0')).join('');
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const challenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return { verifier, challenge };
}

function SpotifyAuth({ onConnect }) {
  const handleConnect = async () => {
    const { verifier, challenge } = await generatePKCE();
    localStorage.setItem('spotify_pkce_verifier', verifier);
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      code_challenge_method: 'S256',
      code_challenge: challenge,
    });
    window.location.href = `https://accounts.spotify.com/authorize?${params}`;
  };

  return (
    <Box sx={{
      p: 3, borderRadius: 3, textAlign: 'center',
      bgcolor: 'rgba(29,185,84,0.06)',
      border: '1px solid rgba(29,185,84,0.2)',
    }}>
      <Box sx={{ fontSize: '2rem', mb: 1 }}>🎧</Box>
      <Typography sx={{ color: G.foam, fontWeight: 700, mb: 0.5 }}>
        Connect Spotify
      </Typography>
      <Typography sx={{ color: G.sage, fontSize: '0.8rem', mb: 2 }}>
        Play your workout music while training
      </Typography>
      <Button
        variant="contained"
        onClick={handleConnect}
        startIcon={<SpotifyIcon />}
        sx={{
          bgcolor: '#1DB954', color: '#000', fontWeight: 800,
          borderRadius: 99, px: 3,
          '&:hover': { bgcolor: '#1ed760', transform: 'translateY(-1px)' },
        }}
      >
        Connect Spotify
      </Button>
    </Box>
  );
}

function SpotifyPlayer({ token, onDisconnect }) {
  const [track, setTrack] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  const fetchPlayback = async () => {
    try {
      const res = await fetch('https://api.spotify.com/v1/me/player', { headers });
      if (res.status === 401) { onDisconnect(); return; }
      if (res.status === 204 || !res.ok) { setTrack(null); return; }
      const data = await res.json();
      setTrack(data.item);
      setPlaying(data.is_playing);
      setProgress(data.progress_ms / data.item?.duration_ms * 100 || 0);
      setError('');
    } catch {
      setError('Could not reach Spotify');
    }
  };

  useEffect(() => {
    fetchPlayback();
    const interval = setInterval(fetchPlayback, 3000);
    return () => clearInterval(interval);
  }, [token]);

  const control = async (action) => {
    const base = 'https://api.spotify.com/v1/me/player';
    const map = {
      play:  { method: 'PUT',  url: `${base}/play` },
      pause: { method: 'PUT',  url: `${base}/pause` },
      next:  { method: 'POST', url: `${base}/next` },
      prev:  { method: 'POST', url: `${base}/previous` },
    };
    const { method, url } = map[action];
    await fetch(url, { method, headers });
    setTimeout(fetchPlayback, 500);
  };

  if (!track) {
    return (
      <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'rgba(29,185,84,0.06)', border: '1px solid rgba(29,185,84,0.15)', textAlign: 'center' }}>
        <Typography sx={{ color: G.sage, fontSize: '0.85rem' }}>
          🎵 Open Spotify on any device and start playing to control it here
        </Typography>
        {error && <Typography sx={{ color: '#f87171', fontSize: '0.75rem', mt: 1 }}>{error}</Typography>}
        <Button size="small" onClick={onDisconnect} sx={{ mt: 1.5, color: 'rgba(232,245,238,0.3)', fontSize: '0.72rem' }}>
          Disconnect
        </Button>
      </Box>
    );
  }

  const albumArt = track.album?.images?.[0]?.url;
  const artists = track.artists?.map(a => a.name).join(', ');

  return (
    <Box sx={{
      borderRadius: 3,
      bgcolor: 'rgba(29,185,84,0.06)',
      border: '1px solid rgba(29,185,84,0.2)',
      overflow: 'hidden',
    }}>
      {/* Album art + info */}
      <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
        {albumArt ? (
          <Box component="img" src={albumArt} alt="album"
            sx={{ width: 64, height: 64, borderRadius: 2, flexShrink: 0, objectFit: 'cover' }} />
        ) : (
          <Box sx={{ width: 64, height: 64, borderRadius: 2, bgcolor: 'rgba(29,185,84,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <SpotifyIcon sx={{ color: '#1DB954', fontSize: 28 }} />
          </Box>
        )}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ color: G.foam, fontWeight: 700, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {track.name}
          </Typography>
          <Typography sx={{ color: G.sage, fontSize: '0.78rem', mt: 0.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {artists}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#1DB954' }} />
            <Typography sx={{ color: '#1DB954', fontSize: '0.68rem', fontWeight: 700 }}>SPOTIFY</Typography>
          </Box>
        </Box>
        <IconButton
          size="small"
          href={track.external_urls?.spotify}
          target="_blank"
          sx={{ color: 'rgba(232,245,238,0.2)', p: 0.4, alignSelf: 'flex-start' }}
        >
          <OpenInNewIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>

      {/* Progress bar */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 2, bgcolor: 'rgba(29,185,84,0.1)',
          '& .MuiLinearProgress-bar': { bgcolor: '#1DB954' },
        }}
      />

      {/* Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, py: 1.2 }}>
        <IconButton onClick={() => control('prev')} sx={{ color: G.sage, '&:hover': { color: G.mint } }}>
          <SkipPreviousIcon />
        </IconButton>
        <IconButton
          onClick={() => control(playing ? 'pause' : 'play')}
          sx={{
            color: '#000', bgcolor: '#1DB954', width: 40, height: 40,
            '&:hover': { bgcolor: '#1ed760', transform: 'scale(1.05)' },
          }}
        >
          {playing ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        <IconButton onClick={() => control('next')} sx={{ color: G.sage, '&:hover': { color: G.mint } }}>
          <SkipNextIcon />
        </IconButton>
      </Box>

      <Box sx={{ textAlign: 'center', pb: 1 }}>
        <Button size="small" onClick={onDisconnect} sx={{ color: 'rgba(232,245,238,0.2)', fontSize: '0.65rem' }}>
          Disconnect
        </Button>
      </Box>
    </Box>
  );
}

export default function SpotifyWidget() {
  const [token, setToken] = useState(() => localStorage.getItem('spotify_access_token'));

  const handleDisconnect = () => {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_pkce_verifier');
    setToken(null);
  };

  // Handle OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const path = window.location.pathname;
    if (code && path === '/spotify-callback') {
      const verifier = localStorage.getItem('spotify_pkce_verifier');
      if (verifier) {
        fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI,
            client_id: CLIENT_ID,
            code_verifier: verifier,
          }),
        })
          .then(r => r.json())
          .then(data => {
            if (data.access_token) {
              localStorage.setItem('spotify_access_token', data.access_token);
              setToken(data.access_token);
            }
            window.history.replaceState({}, '', '/health');
          });
      }
    }
  }, []);

  return token ? (
    <SpotifyPlayer token={token} onDisconnect={handleDisconnect} />
  ) : (
    <SpotifyAuth onConnect={setToken} />
  );
}
