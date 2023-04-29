import { FunctionalComponent, createContext } from 'preact';
import { useContext } from 'preact/hooks';

export interface Product {
	name: string;

	component: FunctionalComponent;

	yOffset?: number;

	reviews: string[];

	problems: { identifier: string, description: string }[];
};

export type ActiveProblems = {
	identifier: string;
	found: boolean;
}[];

export type Tool = {
	type: 'hand'
} | {
	type: 'test',
	problem: string
};

export interface ProductContext {
	product: Product;
	problems: ActiveProblems;
	tool: Tool;

	onProblem: (problem: string) => void;
	setTool: (tool: Tool) => void;
}

export const ProductContext = createContext<ProductContext>({
	product: null as any,
	problems: [],
	tool: { type: 'hand' },
	onProblem: () => {},
	setTool: () => {}
});

export const useProduct = (): ProductContext => {
	return useContext(ProductContext);
}
