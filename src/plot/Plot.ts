import { Level } from "../Level";

export type Action = {
	type: 'dialogue';
	text: string[];
	ring?: boolean;
	endTone?: boolean;
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
} | {
	type: 'set_score_expectation',
	score: number
} | {
	type: 'set_time_of_day',
	time: 'day' | 'night' | 'snow';
};

export type Plot = Generator<Action, void, any>;
