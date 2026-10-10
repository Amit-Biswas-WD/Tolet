'use client';

import React from 'react';
import { formatNumber } from '@/lib/utils';

export function LineChart({
  data,
  labels,
  height = 200,
  lang = 'bn',
}: {
  data: number[];
  labels: string[];
  height?: number;
  lang?: 'bn' | 'en';
}) {
  const w = 640;
  const pl = 36;
  const pb = 26;
  const pt = 12;
  const pr = 10;
  const max = Math.ceil(Math.max(...data, 10) / 20) * 20;

  const x = (i: number) => pl + (i * (w - pl - pr)) / (data.length - 1);
  const y = (v: number) => pt + (height - pt - pb) * (1 - v / max);

  const gridLines = [];
  for (let i = 0; i <= 4; i++) {
    const v = (max * i) / 4;
    const yPos = y(v);
    gridLines.push(
      <g key={i}>
        <line x1={pl} x2={w - pr} y1={yPos} y2={yPos} stroke="var(--line)" />
        <text x={pl - 6} y={yPos + 4} textAnchor="end">
          {formatNumber(v, lang)}
        </text>
      </g>
    );
  }

  const pts = data.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const area = `${pl},${height - pb} ${pts} ${w - pr},${height - pb}`;

  const labelTexts = labels.map((l, i) => {
    if (i % 3 === 0) {
      return (
        <text key={i} x={x(i)} y={height - 8} textAnchor="middle">
          {l}
        </text>
      );
    }
    return null;
  });

  return (
    <svg
      className="chart"
      viewBox={`0 0 ${w} ${height}`}
      role="img"
      aria-label={lang === 'bn' ? 'ভিউ চার্ট (নমুনা তথ্য)' : 'Views chart (sample data)'}
    >
      {gridLines}
      <polygon points={area} fill="var(--pri)" opacity="0.12" />
      <polyline points={pts} fill="none" stroke="var(--pri)" strokeWidth="2.5" strokeLinejoin="round" />
      <circle
        cx={x(data.length - 1)}
        cy={y(data[data.length - 1])}
        r="5"
        fill="var(--pri)"
        stroke="var(--card)"
        strokeWidth="2"
      />
      {labelTexts}
    </svg>
  );
}

export function BarChart({
  items,
  height = 200,
  lang = 'bn',
}: {
  items: [string, number][];
  height?: number;
  lang?: 'bn' | 'en';
}) {
  const w = 640;
  const pl = 36;
  const pb = 30;
  const pt = 12;
  const pr = 10;
  const max = Math.ceil(Math.max(...items.map((i) => i[1]), 10) / 10) * 10 || 10;
  const bw = (w - pl - pr) / items.length;
  const y = (v: number) => pt + (height - pt - pb) * (1 - v / max);

  const gridLines = [];
  for (let i = 0; i <= 4; i++) {
    const v = (max * i) / 4;
    const yPos = y(v);
    gridLines.push(
      <g key={i}>
        <line x1={pl} x2={w - pr} y1={yPos} y2={yPos} stroke="var(--line)" />
        <text x={pl - 6} y={yPos + 4} textAnchor="end">
          {formatNumber(v, lang)}
        </text>
      </g>
    );
  }

  const bars = items.map((it, i) => {
    const barHeight = height - pb - y(it[1]);
    return (
      <g key={i}>
        <rect
          x={pl + i * bw + bw * 0.2}
          y={y(it[1])}
          width={bw * 0.6}
          height={barHeight}
          rx="4"
          fill="var(--pri)"
        />
        <text x={pl + i * bw + bw / 2} y={height - 10} textAnchor="middle">
          {it[0]}
        </text>
      </g>
    );
  });

  return (
    <svg
      className="chart"
      viewBox={`0 0 ${w} ${height}`}
      role="img"
      aria-label={lang === 'bn' ? 'বার চার্ট (নমুনা তথ্য)' : 'Bar chart (sample data)'}
    >
      {gridLines}
      {bars}
    </svg>
  );
}
