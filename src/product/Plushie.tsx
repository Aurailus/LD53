import { Fragment, h } from 'preact';
import { merge } from '../Util';
import { ClickCheck } from './ClickCheck';
import { useState } from 'preact/hooks';
import type { Product, useProduct } from './Product';

import image_base from '@res/plushie/base.png';
import image_base_beheaded from '@res/plushie/base_beheaded.png';
import image_mod_bomb from '@res/plushie/mod_bomb.png';
import image_mod_ear from '@res/plushie/mod_ear.png';
import image_mod_ear_wrong from '@res/plushie/mod_ear_wrong.png';
import image_mod_eyes from '@res/plushie/mod_eyes.png';
import image_mod_tag from '@res/plushie/mod_tag.png';
import image_mod_tail from '@res/plushie/mod_tail.png';
import image_mod_tail_wrong from '@res/plushie/mod_tail_wrong.png';

const problems = [
	{ identifier: 'color', description: 'Product has correct color.' },
	{ identifier: 'ears', description: 'Product has correct ears.' },
	{ identifier: 'eyes', description: 'Product has button eyes.' },
	{ identifier: 'tag', description: 'Product has the correct tag.' },
	{ identifier: 'tail', description: 'Product has fluffy tail.' },
	{ identifier: 'bomb', description: 'Product is not a bomb.' }
]

export function Plushie() {
	const problems = new Set<string>([ 'eyes', 'ears', 'tag', 'bomb' ]);

	const [ beheaded, setBeheaded ] = useState(false);

	// const product = useProduct();

	return (
		<div class={merge('w-128 aspect-square relative', problems.has('color') && 'saturate-200')}>
			{beheaded ?
				<Fragment>
				<img class='absolute inset-0 w-full' src={image_base_beheaded}/>
					{problems.has('bomb') && <ClickCheck class='absolute inset-0 w-full' src={image_mod_bomb}
						onClick={() => console.log('BOMB!!!')}/>}
					{problems.has('tag') && <ClickCheck class='absolute inset-0 w-full' src={image_mod_tag}
						onClick={() => console.log('tag')}/>}
					<ClickCheck class='absolute inset-0 w-full' src={problems.has('tail') ? image_mod_tail_wrong : image_mod_tail}
						onClick={() => console.log('tail!')}/>
				</Fragment> :
				<Fragment>
					<ClickCheck class='absolute inset-0 w-full' src={image_base} onClick={() => setBeheaded(true)}/>
					<ClickCheck class='absolute inset-0 w-full' src={problems.has('ears') ? image_mod_ear_wrong : image_mod_ear}
						onClick={() => console.log('ears')}/>
					{problems.has('eyes') && <ClickCheck class='absolute inset-0 w-full' src={image_mod_eyes}
						onClick={() => console.log('eyes!')}/>}
					{problems.has('tag') && <ClickCheck class='absolute inset-0 w-full' src={image_mod_tag}
						onClick={() => console.log('tag')}/>}
					<ClickCheck class='absolute inset-0 w-full' src={problems.has('tail') ? image_mod_tail_wrong : image_mod_tail}
						onClick={() => console.log('tail!')}/>
				</Fragment>}
		</div>
	);
}


const product: Product = {
	name: '100% Genuine Fabric Cute Game Plushie Adorable Happy Friend For Children 5-6',
	component: Plushie,
	problems,
	yOffset: 8,
	reviews: [
		'I eat one of these things every day. I love the taste of the fabric :) 5/5 I eat one of these things every day. I love the taste of the fabric :) 5/5'
	]
};

export default product;
