import { describe, it, expect, vi } from 'vitest';
import { checkF2LState } from './checkF2LState';

// Mock cubing.js
vi.mock('cubing/alg', () => ({
	Alg: class MockAlg {
		constructor(public alg: string) {}
	}
}));

describe('checkF2LState', () => {
	describe('PLL solve detection', () => {
		it('should detect F perm as solved', async () => {
			// F perm case (PLL case 11)
			const scramble = "R' U' R U' R' U R U R2' F' R U R U' R' F U R y'";
			const algorithm = "y R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R";

			// Mock KPuzzle that returns solved state when the correct algorithm is applied
			const mockKPuzzle = {
				algToTransformation: vi.fn((alg: any) => {
					// Check if the algorithm contains the expected scramble + algorithm
					const algString = alg.alg;
					const expectedAlg = `${scramble} ${algorithm}`;
					if (algString === expectedAlg) {
						return {
							toKPattern: () => ({
								patternData: {
									CORNERS: {
										pieces: [0, 1, 2, 3, 4, 5, 6, 7], // Identity permutation
										orientation: [0, 0, 0, 0, 0, 0, 0, 0] // All correct orientation
									},
									EDGES: {
										pieces: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // Identity permutation
										orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // All correct orientation
									}
								}
							})
						};
					} else {
						// For incomplete algorithms, return unsolved
						return {
							toKPattern: () => ({
								patternData: {
									CORNERS: {
										pieces: [3, 0, 1, 2, 5, 6, 7, 4], // Not solved
										orientation: [0, 0, 0, 0, 0, 0, 0, 0]
									},
									EDGES: {
										pieces: [3, 0, 1, 2, 7, 4, 5, 6, 9, 11, 8, 10], // Not solved
										orientation: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1] // Some flipped
									}
								}
							})
						};
					}
				})
			};

			// Mock the pattern object
			const pattern = { kpuzzle: mockKPuzzle };

			// Track if the callback was called
			let solvedCallbackCalled = false;
			const onF2LSolved = () => {
				solvedCallbackCalled = true;
			};

			// Test the solve detection
			const result = await checkF2LState(
				pattern,
				scramble,
				algorithm,
				undefined, // piecesToHide
				'right', // side
				'pll', // groupId
				onF2LSolved,
				undefined // onCubeSolved
			);

			// Should detect as solved
			expect(result.f2lSolved).toBe(true); // Identity permutation includes solved F2L
			expect(result.cubeSolved).toBe(true); // And solves the cube
			expect(solvedCallbackCalled).toBe(true);
		});

		it('should not detect unsolved cube as solved', async () => {
			// Same scramble but incomplete algorithm - should not be solved
			const scramble = "R' U' R U' R' U R U R2' F' R U R U' R' F U R y'";
			const incompleteAlgorithm = "y R' U' F'"; // Incomplete F perm

			const mockKPuzzle = {
				algToTransformation: vi.fn((alg: any) => ({
					toKPattern: () => ({
						patternData: {
							CORNERS: {
								pieces: [3, 0, 1, 2, 5, 6, 7, 4], // Not identity permutation
								orientation: [0, 0, 0, 0, 0, 0, 0, 0]
							},
							EDGES: {
								pieces: [3, 0, 1, 2, 7, 4, 5, 6, 9, 11, 8, 10], // Not identity permutation
								orientation: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1] // Some edges flipped
							}
						}
					})
				}))
			};

			const pattern = { kpuzzle: mockKPuzzle };

			let solvedCallbackCalled = false;
			const onF2LSolved = () => {
				solvedCallbackCalled = true;
			};

			const result = await checkF2LState(
				pattern,
				scramble,
				incompleteAlgorithm,
				undefined,
				'right',
				'pll',
				onF2LSolved,
				undefined
			);

			// Should not detect as solved
			expect(result.cubeSolved).toBe(false);
			expect(solvedCallbackCalled).toBe(false);
		});
	});
});
