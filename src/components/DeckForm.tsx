/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  BoardType,
  BoardTexture,
  LayoutDirection,
  DeckConfig,
  DeckShape,
  ColorGroup,
} from '../types';
import { BOARD_SPECS, COLORS } from '../utils';
import {
  Maximize2,
  Minimize2,
  Compass,
  Layers,
  Settings,
  HelpCircle,
  Truck,
  Sparkles,
  ChevronRight,
  Square,
  CornerDownRight,
  Scissors,
  Grid,
  PenTool,
  Eraser,
  Trash2,
  RefreshCw,
} from 'lucide-react';

interface DeckFormProps {
  config: DeckConfig;
  onChange: (newConfig: DeckConfig) => void;
}

export const DeckForm: React.FC<DeckFormProps> = ({ config, onChange }) => {
  const [isMouseDown, setIsMouseDown] = React.useState(false);
  const [drawTool, setDrawTool] = React.useState<'paint' | 'erase'>('paint');

  const toggleCell = (r: number, c: number, tool: 'paint' | 'erase') => {
    if (!config.customGrid) return;
    const newGrid = config.customGrid.map((row, rIdx) =>
      row.map((cell, cIdx) => {
        if (rIdx === r && cIdx === c) {
          return tool === 'paint';
        }
        return cell;
      })
    );
    handleInputChange('customGrid', newGrid);
  };

  const handleInputChange = (key: keyof DeckConfig, value: any) => {
    onChange({
      ...config,
      [key]: value,
    });
  };

  // Convert inputs in meters to mm
  const [widthMeters, setWidthMeters] = React.useState((config.width / 1000).toString());
  const [lengthMeters, setLengthMeters] = React.useState((config.length / 1000).toString());

  React.useEffect(() => {
    setWidthMeters((config.width / 1000).toString());
    setLengthMeters((config.length / 1000).toString());
  }, [config.width, config.length]);

  const handleWidthChange = (val: string) => {
    setWidthMeters(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      handleInputChange('width', Math.round(num * 1000));
    }
  };

  const handleLengthChange = (val: string) => {
    setLengthMeters(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      handleInputChange('length', Math.round(num * 1000));
    }
  };

  const currentSpec = BOARD_SPECS[config.boardType];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-8" id="deck-form-container">
      {/* 1. Геометрия и Размеры */}
      <div className="space-y-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Maximize2 className="w-4 h-4 text-emerald-500" />
          1. Геометрия и Размеры террасы
        </h3>

        {/* Shape selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 block">Форма террасы</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              id="shape-rectangle-btn"
              onClick={() => handleInputChange('shape', DeckShape.RECTANGLE)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center cursor-pointer transition-all ${
                config.shape === DeckShape.RECTANGLE
                  ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 shadow-sm'
                  : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <Square className="w-5 h-5 mb-1.5" />
              <span className="text-xs font-bold">Прямоугольник</span>
            </button>

            <button
              type="button"
              id="shape-lshape-btn"
              onClick={() => handleInputChange('shape', DeckShape.L_SHAPE)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center cursor-pointer transition-all ${
                config.shape === DeckShape.L_SHAPE
                  ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 shadow-sm'
                  : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <CornerDownRight className="w-5 h-5 mb-1.5" />
              <span className="text-xs font-bold">Г-образная</span>
            </button>

            <button
              type="button"
              id="shape-cutout-btn"
              onClick={() => handleInputChange('shape', DeckShape.CUTOUT)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center cursor-pointer transition-all ${
                config.shape === DeckShape.CUTOUT
                  ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 shadow-sm'
                  : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <Scissors className="w-5 h-5 mb-1.5" />
              <span className="text-xs font-bold">С вырезом</span>
            </button>

            <button
              type="button"
              id="shape-custom-btn"
              onClick={() => handleInputChange('shape', DeckShape.CUSTOM)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center cursor-pointer transition-all ${
                config.shape === DeckShape.CUSTOM
                  ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 shadow-sm'
                  : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <Grid className="w-5 h-5 mb-1.5" />
              <span className="text-xs font-bold">Своя форма</span>
            </button>
          </div>
        </div>

        {/* Core Dimensions */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500" htmlFor="width-input">
              Ширина (W), м
            </label>
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all overflow-hidden">
              <button
                type="button"
                id="width-decrement-btn"
                onClick={() => {
                  const current = parseFloat(widthMeters) || 0;
                  const next = Math.max(0.5, Math.round((current - 0.1) * 10) / 10);
                  handleWidthChange(next.toString());
                }}
                className="w-10 h-11 flex items-center justify-center text-slate-500 hover:bg-slate-100 active:bg-slate-200 font-bold text-base cursor-pointer select-none transition-colors border-r border-slate-200"
                title="Уменьшить"
              >
                –
              </button>
              <input
                id="width-input"
                type="number"
                step="0.1"
                min="0.5"
                max="50"
                value={widthMeters}
                onChange={(e) => handleWidthChange(e.target.value)}
                className="w-full bg-transparent px-2 py-3 text-center focus:outline-none text-slate-800 font-semibold text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-12 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none hidden sm:inline font-mono">
                {(config.width).toLocaleString()} мм
              </span>
              <button
                type="button"
                id="width-increment-btn"
                onClick={() => {
                  const current = parseFloat(widthMeters) || 0;
                  const next = Math.min(50, Math.round((current + 0.1) * 10) / 10);
                  handleWidthChange(next.toString());
                }}
                className="w-10 h-11 flex items-center justify-center text-slate-500 hover:bg-slate-100 active:bg-slate-200 font-bold text-base cursor-pointer select-none transition-colors border-l border-slate-200"
                title="Увеличить"
              >
                +
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500" htmlFor="length-input">
              Длина (L), м
            </label>
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all overflow-hidden">
              <button
                type="button"
                id="length-decrement-btn"
                onClick={() => {
                  const current = parseFloat(lengthMeters) || 0;
                  const next = Math.max(0.5, Math.round((current - 0.1) * 10) / 10);
                  handleLengthChange(next.toString());
                }}
                className="w-10 h-11 flex items-center justify-center text-slate-500 hover:bg-slate-100 active:bg-slate-200 font-bold text-base cursor-pointer select-none transition-colors border-r border-slate-200"
                title="Уменьшить"
              >
                –
              </button>
              <input
                id="length-input"
                type="number"
                step="0.1"
                min="0.5"
                max="50"
                value={lengthMeters}
                onChange={(e) => handleLengthChange(e.target.value)}
                className="w-full bg-transparent px-2 py-3 text-center focus:outline-none text-slate-800 font-semibold text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-12 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none hidden sm:inline font-mono">
                {(config.length).toLocaleString()} мм
              </span>
              <button
                type="button"
                id="length-increment-btn"
                onClick={() => {
                  const current = parseFloat(lengthMeters) || 0;
                  const next = Math.min(50, Math.round((current + 0.1) * 10) / 10);
                  handleLengthChange(next.toString());
                }}
                className="w-10 h-11 flex items-center justify-center text-slate-500 hover:bg-slate-100 active:bg-slate-200 font-bold text-base cursor-pointer select-none transition-colors border-l border-slate-200"
                title="Увеличить"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Cutout Dimensions (for L_SHAPE and CUTOUT) */}
        {(config.shape === DeckShape.L_SHAPE || config.shape === DeckShape.CUTOUT) && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500" htmlFor="cutout-width-input">
                Ширина выреза, м
              </label>
              <div className="relative flex items-center bg-white border border-slate-200 rounded-xl focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all overflow-hidden">
                <button
                  type="button"
                  id="cutout-width-decrement-btn"
                  onClick={() => {
                    const current = config.cutoutWidth ? config.cutoutWidth / 1000 : 1.5;
                    const next = Math.max(0.1, Math.round((current - 0.1) * 10) / 10);
                    handleInputChange('cutoutWidth', Math.round(next * 1000));
                  }}
                  className="w-8 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-100 active:bg-slate-200 font-bold text-sm cursor-pointer select-none transition-colors border-r border-slate-200"
                  title="Уменьшить"
                >
                  –
                </button>
                <input
                  id="cutout-width-input"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max={(config.width / 1000 - 0.5).toFixed(1)}
                  value={config.cutoutWidth ? (config.cutoutWidth / 1000).toString() : '1.5'}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val > 0) {
                      handleInputChange('cutoutWidth', Math.round(val * 1000));
                    }
                  }}
                  className="w-full bg-transparent px-2 py-2 text-center focus:outline-none text-slate-800 font-semibold text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  id="cutout-width-increment-btn"
                  onClick={() => {
                    const current = config.cutoutWidth ? config.cutoutWidth / 1000 : 1.5;
                    const maxVal = parseFloat((config.width / 1000 - 0.5).toFixed(1));
                    const next = Math.min(maxVal, Math.round((current + 0.1) * 10) / 10);
                    handleInputChange('cutoutWidth', Math.round(next * 1000));
                  }}
                  className="w-8 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-100 active:bg-slate-200 font-bold text-sm cursor-pointer select-none transition-colors border-l border-slate-200"
                  title="Увеличить"
                >
                  +
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500" htmlFor="cutout-length-input">
                Длина выреза, м
              </label>
              <div className="relative flex items-center bg-white border border-slate-200 rounded-xl focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all overflow-hidden">
                <button
                  type="button"
                  id="cutout-length-decrement-btn"
                  onClick={() => {
                    const current = config.cutoutLength ? config.cutoutLength / 1000 : 1.5;
                    const next = Math.max(0.1, Math.round((current - 0.1) * 10) / 10);
                    handleInputChange('cutoutLength', Math.round(next * 1000));
                  }}
                  className="w-8 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-100 active:bg-slate-200 font-bold text-sm cursor-pointer select-none transition-colors border-r border-slate-200"
                  title="Уменьшить"
                >
                  –
                </button>
                <input
                  id="cutout-length-input"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max={(config.length / 1000 - 0.5).toFixed(1)}
                  value={config.cutoutLength ? (config.cutoutLength / 1000).toString() : '1.5'}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val > 0) {
                      handleInputChange('cutoutLength', Math.round(val * 1000));
                    }
                  }}
                  className="w-full bg-transparent px-2 py-2 text-center focus:outline-none text-slate-800 font-semibold text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  id="cutout-length-increment-btn"
                  onClick={() => {
                    const current = config.cutoutLength ? config.cutoutLength / 1000 : 1.5;
                    const maxVal = parseFloat((config.length / 1000 - 0.5).toFixed(1));
                    const next = Math.min(maxVal, Math.round((current + 0.1) * 10) / 10);
                    handleInputChange('cutoutLength', Math.round(next * 1000));
                  }}
                  className="w-8 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-100 active:bg-slate-200 font-bold text-sm cursor-pointer select-none transition-colors border-l border-slate-200"
                  title="Увеличить"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Drawing Board ("Своя форма" & "Блок с окном") */}
        {config.shape === DeckShape.CUSTOM && config.customGrid && (
          <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/60 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700 block flex items-center gap-1">
                  <Grid className="w-3.5 h-3.5 text-emerald-600" />
                  Конструктор формы террасы
                </span>
                <span className="text-[10px] text-slate-400">
                  Сетка {config.gridCols} × {config.gridRows} ячеек (1 ячейка = 50 × 50 см)
                </span>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  id="fill-all-cells-btn"
                  onClick={() => {
                    if (config.customGrid) {
                      const newGrid = config.customGrid.map(row => row.map(() => true));
                      handleInputChange('customGrid', newGrid);
                    }
                  }}
                  className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  Заполнить
                </button>
                <button
                  type="button"
                  id="clear-all-cells-btn"
                  onClick={() => {
                    if (config.customGrid) {
                      const newGrid = config.customGrid.map(row => row.map(() => false));
                      handleInputChange('customGrid', newGrid);
                    }
                  }}
                  className="px-2 py-1 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 rounded-lg border border-slate-200 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  Сброс
                </button>
              </div>
            </div>

            {/* Draw / Erase Mode Selectors */}
            <div className="flex gap-2 items-center border-t border-slate-100 pt-3">
              <span className="text-[10px] text-slate-400 font-medium">Инструмент:</span>
              <button
                type="button"
                id="draw-tool-paint-btn"
                onClick={() => setDrawTool('paint')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                  drawTool === 'paint'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <PenTool className="w-3 h-3" />
                Рисовать
              </button>
              <button
                type="button"
                id="draw-tool-erase-btn"
                onClick={() => setDrawTool('erase')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                  drawTool === 'erase'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Eraser className="w-3 h-3" />
                Стирать (Вырез/Окно)
              </button>
            </div>

            {/* Grid Container */}
            <div 
              className="relative overflow-auto border border-slate-200 bg-white rounded-xl shadow-inner max-h-[300px] p-4 select-none touch-none"
              onMouseLeave={() => setIsMouseDown(false)}
              onMouseUp={() => setIsMouseDown(false)}
            >
              <div 
                className="grid gap-1 mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${config.gridCols || 12}, minmax(18px, 1fr))`,
                  width: `${Math.min(420, (config.gridCols || 12) * 26)}px`
                }}
              >
                {config.customGrid.map((row, rIdx) => 
                  row.map((active, cIdx) => (
                    <button
                      key={`cell-${rIdx}-${cIdx}`}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setIsMouseDown(true);
                        const initialMode = active ? 'erase' : 'paint';
                        setDrawTool(initialMode);
                        toggleCell(rIdx, cIdx, initialMode);
                      }}
                      onMouseEnter={() => {
                        if (isMouseDown) {
                          toggleCell(rIdx, cIdx, drawTool);
                        }
                      }}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        setIsMouseDown(true);
                        const initialMode = active ? 'erase' : 'paint';
                        setDrawTool(initialMode);
                        toggleCell(rIdx, cIdx, initialMode);
                      }}
                      className={`aspect-square rounded border transition-all cursor-pointer ${
                        active 
                          ? 'bg-emerald-500 border-emerald-600 shadow-sm' 
                          : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                      }`}
                      title={`${rIdx + 1} ряд, ${cIdx + 1} колонка`}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100 text-[10px] text-slate-500 leading-relaxed">
              <span className="font-bold text-emerald-800 block mb-0.5">💡 Подсказка:</span>
              Зажмите кнопку мыши (или коснитесь пальцем) и ведите по сетке, чтобы быстро рисовать или удалять участки. Удаленные ячейки (серые) — это незаполненные зоны, проёмы или «окна» в террасе. Расчет материалов моментально обновится!
            </div>
          </div>
        )}
      </div>

      {/* 2. Направление и Шаг лаг */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-500" />
          2. Направление укладки досок
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            id="layout-along-length-btn"
            onClick={() => handleInputChange('direction', LayoutDirection.ALONG_LENGTH)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
              config.direction === LayoutDirection.ALONG_LENGTH
                ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 shadow-sm'
                : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-600'
            }`}
          >
            <div className="flex flex-col gap-0.5 items-center mb-2">
              <div className="w-8 h-1.5 bg-emerald-500 rounded-sm mb-1"></div>
              <div className="w-8 h-1.5 bg-emerald-500 rounded-sm mb-1"></div>
              <div className="w-8 h-1.5 bg-emerald-500 rounded-sm"></div>
            </div>
            <span className="text-xs font-semibold">Вдоль длины (L)</span>
            <span className="text-[10px] text-slate-400 mt-1">Лаги поперек</span>
          </button>

          <button
            type="button"
            id="layout-along-width-btn"
            onClick={() => handleInputChange('direction', LayoutDirection.ALONG_WIDTH)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
              config.direction === LayoutDirection.ALONG_WIDTH
                ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 shadow-sm'
                : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-600'
            }`}
          >
            <div className="flex items-center gap-0.5 mb-2">
              <div className="w-1.5 h-8 bg-emerald-500 rounded-sm mr-1"></div>
              <div className="w-1.5 h-8 bg-emerald-500 rounded-sm mr-1"></div>
              <div className="w-1.5 h-8 bg-emerald-500 rounded-sm"></div>
            </div>
            <span className="text-xs font-semibold">Вдоль ширины (W)</span>
            <span className="text-[10px] text-slate-400 mt-1">Лаги поперек</span>
          </button>
        </div>
      </div>

      {/* 3. Выбор террасной доски */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-500" />
          3. Профиль террасной доски
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.values(BOARD_SPECS).map((spec) => (
            <button
              type="button"
              id={`board-type-${spec.type}-btn`}
              key={spec.type}
              onClick={() => handleInputChange('boardType', spec.type)}
              className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                config.boardType === spec.type
                  ? 'border-emerald-500 bg-emerald-50/30 text-slate-800 shadow-sm'
                  : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <span className={`text-xs font-bold ${config.boardType === spec.type ? 'text-emerald-700' : 'text-slate-800'}`}>
                {spec.name}
              </span>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                <span>{spec.thickness}×{spec.width} мм</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>{spec.weightPerMeter} кг/м.п.</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1">
                {spec.isSolid ? 'Для высоких нагрузок' : 'Классическая пустотелая'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Текстура и Обработка */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          4. Обработка поверхности
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            id="texture-velvet-btn"
            onClick={() => handleInputChange('boardTexture', BoardTexture.VELVET)}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
              config.boardTexture === BoardTexture.VELVET
                ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 shadow-sm'
                : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-600'
            }`}
          >
            <span className="text-xs font-semibold">Вельвет</span>
            <span className="text-[10px] text-slate-400 mt-1">Шлифованный</span>
          </button>

          <button
            type="button"
            id="texture-grinding-btn"
            onClick={() => handleInputChange('boardTexture', BoardTexture.GRINDING_EMBOSSING)}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
              config.boardTexture === BoardTexture.GRINDING_EMBOSSING
                ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 shadow-sm'
                : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-600'
            }`}
          >
            <span className="text-xs font-semibold">Шлифовка + Тиснение</span>
            <span className="text-[10px] text-slate-400 mt-1">Под дерево (плоская)</span>
          </button>

          <button
            type="button"
            id="texture-embossing-3d-btn"
            onClick={() => handleInputChange('boardTexture', BoardTexture.EMBOSSING_3D)}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
              config.boardTexture === BoardTexture.EMBOSSING_3D
                ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 shadow-sm'
                : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-600'
            }`}
          >
            <span className="text-xs font-semibold">3D Тиснение (ТТ)</span>
            <span className="text-[10px] text-slate-400 mt-1">Глубокая текстура</span>
          </button>
        </div>
      </div>

      {/* 5. Выбор Цвета */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[9px] text-emerald-600 font-bold bg-emerald-50">C</span>
          5. Цвет доски
        </h3>
        
        {/* Standard Group */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">Стандартные цвета (МПК)</span>
          <div className="flex flex-wrap gap-2">
            {COLORS.filter((c) => c.group === ColorGroup.STANDARD).map((color) => (
              <button
                type="button"
                id={`color-${color.id}-btn`}
                key={color.id}
                onClick={() => handleInputChange('colorId', color.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs transition-all ${
                  config.colorId === color.id
                    ? 'border-emerald-500 bg-emerald-50/30 text-emerald-950 font-medium'
                    : 'border-slate-100 bg-slate-50/30 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <span
                  className="w-4.5 h-4.5 rounded-full border border-black/10 shadow-inner flex-shrink-0"
                  style={{ backgroundColor: color.hex }}
                ></span>
                {color.name}
              </button>
            ))}
          </div>
        </div>

        {/* Premium Group */}
        <div className="space-y-2 pt-2">
          <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">Премиум цвета (+ наценка)</span>
          <div className="flex flex-wrap gap-2">
            {COLORS.filter((c) => c.group === ColorGroup.PREMIUM).map((color) => (
              <button
                type="button"
                id={`color-${color.id}-btn`}
                key={color.id}
                onClick={() => handleInputChange('colorId', color.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs transition-all ${
                  config.colorId === color.id
                    ? 'border-emerald-500 bg-emerald-50/30 text-emerald-950 font-medium'
                    : 'border-slate-100 bg-slate-50/30 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <span
                  className="w-4.5 h-4.5 rounded-full border border-black/10 shadow-inner flex-shrink-0"
                  style={{ backgroundColor: color.hex }}
                ></span>
                {color.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Длина Доски и Запас */}
      <div className="space-y-4 pt-2 border-t border-slate-50">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Settings className="w-4 h-4 text-emerald-500" />
          6. Параметры поставки и Запас
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Board length type */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-600 block">Длина доски</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="board-length-stock-btn"
                onClick={() => handleInputChange('boardLengthOption', 'stock')}
                className={`px-3 py-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                  config.boardLengthOption === 'stock'
                    ? 'border-emerald-500 bg-emerald-50/40 text-emerald-950'
                    : 'border-slate-100 bg-slate-50/50 text-slate-600'
                }`}
              >
                Со склада (3.0 м)
              </button>
              <button
                type="button"
                id="board-length-custom-btn"
                onClick={() => handleInputChange('boardLengthOption', 'custom')}
                className={`px-3 py-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                  config.boardLengthOption === 'custom'
                    ? 'border-emerald-500 bg-emerald-50/40 text-emerald-950'
                    : 'border-slate-100 bg-slate-50/50 text-slate-600'
                }`}
              >
                Под заказ (1.0 - 6.0 м)
              </button>
            </div>

            {config.boardLengthOption === 'custom' && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-medium text-slate-500">
                  <span>Длина доски:</span>
                  <span className="text-emerald-600 font-bold">{(config.customBoardLength / 1000).toFixed(1)} м</span>
                </div>
                <input
                  id="custom-board-length-slider"
                  type="range"
                  min="1000"
                  max="6000"
                  step="100"
                  value={config.customBoardLength}
                  onChange={(e) => handleInputChange('customBoardLength', parseInt(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-100 h-1 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block">Шаг нарезки составляет 100 мм.</span>
              </div>
            )}
          </div>

          {/* Safety Margin */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>Запас материала</span>
              <span className="text-emerald-600 font-bold">{config.wastageMargin}%</span>
            </div>
            <div className="pt-2">
              <input
                id="wastage-margin-slider"
                type="range"
                min="0"
                max="20"
                step="5"
                value={config.wastageMargin}
                onChange={(e) => handleInputChange('wastageMargin', parseInt(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-100 h-1 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                <span>0% (без запаса)</span>
                <span>10% (рекомендуемый)</span>
                <span>20%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Add-ons */}
        <div className="space-y-3 pt-4 border-t border-slate-50">
          <span className="text-xs font-semibold text-slate-600 block">Дополнительные комплектующие и услуги</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-slate-50 cursor-pointer select-none">
              <input
                id="include-corners-toggle"
                type="checkbox"
                checked={config.includeCorners}
                onChange={(e) => handleInputChange('includeCorners', e.target.checked)}
                className="w-4 h-4 text-emerald-500 border-slate-200 rounded focus:ring-emerald-400 accent-emerald-500"
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-800">Декоративный уголок (40×60)</span>
                <span className="text-[10px] text-slate-400">Для отделки торцов, 3.0 м</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-slate-50 cursor-pointer select-none">
              <input
                id="include-installation-toggle"
                type="checkbox"
                checked={config.includeInstallation}
                onChange={(e) => handleInputChange('includeInstallation', e.target.checked)}
                className="w-4 h-4 text-emerald-500 border-slate-200 rounded focus:ring-emerald-400 accent-emerald-500"
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-800">Монтажные работы</span>
                <span className="text-[10px] text-slate-400">Укладка силами специалистов</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Tech Specifications Badge */}
      <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-500">
          <span className="font-semibold text-slate-700 block">Параметры укладки по ТЗ:</span>
          <ul className="list-disc pl-4 space-y-1 text-[11px]">
            <li>Зазор между досками: 3 мм (задаётся кляймером автоматически).</li>
            <li>Рекомендуемый шаг лаг: 350 мм (в расчётах учтены двойные лаги на стыках досок).</li>
            <li>Зазор от стен: учтена деформационная компенсация 1 мм на 1 м длины настила.</li>
            <li>Раскладка: шахматный порядок со смещением стыков не менее 300 мм. Минимальный отрезок доски: 500 мм.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
