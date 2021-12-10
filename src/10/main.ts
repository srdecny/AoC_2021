import { runTests } from "../utils";
import { readFileSync } from "fs";

enum CHAR {
	NONE = "",
	CURLY = "}",
	ROUND = ")",
	SQUARE = "]",
	ANGLE = ">",
}

type Incomplete = {
	state: "incomplete"
	stack: CHAR[]
}

type Corrupted = {
	state: "corrupted"
	illegal: CHAR
}

function verify(input: string): Incomplete | Corrupted {
	// check if the string has correct bracket pairing
	const stack: CHAR[] = [];
	for (const char of input) {
		switch (char) {
			case "{":
				stack.push(CHAR.CURLY);
				break;
			case "(":
				stack.push(CHAR.ROUND);
				break;
			case "[":
				stack.push(CHAR.SQUARE);
				break;
			case "<":
				stack.push(CHAR.ANGLE);
				break;
			case "}":
				if (stack.pop() !== CHAR.CURLY) return { state: "corrupted", illegal: CHAR.CURLY };
				break;
			case ")":
				if (stack.pop() !== CHAR.ROUND) return { state: "corrupted", illegal: CHAR.ROUND };
				break;
			case "]":
				if (stack.pop() !== CHAR.SQUARE) return { state: "corrupted", illegal: CHAR.SQUARE };
				break;
			case ">":
				if (stack.pop() !== CHAR.ANGLE) return { state: "corrupted", illegal: CHAR.ANGLE };
				break;
		}
	}
	return {
		state: "incomplete",
		stack,
	}
}

function part1(input: string): number {
	return input.split("\n").map(verify).filter((f): f is Corrupted => f.state == "corrupted").reduce((acc, c) => {
		const points: {[key in CHAR]: number} = {
			[CHAR.NONE]: 0,
			[CHAR.ROUND]: 3,
			[CHAR.SQUARE]: 57,
			[CHAR.CURLY]: 1197,
			[CHAR.ANGLE]: 25137,
		}
		return acc + points[c.illegal];
	}, 0);
}

function part2(input: string): number {
	const scores = input.split("\n").map(verify).filter((f): f is Incomplete => f.state == "incomplete").map(c => {
		let score = 0
		const points: {[key in CHAR]: number} = {
			[CHAR.NONE]: 0,
			[CHAR.ROUND]: 1,
			[CHAR.SQUARE]: 2,
			[CHAR.CURLY]: 3,
			[CHAR.ANGLE]: 4,
		}

		while (c.stack.length > 0) {
			const char = c.stack.pop();
			score = score * 5
			score += points[char]
		}
		return score
	}).sort((a, b) => a - b)
	
	// Return the score in the middle of the list
	return scores[Math.floor(scores.length / 2)]
}


runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));