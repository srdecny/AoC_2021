import { range, runTests } from "../utils";
import { readFileSync } from "fs";

function part1(input: string): number {
	const nums = input.split(",").map(Number)
	const max = Math.max(...nums)
	return range(0, max).reduce((acc, i) => {
		const cost = nums.reduce((sum, n) => sum += Math.abs(n - i), 0)
		return acc > cost ? cost : acc
	}, 10000000)
}

function part2(input: string): string|number {
	const nums = input.split(",").map(Number)
	const max = Math.max(...nums)
	return range(0, max).reduce((acc, i) => {
		const burned = (to: number) => to * ((1 + to)/2)
		const cost = nums.reduce((sum, n) => sum += burned(Math.abs(n - i)), 0)
		return acc > cost ? cost : acc
	}, 1000000000000000)
}


runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));