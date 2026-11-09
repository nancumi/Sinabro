import React, { useEffect, useRef } from 'react';
import { COLOR_PALETTE } from '../utils/constants';

export default function RouletteCanvas({
  items,
  rotation,
  isSpinning,
  onPointerTick,
  size = 360,
}) {
  const canvasRef = useRef(null);
  const prevSectorRef = useRef(-1);

  // Draw roulette wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina display scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 16;
    const totalItems = items.length;
    if (totalItems === 0) return;

    const arcAngle = (2 * Math.PI) / totalItems;

    ctx.clearRect(0, 0, size, size);

    // Outer glow / shadow
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.shadowColor = 'rgba(99, 102, 241, 0.4)';
    ctx.shadowBlur = 24;
    ctx.fill();
    ctx.restore();

    // Outer golden/metallic ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI);
    ctx.lineWidth = 6;
    const ringGrad = ctx.createLinearGradient(0, 0, size, size);
    ringGrad.addColorStop(0, '#f59e0b');
    ringGrad.addColorStop(0.5, '#6366f1');
    ringGrad.addColorStop(1, '#f59e0b');
    ctx.strokeStyle = ringGrad;
    ctx.stroke();
    ctx.restore();

    // Draw wheel segments rotated by current rotation angle
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    items.forEach((item, index) => {
      const startAngle = index * arcAngle;
      const endAngle = startAngle + arcAngle;

      // Slice background
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      const baseColor = item.color || COLOR_PALETTE[index % COLOR_PALETTE.length];
      ctx.fillStyle = baseColor;
      ctx.fill();

      // Inner subtle radial highlight
      const sliceGrad = ctx.createRadialGradient(0, 0, radius * 0.1, 0, 0, radius);
      sliceGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
      sliceGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.05)');
      sliceGrad.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
      ctx.fillStyle = sliceGrad;
      ctx.fill();

      // Segment separator border
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Outer rim bulb lights
      const pinAngle = startAngle;
      const pinX = Math.cos(pinAngle) * (radius - 1);
      const pinY = Math.sin(pinAngle) * (radius - 1);
      ctx.beginPath();
      ctx.arc(pinX, pinY, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 4;
      ctx.fill();

      // Segment text
      ctx.save();
      const midAngle = startAngle + arcAngle / 2;
      ctx.rotate(midAngle);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      // Dynamic font size depending on total item count and size
      const fontSize = Math.max(11, Math.min(16, Math.floor(170 / Math.sqrt(totalItems))));
      ctx.font = `bold ${fontSize}px 'Pretendard', sans-serif`;

      // Text truncation if too long
      let text = item.text || `항목 ${index + 1}`;
      if (text.length > 11) {
        text = text.substring(0, 10) + '…';
      }

      ctx.fillText(text, radius - 20, 0);
      ctx.restore();
    });

    ctx.restore(); // restore from rotation

    // Center circular badge
    ctx.save();
    // Center shadow
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 10;
    ctx.fill();

    // Center ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, 24, 0, 2 * Math.PI);
    const centerGrad = ctx.createLinearGradient(
      centerX - 24,
      centerY - 24,
      centerX + 24,
      centerY + 24
    );
    centerGrad.addColorStop(0, '#f59e0b');
    centerGrad.addColorStop(1, '#b45309');
    ctx.fillStyle = centerGrad;
    ctx.fill();

    // Center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 14, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e1b4b';
    ctx.fill();

    // Center text or icon star
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', centerX, centerY + 1);
    ctx.restore();

    // Top Pointer Needle
    ctx.save();
    const pointerSize = 22;
    const pointerTop = centerY - radius - 8;

    // Pointer shadow
    ctx.beginPath();
    ctx.moveTo(centerX, pointerTop + pointerSize + 6);
    ctx.lineTo(centerX - 13, pointerTop);
    ctx.lineTo(centerX + 13, pointerTop);
    ctx.closePath();
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = 'rgba(239, 68, 68, 0.8)';
    ctx.shadowBlur = 12;
    ctx.fill();

    // Pointer border
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Pointer cap bead
    ctx.beginPath();
    ctx.arc(centerX, pointerTop + 3, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();

    // Detect sector passage for tick sound
    if (isSpinning && onPointerTick && totalItems > 0) {
      // Top position corresponds to angle -PI/2 (270 deg)
      // Normalize rotation angle
      const normalizedAngle = ((-rotation - Math.PI / 2) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      const currentSector = Math.floor(normalizedAngle / arcAngle);
      if (currentSector !== prevSectorRef.current) {
        prevSectorRef.current = currentSector;
        onPointerTick();
      }
    }
  }, [items, rotation, isSpinning, onPointerTick, size]);

  return (
    <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center p-1 select-none mx-auto">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', aspectRatio: '1 / 1' }}
        className="w-full h-full aspect-square drop-shadow-2xl transition-transform block"
      />
    </div>
  );
}

