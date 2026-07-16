/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum BoardType {
  ARTE = 'ARTE',
  STRADA = 'STRADA',
  FORTE = 'FORTE',
  FORTE_MAX = 'FORTE_MAX',
}

export enum BoardTexture {
  VELVET = 'VELVET',
  GRINDING_EMBOSSING = 'GRINDING_EMBOSSING',
  EMBOSSING_3D = 'EMBOSSING_3D',
}

export enum ColorGroup {
  STANDARD = 'STANDARD', // антрацит, графит, шоколад, какао, терракот
  PREMIUM = 'PREMIUM', // серый, песочный, бронза, бежевый, жемчуг
}

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  group: ColorGroup;
}

export interface BoardSpecification {
  type: BoardType;
  name: string;
  thickness: number; // mm
  width: number; // mm
  weightPerMeter: number; // kg/m.p.
  isSolid: boolean;
  prices: {
    [key in ColorGroup]: {
      [key in BoardTexture]: {
        meter: number; // BYN per running meter
        sqm: number;  // BYN per sq meter
      };
    };
  };
}

export enum DeckShape {
  RECTANGLE = 'RECTANGLE',
  L_SHAPE = 'L_SHAPE',
  CUTOUT = 'CUTOUT',
  CUSTOM = 'CUSTOM',
}

export enum LayoutDirection {
  ALONG_LENGTH = 'ALONG_LENGTH', // Parallel to length, lags are parallel to width
  ALONG_WIDTH = 'ALONG_WIDTH',   // Parallel to width, lags are parallel to length
}

export interface DeckConfig {
  shape: DeckShape;
  width: number; // mm (overall width)
  length: number; // mm (overall length)
  
  // For L_shape
  cutoutWidth?: number; // mm (width of the missing part)
  cutoutLength?: number; // mm (length of the missing part)

  boardType: BoardType;
  boardTexture: BoardTexture;
  colorId: string;
  
  direction: LayoutDirection;
  lagStep: number; // mm (default 350, max 350)
  boardLengthOption: 'stock' | 'custom';
  customBoardLength: number; // mm (1000 - 6000, step 100)
  
  wastageMargin: number; // % (default 10)
  includeCorners: boolean; // Decorative corners
  includeInstallation: boolean; // Add-on installation service cost

  // Custom Grid drawing
  customGrid?: boolean[][];
  gridRows?: number;
  gridCols?: number;
  cellSize?: number;
}

export interface BoardPiece {
  id: string;
  rowIdx: number;
  startX: number; // mm from left/start
  length: number; // mm
  isWaste: boolean;
  isReused: boolean;
  originalBoardId?: string; // which board this was cut from
}

export interface RowLayout {
  rowIdx: number;
  yPosition: number; // mm
  pieces: BoardPiece[];
}

export interface LagLayout {
  id: string;
  position: number; // mm (along the boards direction)
  length: number; // mm (across the boards)
  isDouble: boolean; // double lag at board joints
  startCoord?: number; // mm from start (useful for custom shapes)
}

export interface CalculationResults {
  deckArea: number; // sqm
  perimeter: number; // meters (for corners)
  
  // Gaps calculated
  wallGap: number; // mm
  endGap: number; // mm
  
  // Material needs
  totalRunningMetersNeeded: number; // m.p. before margin
  totalRunningMetersWithMargin: number; // m.p. with margin
  
  totalStandardBoardsNeeded: number; // count of whole boards (3m or custom size)
  totalStandardBoardsWithMargin: number;
  
  lagsRunningMeters: number; // m.p.
  lagsCount: number; // pieces of 3000 mm lags (each lag is 3000 mm, weight 1.75 kg/m)
  
  standardClipsCount: number; // pcs (рядовая клипса)
  starterClipsCount: number; // pcs (стартовая клипса)
  cornersCount: number; // pcs of 3000mm corners
  
  // Detailed Layout for visualizer
  rows: RowLayout[];
  lags: LagLayout[];
  
  // Waste metrics
  totalPiecesUsed: number;
  wastePiecesCount: number;
  wasteLength: number; // mm
  actualWastePercentage: number; // calculated from layouts
  
  // Financial break downs (BYN)
  boardUnitPrice: number; // BYN/m.p.
  boardTotalPrice: number;
  lagsTotalPrice: number;
  clipsTotalPrice: number;
  cornersTotalPrice: number;
  installationTotalPrice: number;
  totalSum: number;
  
  // Weight breakdown
  boardTotalWeight: number; // kg
  lagsTotalWeight: number; // kg
  totalWeight: number; // kg
}
