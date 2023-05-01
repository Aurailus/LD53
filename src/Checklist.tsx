import { h } from 'preact';

import { useLevel } from './Level';

import image_clipboard from '@res/room/clipboard.png';
import image_product_frame from '@res/room/product_frame.png';
import image_clipboard_mark from '@res/room/clipboard_mark.png';


import { merge } from './Util';


interface Props {
	onSelectProblem: (problem: string) => void;
}

export function Checklist(props: Props) {
	const level = useLevel();

	function handleSelectProblem(identifier: string) {
		props.onSelectProblem(identifier);
	}

	return (
		<div class='w-[480px] aspect-[120/150] shrink-0 bg-cover p-16 relative font-computer font-black'
			style={{ backgroundImage: `url(${image_clipboard})` }}>


			<div class='absolute z-10 top-1 -right-2 -rotate-12 will-change-transform scale-[100.5%]'>
				<img src={image_product_frame} class='w-[200px] h-[220px]' />
				<img src={level.product.image} class='absolute top-0 left-0 w-[160px] h-[160px]
					top-3 left-5 scale-[100.5%]' />
			</div>

			<p class='text-3xl text-stone-600 bg-stone-400/75 p-2'>PRODUCT SPECIFICATION</p>

			<div class='border-b-2 border-b-stone-400 pb-3 my-3'>
				<p class='line-clamp-1 text-sm text-stone-600'>{level.company.name}</p>
				<p class='line-clamp-1 text-xl text-stone-950'>{level.product.name}</p>
			</div>

			<ul class='flex flex-col overflow-hidden py-4'>
				{level.product.problems.map((prob, i) =>
					<li
						key={prob.identifier}
						onClick={() => handleSelectProblem(prob.identifier)}
						class={merge('cursor-pointer text-black flex gap-3 relative group py-0.5')}>
						<div class='w-2 h-2 mt-2.5 bg-stone-500 rounded-full shrink-0'></div>
						<p class='font-computer opacity-90 text-stone-900 font-black text-lg select-none'>{level.product.problems.find(p => p.identifier == prob.identifier)!.description}</p>
						<img class={merge('absolute -top-3.5 left-0 w-[352px] interact-none',
							level.flaggedProblems.has(prob.identifier) ? 'group-hover:brightness-75'
							: 'opacity-0 group-hover:opacity-50 grayscale contrast-200')} src={image_clipboard_mark}/>
					</li>
				)}
			</ul>
		</div>
	);
}
