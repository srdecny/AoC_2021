import { runTests } from "../utils";
import { readFileSync } from "fs";

function part1(input: string): string|number {
	return "";
}

function part2(input: string): string|number {
	return "";
}


runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));