import { runTests } from "../utils";
import { readFileSync } from "fs";

function parseInput(input: string): [string, number][] {
	return input.split("\n").map(line => {
		const [direction, units] = line.split(" ");
		return [direction, Number(units)];
	})
}

function part1(input: string): number {
	const res = parseInput(input).reduce((acc, [direction, units]) => {
		direction === "forward" ? acc.x += units : direction == "down" ? acc.y += units : acc.y -= units;
		return acc
	}, {x: 0, y: 0});
	return res.x * res.y
}

function part2(input: string): number {
	const res = parseInput(input).reduce((acc, [direction, units]) => {
		direction === "forward" ? (acc.x += units, acc.y += acc.aim * units) : direction == "down" ? acc.aim += units : acc.aim -= units;
		return acc
	}, {x: 0, y: 0, aim: 0});
	return res.x * res.y
}


runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));