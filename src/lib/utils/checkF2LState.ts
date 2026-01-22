import { Alg } from 'cubing/alg';
import type { Side } from '$lib/types/Side';
import type { StickerHidden } from '$lib/types/stickering';
import type { GroupId } from '$lib/types/group';
import { mirrorSlot } from './logNormalizedKPattern';

// Type definitions for KPuzzle pattern structure
interface PieceData {
	pieces: number[];
	orientation: number[];
}

interface PatternData {
	CORNERS: PieceData;
	EDGES: PieceData;
}

interface NormalizedPattern {
	patternData: PatternData;
}

interface KPuzzleInterface {
	algToTransformation: (alg: Alg) => {
		toKPattern: () => NormalizedPattern;
	};
}

export interface PuzzlePattern {
	kpuzzle: KPuzzleInterface;
}

// F2L slot positions in KPattern
const F2L_SLOTS = {
	fr: { edge: 8, corner: 4 }, // FR edge, DRF corner
	fl: { edge: 9, corner: 5 }, // FL edge, DFL corner
	br: { edge: 10, corner: 7 }, // BR edge, DBR corner
	bl: { edge: 11, corner: 6 } // BL edge, DLB corner
} as const;

/**
 * Checks if the top layer is oriented (OLL solved)
 * OLL is solved when all top layer pieces are correctly oriented
 */
function isOLLSolved(corners: PieceData, edges: PieceData): boolean {
	// Check that all top layer corners are oriented correctly (orientation 0)
	const topCorners = [0, 1, 2, 3]; // URF, UFL, ULB, UBR corners
	for (const cornerIndex of topCorners) {
		if (corners.orientation[cornerIndex] !== 0) {
			return false;
		}
	}

	// Check that all top layer edges are oriented correctly (orientation 0)
	const topEdges = [0, 1, 2, 3]; // UR, UF, UL, UB edges
	for (const edgeIndex of topEdges) {
		if (edges.orientation[edgeIndex] !== 0) {
			return false;
		}
	}

	return true;
}

/**
 * Checks if a specific F2L slot is solved
 */
function isSlotSolved(
	corners: { pieces: number[]; orientation: number[] },
	edges: { pieces: number[]; orientation: number[] },
	slot: NonNullable<StickerHidden>
): boolean {
	const { edge, corner } = F2L_SLOTS[slot];
	return (
		corners.pieces[corner] === corner &&
		corners.orientation[corner] === 0 &&
		edges.pieces[edge] === edge &&
		edges.orientation[edge] === 0
	);
}

// Cross edge positions (bottom layer edges): DF(4), DR(5), DB(6), DL(7)
const CROSS_EDGES = [4, 5, 6, 7] as const;

/**
 * Checks if the cross (all 4 bottom layer edges) is solved
 */
function isCrossSolved(edges: { pieces: number[]; orientation: number[] }): boolean {
	for (const edgePos of CROSS_EDGES) {
		if (edges.pieces[edgePos] !== edgePos || edges.orientation[edgePos] !== 0) {
			return false;
		}
	}
	return true;
}

/**
 * Checks if the F2L is solved according to the case requirements
 */
function isF2LSolved(
	corners: { pieces: number[]; orientation: number[] },
	edges: { pieces: number[]; orientation: number[] },
	piecesToHide: StickerHidden | undefined,
	side: Side
): boolean {
	// First, check if the cross (bottom layer edges) is solved
	if (!isCrossSolved(edges)) {
		return false;
	}

	// Determine which slot to exclude from checking
	let slotToExclude: NonNullable<StickerHidden> | undefined = piecesToHide;
	if (piecesToHide && side === 'left') {
		slotToExclude = mirrorSlot(piecesToHide);
	}

	// Check all slots except the one to exclude
	const slotsToCheck: NonNullable<StickerHidden>[] = ['fr', 'fl', 'br', 'bl'];
	for (const slot of slotsToCheck) {
		if (slot === slotToExclude) {
			continue; // Skip the slot that doesn't need to be solved
		}
		if (!isSlotSolved(corners, edges, slot)) {
			return false;
		}
	}

	return true;
}

/**
 * Check if the cube is fully solved by checking for identity permutation
 */
