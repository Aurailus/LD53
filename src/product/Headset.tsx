import { Fragment, h } from 'preact';
import { merge } from '../Util';
import { ClickCheck } from './ClickCheck';
import { useState } from 'preact/hooks';
import { Product, generateNonConflictingProblems } from './Product';
import { useLevel } from '../Level';

import image_reference from '@res/headset/reference.png';
import image_base from '@res/headset/base.png';
import image_base_mod_strap from '@res/headset/base_mod_strap.png';
import image_flipped_on from '@res/headset/flipped_on.png';
import image_flipped_off from '@res/headset/flipped_off.png';
import image_flipped_mod_strap from '@res/headset/flipped_mod_strap.png';
import image_controller from '@res/headset/controller.png';
import image_controller_mod_dpad from '@res/headset/controller_mod_dpad.png';
import image_controller_mod_straps from '@res/headset/controller_mod_straps.png';
import image_base_mod_logo from '@res/headset/base_mod_logo.png';

const problems = [
	{ identifier: 'broken', description: 'Turns on and lights up.' },
	{ identifier: 'strapless', description: 'Headstrap included.' },
	{ identifier: 'color', description: 'Color matches reference image.' },
	{ identifier: 'logo', description: 'Logo is oriented correctly.' },
	// { identifier: 'controllers', description: 'Controllers are included.' },
	{ identifier: 'straps', description: 'Controllers have wrist straps.' },
	{ identifier: 'dpad', description: 'Controllers have analog input.' },
	// { identifier: 'amogos', description: 'Product is not sus.', special: true }
]

export function Headset() {
	const { problemsSet: pr } = useLevel();

	const [ state, setState ] = useState<'front' | 'back' | 'controllers'>('front');

	return (
		<div class={merge('w-128 aspect-square relative', pr.has('color') && 'hue-rotate-30')}>
			{state === 'front' ?
				<Fragment>
					<ClickCheck class='!absolute inset-0 w-full' src={image_base} onClick={() => setState('back')}/>
					{!pr.has('strapless') && <img class='absolute inset-0 w-full interact-none' src={image_base_mod_strap}/>}
					{pr.has('logo') && <img class='absolute inset-0 w-full interact-none' src={image_base_mod_logo}/>}
				</Fragment> :
				state === 'back' ?
				<Fragment>
					<ClickCheck class='!absolute inset-0 w-full' src={pr.has('broken') ? image_flipped_off : image_flipped_on}
						onClick={() => setState('controllers')}/>
					{!pr.has('strapless') && <img class='absolute inset-0 w-full interact-none' src={image_flipped_mod_strap}/>}
				</Fragment> :
				<Fragment>
					<ClickCheck class='!absolute inset-0 w-full' src={image_controller} onClick={() => setState('front')}/>
					{pr.has('dpad') && <img class='absolute inset-0 w-full interact-none' src={image_controller_mod_dpad}/>}
					{!pr.has('straps') && <img class='absolute inset-0 w-full interact-none' src={image_controller_mod_straps}/>}
				</Fragment>
			}
		</div>
	);
}


const product: Product = {
	name: 'Monoculus Virtual Reality VR Reality Headset For PC XBox Macintosh Gamecube Console PC Control Video Game',
	component: Headset,
	problems,
	image: image_reference,
	yOffset: -8,
	reviews: [
		'I love how realistic the rocks look, it\'s like I\'m really there!',
	],
	generateProblems: generateNonConflictingProblems(problems)
};

export default product;
