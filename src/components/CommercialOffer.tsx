/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CalculationResults, DeckConfig } from '../types';
import { BOARD_SPECS, COLORS } from '../utils';
import { Printer, Mail, Phone, MapPin, Globe, X } from 'lucide-react';

interface CommercialOfferProps {
  config: DeckConfig;
  results: CalculationResults;
  onClose: () => void;
}

export const CommercialOffer: React.FC<CommercialOfferProps> = ({ config, results, onClose }) => {
  const spec = BOARD_SPECS[config.boardType];
  const color = COLORS.find((c) => c.id === config.colorId) || COLORS[0];

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (val: number) => {
    return `${val.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} руб.`;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto print:static print:bg-white print:p-0 print:overflow-visible">
      <div className="bg-white rounded-2xl w-full max-w-4xl p-6 sm:p-8 space-y-6 shadow-xl relative max-h-[90vh] overflow-y-auto print:shadow-none print:max-h-full print:p-0 print:rounded-none">
        
        {/* Close Button & Print Action Bar (hidden in print) */}
        <div className="flex justify-between items-center print:hidden border-b border-slate-100 pb-4">
          <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand"></span>
            Официальное коммерческое предложение
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="print-action-btn"
              onClick={handlePrint}
              className="px-4 py-2 bg-brand text-white text-xs font-semibold rounded-lg hover:bg-brand-hover flex items-center gap-2 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              Распечатать / Сохранить в PDF
            </button>
            <button
              type="button"
              id="close-offer-btn"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE HEADER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start border-b border-slate-200 pb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 text-white px-4 py-2 rounded-xl font-extrabold text-lg tracking-wider">
                МПК
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">ООО «Акваполис»</h1>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                  Минерально-полимерный композит
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Прямой поставщик высококачественного МПК и комплектующих на территории Республики Беларусь.
            </p>
          </div>

          <div className="text-xs text-slate-500 space-y-2 md:text-right md:justify-self-end">
            <div className="flex items-center md:justify-end gap-2 text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-brand" />
              <span>аг. Ждановичи, ул. Цветочная, д.25</span>
            </div>
            <div className="flex items-center md:justify-end gap-2 text-slate-700">
              <Phone className="w-3.5 h-3.5 text-brand" />
              <span className="font-semibold">+375 (29) 608-55-99, +375 (29) 608-72-29</span>
            </div>
            <div className="flex items-center md:justify-end gap-2 text-slate-700">
              <Mail className="w-3.5 h-3.5 text-brand" />
              <span>info@мпк.бел</span>
            </div>
            <div className="flex items-center md:justify-end gap-2 text-slate-700">
              <Globe className="w-3.5 h-3.5 text-brand" />
              <span className="font-semibold text-brand-dark">https://мпк.бел</span>
            </div>
            <div className="text-[10px] text-slate-400 pt-1">
              УНП 693157911 • Действительно до: 31 декабря 2026 г.
            </div>
          </div>
        </div>

        {/* PROPOSAL INFO */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col sm:flex-row justify-between gap-4 text-xs">
          <div>
            <span className="text-slate-400 block uppercase font-bold tracking-wider text-[9px] mb-1">
              Расчёт подготовлен для
            </span>
            <span className="font-semibold text-slate-800 text-sm">
              Посетителя сайта мпк.бел
            </span>
          </div>
          <div>
            <span className="text-slate-400 block uppercase font-bold tracking-wider text-[9px] mb-1">
              Параметры объекта
            </span>
            <span className="font-medium text-slate-700">
              Терраса прямоугольная • {results.deckArea.toFixed(2)} м² ({(config.width / 1000).toFixed(2)} × {(config.length / 1000).toFixed(2)} м)
            </span>
          </div>
          <div className="sm:text-right">
            <span className="text-slate-400 block uppercase font-bold tracking-wider text-[9px] mb-1">
              Дата предложения
            </span>
            <span className="font-semibold text-slate-800">
              {new Date().toLocaleDateString('ru-RU')} г.
            </span>
          </div>
        </div>

        {/* SPECIFICATION TABLE */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 border-l-2 border-brand pl-2">
            Спецификация материалов и комплектующих
          </h2>
          
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-600 tracking-wider">
                  <th className="p-3 pl-4">Материал</th>
                  <th className="p-3">Характеристики</th>
                  <th className="p-3 text-center">Кол-во</th>
                  <th className="p-3 text-right pr-4">Сумма</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {/* Board */}
                <tr>
                  <td className="p-3 pl-4 font-semibold text-slate-900">
                    Террасная доска {spec.name}
                  </td>
                  <td className="p-3 text-slate-500 text-[11px]">
                    Цвет: {color.name}, Текстура: {config.boardTexture === 'VELVET' ? 'Вельвет' : config.boardTexture === 'GRINDING_EMBOSSING' ? 'Шлифовка + Тиснение' : '3D Тиснение'}. Длина: {config.boardLengthOption === 'stock' ? '3.0 м (со склада)' : `${(config.customBoardLength / 1000).toFixed(1)} м (под заказ)`}
                  </td>
                  <td className="p-3 text-center font-mono font-medium">
                    {results.totalStandardBoardsWithMargin} шт. ({results.totalRunningMetersWithMargin.toFixed(1)} м.п.)
                  </td>
                  <td className="p-3 text-right pr-4 font-bold font-mono text-slate-900">
                    {formatCurrency(results.boardTotalPrice)}
                  </td>
                </tr>

                {/* Lags */}
                <tr>
                  <td className="p-3 pl-4 font-semibold text-slate-900">
                    Лага монтажная (МПК)
                  </td>
                  <td className="p-3 text-slate-500 text-[11px]">
                    35×60 мм. Спец цена. Повышенная прочность. Поставляется хлыстами по 3.0 м.
                  </td>
                  <td className="p-3 text-center font-mono font-medium">
                    {results.lagsCount} шт. ({(results.lagsCount * 3).toFixed(1)} м.п.)
                  </td>
                  <td className="p-3 text-right pr-4 font-bold font-mono text-slate-900">
                    {formatCurrency(results.lagsTotalPrice)}
                  </td>
                </tr>

                {/* Clips */}
                <tr>
                  <td className="p-3 pl-4 font-semibold text-slate-900">
                    Нержавеющий крепёж
                  </td>
                  <td className="p-3 text-slate-500 text-[11px]">
                    Клипса стартовая/рядовая (нерж. сталь). Задает зазор 3 мм.
                  </td>
                  <td className="p-3 text-center font-mono font-medium">
                    {results.standardClipsCount + results.starterClipsCount} шт.
                  </td>
                  <td className="p-3 text-right pr-4 font-bold font-mono text-slate-900">
                    {formatCurrency(results.clipsTotalPrice)}
                  </td>
                </tr>

                {/* Corner */}
                {config.includeCorners && (
                  <tr>
                    <td className="p-3 pl-4 font-semibold text-slate-900">
                      Уголок декоративный
                    </td>
                    <td className="p-3 text-slate-500 text-[11px]">
                      40×60 мм (внутр. размер). Из МПК в цвет доски. Длина хлыста: 3.0 м.
                    </td>
                    <td className="p-3 text-center font-mono font-medium">
                      {results.cornersCount} шт.
                    </td>
                    <td className="p-3 text-right pr-4 font-bold font-mono text-slate-900">
                      {formatCurrency(results.cornersTotalPrice)}
                    </td>
                  </tr>
                )}

                {/* Installation */}
                {config.includeInstallation && (
                  <tr>
                    <td className="p-3 pl-4 font-semibold text-slate-900">
                      Монтажные работы
                    </td>
                    <td className="p-3 text-slate-500 text-[11px]">
                      Установка «под ключ» сертифицированной бригадой с гарантией 12 месяцев.
                    </td>
                    <td className="p-3 text-center font-mono font-medium">
                      {results.deckArea.toFixed(2)} м²
                    </td>
                    <td className="p-3 text-right pr-4 font-bold font-mono text-slate-900">
                      {formatCurrency(results.installationTotalPrice)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* TOTAL SUMMARY BLOCK */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="text-xs text-slate-500 space-y-1.5 max-w-md">
            <span className="font-bold text-slate-700 block">Техническая информация по укладке:</span>
            <ul className="list-disc pl-4 space-y-1 text-[11px]">
              <li>Расстояние между осями лаг должно составлять не более 350 мм.</li>
              <li>Свес доски за край опорной лаги не должен превышать 30 мм.</li>
              <li>В местах торцевого стыка досок укладываются две параллельные лаги (зазор ≤ 60 мм).</li>
              <li>Температурный компенсационный зазор от стен рассчитан по ТЗ: {results.wallGap} мм.</li>
            </ul>
          </div>

          <div className="w-full md:w-auto space-y-2 text-right md:justify-self-end">
            <div className="text-xs text-slate-500">
              Вес груза для доставки: <span className="font-bold text-slate-800">{results.totalWeight.toLocaleString()} кг</span>
            </div>
            <div className="text-lg font-bold text-slate-950">
              ИТОГО К ОПЛАТЕ: <span className="text-brand-dark font-extrabold font-mono text-xl">{formatCurrency(results.totalSum)}</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              *Цены действительны при заказе через сайт мпк.бел
            </div>
          </div>
        </div>

        {/* PRINTABLE FOOTER STAMP */}
        <div className="hidden print:flex justify-between items-end border-t border-slate-200 pt-8 mt-12 text-[10px] text-slate-400">
          <div>
            <div>Менеджер расчёта: Автоматический алгоритм калькулятора мпк.бел</div>
            <div>ООО «Акваполис» • Республика Беларусь, УНП 693157911</div>
          </div>
          <div className="text-right">
            <div>Подпись: ______________________</div>
            <div className="pt-1">М.П.</div>
          </div>
        </div>

      </div>
    </div>
  );
};
