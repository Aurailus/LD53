import { Fragment, h } from 'preact';
import { merge } from '../Util';
import { ClickCheck } from './ClickCheck';
import { useState } from 'preact/hooks';
import { AdvancedProblem, Product, generateNonConflictingProblems } from './Product';
import { useLevel } from '../Level';

import image_reference from '@res/cartridge/reference.png';
import image_base from '@res/cartridge/base.png';
import image_mod_art from '@res/cartridge/mod_art.png';
import image_mod_console from '@res/cartridge/mod_console.png';
import image_mod_mature from '@res/cartridge/mod_mature.png';
import image_mod_region from '@res/cartridge/mod_region.png';
import image_mod_seal from '@res/cartridge/mod_seal.png';
import image_back from '@res/cartridge/back.png';
import image_back_cracker from '@res/cartridge/back_cracker.png';
import image_mod_brand from '@res/cartridge/mod_brand.png';
import image_inside from '@res/cartridge/inside.png';
import image_inside_cracker from '@res/cartridge/inside_cracker.png';
import image_mod_circuitboard from '@res/cartridge/mod_circuitboard.png';

const problems: AdvancedProblem[] = [
	{ identifier: 'art', description: 'Art matches reference image.' },
	{ identifier: 'console', description: 'Console name is \'DX2\'.' },
	{ identifier: 'rating', description: 'Has correct age rating (E).' },
	{ identifier: 'region', description: 'Has region marker.' },
	{ identifier: 'seal', description: 'Has seal of approval.' },
	{ identifier: 'brand', description: 'Has marking on the back.' },
	{ identifier: 'circuitboard', description: 'Has internal processor chip.', conflicts: [ 'cracker' ] },
	{ identifier: 'cracker', description: 'Free of food residue.', conflicts: [ 'circuitboard' ], special: true }
]

export function Cartridge() {
	const { problemsSet: pr } = useLevel();
	const [ state, setState ] = useState<'front' | 'back' | 'inside'>('front');

	return (
		<div class={merge('w-128 aspect-square relative', pr.has('color') && 'saturate-200')}>
			{state === 'front' ?
				<Fragment>
					<ClickCheck class='!absolute inset-0 w-full' src={image_base} onClick={() => setState('back')}/>
					{pr.has('art') && <img class='!absolute inset-0 w-full interact-none' src={image_mod_art}/>}
					{pr.has('console') && <img class='!absolute inset-0 w-full interact-none' src={image_mod_console}/>}
					{pr.has('rating') && <img class='!absolute inset-0 w-full interact-none' src={image_mod_mature}/>}
					{pr.has('region') && <img class='!absolute inset-0 w-full interact-none' src={image_mod_region}/>}
					{!pr.has('seal') && <img class='!absolute inset-0 w-full interact-none' src={image_mod_seal}/>}
				</Fragment> :
				state === 'back' ?
				<Fragment>
					<ClickCheck class='!absolute inset-0 w-full' src={image_back} onClick={() => setState('inside')}/>
					{pr.has('cracker') && <img class='absolute inset-0 w-full interact-none' src={image_back_cracker}/>}
					{!pr.has('brand') && <img class='!absolute inset-0 w-full interact-none' src={image_mod_brand}/>}
				</Fragment> :
				<Fragment>
					<ClickCheck class='absolute inset-0 w-full' src={image_inside} onClick={() => setState('front')}/>
					{!pr.has('circuitboard') && <img class='!absolute inset-0 w-full interact-none'
						src={image_mod_circuitboard}/>}
					{pr.has('cracker') && <img class='absolute inset-0 w-full interact-none'
						src={image_inside_cracker}/>}
				</Fragment>}
		</div>
	);
}


const product: Product = {
	name: 'Nontondo Video Game Cartridge Franchise Game Play 2018 Edition New',
	component: Cartridge,
	problems,
	image: image_reference,
	reviews: [
		'I hate pokemon 1/5'
	],
	generateProblems: generateNonConflictingProblems(problems)
};

export default product;
