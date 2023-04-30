import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

import { Company } from './company/Company';
import { Product } from "./product/Product";

export interface Level {
	product: Product;
	company: Company;
	problems: string[];
	customer: string;
}

export interface LevelContext extends Level {
	problemsSet: Set<string>;
	flaggedProblems: Set<string>;
}

export const LevelContext = createContext<LevelContext>(null as any);

export const useLevel = (): LevelContext => {
	return useContext(LevelContext);
}

export type ResultType = 'correct' | 'incorrect_invalid_evidence' | 'incorrect_verdict';

export interface LevelResult {
	level: Level;
	flaggedProblems: Set<string>;
	verdict: 'approved' | 'denied';
	result: ResultType;
	hour: number;
	currentComplete: number;
	quota: number;
}
