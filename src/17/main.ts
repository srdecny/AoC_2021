import { range, runTests } from "../utils";
import { readFileSync } from "fs";

function part1(input: string): number {
	const [xFrom, xTo, yFrom, yTo] = input.split(",").map(Number);
	const partialSum = (step: number) => (step * (step + 1)) / 2;
	const partialSums = range(0, 100).map(stepCount => partialSum(stepCount));
	let maxSum = -Infinity
	for (const sumUp of partialSums) {
		for (const sumDown of partialSums) {
			if (sumUp - sumDown >= yFrom && sumUp - sumDown <= yTo) {
				maxSum = Math.max(maxSum, sumUp);
			}
		}
	}

	return maxSum;
}

type Coords = {x: number, y: number};
type Shot = {pos: Coords, vel: Coords};

function part2(input: string): number {

	const [xFrom, xTo, yTo, yFrom] = input.split(",").map(Number);
	const overshoot = (shot: Shot): boolean => shot.pos.x > xTo || shot.pos.y < yTo;
	const nextStep = (shot: Shot): Shot => ({pos: {x: shot.pos.x + shot.vel.x, y: shot.pos.y + shot.vel.y}, vel: {x: Math.max(shot.vel.x - 1, 0), y: shot.vel.y - 1}});
	const landed = (shot: Shot): boolean => shot.pos.x <= xTo && shot.pos.y >= yTo && shot.pos.x >= xFrom && shot.pos.y <= yFrom;

	const landingStarts = range(0, xTo + 1).map(startX => {
		return range(1000, -1000).map(startY => {
			let pos = {pos: {x: 0, y: 0}, vel: {x: startX, y: startY}};
			while (!overshoot(pos)) {
				if (landed(pos)) {
					return true
				}
				pos = nextStep(pos);
			}
			return false
		})
	})
	return landingStarts.flat().filter(x => x).length;
}


runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));