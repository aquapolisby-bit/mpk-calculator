/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DeckConfig, DeckShape, BoardType, BoardTexture, LayoutDirection } from './types';
import { calculateDeck, syncGridWithDimensions } from './utils';
import { DeckForm } from './components/DeckForm';
import { DeckVisualizer } from './components/DeckVisualizer';
import { PriceBreakdown } from './components/PriceBreakdown';
import { CommercialOffer } from './components/CommercialOffer';
import { Phone, CheckCircle, Flame, ShieldCheck, HeartHandshake, X } from 'lucide-react';

export default function App() {
  const [config, setConfig] = React.useState<DeckConfig>({
    shape: DeckShape.RECTANGLE,
    width: 4000, // 4 meters
    length: 6000, // 6 meters
    boardType: BoardType.ARTE,
    boardTexture: BoardTexture.VELVET,
    colorId: 'anthracite',
    direction: LayoutDirection.ALONG_LENGTH,
    lagStep: 350,
    boardLengthOption: 'stock',
    customBoardLength: 3000,
    wastageMargin: 10,
    includeCorners: true,
    includeInstallation: false,
  });

  const [showOffer, setShowOffer] = React.useState(false);

  // Close calculator logic (try iframe postMessage, try window.close)
  const handleClose = () => {
    try {
      window.parent.postMessage({ action: 'close_calculator' }, '*');
    } catch (e) {
      console.error('Failed to postMessage close_calculator:', e);
    }
    try {
      // Использование трюка с переопределением вкладки для её закрытия
      window.open('', '_self');
      window.close();
    } catch (e) {
      console.error('Failed to call window.close():', e);
    }
  };

  // Sync custom drawing grid with selected shape and dimensions
  React.useEffect(() => {
    const CELL_SIZE = 500;
    const targetRows = Math.round(config.width / CELL_SIZE);
    const targetCols = Math.round(config.length / CELL_SIZE);

    if (
      !config.customGrid ||
      config.gridRows !== targetRows ||
      config.gridCols !== targetCols ||
      config.cellSize !== CELL_SIZE
    ) {
      const newGrid = syncGridWithDimensions(
        config.customGrid,
        targetRows,
        targetCols,
        config.shape
      );

      setConfig((prev) => ({
        ...prev,
        customGrid: newGrid,
        gridRows: targetRows,
        gridCols: targetCols,
        cellSize: CELL_SIZE,
      }));
    }
  }, [config.width, config.length, config.shape]);

  // Compute results reactively
  const results = React.useMemo(() => {
    return calculateDeck(config);
  }, [config]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-brand selection:text-white">
      {/* 1. Header (мпк.бел Brand representation) */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <a
            href="https://xn--j1adj.xn--90ais/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group hover:opacity-95 transition-opacity"
            title="Перейти на сайт мпк.бел"
          >
            <div className="bg-brand text-white font-extrabold text-sm sm:text-base px-3 py-1.5 rounded-xl tracking-wider shadow-sm shadow-brand/20 group-hover:scale-[1.03] transition-transform">
              МПК
            </div>
            <div>
              <div className="font-extrabold text-base sm:text-lg tracking-tight leading-none group-hover:text-brand transition-colors">мпк.бел</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Террасная доска и комплектующие</div>
            </div>
          </a>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <div className="hidden lg:flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand" />
              <span>УНП 693157911</span>
            </div>
            
            <a
              href="tel:+375296085599"
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-2 rounded-xl border border-slate-700/80 transition-all text-[11px]"
            >
              <Phone className="w-3.5 h-3.5 text-brand" />
              <span>+375 (29) 608-55-99</span>
            </a>

            <a
              href="tel:+375296087229"
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-2 rounded-xl border border-slate-700/80 transition-all text-[11px]"
            >
              <Phone className="w-3.5 h-3.5 text-brand" />
              <span>+375 (29) 608-72-29</span>
            </a>

            <button
              onClick={handleClose}
              id="close-calculator-btn"
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-2 rounded-xl border border-red-500/10 shadow-sm shadow-red-600/10 transition-all text-[11px] cursor-pointer ml-1 sm:ml-2"
              title="Закрыть калькулятор"
            >
              <X className="w-3.5 h-3.5" />
              <span>Закрыть</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero banner / Title */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        <div className="space-y-2 text-center max-w-2xl mx-auto print:hidden">
          <span className="text-[11px] uppercase font-bold tracking-widest text-brand-dark bg-brand-light px-2.5 py-1 rounded-full border border-brand/20">
            Интерактивный калькулятор МПК
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Расчёт террасной доски и комплектующих
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Профессиональный 2D калькулятор раскладки по ГОСТу с учётом температурных зазоров, двойных лаг на стыках и минимизации отходов (смещение шахматки ≥ 300 мм).
          </p>
        </div>

        {/* 3. Responsive 2-Column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Form Inputs (colspan 5 on desktop) */}
          <section className="lg:col-span-5 space-y-6 print:hidden">
            <DeckForm config={config} onChange={setConfig} />
          </section>

          {/* Right Column: Visualizer & Breakdown (colspan 7 on desktop) */}
          <section className="lg:col-span-7 space-y-6">
            <DeckVisualizer config={config} results={results} />
            <PriceBreakdown
              config={config}
              results={results}
              onPrint={() => setShowOffer(true)}
              onSendRequest={() => setShowOffer(true)}
            />
          </section>
        </div>

        {/* Features badges */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100 print:hidden">
          <div className="bg-white rounded-xl p-4 border border-slate-100 flex gap-3 items-start">
            <CheckCircle className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs">
              <span className="font-bold text-slate-800 block">Российское производство</span>
              <span className="text-slate-500">Высококачественный МПК напрямую с завода РФ.</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-100 flex gap-3 items-start">
            <Flame className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs">
              <span className="font-bold text-slate-800 block">Экологичные материалы</span>
              <span className="text-slate-500">Стойкость к ультрафиолету, влаге и перепадам температур.</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-100 flex gap-3 items-start">
            <HeartHandshake className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs">
              <span className="font-bold text-slate-800 block">Помощь и консультация</span>
              <span className="text-slate-500">Бесплатный расчет от инженеров по вашим чертежам.</span>
            </div>
          </div>
        </section>
      </main>

      {/* 4. Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-bold text-white text-sm">ООО «Акваполис»</div>
            <div>УНП 693157911 • Республика Беларусь, аг. Ждановичи, ул. Цветочная, д.25</div>
            <div className="text-[10px] text-slate-500 mt-1">© 2026 мпк.бел. Все права защищены. Калькулятор террасной доски.</div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-center md:text-right">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Приём звонков</span>
              <div className="flex flex-col gap-0.5">
                <a href="tel:+375296085599" className="text-white hover:text-brand font-bold text-sm transition-colors">+375 (29) 608-55-99</a>
                <a href="tel:+375296087229" className="text-white hover:text-brand font-bold text-sm transition-colors">+375 (29) 608-72-29</a>
              </div>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Режим работы</span>
              <span className="text-slate-300">Пн-Пт: с 9:00 до 17:00</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 5. Commercial Proposal Modal overlay */}
      {showOffer && (
        <CommercialOffer
          config={config}
          results={results}
          onClose={() => setShowOffer(false)}
        />
      )}
    </div>
  );
}
