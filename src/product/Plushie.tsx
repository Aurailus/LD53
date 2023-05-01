import { Fragment, h } from 'preact';
import { merge } from '../Util';
import { ClickCheck } from './ClickCheck';
import { useState } from 'preact/hooks';
import { AdvancedProblem, Product, generateNonConflictingProblems } from './Product';
import { useLevel } from '../Level';

import image_reference from '@res/plushie/reference.png';
import image_base from '@res/plushie/base.png';
import image_base_beheaded from '@res/plushie/base_beheaded.png';
import image_mod_bomb from '@res/plushie/mod_bomb.png';
import image_mod_ear from '@res/plushie/mod_ear.png';
import image_mod_ear_wrong from '@res/plushie/mod_ear_wrong.png';
import image_mod_eyes from '@res/plushie/mod_eyes.png';
import image_mod_tag from '@res/plushie/mod_tag.png';
import image_mod_tail from '@res/plushie/mod_tail.png';
import image_mod_tail_wrong from '@res/plushie/mod_tail_wrong.png';

const problems: AdvancedProblem[] = [
	{ identifier: 'color', description: 'Color matches reference image.' },
	{ identifier: 'ears', description: 'Ears match reference image.', conflicts: [ 'beheaded' ] },
	{ identifier: 'tail', description: 'Tail matches reference image.' },
	{ identifier: 'eyes', description: 'Has button eyes.', conflicts: [ 'beheaded' ] },
	{ identifier: 'beheaded', description: 'No parts missing.', conflicts: [ 'eyes', 'ears', 'bomb' ] },
	{ identifier: 'tag', description: 'Has a \'PTC\' tag.' },
	{ identifier: 'bomb', description: 'Is not a bomb.', conflicts: [ 'beheaded' ], special: true }
]

export function Plushie() {
	const { problemsSet: pr } = useLevel();
	const [ beheaded, setBeheaded ] = useState(pr.has('beheaded'));

	return (
		<div class={merge('w-128 aspect-square relative', pr.has('color') && 'saturate-200')}>
			{beheaded ?
				<Fragment>
				<img class='absolute inset-0 w-full select-none' src={image_base_beheaded}/>
					{pr.has('bomb') && <ClickCheck class='!absolute inset-0 w-full select-none' src={image_mod_bomb}
						onClick={() => console.log('BOMB!!!')}/>}
					{pr.has('tag') && <img class='!absolute inset-0 w-full select-none' src={image_mod_tag}/>}
					<img class='absolute inset-0 w-full interact-none'
						src={pr.has('tail') ? image_mod_tail_wrong : image_mod_tail}/>
				</Fragment> :
				<Fragment>
					<ClickCheck class='!absolute inset-0 w-full select-none'
						src={image_base} onClick={() => setBeheaded(pr.has('bomb'))}/>
					<img class='!absolute inset-0 w-full interact-none'
						src={pr.has('ears') ? image_mod_ear_wrong : image_mod_ear}/>
					{pr.has('eyes') && <img class='!absolute inset-0 w-full interact-none' src={image_mod_eyes}/>}
					{pr.has('tag') && <img class='!absolute inset-0 w-full interact-none' src={image_mod_tag}/>}
					<img class='!absolute inset-0 w-full interact-none'
						src={pr.has('tail') ? image_mod_tail_wrong : image_mod_tail}/>
				</Fragment>}
		</div>
	);
}


const product: Product = {
	name: '100% Genuine Fabric Cute Game Plushie Adorable Happy Friend For Children 5-6',
	component: Plushie,
	problems,
	yOffset: 8,
	image: image_reference,
	reviews: [
		'I eat one of these things every day. I love the taste of the fabric :) 5/5',
		'Very cute, but the fabric is a bit too chewy. 4/5',
		'I don\'t like how it stares at me with it\'s mournful eyes'
	],
	generateProblems: generateNonConflictingProblems(problems)
};

export default product;
