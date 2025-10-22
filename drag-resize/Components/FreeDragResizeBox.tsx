'use client';
import React, { useRef, useState, useEffect } from 'react';

// --- Hook untuk deteksi breakpoint aktif ---
function useBreakpoint() {
  const [bp, setBp] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'default'>('default');

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 321) setBp('xs');
      else if (w < 426) setBp('sm');
      else if (w < 769) setBp('md');
      else if (w < 1025) setBp('lg');
      else if (w < 1441) setBp('xl');
      else setBp('default');
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return bp;
}

// --- Interface utama ---
interface Size {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface FreeDragResizeBoxProps {
  id: string;
  sizeData: {
    default: Size;
    xs?: Size
    sm?: Size;
    md?: Size;
    lg?: Size;
    xl?: Size;
  };
  bounds?: 'window' | 'parent';
  onChange?: (data: {
    id: string;
    breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'default';
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void;
}

const FreeDragResizeBox: React.FC<FreeDragResizeBoxProps> = ({
  id,
  sizeData,
  bounds = 'parent',
  onChange,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const breakpoint = useBreakpoint();

  // ambil ukuran yang sesuai breakpoint aktif, fallback ke default
  const current = sizeData[breakpoint] || sizeData.default;

  const [pos, setPos] = useState({ x: current.x, y: current.y });
  const [size, setSize] = useState({ width: current.width, height: current.height });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [resizeDir, setResizeDir] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // update parent saat posisi/ukuran berubah
  const updateParent = (x: number, y: number, w: number, h: number) => {
    onChange?.({ id, breakpoint, x, y, width: w, height: h });
  };

  // mulai drag
  const onMouseDownDrag = (e: React.MouseEvent) => {
    if (resizing) return;
    setDragging(true);
    setOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  // handle mouse move drag/resize
  const onMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;

    const parentRect =
      bounds === 'parent'
        ? ref.current.parentElement?.getBoundingClientRect()
        : document.body.getBoundingClientRect();
    if (!parentRect) return;

    if (dragging && !resizing) {
      let newX = e.clientX - offset.x - parentRect.left;
      let newY = e.clientY - offset.y - parentRect.top;
      newX = Math.max(0, Math.min(newX, parentRect.width - size.width));
      newY = Math.max(0, Math.min(newY, parentRect.height - size.height));
      setPos({ x: newX, y: newY });
      updateParent(newX, newY, size.width, size.height);
    }

    if (resizing && resizeDir) {
      const deltaX = e.movementX;
      const deltaY = e.movementY;
      let { x, y } = pos;
      let { width, height } = size;

      // arah resize
      if (resizeDir.includes('right')) width = Math.max(50, width + deltaX);
      if (resizeDir.includes('bottom')) height = Math.max(50, height + deltaY);
      if (resizeDir.includes('left')) {
        width = Math.max(50, width - deltaX);
        x = x + deltaX;
      }
      if (resizeDir.includes('top')) {
        height = Math.max(50, height - deltaY);
        y = y + deltaY;
      }

      setPos({ x, y });
      setSize({ width, height });
      updateParent(x, y, width, height);
    }
  };

  const onMouseUp = () => {
    setDragging(false);
    setResizing(false);
    setResizeDir(null);
  };

  const startResize = (dir: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setResizing(true);
    setResizeDir(dir);
  };

  // tambahkan listener global
  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  });

  // kalau breakpoint berubah, update posisi/ukuran
  useEffect(() => {
    const bpSize = sizeData[breakpoint] || sizeData.default;
    setPos({ x: bpSize.x, y: bpSize.y });
    setSize({ width: bpSize.width, height: bpSize.height });
  }, [breakpoint, sizeData]);

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDownDrag}
      className="absolute bg-white shadow-lg border border-gray-400 cursor-grab active:cursor-grabbing"
      style={{
        left: pos.x,
        top: pos.y,
        width: size.width,
        height: size.height,
        userSelect: 'none',
      }}
    >
      {/* Content */}
      <div className="flex items-center justify-center text-gray-700 select-none">
        Box {id} ({breakpoint})
      </div>

      {/* 8 resize handles */}
      {[
        'top-left', 'top', 'top-right',
        'right', 'bottom-right', 'bottom', 'bottom-left', 'left',
      ].map((dir) => (
        <div
          key={dir}
          onMouseDown={startResize(dir)}
          className={`absolute ${getHandleStyle(dir)}`}
        />
      ))}
    </div>
  );
};

// --- Tailwind posisi handle resize ---
function getHandleStyle(dir: string): string {
  const base = 'w-3 h-3 bg-blue-500 opacity-80 absolute cursor-';
  switch (dir) {
    case 'top-left': return base + 'nwse-resize -top-1 -left-1';
    case 'top': return base + 'ns-resize -top-1 left-1/2 -translate-x-1/2';
    case 'top-right': return base + 'nesw-resize -top-1 -right-1';
    case 'right': return base + 'ew-resize top-1/2 -right-1 -translate-y-1/2';
    case 'bottom-right': return base + 'nwse-resize -bottom-1 -right-1';
    case 'bottom': return base + 'ns-resize -bottom-1 left-1/2 -translate-x-1/2';
    case 'bottom-left': return base + 'nesw-resize -bottom-1 -left-1';
    case 'left': return base + 'ew-resize top-1/2 -left-1 -translate-y-1/2';
    default: return '';
  }
}

export default FreeDragResizeBox;
