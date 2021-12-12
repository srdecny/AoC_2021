import { runTests } from "../utils";
import { readFileSync } from "fs";

type Map = { [key: string]: string[] };
function parseInput(input: string): Map {
	return input.split("\n").reduce((acc, c) => {
		const [from, to] = c.split("-");
		if (!acc[from]) {
			acc[from] = [];
		}
		if (!acc[to]) {
			acc[to] = [];
		}
		acc[to].push(from);
		acc[from].push(to);
		return acc
	}, {} as Map);
}

type Search = {
	visited: Set<string>;
	path: string[];
	current: string;
}

function part1(input: string): number {
	const map = parseInput(input);
	const searchQueue: Search[] = [{
		visited: new Set(["start"]),
		path: ["start"],
		current: "start"
	}]
	let paths = 0;
	while (searchQueue.length > 0) {
		const search = searchQueue.pop();
		if (search.current === "end") {
			paths++;
			continue;
		}
		for (const next of map[search.current] || []) {
			if (!search.visited.has(next)) {
				const isLowercase = (str: string) => [...str].every(c => c.toLowerCase() === c);
				searchQueue.push({
					visited: isLowercase(next) ? new Set([...search.visited, next]) : new Set([...search.visited]),
					path: [...search.path, next],
					current: next
				})
			}
		}
	}
	return paths;
}

function part2(input: string): number {
	return "";
}


runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));