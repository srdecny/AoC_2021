import { runTests } from "../utils";
import { readFileSync } from "fs";
import { assert } from "console";

type InnerNode = {
	name: "inner",
	left: Node,
	right: Node,
}

type ValueNode = {
	name: "value",
	value: number,
}

type Node = InnerNode | ValueNode;

function addNodes(first: Node, second: Node): Node {
	return {
		name: "inner",
		left: first,
		right: second,
	}
}

function isValueNode(node: Node): node is ValueNode {
	return node.name == "value";
}

function isInnerNode(node: Node): node is InnerNode {
	return node.name == "inner";
}

function printNode(node: Node): string {
	if (isValueNode(node)) {
		return node.value.toString()
	} else {
		return `[${printNode(node.left)},${printNode(node.right)}]`
	}
}

function parse(input: string[]): Node {
	const action = input.shift();
	if (action === "[") {
			const left = parse(input);
			assert(input.shift() == ",")
			const right = parse(input);
			assert(input.shift() == "]")
			return addNodes(left, right);
	} else {
		return {
			name: "value",
			value: parseInt(action),
		}
	}
}

type TreeOrder = {
	node: Node,
	depth: number,
}

function traverseTree(node: Node, depth: number): TreeOrder[] {
	if (node.name === "inner") {
		return [
			...traverseTree(node.left, depth + 1),
			{ node, depth },
			...traverseTree(node.right, depth + 1),
		]
	} else {
		return [
			{ node, depth },
		]
	}
} 

// Returns true if any exploded
function explode(order: TreeOrder[]): boolean {
	const toExplodeIdx = order.findIndex(o => o.depth == 4 && isInnerNode(o.node));
	if (toExplodeIdx == -1) return false
	const nodeToExplode = order[toExplodeIdx].node;
	if (isInnerNode(nodeToExplode) && isValueNode(nodeToExplode.left) && isValueNode(nodeToExplode.right)) {
		const valueNodeToLeft = order.filter((n, idx) => idx < toExplodeIdx - 1 && isValueNode(n.node)).reverse()[0]?.node;
		if (valueNodeToLeft && isValueNode(valueNodeToLeft)) {
			valueNodeToLeft.value += nodeToExplode.left.value
		}
		const valueNodeToRight = order.find((n, idx) => idx > toExplodeIdx + 1 && isValueNode(n.node))?.node;
		if (valueNodeToRight && isValueNode(valueNodeToRight)) {
			valueNodeToRight.value += nodeToExplode.right.value
		}
		// Evil hack, we can't reassign node with a value node because other nodes keep a reference to it
		// @ts-ignore
		nodeToExplode.name = "value"
		// @ts-ignore
		nodeToExplode.value = 0
		delete nodeToExplode.left
		delete nodeToExplode.right

	} else throw Error("Exploding a node that has a non-value child")
	return true
}

// returns true if any splitted
function split(order: TreeOrder[]): boolean {
	const toSplitIdx = order.findIndex(o => isValueNode(o.node) && o.node.value > 9);
	if (toSplitIdx == -1) return false
	const nodeToSplit = order[toSplitIdx].node;
	if (isValueNode(nodeToSplit)) {
		const newLeft: ValueNode = {
			name: "value",
			value:  Math.floor(nodeToSplit.value / 2),
		}
		const newRight: ValueNode = {
			name: "value",
			value: Math.ceil(nodeToSplit.value / 2),
		}
		// @ts-ignore
		nodeToSplit.name = "inner"
		// @ts-ignore
		nodeToSplit.left = newLeft
		// @ts-ignore
		nodeToSplit.right = newRight
		delete nodeToSplit.value
		return true
	}
}

function magnitude(node: Node): number {
	if (isValueNode(node)) {
		return node.value
	} else {
		return 3 * magnitude(node.left) + 2 * magnitude(node.right)
	}
}


function sumNodes (first: Node, second: Node): Node {
		let root = addNodes(first, second);
		let order = traverseTree(root, 0);
		while (true) {
			order = traverseTree(root, 0);
			const hasExploded = explode(order);
			if (hasExploded) continue;
			order = traverseTree(root, 0);
			const hasSplitted = split(order);
			if (hasSplitted) continue;
			break;
		}
		return root
}

function part1(input: string): number {
	const nodes = input.split("\n").map(l => parse(l.split("")));
	const final = nodes.reduce((acc, node) => sumNodes(acc, node))
	return magnitude(final)
}

function part2(input: string): number {
	let nodes = input.split("\n").map(l => parse(l.split("")));
	const clone = (obj: any) => JSON.parse(JSON.stringify(obj));
	let maxMagniture = -Infinity
	for (let i = 0; i < nodes.length; i++) {
		for (let j = 0; j < nodes.length; j++) {
			if (i == j) continue;
			const final = sumNodes(clone(nodes[i]), clone(nodes[j]));
			const newMagnitude = magnitude(final)
			if (newMagnitude > maxMagniture) maxMagniture = newMagnitude
		}
	}
	return maxMagniture
}


runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));