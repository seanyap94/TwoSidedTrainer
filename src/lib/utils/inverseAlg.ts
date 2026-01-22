/**
 * Inverts a Rubik's cube algorithm string.
 * Reverses the order of moves and inverts each move:
 * - R becomes R'
 * - R' becomes R
 * - R2 stays R2
 * - Wide moves (like r, l, etc.) follow the same rules
 */
export function inverseAlg(alg: string): string {
	if (!alg.trim()) return '';

	// Split the algorithm into individual moves
	const moves = alg.trim().split(/\s+/);

	// Reverse the order and invert each move
	const invertedMoves = moves.reverse().map((move) => {
		// Handle wide moves and regular moves
		if (move.endsWith("'")) {
			// Remove the prime
			return move.slice(0, -1);
		} else if (move.endsWith('2')) {
			// Double moves stay the same
			return move;
		} else {
			// Add prime to single moves
			return move + "'";
		}
	});

	return invertedMoves.join(' ');
}
