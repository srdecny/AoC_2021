import { eachCons, runTests } from "../utils";
import { readFileSync } from "fs";

type Rules = { [key: string] : string}

function parse(input: string): [string, Rules] {
	const [initial, rawRules] = input.split("\n\n");
	const rules = rawRules.split("\n").reduce((acc, rule) => {
		const [from, to] = rule.split(" -> ");
		acc[from] = to;
		return acc
	}, {} as Rules)
	return [initial, rules];
}

type State = {
	pairs: { [key: string] : number}
	lastPair: string
}

function step(rules: Rules, state: State): State {
	const newState: State = { pairs: {}, lastPair: "" }
	const addPair = (pair: string, count: number) => {
		if (!newState.pairs[pair]) {
			newState.pairs[pair] = count;
		} else {
			newState.pairs[pair] += count;
		}
	}

	Object.entries(state.pairs).forEach(([pair, count]) => {
		if (rules[pair]) {
			const [first, second] = pair.split("");
			addPair(first + rules[pair], count);
			addPair(rules[pair] + second, count);
		}
		else {
			addPair(pair, count);
		}
	})

	if (!rules[state.lastPair]) {
		newState.lastPair = state.lastPair
	} else {
			const [first, second] = state.lastPair.split("");
			addPair(first + rules[state.lastPair], 1);
			newState.lastPair = rules[state.lastPair] + second
	}

	return newState;
}

function scorePolymer(state: State): number {
	const elementCount = Object.entries(state.pairs).reduce((acc, [pair, count]) => {
		const letter = pair[0]
		acc[letter] = (acc[letter] || 0) + count;
		return acc
	}, {} as { [key: string] : number });

	[...state.lastPair].forEach(letter => elementCount[letter]++)
	return Math.max(...Object.values(elementCount)) - Math.min(...Object.values(elementCount))
}

function initialState(input: string): State {
	const pairs = eachCons(2, [...input])
	const state: State = { pairs: {}, lastPair: "" }
	for (let i = 0; i < pairs.length - 1; i++) {
		const pair = pairs[i].join("")
		state.pairs[pair] = (state.pairs[pair] || 0) + 1
	}
	state.lastPair = pairs[pairs.length - 1].join("")
	return state
}

function part1(input: string): number {
	let [polymer, rules] = parse(input);
	let state = initialState(polymer);
	for (let i = 0; i < 10; i++) {
		state = step(rules, state);
	}
	return scorePolymer(state)
}

function part2(input: string): string|number {
	let [polymer, rules] = parse(input);
	let state = initialState(polymer);
	for (let i = 0; i < 40; i++) {
		state = step(rules, state);
	}
	return scorePolymer(state)
}


runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));