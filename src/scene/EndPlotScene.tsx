import { h } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { Howl } from 'howler';

import { merge } from '../Util';
import { PlotResult } from './PlotScene';

import image_clipboard_lg from '@res/room/clipboard_lg.png';
import image_background_desk from '@res/room/background_desk.png';

import sound_product_interact from '@res/sound/product_interact.wav';
import sound_product_mark from '@res/sound/product_mark.wav';
import sound_clipboard_slide from '@res/sound/clipboard_slide.wav';

import image_stamp_grade_s from '@res/room/stamp_grade_s.png';
import image_stamp_grade_a from '@res/room/stamp_grade_a.png';
import image_stamp_grade_b from '@res/room/stamp_grade_b.png';
import image_stamp_grade_c from '@res/room/stamp_grade_c.png';
import image_stamp_grade_f from '@res/room/stamp_grade_f.png';

const STAMPS: Record<'s' | 'a' | 'b' | 'c' | 'f', string> = {
	s: image_stamp_grade_s,
	a: image_stamp_grade_a,
	b: image_stamp_grade_b,
	c: image_stamp_grade_c,
	f: image_stamp_grade_f,
};

interface Props {
	result: PlotResult;
	onRestart: () => void;
	onContinue: () => void;
}

const SUPERVISOR_COMMENTS: Record<'s' | 'a' | 'b' | 'c' | 'f', string[]> = {
	s: [
		'Wow! You\'re a real pro!',
		'You\'ve exceeded all expectations!',
		'You\'re a real go-getter!',
		'You\'re doing better than I did back in your day!',
		'You\'ll be a manager in no time!'
	],
	a: [
		'Nice job!',
		'You\'re doing great!',
		'You\'re a natural!',
		'You\'re really settling in!',
		'You\'re a asset to the team!'
	],
	b: [
		'Nice one!',
		'You\'re doing well!',
		'You\'re getting there!',
		'Almost there!',
		'You\'re doing fine!'
	],
	c: [
		'Pretty okay!',
		'Could use a bit of work!',
		'With a bit more practice, you\'ll get there!',
		'Close enough!',
		'You\'ll get there some day!'
	],
	f: [
		'Yikes!',
		'Do you need a hand?',
		'Coffee break time!',
		'Give it another shot!',
		'Let\'s try that again!'
	]
};

const CORPORATE_COMMENTS: Record<'s' | 'a' | 'b' | 'c' | 'f', string[]> = {
	s: [
		'Performance: Satisfactory.',
		'You have met expectations.',
		'You will be rewarded for your efforts.',
		'You are a valued employee.',
		'You are a model employee.'
	],
	a: [
		'Performance: Above Average.',
		'You are nearing expectations.',
		'Your efforts are appreciated.',
		'Our employees matter.',
		'Please continue to improve.'
	],
	b: [
		'Performance: Below Average.',
		'You are not meeting expectations.',
		'Your efforts are noted, but insufficient.',
		'82% of your colleagues outperformed you.',
		'Please improve your performance.'
	],
	c: [
		'Performance: Unsatisfactory.',
		'You are not meeting expectations.',
		'You are a liability to the company.',
		'You are a drain on company resources.',
		'Your colleagues talk about you.'
	],
	f: [
		'Performance: Unacceptable.',
		'You have failed to meet expectations.',
		'You are a liability to the company.',
		'Your company vehicle has been repossessed.',
		'Your colleagues do not like you.'
	]
}

const TEXT_COLORS: Record<'s' | 'a' | 'b' | 'c' | 'f', string> = {
	s: 'text-[#0070D6]',
	a: 'text-[#107C3D]',
	b: 'text-[#5B9723]',
	c: 'text-[#9A8127]',
	f: 'text-[#7E1823]'
};

