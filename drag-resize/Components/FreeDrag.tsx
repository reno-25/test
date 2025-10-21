'use client';
import React, { useState, useRef } from 'react';

interface FreeDragProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  bounds?: 'window' | 'parent'; // bisa batasi area gerak
}

const FreeDrag: React.FC<FreeDragProps> = ({
  children,
  className = '',
  style = {},
  bounds = 'window',
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setDragging(true);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging || !ref.current) return;

    const parentRect =
      bounds === 'parent'
        ? ref.current.parentElement?.getBoundingClientRect()
        : document.body.getBoundingClientRect();

    if (!parentRect) return;

    let newX = e.clientX - offset.x - parentRect.left;
    let newY = e.clientY - offset.y - parentRect.top;

    // Batasi ke dalam bounds
    const maxX = parentRect.width - ref.current.offsetWidth;
    const maxY = parentRect.height - ref.current.offsetHeight;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    setPosition({ x: newX, y: newY });
  };

  const onMouseUp = () => setDragging(false);

  React.useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging]);

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      className={`cursor-grab active:cursor-grabbing absolute ${className}`}
      style={{
        left: position.x,
        top: position.y,
        userSelect: 'none',
        ...style,
      }}
    >
      {children ?? <div className="w-40 h-40 bg-blue-500 text-white flex items-center justify-center rounded-lg shadow-lg">Drag Me</div>}
    </div>
  );
};

export default FreeDrag;
