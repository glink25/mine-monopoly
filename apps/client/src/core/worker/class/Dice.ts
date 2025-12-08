import { DiceInfo, IDice } from "@fatpaper-monopoly/types";
import { clone, result } from "lodash";

class Dice implements IDice {
	public id: string;
	public diceValues: number[] = [1, 2, 3, 4, 5, 6];
	public diceProphecyQueue: number[] = [];

	constructor(diceValues?: number[]) {
		this.id = crypto.randomUUID();
		diceValues && this.setDiceValues(diceValues);
	}

	public addDiceprophecy(prophecy: number) {
		this.diceProphecyQueue.push(prophecy);
	}

	public setDiceValues(values: number[]): void {
		this.diceValues = clone(values);
	}

	public roll() {
		let r: number;
		// 预言
		if (this.diceProphecyQueue.length > 0) {
			r = this.diceProphecyQueue.shift() as number;
		} else {
			r = this.getRandomInteger();
		}
		return { diceValues: this.diceValues, result: r };
	}

	private getRandomInteger() {
		return this.diceValues[Math.floor(Math.random() * this.diceValues.length)];
	}

	public getInfo(): DiceInfo {
		return {
			id: this.id,
			diceValues: this.diceValues,
			diceProphecyQueue: this.diceProphecyQueue,
		};
	}
}

export default Dice;
