import { runTests } from "../utils";
import { readFileSync } from "fs";

function parseInput(input: string): number[] {
	return input.split(",").map(Number).reduce((acc, c) => {
		acc[c]++
		return acc
	}, new Array(9).fill(0));
}

function solve(input: string, days: number): number {
	const finalState = [...Array(days).keys()].reduce((acc, _) => {
		const newAcc = new Array(9).fill(0);
		[...acc.entries()].forEach(([i, v]) => {
			if (i == 0) {
				newAcc[6] += v
				newAcc[8] += v
			} else {
				newAcc[i - 1] += v
			}
		})
		return newAcc
	}, parseInput(input))

	return finalState.reduce((acc, c) => acc + c, 0)
}

function part1(input: string): number {
	return solve(input, 80)
}

function part2(input: string): number {
	return solve(input, 256)
}


runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));