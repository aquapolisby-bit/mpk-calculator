/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CalculationResults, DeckConfig } from '../types';
import { BOARD_SPECS, COLORS, ACCESSORY_PRICES } from '../utils';
import {
  FileText,
  DollarSign,
  Scale,
  Percent,
  Compass,
  ArrowRight,
  ClipboardList,
} from 'lucide-react';

interface PriceBreakdownProps {
  config: DeckConfig;
  results: CalculationResults;
  onPrint: () => void;
  onSendRequest: () => void;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  config,
  results,
  onPrint,
  onSendRequest,
}) => {
  const spec = BOARD_SPECS[config.boardType];
  const color = COLORS.find((c) => c.id === config.colorId) || COLORS[0];

  const formatCurrency = (val: number) => {
    return `${val.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} руб.`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6" id="price-breakdown-container">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-brand" />
          Спецификация и Стоимость
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Расчёт составлен на основе актуального прайс-листа компании ООО «Акваполис» для сайта мпк.бел.
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
            Площадь настила
          </span>
          <span className="text-xl font-bold text-slate-800 font-mono">
            {results.deckArea.toFixed(2)} м²
          </span>
        </div>

        <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
            Общий вес заказа
          </span>
          <span className="text-xl font-bold text-slate-800 font-mono flex items-center gap-1">
            <Scale className="w-4 h-4 text-slate-400" />
            {results.totalWeight.toLocaleString()} кг
          </span>
        </div>

        <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
            Реальный отход
          </span>
          <span className="text-xl font-bold text-slate-800 font-mono flex items-center gap-1">
            <Percent className="w-4 h-4 text-slate-400" />
            {results.actualWastePercentage}%
          </span>
        </div>

        <div className="bg-brand-light rounded-xl p-4 border border-brand/20">
          <span className="text-[10px] uppercase font-bold tracking-wider text-brand-dark block mb-1">
            Итоговая стоимость
          </span>
          <span className="text-xl font-extrabold text-brand-dark font-mono">
            {formatCurrency(results.totalSum)}
          </span>
        </div>
      </div>

      {/* Itemized list of materials */}
      <div className="border border-slate-100 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
              <th className="p-3 pl-4">Наименование товара / услуги</th>
              <th className="p-3">Кол-во</th>
              <th className="p-3">Цена за ед.</th>
              <th className="p-3 text-right pr-4">Сумма</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* 1. Terrace Board */}
            <tr>
              <td className="p-3 pl-4 space-y-0.5">
                <span className="font-semibold text-slate-800 block">
                  Террасная доска {spec.name}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Цвет: {color.name}, Текстура: {config.boardTexture === 'VELVET' ? 'Вельвет' : config.boardTexture === 'GRINDING_EMBOSSING' ? 'Шлифовка + Тиснение' : '3D Тиснение'}, Толщина: {spec.thickness} мм, Длина: {config.boardLengthOption === 'stock' ? '3.0 м (склад)' : `${(config.customBoardLength / 1000).toFixed(1)} м (под заказ)`}
                </span>
              </td>
              <td className="p-3 font-mono text-slate-600">
                {results.totalStandardBoardsWithMargin} шт.
                <span className="text-[10px] text-slate-400 block">({results.totalRunningMetersWithMargin.toFixed(1)} м.п.)</span>
              </td>
              <td className="p-3 font-mono text-slate-600">
                {formatCurrency(results.boardUnitPrice)} / м.п.
              </td>
              <td className="p-3 text-right pr-4 font-bold text-slate-800 font-mono">
                {formatCurrency(results.boardTotalPrice)}
              </td>
            </tr>

            {/* 2. Lags */}
            <tr>
              <td className="p-3 pl-4 space-y-0.5">
                <span className="font-semibold text-slate-800 block">
                  Лага монтажная из МПК (35×60 мм)
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Шаг укладки {config.lagStep} мм. Длина хлыста: 3.0 м. Вес: 1.75 кг/м.п.
                </span>
              </td>
              <td className="p-3 font-mono text-slate-600">
                {results.lagsCount} шт.
                <span className="text-[10px] text-slate-400 block">({(results.lagsCount * 3).toFixed(1)} м.п.)</span>
              </td>
              <td className="p-3 font-mono text-slate-600">
                {formatCurrency(ACCESSORY_PRICES.LAG_METER)} / м.п.
              </td>
              <td className="p-3 text-right pr-4 font-bold text-slate-800 font-mono">
                {formatCurrency(results.lagsTotalPrice)}
              </td>
            </tr>

            {/* 3. Fasteners (Clips) */}
            <tr>
              <td className="p-3 pl-4 space-y-0.5">
                <span className="font-semibold text-slate-800 block">
                  Крепежная клипса (нержавеющая сталь)
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Рядовые: {results.standardClipsCount} шт. Стартовые: {results.starterClipsCount} шт.
                </span>
              </td>
              <td className="p-3 font-mono text-slate-600">
                {results.standardClipsCount + results.starterClipsCount} шт.
              </td>
              <td className="p-3 font-mono text-slate-600">
                {formatCurrency(ACCESSORY_PRICES.CLIP_EACH)} / шт.
              </td>
              <td className="p-3 text-right pr-4 font-bold text-slate-800 font-mono">
                {formatCurrency(results.clipsTotalPrice)}
              </td>
            </tr>

            {/* 4. Optional Corner */}
            {config.includeCorners && (
              <tr>
                <td className="p-3 pl-4 space-y-0.5">
                  <span className="font-semibold text-slate-800 block">
                    Уголок декоративный из МПК (40×60 мм)
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Для закрытия торцов настила по периметру ({results.perimeter.toFixed(1)} м). Длина: 3.0 м.
                  </span>
                </td>
                <td className="p-3 font-mono text-slate-600">
                  {results.cornersCount} шт.
                </td>
                <td className="p-3 font-mono text-slate-600">
                  {formatCurrency(ACCESSORY_PRICES.CORNER_PIECE)} / шт.
                </td>
                <td className="p-3 text-right pr-4 font-bold text-slate-800 font-mono">
                  {formatCurrency(results.cornersTotalPrice)}
                </td>
              </tr>
            )}

            {/* 5. Optional Installation */}
            {config.includeInstallation && (
              <tr>
                <td className="p-3 pl-4 space-y-0.5">
                  <span className="font-semibold text-slate-800 block">
                    Профессиональный монтаж
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Подготовка основания, укладка лаг, крепление доски с соблюдением деформационных швов.
                  </span>
                </td>
                <td className="p-3 font-mono text-slate-600">
                  {results.deckArea.toFixed(2)} м²
                </td>
                <td className="p-3 font-mono text-slate-600">
                  {formatCurrency(ACCESSORY_PRICES.INSTALLATION_SQM)} / м²
                </td>
                <td className="p-3 text-right pr-4 font-bold text-slate-800 font-mono">
                  {formatCurrency(results.installationTotalPrice)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          id="print-offer-btn"
          onClick={onPrint}
          className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
        >
          <FileText className="w-4 h-4 text-slate-500" />
          Показать КП для печати
        </button>

        <button
          type="button"
          id="send-request-btn"
          onClick={onSendRequest}
          className="flex-1 px-4 py-3 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm shadow-brand/10 transition-all"
        >
          Получить скидку и вызвать замерщика
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
