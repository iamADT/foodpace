import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

// Deep olive RGB — matches colors.deepOlive (#26382D)
const DOT_R = 38, DOT_G = 56, DOT_B = 45;
const SPACING = 26;

export function DotField() {
  const viewRef = useRef<View>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = viewRef.current as unknown as HTMLElement;
    if (!el) return;

    const canvas = document.createElement('canvas');
    Object.assign(canvas.style, {
      position: 'absolute', top: '0', left: '0',
      width: '100%', height: '100%', pointerEvents: 'none',
    });
    el.appendChild(canvas);

    const ctx = canvas.getContext('2d')!;
    let rafId: number;
    const t0 = performance.now();

    const resize = () => {
      canvas.width = el.clientWidth * devicePixelRatio;
      canvas.height = el.clientHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      const W = el.clientWidth;
      const H = el.clientHeight;
      ctx.clearRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;
      const maxDist = Math.sqrt(cx * cx + cy * cy);

      for (let x = SPACING / 2; x < W; x += SPACING) {
        for (let y = SPACING / 2; y < H; y += SPACING) {
          const dx = x - cx, dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const dn = dist / maxDist;

          // Fade toward edges so the dot field doesn't compete with content
          const baseOpacity = Math.max(0, 0.125 - dn * 0.11);
          if (baseOpacity <= 0) continue;

          // Radial pulse wave radiating outward from centre
          const pulse = reduced
            ? 0.5
            : 0.5 + 0.5 * Math.sin(t * 0.5 - dn * 4.2);

          const opacity = baseOpacity * (0.3 + 0.7 * pulse);
          const r = 1.1 + pulse * 0.9;

          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${DOT_R},${DOT_G},${DOT_B},${opacity.toFixed(3)})`;
          ctx.fill();
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return <View ref={viewRef} style={StyleSheet.absoluteFill} pointerEvents="none" />;
}
