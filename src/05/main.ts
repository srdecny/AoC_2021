import { range, runTests } from "../utils";
import { readFileSync } from "fs";

interface Point {
	x: number;
	y: number;
}

interface Line {
	from: Point;
	to: Point;
}

function parseInput(input: string): Line[] {
	return input.split("\n").map(line => {
		const [from, to] = line.split(" -> ").map(point => {
			const [x, y] = point.split(",").map(Number);
			return { x, y } as Point;
		});
		return { from, to } as Line;
	})
}

function countIntersection(lines: Line[]): number {
	return lines.reduce((acc, line) => {
		const xSequence = range(line.from.x, line.to.x);
		const ySequence = range(line.from.y, line.to.y);		
		for (let i = 0; i < Math.max(xSequence.length, ySequence.length); i++) {
			const pointStr = `${xSequence[Math.min(i, xSequence.length - 1)]},${ySequence[Math.min(i, ySequence.length - 1)]}`;
			if (acc.points.has(pointStr)) {
				acc.intersections.add(pointStr)
			} else {
				acc.points.add(pointStr);
			}
		}
		return acc
	}, {points: new Set(), intersections: new Set()}).intersections.size
}

function part1(input: string): number {
	const noDiagonals = parseInput(input).filter(line => {
		return line.from.x === line.to.x || line.from.y === line.to.y
	})
	return countIntersection(noDiagonals)
}

function part2(input: string): number {
	return countIntersection(parseInput(input))
}


runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));