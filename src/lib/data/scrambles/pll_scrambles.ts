// Source: Standard PLL setup scrambles
// These scrambles create the specific PLL state for training

import type { AlgorithmCollection } from '..';

export const pllScrambles: AlgorithmCollection = {
	1: ["x R2' D2' R U R' D2' R U' R x'"], // Aa
	2: ["x R' U R' D2' R U' R' D2' R2' x'"], // Ab
	3: ["x' D R U R' D' R U' R' D R U' R' D' R U R' x"], // E
	4: ["R U2' R D R' U R D' R' U' R' U R U R'"], // Ra
	5: ["R' U' R D' U R2' U R' U R U' R U' R2' D"], // Ga
	6: ["R2' U R' U R' U' R U' R2' D U' R' U R D'"], // Gb
	7: ["D' R U R' U' D R2' U' R U' R' U R' U R2'"], // Gc
	8: ["R2' U' R U' R U R' U R2' D' U R U' R' D"], // Gd
	9: ["L' R' U2' R U R' U2' L U' R"], // Ja
	10: ["R U R2' F' R U R U' R' F R U' R'"], // Jb
	11: ["R' U' R U' R' U R U R2' F' R U R U' R' F U R"], // F
	12: ["R U R' U2' R U R2' F' R U R U' R' F R U' R' U' R U' R'"], // Na
	13: ["F r' F' r U r U' r2' D' F r U r' F' D r"], // Nb
	14: ["F R U' R' U R U R2' F' R U R U' R'"], // T
	15: ["D2' R' U R D' R2' U' R' U R' U R' D' R U2' R'"], // V
	16: ["M2' U' M2' U2' M2' U' M2'"], // H
	17: ["M2' U' M' U2' M U' M2'"], // Ua
	18: ["M2' U M' U2' M U M2'"], // Ub
	19: ["M U2' M2' U2' M U' M2' U' M2'"], // Z
	20: ["F R' F' R U R U' R' F R U' R' U R U R' F'"], // Y
	21: ["R' U R U R' U' R' D' R U R' D R U2' R"] // Rb
};
