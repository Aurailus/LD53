import { Fragment, h } from 'preact';
import { merge } from '../Util';
import { ClickCheck } from './ClickCheck';
import { useMemo, useState } from 'preact/hooks';
import { Product, generateNonConflictingProblems } from './Product';
import { useLevel } from '../Level';

import { Howl } from 'howler';
import sound_product_interact from '@res/sound/product_interact.wav';

import image_reference from '@res/mobile/reference.png';
import image_base from '@res/mobile/base.png';
import image_mod_screen_off from '@res/mobile/mod_screen_off.png';
import image_mod_screen_on from '@res/mobile/mod_screen_on.png';
import image_mod_notch from '@res/mobile/mod_notch.png';
import image_mod_cutout from '@res/mobile/mod_cutout.png';
import image_mod_logo_android from '@res/mobile/mod_android.png';
import image_mod_logo_apple from '@res/mobile/mod_apple.png';
import image_mod_logo_fraud from '@res/mobile/mod_fraud.png';
import image_mod_battery_full from '@res/mobile/mod_battery_full.png';
import image_mod_battery_empty from '@res/mobile/mod_battery_empty.png';
import image_mod_dead_pixel from '@res/mobile/mod_dead_pixel.png';
import image_mod_broken_screen from '@res/mobile/mod_broken_screen.png';
import image_back from '@res/mobile/back.png';
import image_mod_back_serial from '@res/mobile/back_serial.png';
import image_brand_name_1_false from '@res/mobile/back_brand_name_1_false.png';
import image_brand_name_1 from '@res/mobile/back_brand_name_1.png';
import image_brand_name_2_false from '@res/mobile/back_brand_name_2_false.png';
import image_brand_name_2 from '@res/mobile/back_brand_name_2.png';

const problems = [
	{ identifier: 'broken', description: 'Device turns on.', conflicts: [ 'dead_pixel', 'screen', 'logo', 'battery' ] },
	{ identifier: 'dead_pixel', description: 'Screen has no dead pixels.', conflicts: [ 'broken' ] },
	{ identifier: 'screen', description: 'Screen is free of blemishes.', conflicts: [ 'broken' ] },
	{ identifier: 'serial', description: 'Has serial number on back.' },
	{ identifier: 'logo', description: 'Has authentic logo.', conflicts: [ 'broken' ] },
	{ identifier: 'color', description: 'Is purple or blue.' },
	// { identifier: 'notch', description: 'Has notch or cutout.' },
	{ identifier: 'battery', description: 'Has full battery.', conflicts: [ 'broken' ] },
	{ identifier: 'brand_name', description: 'Has APPLO or ROBOT on back.' },
	// { identifier: 'flipphone', description: 'Is modern revision.', special: true }
]

export function Mobile() {
	const { problemsSet: pr } = useLevel();

	const type = useMemo(() => Math.floor(Math.random() * 2) == 1, []);
	const color = useMemo(() => Math.floor(Math.random() * 2) == 1, []);

	const colorClass = pr.has('color') ? 'hue-rotate-[270deg]' : color ? 'hue-rotate-60' : '';

	const [ state, setState ] = useState<'front_off' | 'front_on' | 'back'>('front_off');

	function interact(side: 'front_off' | 'front_on' | 'back') {
		setState(side);
		new Howl({ src: sound_product_interact, volume: 1, rate: Math.random() * 0.4 + 0.8 }).play();
	}

	return (
		<div class={merge('w-128 aspect-square relative')}>
			{(state === 'front_off' || (state === 'front_on' && pr.has('broken'))) ?
				<Fragment>
					<ClickCheck class={merge('!absolute inset-0 w-full select-none', colorClass)} src={image_base}
						onClick={() => interact(state === 'front_on' ? 'back' : 'front_on')}/>
					<img class='absolute inset-0 w-full interact-none'
						src={image_mod_screen_off}/>
					{!pr.has('notch') && <img class={merge('absolute inset-0 w-full interact-none', colorClass)}
						src={type ? image_mod_cutout : image_mod_notch}/>}
				</Fragment> :
				state === 'front_on' ?
				<Fragment>
					<ClickCheck class={merge('!absolute inset-0 w-full select-none', colorClass)} src={image_base}
					onClick={() => interact('back')}/>
					<img class='absolute inset-0 w-full interact-none'
						src={image_mod_screen_on}/>
					{!pr.has('notch') && <img class={merge('absolute inset-0 w-full interact-none', colorClass)}
						src={type ? image_mod_cutout : image_mod_notch}/>}
					{pr.has('screen') && <img class='absolute inset-0 w-full interact-none'
						src={image_mod_broken_screen}/>}
					<img class='absolute inset-0 w-full interact-none'
						src={pr.has('logo') ? image_mod_logo_fraud : type ? image_mod_logo_android : image_mod_logo_apple }/>
					<img class='absolute inset-0 w-full interact-none'
						src={pr.has('battery') ? image_mod_battery_empty: image_mod_battery_full}/>
					{pr.has('dead_pixel') && <img class='absolute inset-0 w-full interact-none'
						src={image_mod_dead_pixel}/>}
				</Fragment> :
				<Fragment>
					<ClickCheck class={merge('!absolute inset-0 w-full select-none', colorClass)}
						src={image_back} onClick={() => interact('front_off')}/>
					{!pr.has('serial') && <img class={merge('absolute inset-0 w-full interact-none', colorClass)} src={image_mod_back_serial}/>}
					<img class={merge('absolute inset-0 w-full interact-none', colorClass)} src={pr.has('brand_name') ?
						type ? image_brand_name_1_false : image_brand_name_2_false :
						type ? image_brand_name_2 : image_brand_name_1 }/>
				</Fragment>
			}
		</div>
	);
}

const product: Product = {
	name: 'Genuine Premium Brand Smartphone Application App Store Facbok Twidder Instapix Chatgram Battery Phone Online',
	component: Mobile,
	problems,
	image: image_reference,
	yOffset: -24,
	reviews: [
		'I can see my house on the maps app!',
	],
	generateProblems: generateNonConflictingProblems(problems)
};

export default product;
