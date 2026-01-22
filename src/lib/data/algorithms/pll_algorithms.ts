import type { AlgorithmCollection } from '..';

// PLL algorithms keyed by case numbers (1-21)
export const pllAlgorithms: AlgorithmCollection = {
	1: ["x R' U R' D2 R U' R' D2 R2 x'"], // Aa
	2: ["x R2 D2 R U R' D2 R U' R x'"], // Ab
	3: ["x' R U' R' D R U R' D' R U R' D R U' R' D' x"], // E
	4: ["R U' R' U' R U R D R' U' R D' R' U2 R'"], // Ra
	5: ["R2 U R' U R' U' R U' R2 D U' R' U R D'"], // Ga
	6: ["D R' U' R U D' R2 U R' U R U' R U' R2"], // Gb
	7: ["R2 U' R U' R U R' U R2 D' U R U' R' D"], // Gc
	8: ["R U R' U' D R2 U' R U' R' U R' U R2 D'"], // Gd
	9: ["(R' U L') U2 (R U' R') U2 R L"], // Ja
	10: ["R U R' F' R U R' U' R' F R2 U' R'"], // Jb
	11: ["R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R"], // F
	12: ["R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'"], // Na
	13: ["R' U R U' R' F' U' F R U R' F R' F' R U' R"], // Nb
	14: ["R U R' U' R' F R2 U' R' U' R U R' F'"], // T
	15: ["R' U R' U' R D' R' D R' U D' R2 U' R2 D R2"], // V
	16: ["M2 U' M2 U2 M2 U' M2"], // H
	17: ["y2 M2 U M U2 M' U M2"], // Ua
	18: ["y2 M2 U' M U2 M' U' M2"], // Ub
	19: ["M' U' M2 U' M2 U' M' U2 M2"], // Z
	20: ["F R U' R' U' R U R' F' R U R' U' R' F R F'"], // Y
	21: ["R' U2 R U2 R' F R U R' U' R' F' R2"] // Rb
};

export default pllAlgorithms;
