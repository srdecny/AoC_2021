import { transpose, runTests } from "../utils";
import { readFileSync } from "fs";

type Matrix = GameLine[];
type GameLine = number[]

function parseInput(input: string): [number[], Matrix[]] {
	const numbers = input.split("\n")[0].split(",").map(Number);
	const matriceLines = input.split("\n")
			.slice(2)
			.filter(l => l.length > 0)
			.map(m => m.split(" ").filter(l => l.length > 0).map(Number));
	const matrices = matriceLines.reduce((acc: Matrix[], cur, i) => {
		if (i % 5 === 0) {
			acc.push([]);
		}
		acc[acc.length - 1].push(cur);
		return acc;
	}, []);
	return [numbers, matrices];

}
enum GameResult { FIRST_WINS, LAST_WINS }
function solve(input: string, result: GameResult): number {
	const [numbers, matrices] = parseInput(input);
	type Order = {[key: number]: number};
	const numberOrder: Order = numbers.reduce((acc, cur, i) => (acc[cur] = i, acc), {} as Order);

	const resolvedBoards = matrices.map(m => {
		const lines = [...m, ...transpose(m)];
		const order = lines.map(l => l.map(n => numberOrder[n]));
		return order as GameLine[];
	})

	const winningOrder = resolvedBoards.map(b => Math.min(...b.map(line => Math.max(...line))))
	const winningTurn = result == GameResult.FIRST_WINS ? Math.min(...winningOrder) : Math.max(...winningOrder)
	const winningBoard = matrices[winningOrder.indexOf(winningTurn)]
	const playedNumbers = numbers.slice(0, winningTurn + 1);
	const remainingNumbers: number[] = winningBoard.flat(2).filter(n => !playedNumbers.includes(n))
	return remainingNumbers.reduce((acc, cur) => acc + cur, 0) * numbers[winningTurn];
}

function part1(input: string): number {
	return solve(input, GameResult.FIRST_WINS)
}

function part2(input: string): number {
	return solve(input, GameResult.LAST_WINS)
}


runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));