export function EndPlotScene(props: Props) {
	const [ sceneState, setSceneState ] = useState<'in' | 'out'>('in');

	useEffect(() => {
		new Howl({ src: sound_product_mark, volume: 0.7 }).play();
		setTimeout(() => new Howl({ src: sound_product_interact, volume: 0.7 }).play(), 1100);
		setTimeout(() => new Howl({ src: sound_clipboard_slide, volume: 0.7 }).play(), 1400);
	}, []);

	const corporateComment = useMemo(() => {
		return CORPORATE_COMMENTS[props.result.grade][
			Math.floor(Math.random() * CORPORATE_COMMENTS[props.result.grade].length)];
	}, [ props.result.grade ]);

	const supervisorComment = useMemo(() => {
		return SUPERVISOR_COMMENTS[props.result.grade][
			Math.floor(Math.random() * SUPERVISOR_COMMENTS[props.result.grade].length)];
	}, [ props.result.grade ]);

	return (
		<div class={merge('w-screen h-screen overflow-hidden bg-[size:1920px,1080px] bg-center grid place-content-center',
			sceneState === 'in' ? 'animate-scene_in' : 'animate-scene_out')}
			style={{ backgroundImage: `url(${image_background_desk})` }}>

			<div class='w-[688px] h-[872px] bg-cover animate-clipboard_in flex flex-col
				p-14 pr-12 pt-20 font-computer font-black relative'
				style={{ backgroundImage: `url(${image_clipboard_lg})` }}>

				<p class='text-3xl text-stone-600 bg-stone-400/75 p-2 mx-20 my-6 text-center'>PERFORMANCE REVIEW</p>

				<div class='border-b-2 border-b-stone-400 pb-3 my-3 mt-2 mx-5'></div>

				<div class='grid grid-cols-3 gap-8'>
					<p class='text-stone-600 text-2xl text-right col-span-2'>Products Processed</p>
					<p class='text-stone-800 text-2xl text-left'>{props.result.complete}</p>
				</div>
				<div class='grid grid-cols-3 gap-8'>
					<p class='text-stone-600 text-2xl text-right col-span-2'>Products Fumbled</p>
					<p class='text-stone-800 text-2xl text-left'>{props.result.mistakes}</p>
				</div>
				<div class='grid grid-cols-3 gap-8'>
					<p class='text-stone-600 text-2xl text-right col-span-2'>Product Score</p>
					<p class='text-stone-800 text-2xl text-left'>{props.result.subScore}</p>
				</div>
				<div class='grid grid-cols-3 gap-8'>
					<p class='text-stone-600 text-2xl text-right col-span-2'>Careful Bonus</p>
					<p class='text-stone-800 text-2xl text-left'>{props.result.mistakeBonus}</p>
				</div>

				<div class='border-b-2 border-b-stone-400 pb-3 my-3 mt-1 mx-5'></div>

				<div class='grid grid-cols-3 gap-8'>
					<p class='text-stone-600 text-3xl text-right col-span-2'>Final Score</p>
					<p class='text-stone-800 text-3xl text-left'>{props.result.finalScore}</p>
				</div>

				<div class='grid grid-cols-2 gap-8 mt-6'>
					<p class='text-stone-600 text-lg text-right'>Amozom Feedback:</p>
					<p class='text-stone-800 text-lg text-left'>{corporateComment}</p>
				</div>

				<img class='w-[160px] h-[160px] absolute bottom-40 right-20' src={STAMPS[props.result.grade]} />
				<p class={merge('absolute top-[38rem] max-w-xs right-72 text-3xl font-normal font-dialogue text-right -rotate-6',
					TEXT_COLORS[props.result.grade])}>
					{supervisorComment}<br/>
					-Jim
				</p>

				<div class='flex absolute bottom-20 w-full left-0 justify-center gap-4'>
					<button class='bg-stone-400 hover:bg-stone-600110text-stone-900 hover:text-white p-6 py-3 text-xl'
						onClick={props.onRestart}
						>Restart Day</button>
					<button class='bg-stone-400 hover:bg-stone-600 text-stone-900 hover:text-white
						disabled:pointer-events-none disabled:opacity-50 p-6 py-3 text-xl'
						onClick={props.onContinue}
						disabled={props.result.grade === 'f' && !props.result.forceAllowContinue}
						>Continue</button>
				</div>
			</div>

			{/* <h3>End Plot Scene</h3>
			<p>{JSON.stringify(props.result)}</p> */}
		</div>
	);
}
