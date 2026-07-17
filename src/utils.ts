/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BoardType,
  BoardTexture,
  ColorGroup,
  ProductColor,
  BoardSpecification,
  DeckConfig,
  CalculationResults,
  RowLayout,
  BoardPiece,
  LagLayout,
  LayoutDirection,
  DeckShape,
} from './types';

export const COLORS: ProductColor[] = [
  // Standard Group
  { id: 'anthracite', name: 'Антрацит', hex: '#2B2D2F', group: ColorGroup.STANDARD },
  { id: 'graphite', name: 'Графит', hex: '#4B4E53', group: ColorGroup.STANDARD },
  { id: 'chocolate', name: 'Шоколад', hex: '#432E27', group: ColorGroup.STANDARD },
  { id: 'cacao', name: 'Какао', hex: '#7E5C4E', group: ColorGroup.STANDARD },
  { id: 'terracotta', name: 'Терракот', hex: '#9E472A', group: ColorGroup.STANDARD },
  // Premium Group
  { id: 'grey', name: 'Серый', hex: '#8A8D8F', group: ColorGroup.PREMIUM },
  { id: 'sandy', name: 'Песочный', hex: '#CDB08E', group: ColorGroup.PREMIUM },
  { id: 'bronze', name: 'Бронза', hex: '#806653', group: ColorGroup.PREMIUM },
  { id: 'beige', name: 'Бежевый', hex: '#D6C0B0', group: ColorGroup.PREMIUM },
  { id: 'pearl', name: 'Жемчуг', hex: '#E9E5DE', group: ColorGroup.PREMIUM },
];

export const BOARD_SPECS: { [key in BoardType]: BoardSpecification } = {
  [BoardType.ARTE]: {
    type: BoardType.ARTE,
    name: 'ARTE (пустотелая)',
    thickness: 22,
    width: 140,
    weightPerMeter: 2.7,
    isSolid: false,
    prices: {
      [ColorGroup.STANDARD]: {
        [BoardTexture.VELVET]: { meter: 23.40, sqm: 163.8 },
        [BoardTexture.GRINDING_EMBOSSING]: { meter: 24.60, sqm: 172.2 },
        [BoardTexture.EMBOSSING_3D]: { meter: 26.80, sqm: 187.6 },
      },
      [ColorGroup.PREMIUM]: {
        [BoardTexture.VELVET]: { meter: 27.60, sqm: 193.2 },
        [BoardTexture.GRINDING_EMBOSSING]: { meter: 28.90, sqm: 202.3 },
        [BoardTexture.EMBOSSING_3D]: { meter: 31.70, sqm: 221.9 },
      },
    },
  },
  [BoardType.STRADA]: {
    type: BoardType.STRADA,
    name: 'STRADA (пустотелая)',
    thickness: 25,
    width: 140,
    weightPerMeter: 3.0,
    isSolid: false,
    prices: {
      [ColorGroup.STANDARD]: {
        [BoardTexture.VELVET]: { meter: 25.20, sqm: 176.4 },
        [BoardTexture.GRINDING_EMBOSSING]: { meter: 26.50, sqm: 185.5 },
        [BoardTexture.EMBOSSING_3D]: { meter: 28.90, sqm: 202.3 },
      },
      [ColorGroup.PREMIUM]: {
        [BoardTexture.VELVET]: { meter: 29.50, sqm: 206.5 },
        [BoardTexture.GRINDING_EMBOSSING]: { meter: 30.80, sqm: 215.6 },
        [BoardTexture.EMBOSSING_3D]: { meter: 33.80, sqm: 236.6 },
      },
    },
  },
  [BoardType.FORTE]: {
    type: BoardType.FORTE,
    name: 'FORTE (пустотелая)',
    thickness: 22,
    width: 160,
    weightPerMeter: 4.0,
    isSolid: false,
    prices: {
      [ColorGroup.STANDARD]: {
        [BoardTexture.VELVET]: { meter: 34.50, sqm: 211.7 },
        [BoardTexture.GRINDING_EMBOSSING]: { meter: 35.70, sqm: 219.0 },
        [BoardTexture.EMBOSSING_3D]: { meter: 39.50, sqm: 242.3 },
      },
      [ColorGroup.PREMIUM]: {
        [BoardTexture.VELVET]: { meter: 39.40, sqm: 241.7 },
        [BoardTexture.GRINDING_EMBOSSING]: { meter: 40.60, sqm: 249.1 },
        [BoardTexture.EMBOSSING_3D]: { meter: 45.00, sqm: 276.1 },
      },
    },
  },
  [BoardType.FORTE_MAX]: {
    type: BoardType.FORTE_MAX,
    name: 'FORTE MAX (полнотелая)',
    thickness: 22,
    width: 160,
    weightPerMeter: 6.0,
    isSolid: true,
    prices: {
      [ColorGroup.STANDARD]: {
        [BoardTexture.VELVET]: { meter: 51.00, sqm: 312.9 },
        [BoardTexture.GRINDING_EMBOSSING]: { meter: 52.30, sqm: 320.9 },
        [BoardTexture.EMBOSSING_3D]: { meter: 58.50, sqm: 358.9 },
      },
      [ColorGroup.PREMIUM]: {
        [BoardTexture.VELVET]: { meter: 58.70, sqm: 360.1 },
        [BoardTexture.GRINDING_EMBOSSING]: { meter: 59.90, sqm: 367.5 },
        [BoardTexture.EMBOSSING_3D]: { meter: 67.20, sqm: 412.3 },
      },
    },
  },
};

