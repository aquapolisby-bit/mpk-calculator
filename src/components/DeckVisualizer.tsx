/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CalculationResults, DeckConfig, LayoutDirection, BoardPiece } from '../types';
import { COLORS, BOARD_SPECS } from '../utils';
import { Layers, Info, CheckCircle2, RotateCw } from 'lucide-react';

interface DeckVisualizerProps {
  config: DeckConfig;
  results: CalculationResults;
}

export const DeckVisualizer: React.FC<DeckVisualizerProps> = ({ config, results }) => {
  const [selectedPiece, setSelectedPiece] = React.useState<BoardPiece | null>(null);
  const colorSpec = COLORS.find((c) => c.id === config.colorId) || COLORS[0];
  const boardSpec = BOARD_SPECS[config.boardType];

  // We want to scale our layout to fit the screen container
  // Keep an aspect ratio based on physical length and width of the terrace
  // Ensure we add some padding around the SVG for dimension labels
  const svgWidth = 800;
  
  const isAlongLength = config.direction === LayoutDirection.ALONG_LENGTH;
  
  // Determine physical coordinates (independent of board layout direction)
  // Length is always along the X-axis of the screen/SVG
  // Width is always along the Y-axis of the screen/SVG
  const physicalLength = config.length;
  const physicalWidth = config.width;

  const unitScale = Math.max(1.2, physicalLength / 700);
  const padding = 75 * unitScale;

  const aspect = physicalWidth / physicalLength;
  const svgHeight = Math.max(200, Math.min(600, Math.round(svgWidth * aspect)));

  // ViewBox coordinates (always matching physical dimensions of the terrace)
  const viewWidth = physicalLength + padding * 2;
  const viewHeight = physicalWidth + padding * 2;

  // Render variables
  const wallGap = results.wallGap;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6" id="deck-visualizer-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand" />
            Схема раскладки террасы
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Интерактивный чертеж укладки. Нажмите на доску, чтобы увидеть её параметры.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-brand-light text-brand-dark font-semibold px-2 py-1 rounded-md border border-brand/20">
            Зазор от стен: {results.wallGap} мм
          </span>
          <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-1 rounded-md border border-blue-100">
            Зазор досок: 3 мм
          </span>
        </div>
      </div>

      {/* Main Drawing Area */}
      <div className="relative border border-slate-100 bg-slate-50/30 rounded-xl overflow-hidden p-2 flex items-center justify-center">
        <svg
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          className="w-full h-auto max-h-[450px] drop-shadow-sm select-none"
          style={{ maxWidth: '100%' }}
        >
          {/* Grids and backgrounds */}
          {config.shape === 'CUSTOM' && config.customGrid ? (
            // Render grid cells background
            config.customGrid.map((row, rIdx) =>
              row.map((active, cIdx) => {
                if (!active) return null;
                const CELL_SIZE = config.cellSize || 500;
                // Scale cells down to fit physicalLength and physicalWidth correctly
                // Each cell is 500x500mm
                return (
                  <rect
                    key={`bg-cell-${rIdx}-${cIdx}`}
                    x={padding + cIdx * CELL_SIZE}
                    y={padding + rIdx * CELL_SIZE}
                    width={CELL_SIZE}
                    height={CELL_SIZE}
                    fill="#F8FAFC"
                    stroke="#E2E8F0"
                    strokeWidth="1"
                    rx="2"
                  />
                );
              })
            )
          ) : config.shape === 'L_SHAPE' ? (
            // Render L-shape polygon background at bottom-right corner
            <polygon
              points={`
                ${padding},${padding}
                ${padding + config.length},${padding}
                ${padding + config.length},${padding + config.width - (config.cutoutWidth || 1500)}
                ${padding + config.length - (config.cutoutLength || 1500)},${padding + config.width - (config.cutoutWidth || 1500)}
                ${padding + config.length - (config.cutoutLength || 1500)},${padding + config.width}
                ${padding},${padding + config.width}
              `}
              fill="#F8FAFC"
              stroke="#E2E8F0"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          ) : config.shape === 'CUTOUT' ? (
            // Render Cutout polygon background at top-right corner
            <polygon
              points={`
                ${padding},${padding}
                ${padding + config.length - (config.cutoutLength || 1500)},${padding}
                ${padding + config.length - (config.cutoutLength || 1500)},${padding + (config.cutoutWidth || 1500)}
                ${padding + config.length},${padding + (config.cutoutWidth || 1500)}
                ${padding + config.length},${padding + config.width}
                ${padding},${padding + config.width}
              `}
              fill="#F8FAFC"
              stroke="#E2E8F0"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          ) : (
            // Standard RECTANGLE background
            <rect
              x={padding}
              y={padding}
              width={config.length}
              height={config.width}
              fill="#F8FAFC"
              stroke="#E2E8F0"
              strokeWidth="2"
              strokeDasharray="4 4"
              rx="4"
            />
          )}

          {/* Lags layer (drawn underneath the boards) */}
          {results.lags.map((lag) => {
            return (
              <g key={lag.id}>
                {isAlongLength ? (
                  // Vertical lags
                  lag.isDouble ? (
                    <>
                      <line
                        x1={padding + lag.position - 8}
                        y1={padding + (lag.startCoord || 0)}
                        x2={padding + lag.position - 8}
                        y2={padding + (lag.startCoord || 0) + lag.length}
                        stroke="#94A3B8"
                        strokeWidth="3"
                      />
                      <line
                        x1={padding + lag.position + 8}
                        y1={padding + (lag.startCoord || 0)}
                        x2={padding + lag.position + 8}
                        y2={padding + (lag.startCoord || 0) + lag.length}
                        stroke="#94A3B8"
                        strokeWidth="3"
                      />
                    </>
                  ) : (
                    <line
                      x1={padding + lag.position}
                      y1={padding + (lag.startCoord || 0)}
                      x2={padding + lag.position}
                      y2={padding + (lag.startCoord || 0) + lag.length}
                      stroke="#CBD5E1"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  )
                ) : (
                  // Horizontal lags
                  lag.isDouble ? (
                    <>
                      <line
                        x1={padding + (lag.startCoord || 0)}
                        y1={padding + lag.position - 8}
                        x2={padding + (lag.startCoord || 0) + lag.length}
                        y2={padding + lag.position - 8}
                        stroke="#94A3B8"
                        strokeWidth="3"
                      />
                      <line
                        x1={padding + (lag.startCoord || 0)}
                        y1={padding + lag.position + 8}
                        x2={padding + (lag.startCoord || 0) + lag.length}
                        y2={padding + lag.position + 8}
                        stroke="#94A3B8"
                        strokeWidth="3"
                      />
                    </>
                  ) : (
                    <line
                      x1={padding + (lag.startCoord || 0)}
                      y1={padding + lag.position}
                      x2={padding + (lag.startCoord || 0) + lag.length}
                      y2={padding + lag.position}
                      stroke="#CBD5E1"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  )
                )}
              </g>
            );
          })}

          {/* Board rows layer */}
          {results.rows.map((row) => {
            return (
              <g key={`row-${row.rowIdx}`}>
                {row.pieces.map((piece) => {
                  const isSelected = selectedPiece?.id === piece.id;

                  // Coordinate calculation depending on direction
                  const xPos = isAlongLength 
                    ? padding + wallGap + piece.startX 
                    : padding + row.yPosition;
                  
                  const yPos = isAlongLength 
                    ? padding + row.yPosition 
                    : padding + wallGap + piece.startX;
                  
                  const rectWidth = isAlongLength 
                    ? piece.length 
                    : boardSpec.width;
                  
                  const rectHeight = isAlongLength 
                    ? boardSpec.width 
                    : piece.length;

                  return (
                    <rect
                      key={piece.id}
                      x={xPos}
                      y={yPos}
                      width={rectWidth}
                      height={rectHeight}
                      fill={colorSpec.hex}
                      stroke={isSelected ? '#10B981' : '#1E293B'}
                      strokeWidth={isSelected ? '2.5' : '0.5'}
                      className="cursor-pointer transition-all hover:opacity-90"
                      onClick={() => setSelectedPiece(piece)}
                      rx="1"
                    >
                      <title>{`Ряд ${row.rowIdx + 1}, Длина: ${piece.length} мм`}</title>
                    </rect>
                  );
                })}
              </g>
            );
          })}

          {/* Exterior Dimension Labels */}
          {/* Length Arrow & Label */}
          <g>
            <line
              x1={padding}
              y1={padding - 20 * unitScale}
              x2={padding + physicalLength}
              y2={padding - 20 * unitScale}
              stroke="#64748B"
              strokeWidth={1.5 * unitScale}
              markerEnd="url(#arrow-end)"
              markerStart="url(#arrow-start)"
            />
            <text
              x={padding + physicalLength / 2}
              y={padding - 27 * unitScale}
              textAnchor="middle"
              className="font-bold fill-slate-600 font-mono"
              fontSize={11 * unitScale}
            >
              Длина L: {(config.length / 1000).toFixed(2)} м
            </text>
          </g>

          {/* Width Arrow & Label */}
          <g>
            <line
              x1={padding - 20 * unitScale}
              y1={padding}
              x2={padding - 20 * unitScale}
              y2={padding + physicalWidth}
              stroke="#64748B"
              strokeWidth={1.5 * unitScale}
              markerEnd="url(#arrow-end)"
              markerStart="url(#arrow-start)"
            />
            <text
              x={padding - 27 * unitScale}
              y={padding + physicalWidth / 2}
              textAnchor="middle"
              transform={`rotate(-90, ${padding - 27 * unitScale}, ${padding + physicalWidth / 2})`}
              className="font-bold fill-slate-600 font-mono"
              fontSize={11 * unitScale}
            >
              Ширина W: {(config.width / 1000).toFixed(2)} м
            </text>
          </g>

          {/* Side direction labels with letter markers (А, Б, В, Г) */}
          <g className="select-none">
            {/* FRONT (BOTTOM) SIDE - А */}
            <g transform={`translate(${padding + physicalLength / 2}, ${padding + physicalWidth + 45 * unitScale})`}>
              <circle r={12 * unitScale} fill="#10B981" />
              <text y={4 * unitScale} textAnchor="middle" fill="#ffffff" className="font-extrabold font-sans" fontSize={12 * unitScale}>А</text>
              <text y={24 * unitScale} textAnchor="middle" fill="#334155" className="font-bold font-sans" fontSize={9 * unitScale}>Передняя сторона (А)</text>
            </g>

            {/* LEFT SIDE - Б */}
            <g transform={`translate(${padding - 45 * unitScale}, ${padding + physicalWidth / 2}) rotate(-90)`}>
              <circle r={12 * unitScale} fill="#10B981" />
              <text y={4 * unitScale} textAnchor="middle" fill="#ffffff" className="font-extrabold font-sans" fontSize={12 * unitScale}>Б</text>
              <text y={24 * unitScale} textAnchor="middle" fill="#334155" className="font-bold font-sans" fontSize={9 * unitScale}>Левая сторона (Б)</text>
            </g>

            {/* BACK (TOP) SIDE - В */}
            <g transform={`translate(${padding + physicalLength / 2}, ${padding - 45 * unitScale})`}>
              <circle r={12 * unitScale} fill="#10B981" />
              <text y={4 * unitScale} textAnchor="middle" fill="#ffffff" className="font-extrabold font-sans" fontSize={12 * unitScale}>В</text>
              <text y={-16 * unitScale} textAnchor="middle" fill="#334155" className="font-bold font-sans" fontSize={9 * unitScale}>Задняя сторона (В)</text>
            </g>

            {/* RIGHT SIDE - Г */}
            <g transform={`translate(${padding + physicalLength + 45 * unitScale}, ${padding + physicalWidth / 2}) rotate(90)`}>
              <circle r={12 * unitScale} fill="#10B981" />
              <text y={4 * unitScale} textAnchor="middle" fill="#ffffff" className="font-extrabold font-sans" fontSize={12 * unitScale}>Г</text>
              <text y={24 * unitScale} textAnchor="middle" fill="#334155" className="font-bold font-sans" fontSize={9 * unitScale}>Правая сторона (Г)</text>
            </g>
          </g>

          {/* Definitions for Markers */}
          <defs>
            <marker id="arrow-start" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,3 L9,0 L9,6 Z" fill="#64748B" />
            </marker>
            <marker id="arrow-end" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M9,3 L0,0 L0,6 Z" fill="#64748B" />
            </marker>
          </defs>
        </svg>

        {/* Selected Board Detail Card overlay */}
        {selectedPiece && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-72 bg-slate-900/95 text-white backdrop-blur-sm p-4 rounded-xl shadow-lg border border-slate-800 text-xs space-y-2 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="font-bold text-brand">Параметры доски</span>
              <button
                type="button"
                className="text-slate-400 hover:text-white font-medium"
                onClick={() => setSelectedPiece(null)}
              >
                Закрыть
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <span>Индекс ряда:</span>
              <span className="font-semibold text-white">{selectedPiece.rowIdx + 1}</span>
              <span>{isAlongLength ? 'Координата X (Длина):' : 'Координата Y (Ширина):'}</span>
              <span className="font-semibold text-white">{selectedPiece.startX.toLocaleString()} мм</span>
              <span>{isAlongLength ? 'Координата Y (Ширина):' : 'Координата X (Длина):'}</span>
              <span className="font-semibold text-white">{(results.rows[selectedPiece.rowIdx]?.yPosition || 0).toLocaleString()} мм</span>
              <span>Длина отрезка:</span>
              <span className="font-bold text-brand font-mono">{(selectedPiece.length / 1000).toFixed(3)} м ({selectedPiece.length} мм)</span>
              <span>Тип детали:</span>
              <span>
                {selectedPiece.length >= (config.boardLengthOption === 'stock' ? 3000 : config.customBoardLength) ? (
                  <span className="bg-brand/20 text-brand px-1.5 py-0.5 rounded font-semibold text-[10px]">
                    Целая доска
                  </span>
                ) : (
                  <span className="bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-semibold text-[10px]">
                    Отрезок доски
                  </span>
                )}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Legend & Summary Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border border-slate-300 flex-shrink-0" style={{ backgroundColor: colorSpec.hex }}></div>
          <div>
            <span className="font-semibold block text-slate-700">Террасная доска</span>
            <span>{colorSpec.name} ({boardSpec.thickness} мм)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-[#CBD5E1] rounded flex-shrink-0"></div>
          <div>
            <span className="font-semibold block text-slate-700">Опорные лаги</span>
            <span>Рекомендовано: 350 мм</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-1 border-y border-dashed border-[#94A3B8] flex-shrink-0"></div>
          <div>
            <span className="font-semibold block text-slate-700">Двойные лаги</span>
            <span>В местах стыков торцов</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-brand-light rounded border border-brand/30 flex items-center justify-center text-[8px] text-brand font-bold">
            10%
          </div>
          <div>
            <span className="font-semibold block text-slate-700">Запас на подрезку</span>
            <span>Оптимальные стыки</span>
          </div>
        </div>
      </div>

      {/* Dynamic calculation fun fact */}
      <div className="bg-brand-light border border-brand/20 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-600">
          <span className="font-bold text-brand-dark block">Оптимальная шахматная укладка:</span>
          <p className="leading-relaxed">
            Наш алгоритм автоматически распределил доски со смещением стыков на каждом ряду (не менее 300 мм), чтобы обеспечить максимальную жесткость и эстетичный внешний вид настила. 
            Все остатки досок длиннее 300 мм автоматически использованы в последующих рядах для минимизации ваших расходов. 
            В результате, реальный процент отхода составил всего <span className="font-bold text-brand-dark">{results.actualWastePercentage}%</span>.
          </p>
        </div>
      </div>
    </div>
  );
};