function isCubeSolved(normalizedPattern: NormalizedPattern): boolean {
	console.log('Checking cube solved state:', normalizedPattern);
	return (
		normalizedPattern.patternData.CORNERS.pieces.every((v, i) => v === i) &&
		normalizedPattern.patternData.CORNERS.orientation.every((v) => v === 0) &&
		normalizedPattern.patternData.EDGES.pieces.every((v, i) => v === i) &&
		normalizedPattern.patternData.EDGES.orientation.every((v) => v === 0)
	);
}

export interface F2LState {
	f2lSolved: boolean;
	cubeSolved: boolean;
}

/**
 * Checks the current F2L state and optionally triggers callbacks when solved.
 * @param pattern - The current KPattern from TwistyPlayer
 * @param scramble - The scramble algorithm
 * @param alg - The solution algorithm (moves made by user)
 * @param piecesToHide - Which F2L slot to exclude from checking
 * @param side - Which side (right/left) for mirroring
 * @param groupId - The training group to determine solve completion criteria
 * @param onF2LSolved - Optional callback when F2L is solved (for F2L groups)
 * @param onCubeSolved - Optional callback when cube is fully solved (for PLL groups)
 * @returns The current F2L state
 */
export async function checkF2LState(
	pattern: PuzzlePattern,
	scramble: string,
	alg: string,
	piecesToHide?: StickerHidden,
	side: Side = 'right',
	groupId?: GroupId,
	onF2LSolved?: () => void,
	onCubeSolved?: () => void
): Promise<F2LState> {
	try {
		// Generate normalized pattern from scramble + alg applied to solved state
		const currentAppliedAlg = new Alg(scramble + ' ' + alg);
		const normalizedPattern = pattern.kpuzzle.algToTransformation(currentAppliedAlg).toKPattern();
		console.log('Current Applied Alg', scramble + ' ' + alg);
		console.log('Normalized State:', pattern.kpuzzle.algToTransformation(currentAppliedAlg));
		// Check if F2L is solved
		const f2lSolved = isF2LSolved(
			normalizedPattern.patternData.CORNERS,
			normalizedPattern.patternData.EDGES,
			piecesToHide,
			side
		);

		// Check if OLL is solved (top layer oriented)
		const ollSolved = isOLLSolved(
			normalizedPattern.patternData.CORNERS,
			normalizedPattern.patternData.EDGES
		);

		// Check if cube is fully solved
		const cubeSolved = isCubeSolved(normalizedPattern);

		// Determine which callback to trigger based on group
		let shouldTriggerSolve = false;

		if (groupId === 'pll') {
			// For PLL training, solve is complete when cube is fully solved
			shouldTriggerSolve = cubeSolved;
		} else if (groupId === 'oll') {
			// For OLL training, solve is complete when top layer is oriented
			shouldTriggerSolve = ollSolved;
		} else {
			// For F2L groups (basic, basicBack, advanced, expert), solve is complete when F2L is solved
			shouldTriggerSolve = f2lSolved;
		}

		// Trigger appropriate callback
		if (shouldTriggerSolve) {
			if (groupId === 'pll') {
				console.log(
					'%c\u2713 PLL SOLVED! (Full Cube)',
					'color: #fff; background: #9b59b6; font-size:1.2rem; font-weight: bold; padding: 4px 12px; border-radius: 4px;'
				);
				onF2LSolved?.(); // Use F2L callback for PLL completion
			} else if (groupId === 'oll') {
				console.log(
					'%c\u2713 OLL SOLVED! (Top Layer Oriented)',
					'color: #fff; background: #e67e22; font-size:1.2rem; font-weight: bold; padding: 4px 12px; border-radius: 4px;'
				);
				onF2LSolved?.(); // Reuse F2L callback for OLL completion
			} else {
				console.log(
					'%c\u2713 F2L SOLVED!',
					'color: #fff; background: #27ae60; font-size:1.2rem; font-weight: bold; padding: 4px 12px; border-radius: 4px;'
				);
				onF2LSolved?.();
			}
		}

		// Also log cube solved for debugging
		if (cubeSolved && !shouldTriggerSolve) {
			console.log(
				'%c\u2713 CUBE SOLVED!',
				'color: #fff; background: #3498db; font-size:1.2rem; font-weight: bold; padding: 4px 12px; border-radius: 4px;'
			);
			onCubeSolved?.();
		}

		return { f2lSolved, cubeSolved };
	} catch (e) {
		console.error('%c[F2L Check Error]', 'color: #e74c3c; font-weight: bold', e);
		return { f2lSolved: false, cubeSolved: false };
	}
}
