import { runTests } from "../utils";
import { readFileSync } from "fs";

type Points = {[key: number]: number[]};
enum DIRECTION {
	LEFT,
	UP
}

type Fold = [DIRECTION, number];

function parse(input: string): [Points, Fold[]] {
	const [rawPoints, rawFolds] = input.split("\n\n");

	const points = rawPoints.split("\n").reduce((acc, c) => {
		const [x, y] = c.split(",").map(Number);
		if (!acc[y]) acc[y] = []
		acc[y].push(x)
		return acc
	}, {} as Points)
	const height = Math.max(...Object.keys(points).map(c => Number(c)))
	for (let y = 0; y <= height; y++) {
		if (!points[y]) points[y] = []
	}

	const folds = rawFolds.split("\n").map(c => {
		const [dir, dist] = c.split(" ")[2].split("=");
		return [dir === "x" ? DIRECTION.LEFT : DIRECTION.UP, Number(dist)] as Fold
	})

	return [points, folds]

}



function foldPaper(points: Points, fold: Fold): Points {
	const [direction, line] = fold;
	const newPoints: Points = {}
	if (direction === DIRECTION.UP) {
		for (let i = 1; i <= line; i++) {
			const mergedPoints = [...new Set([...points[line + i] || [], ...points[line - i] || []])]
			newPoints[line - i] = mergedPoints
		}
	} else {
		Object.entries(points).forEach(([key, row]) => {
			const mergedPoints = []
			for (let i = 0; i <= line; i++) {
				if (row.includes(line - i) || row.includes(line + i)) mergedPoints.push(line - i)
			}
			newPoints[Number(key)] = [...new Set(mergedPoints)]
		})
	}
	return newPoints
}

function printPoints(points: Points) {
	const maxLength = Math.max(...Object.values(points).map(c => Math.max(...c)))
	const maxWidth = Math.max(...Object.keys(points).map(c => Number(c)))
	for (let i = 0; i <= maxWidth; i++) {
		for (let j = 0; j <= maxLength; j++) {
			if (points[i] && points[i].includes(j)) {
				process.stdout.write("#")
			} else {
				process.stdout.write(" ")
			}
		}
		process.stdout.write("\n")
	}
}

function part1(input: string): number {
	const [points, folds] = parse(input);
	const firstFold = foldPaper(points, folds[0]);
	return Object.values(firstFold).reduce((acc, c) => acc + c.length, 0)
}

function part2(input: string): string|number {
	const [points, folds] = parse(input);
	let finalPoints = folds.reduce((acc, c) => foldPaper(acc, c), points);
	printPoints(finalPoints)

	return 0
}


runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input))