// Unit Prices for accessories
export const ACCESSORY_PRICES = {
  LAG_METER: 11.50, // BYN per running meter of lag (35x60 mm)
  CLIP_EACH: 1.10,  // BYN per clip (stainless steel starter/row)
  CORNER_PIECE: 14.80, // BYN per 3000 mm decorative corner
  INSTALLATION_SQM: 35.00, // BYN per sqm for basic installation service (optional)
};

export function getBoardSpec(type: BoardType): BoardSpecification {
  return BOARD_SPECS[type];
}

export function calculateDeck(config: DeckConfig): CalculationResults {
  const {
    shape,
    width,
    length,
    cutoutWidth,
    cutoutLength,
    boardType,
    boardTexture,
    colorId,
    direction,
    lagStep,
    boardLengthOption,
    customBoardLength,
    wastageMargin,
    includeCorners,
    includeInstallation,
    customGrid,
    cellSize,
  } = config;

  const spec = getBoardSpec(boardType);
  const color = COLORS.find((c) => c.id === colorId) || COLORS[0];
  const colorGroup = color.group;
  const boardWidth = spec.width; // mm
  const boardGap = 3; // mm (from кляймер)

  // 1. Determine layout dimensions
  // Length is along the boards, Width is across the boards.
  const boardDirectionSpan = direction === LayoutDirection.ALONG_LENGTH ? length : width;
  const acrossDirectionSpan = direction === LayoutDirection.ALONG_LENGTH ? width : length;

  // 2. Gaps calculation
  // Wall gap: 1 mm per 1 meter of span + 1 mm
  const wallGap = Math.ceil(boardDirectionSpan / 1000) * 1 + 1; // mm
  const wallGapAcross = Math.ceil(acrossDirectionSpan / 1000) * 1 + 1; // mm

  // Net spans after subtracting wall gaps from both sides
  const netBoardDirectionSpan = Math.max(100, boardDirectionSpan - 2 * wallGap);
  const netAcrossSpan = Math.max(100, acrossDirectionSpan - 2 * wallGapAcross);

  // 3. Row count calculation
  // Each row is boardWidth + boardGap.
  const rowCount = Math.ceil(netAcrossSpan / (boardWidth + boardGap));

  // 4. Board length configuration
  const baseBoardLength = boardLengthOption === 'stock' ? 3000 : customBoardLength;

  // Helpers to calculate active segments for any given row or coordinate
  const getActiveSegments = (y: number): { start: number; end: number }[] => {
    if (shape === DeckShape.RECTANGLE) {
      return [{ start: 0, end: boardDirectionSpan }];
    }
    
    const cWidth = cutoutWidth || 1500;
    const cLength = cutoutLength || 1500;
    
    if (shape === DeckShape.L_SHAPE) {
      if (direction === LayoutDirection.ALONG_LENGTH) {
        if (y >= width - cWidth) {
          return [{ start: 0, end: Math.max(0, length - cLength) }];
        } else {
          return [{ start: 0, end: length }];
        }
      } else {
        if (y >= length - cLength) {
          return [{ start: 0, end: Math.max(0, width - cWidth) }];
        } else {
          return [{ start: 0, end: width }];
        }
      }
    }
    
    if (shape === DeckShape.CUTOUT) {
      if (direction === LayoutDirection.ALONG_LENGTH) {
        if (y < cWidth) {
          return [{ start: 0, end: Math.max(0, length - cLength) }];
        } else {
          return [{ start: 0, end: length }];
        }
      } else {
        if (y < cLength) {
          return [{ start: 0, end: Math.max(0, width - cWidth) }];
        } else {
          return [{ start: 0, end: width }];
        }
      }
    }
    
    if (shape === DeckShape.CUSTOM && customGrid) {
      const CELL_SIZE = cellSize || 500;
      const activeIntervals: { start: number; end: number }[] = [];
      
      if (direction === LayoutDirection.ALONG_LENGTH) {
        const gRow = Math.min(customGrid.length - 1, Math.max(0, Math.floor(y / CELL_SIZE)));
        const cols = customGrid[gRow] || [];
        
        let inSegment = false;
        let segmentStart = 0;
        
        for (let colIdx = 0; colIdx < cols.length; colIdx++) {
          const isActive = cols[colIdx];
          if (isActive && !inSegment) {
            inSegment = true;
            segmentStart = colIdx * CELL_SIZE;
          } else if (!isActive && inSegment) {
            inSegment = false;
            activeIntervals.push({ start: segmentStart, end: colIdx * CELL_SIZE });
          }
        }
        if (inSegment) {
          activeIntervals.push({ start: segmentStart, end: cols.length * CELL_SIZE });
        }
      } else {
        const numCols = customGrid[0]?.length || 0;
        const gCol = Math.min(numCols - 1, Math.max(0, Math.floor(y / CELL_SIZE)));
        
        let inSegment = false;
        let segmentStart = 0;
        
        for (let rowIdx = 0; rowIdx < customGrid.length; rowIdx++) {
          const isActive = customGrid[rowIdx]?.[gCol];
          if (isActive && !inSegment) {
            inSegment = true;
            segmentStart = rowIdx * CELL_SIZE;
          } else if (!isActive && inSegment) {
            inSegment = false;
            activeIntervals.push({ start: segmentStart, end: rowIdx * CELL_SIZE });
          }
        }
        if (inSegment) {
          activeIntervals.push({ start: segmentStart, end: customGrid.length * CELL_SIZE });
        }
      }
      return activeIntervals;
    }
    
    return [{ start: 0, end: boardDirectionSpan }];
  };

  const getActiveLagSegments = (x: number): { start: number; end: number }[] => {
    if (shape === DeckShape.RECTANGLE) {
      return [{ start: 0, end: acrossDirectionSpan }];
    }
    
    const cWidth = cutoutWidth || 1500;
    const cLength = cutoutLength || 1500;
    
    if (shape === DeckShape.L_SHAPE) {
      if (direction === LayoutDirection.ALONG_LENGTH) {
        if (x >= length - cLength) {
          return [{ start: 0, end: Math.max(0, width - cWidth) }];
        } else {
          return [{ start: 0, end: width }];
        }
      } else {
        if (x >= width - cWidth) {
          return [{ start: 0, end: Math.max(0, length - cLength) }];
        } else {
          return [{ start: 0, end: length }];
        }
      }
    }
    
    if (shape === DeckShape.CUTOUT) {
      if (direction === LayoutDirection.ALONG_LENGTH) {
        if (x >= length - cLength) {
          return [{ start: cWidth, end: width }];
        } else {
          return [{ start: 0, end: width }];
        }
      } else {
        if (x >= width - cWidth) {
          return [{ start: cLength, end: length }];
        } else {
          return [{ start: 0, end: length }];
        }
      }
    }
    
    if (shape === DeckShape.CUSTOM && customGrid) {
      const CELL_SIZE = cellSize || 500;
      const activeIntervals: { start: number; end: number }[] = [];
      
      if (direction === LayoutDirection.ALONG_LENGTH) {
        const numCols = customGrid[0]?.length || 0;
        const gCol = Math.min(numCols - 1, Math.max(0, Math.floor(x / CELL_SIZE)));
        
        let inSegment = false;
        let segmentStart = 0;
        
        for (let rowIdx = 0; rowIdx < customGrid.length; rowIdx++) {
          const isActive = customGrid[rowIdx]?.[gCol];
          if (isActive && !inSegment) {
            inSegment = true;
            segmentStart = rowIdx * CELL_SIZE;
          } else if (!isActive && inSegment) {
            inSegment = false;
            activeIntervals.push({ start: segmentStart, end: rowIdx * CELL_SIZE });
          }
        }
        if (inSegment) {
          activeIntervals.push({ start: segmentStart, end: customGrid.length * CELL_SIZE });
        }
      } else {
        const gRow = Math.min(customGrid.length - 1, Math.max(0, Math.floor(x / CELL_SIZE)));
        const cols = customGrid[gRow] || [];
        
        let inSegment = false;
        let segmentStart = 0;
        
        for (let colIdx = 0; colIdx < cols.length; colIdx++) {
          const isActive = cols[colIdx];
          if (isActive && !inSegment) {
            inSegment = true;
            segmentStart = colIdx * CELL_SIZE;
          } else if (!isActive && inSegment) {
            inSegment = false;
            activeIntervals.push({ start: segmentStart, end: colIdx * CELL_SIZE });
          }
        }
        if (inSegment) {
          activeIntervals.push({ start: segmentStart, end: cols.length * CELL_SIZE });
        }
      }
      return activeIntervals;
    }
    
    return [{ start: 0, end: acrossDirectionSpan }];
  };

  // 5. Layout Simulation (with stagger, minimal piece constraint, and offcut reuse)
  const rows: RowLayout[] = [];
  const offcutsPool: { length: number; id: string }[] = [];
  let boardCounter = 0;
  let pieceCounter = 0;
  let totalStandardBoardsUsed = 0;

  // Track all joints for lag placement
  const uniqueJointPositions = new Set<number>();

  for (let r = 0; r < rowCount; r++) {
    const rowPieces: BoardPiece[] = [];
    const yPos = r * (boardWidth + boardGap);
    
    const segments = getActiveSegments(yPos);
    
    let targetStartLength = baseBoardLength;
    if (netBoardDirectionSpan > baseBoardLength) {
      const cycle = r % 2;
      if (cycle === 1) {
        targetStartLength = Math.max(300, Math.round((baseBoardLength * 0.5) / 100) * 100);
      }
    }
    
    if (targetStartLength < 300) {
      targetStartLength = 300;
    }

    segments.forEach((segment) => {
      // Subtraction of wall gaps from segment boundaries
      const segStart = segment.start + wallGap;
      const segEnd = segment.end - wallGap;
      const segSpan = segEnd - segStart;
      
      if (segSpan <= 0) return;

      let currentX = 0;
      let isFirstPiece = true;

      while (currentX < segSpan) {
        const remainingSpace = segSpan - currentX;
        if (remainingSpace <= 0) break;

        let pieceLength = 0;
        let isReused = false;

        if (isFirstPiece) {
          const desiredLength = Math.min(targetStartLength, remainingSpace);
          if (remainingSpace <= baseBoardLength) {
            pieceLength = remainingSpace;
          } else {
            pieceLength = desiredLength;
          }
          
          const offcutIdx = offcutsPool.findIndex(
            (o) => o.length >= pieceLength && o.length <= pieceLength + 100
          );
          if (offcutIdx !== -1) {
            const matchedOffcut = offcutsPool.splice(offcutIdx, 1)[0];
            pieceLength = matchedOffcut.length;
            isReused = true;
          }

          isFirstPiece = false;
        } else {
          if (remainingSpace <= baseBoardLength) {
            pieceLength = remainingSpace;
            
            if (pieceLength < 300 && rowPieces.length > 0) {
              const prevPiece = rowPieces[rowPieces.length - 1];
              const needed = 300 - pieceLength;
              
              if (prevPiece.length - needed >= 300) {
                prevPiece.length -= needed;
                pieceLength += needed;
                currentX -= needed; // Shift the current start position left to touch the shortened previous piece
              } else {
                pieceLength = 300;
              }
            }

            const offcutIdx = offcutsPool.findIndex(
              (o) => o.length >= pieceLength && o.length <= pieceLength + 200
            );
            if (offcutIdx !== -1) {
              const matchedOffcut = offcutsPool.splice(offcutIdx, 1)[0];
              pieceLength = matchedOffcut.length;
              isReused = true;
            }
          } else {
            pieceLength = baseBoardLength;
          }
        }

        if (pieceLength <= 0) {
          pieceLength = 300;
        }

        if (!isReused && pieceLength < baseBoardLength) {
          totalStandardBoardsUsed++;
          const offcutLen = baseBoardLength - pieceLength;
          if (offcutLen >= 300) {
            offcutsPool.push({
              length: offcutLen,
              id: `offcut-${boardCounter}`,
            });
          }
          boardCounter++;
        } else if (!isReused && pieceLength === baseBoardLength) {
          totalStandardBoardsUsed++;
          boardCounter++;
        }

        rowPieces.push({
          id: `piece-${pieceCounter++}`,
          rowIdx: r,
          startX: segStart + currentX,
          length: Math.min(pieceLength, segSpan - currentX),
          isWaste: false,
          isReused,
        });

        currentX += pieceLength + boardGap;

        if (currentX < segSpan) {
          uniqueJointPositions.add(Math.round(segStart + currentX));
        }
      }
    });

    if (rowPieces.length > 0) {
      rows.push({
        rowIdx: r,
        yPosition: yPos,
        pieces: rowPieces,
      });
    }
  }

  // Count remaining offcuts as waste
  let wasteLength = 0;
  offcutsPool.forEach((offcut) => {
    wasteLength += offcut.length;
  });

  // Calculate actual waste percentage
  const totalLengthOfBoardsUsed = totalStandardBoardsUsed * baseBoardLength;
  const netAreaLengthUsed = rows.reduce(
    (acc, row) => acc + row.pieces.reduce((sum, p) => sum + p.length, 0),
    0
  );
  const actualWastePercentage =
    totalLengthOfBoardsUsed > 0
      ? Math.round(((totalLengthOfBoardsUsed - netAreaLengthUsed) / totalLengthOfBoardsUsed) * 1000) / 10
      : 0;

  // 6. Lags Layout Calculation
  const intervals = Math.ceil(netBoardDirectionSpan / lagStep);
  const calculatedLagStep = intervals > 0 ? netBoardDirectionSpan / intervals : lagStep;

  const lags: LagLayout[] = [];
  let lagCounter = 0;

  // Create standard lag lines
  for (let i = 0; i <= intervals; i++) {
    const pos = Math.round(i * calculatedLagStep);
    const lagSegs = getActiveLagSegments(pos);
    
    lagSegs.forEach((seg) => {
      const segLen = seg.end - seg.start;
      if (segLen > 0) {
        lags.push({
          id: `lag-std-${lagCounter++}`,
          position: pos,
          length: segLen,
          isDouble: false,
          startCoord: seg.start,
        });
      }
    });
  }

  // Place double lags at joint positions
  uniqueJointPositions.forEach((jointPos) => {
    const closestLags = lags.filter((l) => Math.abs(l.position - jointPos) < 60);
    if (closestLags.length > 0) {
      closestLags.forEach((l) => {
        l.isDouble = true;
      });
    } else {
      const lagSegs = getActiveLagSegments(jointPos);
      lagSegs.forEach((seg) => {
        const segLen = seg.end - seg.start;
        if (segLen > 0) {
          lags.push({
            id: `lag-joint-${lagCounter++}`,
            position: jointPos,
            length: segLen,
            isDouble: true,
            startCoord: seg.start,
          });
        }
      });
    }
  });

  // Sort lags by position
  lags.sort((a, b) => a.position - b.position);

  // Total running meters of lags
  const totalLagLengthMm = lags.reduce((sum, lag) => {
    return sum + lag.length * (lag.isDouble ? 2 : 1);
  }, 0);

  const lagsRunningMeters = Math.round((totalLagLengthMm / 1000) * 10) / 10;
  const lagsCount = Math.ceil(totalLagLengthMm / 3000);

  // 7. Clips / Fasteners Calculation
  // Starter clips reduced by 2 times (in half) as requested
  const starterClipsCount = Math.ceil(lags.length);
  
  let standardClipsCount = 0;
  rows.forEach((row) => {
    row.pieces.forEach((piece) => {
      const pieceStart = piece.startX;
      const pieceEnd = piece.startX + piece.length;
      
      lags.forEach((lag) => {
        if (lag.position >= pieceStart && lag.position <= pieceEnd) {
          const lagYStart = lag.startCoord || 0;
          const lagYEnd = lagYStart + lag.length;
          const boardY = row.yPosition;
          
          if (boardY >= lagYStart && boardY <= lagYEnd) {
            standardClipsCount++;
          }
        }
      });
    });
  });

  const rawClipsCount = Math.ceil(rowCount * lags.length * 1.1);
  standardClipsCount = Math.max(standardClipsCount, rawClipsCount);

  // Reduce intermediate/row clips (межрядные клипсы) by 4% as requested
  standardClipsCount = Math.ceil(standardClipsCount * 0.96);

  // 8. Area and Perimeter Calculations
  let actualAreaSqm = (width * length) / 1000000;
  let actualPerimeterMm = 2 * (width + length);

  if (shape === DeckShape.L_SHAPE) {
    const cWidth = cutoutWidth || 1500;
    const cLength = cutoutLength || 1500;
    actualAreaSqm = ((width * length) - (cWidth * cLength)) / 1000000;
    actualPerimeterMm = 2 * (width + length); // L-shape perimeter remains same
  } else if (shape === DeckShape.CUTOUT) {
    const cWidth = cutoutWidth || 1500;
    const cLength = cutoutLength || 1500;
    actualAreaSqm = ((width * length) - (cWidth * cLength)) / 1000000;
    actualPerimeterMm = 2 * (width + length);
  } else if (shape === DeckShape.CUSTOM && customGrid) {
    const CELL_SIZE = cellSize || 500;
    let activeCells = 0;
    customGrid.forEach((row) => {
      row.forEach((cell) => {
        if (cell) activeCells++;
      });
    });
    actualAreaSqm = (activeCells * CELL_SIZE * CELL_SIZE) / 1000000;

    // Boundary edge count for perimeter
    let boundaryEdges = 0;
    for (let r = 0; r < customGrid.length; r++) {
      for (let c = 0; c < customGrid[r].length; c++) {
        if (customGrid[r][c]) {
          if (r === 0 || !customGrid[r - 1][c]) boundaryEdges++;
          if (r === customGrid.length - 1 || !customGrid[r + 1][c]) boundaryEdges++;
          if (c === 0 || !customGrid[r][c - 1]) boundaryEdges++;
          if (c === customGrid[r].length - 1 || !customGrid[r][c + 1]) boundaryEdges++;
        }
      }
    }
    actualPerimeterMm = boundaryEdges * CELL_SIZE;
  }

  const deckAreaSqm = Math.round(actualAreaSqm * 100) / 100;
  const perimeterMeters = Math.round((actualPerimeterMm / 1000) * 10) / 10;
  const cornersCount = includeCorners ? Math.ceil((perimeterMeters * 1000) / 3000) : 0;

  // 9. Quantity & Price Calculations
  const marginMultiplier = 1 + wastageMargin / 100;
  const totalStandardBoardsWithMargin = Math.ceil(totalStandardBoardsUsed * marginMultiplier);
  const totalRunningMetersNeeded = totalStandardBoardsUsed * (baseBoardLength / 1000);
  const totalRunningMetersWithMargin = totalStandardBoardsWithMargin * (baseBoardLength / 1000);

  const texturePrices = spec.prices[colorGroup][boardTexture];
  const boardUnitPrice = texturePrices.meter;
  
  const boardTotalPrice = Math.round(totalRunningMetersWithMargin * boardUnitPrice * 100) / 100;
  const lagsTotalPrice = Math.round(lagsCount * 3 * ACCESSORY_PRICES.LAG_METER * 100) / 100;
  const clipsTotalPrice = Math.round((standardClipsCount + starterClipsCount) * ACCESSORY_PRICES.CLIP_EACH * 100) / 100;
  const cornersTotalPrice = Math.round(cornersCount * ACCESSORY_PRICES.CORNER_PIECE * 100) / 100;
  
  const installationTotalPrice = includeInstallation
    ? Math.round(deckAreaSqm * ACCESSORY_PRICES.INSTALLATION_SQM * 100) / 100
    : 0;

  const totalSum = Math.round(
    (boardTotalPrice + lagsTotalPrice + clipsTotalPrice + cornersTotalPrice + installationTotalPrice) * 100
  ) / 100;

  // 10. Weight Calculations
  const boardTotalWeight = Math.round(totalRunningMetersWithMargin * spec.weightPerMeter * 10) / 10;
  const lagsTotalWeight = Math.round(lagsRunningMeters * 1.75 * 10) / 10;
  const totalWeight = Math.round((boardTotalWeight + lagsTotalWeight) * 10) / 10;

  return {
    deckArea: deckAreaSqm,
    perimeter: perimeterMeters,
    wallGap,
    endGap: 3,
    totalRunningMetersNeeded,
    totalRunningMetersWithMargin,
    totalStandardBoardsNeeded: totalStandardBoardsUsed,
    totalStandardBoardsWithMargin,
    lagsRunningMeters,
    lagsCount,
    standardClipsCount,
    starterClipsCount,
    cornersCount,
    rows,
    lags,
    totalPiecesUsed: pieceCounter,
    wastePiecesCount: offcutsPool.length,
    wasteLength,
    actualWastePercentage,
    boardUnitPrice,
    boardTotalPrice,
    lagsTotalPrice,
    clipsTotalPrice,
    cornersTotalPrice,
    installationTotalPrice,
    totalSum,
    boardTotalWeight,
    lagsTotalWeight,
    totalWeight,
  };
}

