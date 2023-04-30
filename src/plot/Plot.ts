import { Level } from "../Level";

export type Action = {
	type: 'dialogue';
	text: string[];
	ring?: boolean;
} | {
	type: 'ui';
	key: string;
	show: boolean;
} | {
	type: 'level';
	level: Level
} | {
	type: 'await',
	what: 'complete' | 'approve' | 'deny' | 'time',
	time?: number
} | {
	type: 'flag_problem',
	key: string
} | {
	type: 'required_evidence',
	amount: number;
} | {
	type: 'set_quota',
	quotas: number[];
} | {
	type: 'set_wave_ticks',
	ticks: number;
} | {
	type: 'set_wave'
	wave: number
}

export type Plot = Generator<Action, void, any>;
