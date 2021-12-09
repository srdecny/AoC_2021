import { runTests } from "../utils";
import { readFileSync } from "fs";

function parse(input: string): number[][] {
	return input.split("\n").map(line => line.split("").map(Number));
}

const neighbours = (y: number, x: number, matrix: number[][]) => {
	return neighbourCoords(y, x, matrix).map(c => matrix[c[0]][c[1]])
}

const neighbourCoords = (y: number, x: number, matrix: number[][]) => {
	const result = [];
	if (y > 0) result.push([y - 1, x]);
	if (y < matrix.length - 1) result.push([y + 1, x]);
	if (x > 0) result.push([y, x - 1]);
	if (x < matrix[y].length - 1) result.push([y, x + 1]);
	return result;
}

function part1(input: string): number {
	const matrix = parse(input);
	return matrix.reduce((acc, row, y) => {
		return acc + row.filter((num, x) => num < Math.min(...neighbours(y, x, matrix))).reduce((s, n) => s + n + 1, 0)
	}, 0)
	
}

function part2(input: string): number {
	const visited = new Set<string>();
	const basins = []
	const matrix = parse(input);
	for (let y = 0; y < matrix.length; y++) {
		for (let x = 0; x < matrix[y].length; x++) {
			const coords = `${y},${x}`;
			if (visited.has(coords)) {
				continue;
			} else {
				// Found a new basin
				const basin = new Set<string>();
				const queue = [coords];
				while (queue.length > 0) {
					const newCoord = queue.pop();
					visited.add(newCoord);
					const [y1, x1] = newCoord.split(",").map(Number);
					if (matrix[y1][x1] == 9) continue
					basin.add(newCoord);
					const n = neighbourCoords(y1, x1 , matrix);
					n.map(c => `${c[0]},${c[1]}`).filter(c => !visited.has(c)).forEach(c => queue.push(c));
				}
				basins.push(basin)
			}
		}
	}

	const sizes = basins.map(b => b.size).sort((a, b) => b - a)
	return sizes[0] * sizes[1] * sizes[2]
}


runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));