export function createDefaultGrid(rows: number, cols: number, shape: DeckShape): boolean[][] {
  const grid: boolean[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < cols; c++) {
      let active = true;
      if (shape === DeckShape.L_SHAPE) {
        // Cut out top-right corner (last 1/3 of columns and last 1/3 of rows)
        if (r >= Math.floor(rows * 2 / 3) && c >= Math.floor(cols * 2 / 3)) {
          active = false;
        }
      } else if (shape === DeckShape.CUTOUT) {
        // Cut out bottom-right corner (last 1/3 of columns and first 1/3 of rows)
        if (r < Math.floor(rows / 3) && c >= Math.floor(cols * 2 / 3)) {
          active = false;
        }
      }
      row.push(active);
    }
    grid.push(row);
  }
  return grid;
}

export function syncGridWithDimensions(
  oldGrid: boolean[][] | undefined,
  newRows: number,
  newCols: number,
  shape: DeckShape
): boolean[][] {
  const defaultGrid = createDefaultGrid(newRows, newCols, shape);
  if (!oldGrid || shape !== DeckShape.CUSTOM) {
    return defaultGrid;
  }
  
  // Create a new grid of newRows x newCols and copy old values where they fit
  const grid: boolean[][] = [];
  for (let r = 0; r < newRows; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < newCols; c++) {
      if (r < oldGrid.length && c < oldGrid[r].length) {
        row.push(oldGrid[r][c]);
      } else {
        row.push(true); // default new cells to active
      }
    }
    grid.push(row);
  }
  return grid;
}
