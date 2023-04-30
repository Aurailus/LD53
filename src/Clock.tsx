import { Fragment, h } from 'preact';

import image_clock from '@res/room/clock.png';

interface Props {
	current: number;
	quota: number;
	ticks: number;
}

export default function Clock(props: Props) {
	return (
		<div class='fixed p-8 pt-9 top-0 left-0 flex w-[512px] h-[128px] bg-cover'
			style={{ backgroundImage: `url(${image_clock})` }}>
			<p class={'text-red-400 text-3xl font-black font-computer w-44 mr-14 text-center ml-0.5'}>
				0:{props.ticks.toString().padStart(2, '0')}
			</p>
			<p class={'text-red-400 text-3xl font-black font-computer w-[7.75rem] flex justify-center pr-2'}>
				<span class='w-10 inline-block text-right'>{props.current}</span>
				<span class='w-6 inline-block text-center text-red-500/75'>/</span>
				<span class='inline-block text-red-500/75'>{props.quota}</span>
			</p>
		</div>
	)
}
