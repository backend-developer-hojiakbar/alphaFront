// src/components/NestingVisualization.tsx

import React from 'react';

interface NestingVisualizationProps {
  layout: Array<{ x: number, y: number, width: number, height: number }>;
}

const SHEET_WIDTH = 320;
const SHEET_HEIGHT = 450;

const NestingVisualization: React.FC<NestingVisualizationProps> = ({ layout }) => {
    if (!layout || layout.length === 0) {
        return <div className="text-center text-slate-500">Joylashuv ma'lumotlari mavjud emas.</div>;
    }
  
  const viewBoxWidth = Math.max(SHEET_WIDTH, ...layout.map(item => item.x + item.width));
  const viewBoxHeight = Math.max(SHEET_HEIGHT, ...layout.map(item => item.y + item.height));

  const viewbox = `0 0 ${viewBoxWidth} ${viewBoxHeight}`;

  return (
    <div className="w-full bg-slate-900/50 p-2 rounded-lg border border-slate-700 flex justify-center items-center" style={{ aspectRatio: `${SHEET_WIDTH}/${SHEET_HEIGHT}` }}>
      <svg
        viewBox={viewbox}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
      >
        <rect
          x="0"
          y="0"
          width={SHEET_WIDTH}
          height={SHEET_HEIGHT}
          fill="#1e293b"
          stroke="#334155"
          strokeWidth="2"
        />
        {layout.map((item, index) => (
          <g key={index}>
            <rect
              x={item.x}
              y={item.y}
              width={item.width}
              height={item.height}
              fill="rgba(56, 189, 248, 0.15)"
              stroke="rgba(56, 189, 248, 0.8)"
              strokeWidth="1.5"
              rx="2"
            />
            <text
              x={item.x + item.width / 2}
              y={item.y + item.height / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
              fill="#bae6fd"
              className="font-sans font-semibold pointer-events-none"
            >
              {index + 1}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default NestingVisualization;