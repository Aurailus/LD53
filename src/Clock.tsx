import { Fragment, h } from 'preact';

import image_clock from '@res/room/clock.png';
import { TIME_HOURS, TIME_MINUTES } from './Game';

interface Props {
	time: number;
	quota: number;
	current: number;
}

export default function Clock(props: Props) {
	return (
		<div class='fixed p-8 pt-9 top-0 left-0 flex w-[512px] h-[128px] bg-cover'
			style={{ backgroundImage: `url(${image_clock})` }}>
			<p class={'text-red-400 text-3xl font-black font-computer w-44 mr-14 text-center ml-0.5'}>
				{(Math.floor(props.time / TIME_MINUTES) + 8) % 12 + 1}:{((props.time % TIME_MINUTES) * 10).toString().padStart(2, '0')} {props.time < (TIME_MINUTES * 3) ? 'AM' : 'PM'}
			</p>
			<p class={'text-red-400 text-3xl font-black font-computer w-[7.75rem] flex justify-center pr-2'}>
				<span class='w-10 inline-block text-right'>{props.current}</span>
				<span class='w-6 inline-block text-center text-red-500/75'>/</span>
				<span class='inline-block text-red-500/75'>{props.quota}</span>
			</p>
		</div>
	)
}
