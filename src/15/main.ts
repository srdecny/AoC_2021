import { range, runTests } from "../utils";
import { readFileSync } from "fs";
// @ts-ignore
import PriorityQueue from "priorityqueuejs";
type Grid = number[][];

function parse(input: string): Grid {
	return input.split("\n").map(line => line.split("").map(Number));
}

type Search = {y: number, x: number, risk: number};

function part1(input: string): number {
	const grid = parse(input)
	const dist = grid.map(row => row.map(() => Infinity));
	dist[0][0] = 0;
	const queue = new PriorityQueue((a: Search, b: Search) => b.risk - a.risk);
	const maxY = grid.length;
	const maxX = grid[0].length;

	for (let y = 0; y < maxY; y++) {
		for (let x = 0; x < maxX; x++) {
				queue.enq({y, x, risk: dist[y][x]});
		}
	}

	while (queue.size() > 0) {
		const {y, x, risk} = queue.deq()
		if (y === maxY - 1 && x === maxX - 1) {
			return risk;
		}
		const neighbors = [
			{y: y - 1, x: x},
			{y: y + 1, x: x},
			{y: y, x: x - 1},
			{y: y, x: x + 1},
		];
		for (const neighbor of neighbors) {
			if (neighbor.y < 0 || neighbor.y >= maxY || neighbor.x < 0 || neighbor.x >= maxX) {
				continue;
			}
			const newRisk = risk + grid[neighbor.y][neighbor.x];
			if (newRisk < dist[neighbor.y][neighbor.x]) {
				dist[neighbor.y][neighbor.x] = newRisk;
				queue.enq({y: neighbor.y, x: neighbor.x, risk: newRisk});
			}
		}

	}
	
}

function part2(input: string): string|number {
	const inputLines = input.split("\n").map(line => line.split("").map(Number));
	const inputY = inputLines.length;
	const inputX = inputLines[0].length;
	const fiveTimesInput: number[][] = []
	for (let dy = 0; dy < 5; dy++) {
		for (let y = 0; y < inputY; y++) {
		fiveTimesInput[dy * inputY + y] = []
			for (let dx = 0; dx < 5; dx++) {
				for (let x = 0; x < inputX; x++) {
					const transformed = inputLines[y][x] + dy + dx
					const reduced = transformed > 9 ? transformed - 9 : transformed
					fiveTimesInput[dy * inputY + y].push(reduced)
				}
			}
		}
	}
	return part1(fiveTimesInput.map(line => line.join("")).join("\n"));
}


runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));