import { readFileSync } from "fs";

export function getLines(path: string, delimiter: string = "\n") {
    return readFileSync(path, "utf8").trim().split(delimiter);
}

export const range = (start: number, end: number): number[] => {
    if (start <= end) {
        return Array.from({length: (end + 1 - start)}, (_, k) => k + start);
    } else {
        return Array.from({length: (start + 1 - end)}, (_, k) => start - k);
		}
}

export const eachCons = <T>(n: number, arr: T[]): T[][] => {
		const result: T[][] = [];
		for (let i = 0; i < (arr.length - n + 1); i++) {
				result.push([...arr.slice(i, i + n)]);
		}
		return result;
}

export const transpose = <T>(matrix: T[][]): T[][] => {
		return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

interface TestCase {
	"input": string;
	"expected" : string;
}

type Solution = (input: string) => string | number;

export const runTests = (testFile: string, part1: Solution, part2: Solution) => {
		const testSamples: Record<string, [TestCase]> = JSON.parse(readFileSync(testFile, "utf8"));
	["part1", "part2"].forEach(part => {
			testSamples[part].forEach(test => {
				const testInput = readFileSync(test.input, "utf8");
				const result = part === "part1" ? part1(testInput) : part2(testInput);
				if (result.toString() !== test.expected) {
					console.log(`Test failed for ${part}: ${test.input}`);
					console.log(`Expected: ${test.expected}`);
					console.log(`Got: ${result}`);
				}
			});
		})
		console.log("-------")
}