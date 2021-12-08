import { runTests } from "../utils";
import { readFileSync } from "fs";


interface Line {
	nums: string[];
	output: string[];
}

function parse(input: string): Line[] {
	const lines = input.split("\n")
	return lines.map(line => {
		const [nums, output] = line.split(" | ")
		return { nums: nums.split(" "), output: output.split(" ")}
	})
}

function part1(input: string): number {
	return parse(input).reduce((acc, line: Line) => {
		return acc + line.output.filter(o => [2, 4, 3, 7].includes(o.length)).length;
	}, 0)
}

function part2(input: string): number {
	return parse(input).reduce((acc, line: Line) => {
		const one =  line.nums.find(n => n.length == 2)
		const seven = line.nums.find(n => n.length == 3)
		const four = line.nums.find(n => n.length == 4)
		const eight = line.nums.find(n => n.length == 7)
		const three = line.nums.find(n => n.length == 5 && [...one].every(seg => n.includes(seg)))
		const six = line.nums.find(n => n.length == 6 && ![...one].every(seg => n.includes(seg)))
		const c = [...one].find(seg => ![...six].includes(seg))
		const two =  line.nums.find(n => n.length == 5 && n !== three && n.includes(c))
		const five = line.nums.find(n => n.length == 5 && n !== three && n !== two)
		const e = [..."abcdefg"].find(seg => seg !== c && !five.includes(seg))
		const zero = line.nums.find(n => n.length == 6 && n !== six && n.includes(e))
		const nine = line.nums.find(n => n.length == 6 && !n.includes(e))


		type Mapping = [string, number]
		const mapping: Mapping[] = [
			[one, 1],
			[two, 2],
			[three, 3],
			[four, 4],
			[five, 5],
			[six, 6],
			[seven, 7],
			[eight, 8],
			[nine, 9],
			[zero, 0]
		]

		return acc + line.output.reduce((sum, outputNumber, idx) => {
			const converted = mapping.find(([key, val]) => key.length == outputNumber.length && [...key].every(seg => outputNumber.includes(seg)))[1]
			return sum + converted * Math.pow(10, 3 - idx)
		}, 0)
	}, 0)
}


runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));