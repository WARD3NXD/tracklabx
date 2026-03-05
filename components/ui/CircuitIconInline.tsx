'use client';

import { useEffect, useState } from 'react';

interface CircuitIconInlineProps {
  circuitId: string;
  className?: string;
  animate?: boolean;
  loop?: boolean;
  color?: string;
  opacity?: number;
}

export default function CircuitIconInline({
  circuitId,
  className = '',
  animate = true,
  loop = false,
  color = 'var(--red)',
  opacity = 1,
}: CircuitIconInlineProps) {
  const [svgContent, setSvgContent] = useState<string>('');
  const [key, setKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch(`/tracks/${circuitId}.svg`)
      .then((r) => r.text())
      .then((text) => {
        if (!cancelled) setSvgContent(text);
      })
      .catch(() => {
        if (!cancelled) setSvgContent('');
      });
    return () => {
      cancelled = true;
    };
  }, [circuitId]);

  useEffect(() => {
    if (!loop || !animate) return;
    const interval = setInterval(() => setKey((k) => k + 1), 3000);
    return () => clearInterval(interval);
  }, [loop, animate]);

  if (!svgContent) return null;

  return (
    <div
      key={key}
      className={`circuit-inline ${animate ? 'circuit-draw' : ''} ${className}`}
      style={{ opacity }}
      dangerouslySetInnerHTML={{
        __html: svgContent
          .replace(/fill="[^"]*"/g, 'fill="none"')
          .replace(/stroke="[^"]*"/g, `stroke="${color}"`)
          .replace(/<svg/, '<svg class="circuit-svg"'),
      }}
    />
  );
}

