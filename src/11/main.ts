import { runTests } from "../utils";
import { readFileSync } from "fs";

type Grid = number[][];
type State = { grid: Grid, flashes: number };
type Coord = { x: number, y: number };

const incrementOne = (grid: Grid): Grid => grid.map(line => line.map(n => n + 1));
const reset = (grid: Grid): Grid => grid.map(line => line.map(n => n > 9 ? 0 : n));
const StrToCoord = (str: string): Coord => { return {x: Number(str.split(",")[0]), y: Number(str.split(",")[1])} }
const CoordToStr = (coord: Coord): string => `${coord.x},${coord.y}`;

function nextStep(state: State): State {
	const incremented = incrementOne(state.grid);
	// First, find all initial flashing cells
	const initialFlashes = incremented.reduce((acc, line, y) => {
		line.forEach((n, x) => {
			if (n > 9) {
				acc.push({ x, y });
			}
		});
		return acc;
	}, [] as Coord[]);

	const flashed = new Set<string>();
	const queue = [...initialFlashes];
	while (queue.length > 0) {
		const flashing = queue.shift();
		if (flashed.has(CoordToStr(flashing))) {
			continue;
		}
		flashed.add(CoordToStr(flashing));
		const generateNeighbourCoords = (coord: Coord): Coord[] => {
			const {x, y} = coord
			return [
				{ x: x - 1, y },
				{ x: x + 1, y },
				{ x, y: y - 1 },
				{ x, y: y + 1 },
				{x: x - 1, y: y - 1},
				{x: x - 1, y: y + 1},
				{x: x + 1, y: y - 1},
				{x: x + 1, y: y + 1}
			].filter(c => c.x >= 0 && c.y >= 0 && c.x < incremented[0].length && c.y < incremented.length);
		}

		const incrementNeighbours = (coord: Coord): Coord[] => {
			return generateNeighbourCoords(coord).filter(coord => {
				if (++incremented[coord.y][coord.x] > 9) {
					return true;
				}
			})
		}

		const flashingNeighbours = incrementNeighbours(flashing);
		flashingNeighbours.forEach(coord => {
			if (!flashed.has(CoordToStr(coord))) {
				queue.push(coord);
			}
		})
	}
	
	return {
			grid: reset(incremented),
			flashes: state.flashes + flashed.size
	}

}


function part1(input: string): number {
	const matrix = input.split("\n").map(line => line.split("").map(n => Number(n)));
	let state = { grid: matrix, flashes: 0 };
	for (let i = 0; i < 100; i++) {
		state = nextStep(state);
	}
	return state.flashes;

}

function part2(input: string): string|number {
	let matrix = input.split("\n").map(line => line.split("").map(n => Number(n)));
	const maxFlashes = matrix.length * matrix[0].length;
	let state = { grid: matrix, flashes: 0 };
	let steps = 0;
	while (true) {
		steps++
		const newState = nextStep(state);
		if (newState.flashes === maxFlashes) {
			break
		}
		state.grid = newState.grid;
		state.flashes = 0;
	}
	return steps
}


runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));