import { eachCons, runTests } from "../utils";
import { readFileSync } from "fs";

function part1(input: string): string|number {
	const lines = input.split("\n").map(Number);
	return eachCons(2, lines).filter(([a, b]) => a < b).length
}

function part2(input: string): string|number {
	const lines = input.split("\n").map(Number);
	const windows = eachCons(3, lines).map(([a, b, c]) => a + b + c);
	return eachCons(2, windows).filter(([a, b]) => a < b).length
}


runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));