import { Fragment, h } from 'preact';
import { merge } from '../Util';
import { ClickCheck } from './ClickCheck';
import { useState } from 'preact/hooks';
import type { Product, useProduct } from './Product';

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

const problems = [
	{ identifier: 'art', description: 'Product has correct art.' },
	{ identifier: 'console', description: 'Product has the correct console name.' },
	{ identifier: 'rating', description: 'Product has the correct age rating.' },
	{ identifier: 'region', description: 'Product has the correct region.' },
	{ identifier: 'seal', description: 'Product has a seal of approval.' },
	{ identifier: 'brand', description: 'Product is marked on the reverse.' },
	{ identifier: 'circuitboard', description: 'Product has all of its internals intact.' },
	{ identifier: 'cracker', description: 'Product is free of food residue.' }
]

export function Cartridge() {
	const problems = new Set<string>([  'cracker' ]);

	const [ state, setState ] = useState<'front' | 'back' | 'inside'>('front');

	return (
		<div class={merge('w-128 aspect-square relative', problems.has('color') && 'saturate-200')}>
			{state === 'front' ?
				<Fragment>
					<ClickCheck class='absolute inset-0 w-full' src={image_base} onClick={() => setState('back')}/>
					{problems.has('art') && <ClickCheck class='absolute inset-0 w-full' src={image_mod_art}
						onClick={() => console.log('art')}/>}
					{problems.has('console') && <ClickCheck class='absolute inset-0 w-full' src={image_mod_console}
						onClick={() => console.log('console')}/>}
					{problems.has('rating') && <ClickCheck class='absolute inset-0 w-full' src={image_mod_mature}
						onClick={() => console.log('rating')}/>}
					{problems.has('region') && <ClickCheck class='absolute inset-0 w-full' src={image_mod_region}
						onClick={() => console.log('region')}/>}
					{!problems.has('seal') && <ClickCheck class='absolute inset-0 w-full' src={image_mod_seal}
						onClick={() => console.log('seal')}/>}
				</Fragment> :
				state === 'back' ?
				<Fragment>
					<ClickCheck class='absolute inset-0 w-full' src={image_back} onClick={() => setState('inside')}/>
					{!problems.has('brand') && <ClickCheck class='absolute inset-0 w-full' src={image_mod_brand}
						onClick={() => console.log('brand')}/>}
					{problems.has('cracker') && <img class='absolute inset-0 w-full interact-none'
						src={image_back_cracker}/>}
				</Fragment> :
				<Fragment>
					<img class='absolute inset-0 w-full' src={image_inside}/>
					{!problems.has('circuitboard') && <ClickCheck class='absolute inset-0 w-full' src={image_mod_circuitboard}
						onClick={() => console.log('circuitboard')}/>}
					{problems.has('cracker') && <img class='absolute inset-0 w-full interact-none'
						src={image_inside_cracker}/>}
				</Fragment>}
		</div>
	);
}


const product: Product = {
	name: 'Cartridge',
	component: Cartridge,
	problems,
	reviews: [
		'I hate pokemon 1/5'
	]
};

export default product;
