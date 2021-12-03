import { transpose, runTests } from "../utils";
import { readFileSync } from "fs";

function parseInput(input: string): number[][] {
	return input.split("\n").map(s => s.split("").map(Number))
}

function binary_to_decimal(binary: number[]): number {
	return binary.reverse().reduce((a, b, i) => a + b * Math.pow(2, i), 0)
}

function part1(input: string): number {
	const matrix = transpose(parseInput(input))
	const most_common_bits = matrix.map(row => {
		return (row.length/2) >= row.filter(x => x === 1).length ? 1 : 0
	})
	const least_common_bits = most_common_bits.map(n => n ? 0 : 1)

	return binary_to_decimal(most_common_bits) * binary_to_decimal(least_common_bits)
}

function part2(input: string): number {
	const matrix = parseInput(input)
	const numberLength = matrix[0].length

	type Comparison = (a: number, b: number) => 0 | 1
	const comparisons: Comparison[] = [
		(a, b) => a <= b ? 1 : 0,
		(a, b) => a > b ? 1 : 0
	]

	const ratings = comparisons.map(comparison => {
		return [...Array(numberLength).keys()].reduce((acc, idx) => {
			if (acc.length == 1) return acc
			const keep_number = comparison((acc.length / 2 ), acc.filter(row => row[idx]).length) 
			return acc.filter(row => row[idx] == keep_number)
		}, matrix)[0]
	})

	return ratings.reduce((acc, c) => acc * binary_to_decimal(c), 1)

}


runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));