import { range, runTests } from "../utils";
import { readFileSync } from "fs";

type Bits = number[]

type LiteralPacket = {
	name: "literal",
	value: number
}

type OperatorPacket = {
	name: "operator",
	type: number
	packets: Packet[]
}

type Content = LiteralPacket | OperatorPacket

type Packet = {
	version: number,
	content: Content
}

function hex2bin(hex: string): Bits {
	var out = "";
	for(var c of hex) {
			switch(c) {
					case '0': out += "0000"; break;
					case '1': out += "0001"; break;
					case '2': out += "0010"; break;
					case '3': out += "0011"; break;
					case '4': out += "0100"; break;
					case '5': out += "0101"; break;
					case '6': out += "0110"; break;
					case '7': out += "0111"; break;
					case '8': out += "1000"; break;
					case '9': out += "1001"; break;
					case 'A': out += "1010"; break;
					case 'B': out += "1011"; break;
					case 'C': out += "1100"; break;
					case 'D': out += "1101"; break;
					case 'E': out += "1110"; break;
					case 'F': out += "1111"; break;
					default: throw Error("Invalid hex character: " + c);
			}
	}
	return out.split('').map(Number);

}

function bin2dec(bits: Bits): number {
	return parseInt(bits.join(''), 2);
}

function parsePacket (packet: Bits): Packet {
	const take = (count: number): Bits => range(1, count).reduce((acc, _) => acc.concat(packet.shift()), []);
	const version = bin2dec(take(3));
	const id = bin2dec(take(3));

	if (id === 4) {
		const parseLiteral = () => {
			let notLast = 1;
			let bits: number[] = []
			while ((notLast = packet.shift())) {
				bits = bits.concat(take(4));
			}
			bits = bits.concat(take(4));
			return bin2dec(bits);
		}
		return {
			version,
			content: {
				name: "literal",
				value: parseLiteral()
			}
		}
	} else {
		let mode = packet.shift();
		const packets: Packet[] = []
		if (mode === 0) { // bitcount
			const count = bin2dec(take(15));
			const rawBits = take(count);
			while (rawBits.length) {
				packets.push(parsePacket(rawBits));
			}
		} else { // subpackets
			let packetCount = bin2dec(take(11));
			while (packetCount--) {
				packets.push(parsePacket(packet));
			}
		}
		return {
			version,
			content: {
				name: "operator",
				type: id,
				packets: packets
			}
		}
	}
}

function sumVersions(packet: Packet): number {
	if (packet.content.name === "literal") {
		return packet.version;
	} else {
		return packet.content.packets.reduce((acc, p) => acc + sumVersions(p), packet.version);
	}
}

function part1(input: string): number {
	const res = parsePacket(hex2bin(input));
	return sumVersions(res);
}

function evaluate(packet: Packet): number {
	if (packet.content.name === "literal") {
		return packet.content.value;
	} else {
		switch (packet.content.type) {
			case 0: return packet.content.packets.reduce((acc, p) => acc + evaluate(p), 0);
			case 1: return packet.content.packets.reduce((acc, p) => acc * evaluate(p), 1);
			case 2: return packet.content.packets.reduce((acc, p) => Math.min(acc, evaluate(p)), Infinity);
			case 3: return packet.content.packets.reduce((acc, p) => Math.max(acc, evaluate(p)), -Infinity);
			case 5: return evaluate(packet.content.packets[0]) > evaluate(packet.content.packets[1]) ? 1 : 0;
			case 6: return evaluate(packet.content.packets[0]) < evaluate(packet.content.packets[1]) ? 1 : 0;
			case 7: return evaluate(packet.content.packets[0]) === evaluate(packet.content.packets[1]) ? 1 : 0;
		}
	}
}

function part2(input: string): number {
	const tree = parsePacket(hex2bin(input));
	return evaluate(tree);
}


runTests("tests.json", part1, part2);
const input = readFileSync("input.txt", "utf8").trim();
console.log("Part 1: " + part1(input));
console.log("Part 2: " + part2(input));