import { h } from 'preact';

import { useProduct } from './product/Product';

import clipboard from '@res/room/clipboard.png';
import { merge } from './Util';

interface Props {
	onSelectProblem: (problem: string) => void;
}

export function Checklist(props: Props) {
	const product = useProduct();
	const activeProblem: string = product.tool.type === 'test' ? product.tool.problem : '';

	console.log(activeProblem);

	return (
		<div class='w-[480px] aspect-[120/150] shrink-0 bg-cover p-16' style={{ backgroundImage: `url(${clipboard})` }}>
			<ul>
				{product.problems.map(prob =>
					<li
						key={prob.identifier}
						onClick={() => props.onSelectProblem(prob.identifier)}
						class={merge('text-black', activeProblem === prob.identifier && 'bg-blue-200', prob.found && 'bg-blue-500')}>
						<p>{product.product.problems.find(p => p.identifier == prob.identifier)!.description}</p>
					</li>
				)}
			</ul>
		</div>
	);
}
