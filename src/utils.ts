import { readFileSync } from "fs";

export function getLines(path: string, delimiter: string = "\n") {
    return readFileSync(path, "utf8").trim().split(delimiter);
}

export const range = (start: number, end: number): number[] => {
    if (start <= end) {
        return Array.from({length: (end + 1 - start)}, (_, k) => k + start);
    } else return range(end, start);
}

export const eachCons = <T>(n: number, arr: T[]): T[][] => {
		const result: T[][] = [];
		for (let i = 0; i < (arr.length - n + 1); i++) {
				result.push([...arr.slice(i, i + n)]);
		}
		return result;
}

interface TestCase {
	"input": string;
	"expected" : string;
}

export const runTests = (testFile: string, part1: (input: string) => string, part2: (input: string) => string) => {
		const testSamples: Record<string, [TestCase]> = JSON.parse(readFileSync(testFile, "utf8"));
	["part1", "part2"].forEach(part => {
			testSamples[part].forEach(test => {
				const testInput = readFileSync(test.input, "utf8");
				const result = part === "part1" ? part1(testInput) : part2(testInput);
				if (result !== test.expected) {
					console.log(`Test failed for ${part}: ${test.input}`);
					console.log(`Expected: ${test.expected}`);
					console.log(`Got: ${result}`);
				}
			});
		})
		console.log("-------")
}