import { FunctionalComponent, createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { Company } from '../company/Company';

export interface Product {
	name: string;
	component: FunctionalComponent;
	yOffset?: number;
	reviews: string[];
	image: string;
	problems: { identifier: string, description: string }[];
	generateProblems: (difficulty: number, requredProblems: number) => string[];
};

export type AdvancedProblem = {
	identifier: string, description: string, conflicts?: string[], special?: boolean;
}

export function generateNonConflictingProblems(
	problems: AdvancedProblem[]) {

	return (difficulty: number, requiredProblems: number) => {
		const problemsSet = new Set<string>();
		const nonSpecial = problems.filter(p => !p.special).length;
		const numEvidence =  Math.min(Math.floor(Math.pow(Math.random(), 2)
			* 3 * (1/Math.max(difficulty, 1))) + requiredProblems, nonSpecial);
		while (problemsSet.size < numEvidence) {
			const newProblem = problems[Math.floor(Math.random() * problems.length)];
			if (newProblem.special || problemsSet.has(newProblem.identifier)) continue;
			let conflicts = false;
			for (let conflicting of (newProblem.conflicts ?? [])) {
				if (problemsSet.has(conflicting)) {
					conflicts = true;
					break;
				}
			}
			if (conflicts) continue;
			problemsSet.add(newProblem.identifier);
		}
		return [...problemsSet.keys()];
	};
}
