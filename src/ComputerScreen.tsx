import { Fragment, h } from 'preact';
import { merge } from './Util';
import { useLevel } from './Level';

import image_success from '@res/room/computer_success.png';
import image_failure from '@res/room/computer_failure.png';

interface Props {
	randVal: number;
	state: 'success' | 'failure' | null;
	quota: number;
	current: number;
}

const SUCCESS_MESSAGES = [
	'Your bathroom breaks have been extended by 1 minute',
	'Your pay has increased by 0.0001%',
	'Your company car has been upgraded to a 2005 model',
	'You have been promoted to intern (from intern)',
	'You may now go outside once your work is complete',
	'You have been shipped a new desk-toy',
	'Your children have been returned to you',
	'Keep it up, employee #412341234123'
]

const FAILURE_MESSAGES = [
	'Your bathroom breaks have been terminated',
	'Your family has been notified that you fail',
	'Your pay has been docked 78%',
	'Your company car has been repossessed',
	'You have been demoted to intern',
	'You may no longer go outside',
	'Your house has been foreclosed',
	'Your children have been taken away',
	'Your spouse has left you'
]

export function ComputerScreen(props: Props) {
	const level = useLevel();

	return (
		<div key={props.randVal.toString() + props.state}
			class='block text-green-300 font-computer w-[28rem] h-[16rem] p-3 pt-2 pb-0
			absolute bottom-[29.5rem] left-20 z-0 flex flex-col font-black antialiased animate-screen_activate'>

			{props.state === null && <Fragment>
				<div class='flex justify-between border-b-2 border-green-300 mb-2'>
					<p>Order #{props.randVal % 1000}</p>
					<p>Purchased 23/10/2023</p>
				</div>

				<div class='flex justify-start gap-2 items-center mb-2'>
					<div class='w-7 h-7 bg-green-400 rounded-full'/>
					<p>{level.customer}</p>
				</div>

				<div class='flex justify-start max-w-full overflow-hidden gap-2 mb-2'>
					<div class='w-20 h-20 bg-green-400 rounded shrink-0'/>

					<div class='flex flex-col gap-3 max-w-full overflow-hidden'>
						<p class='overflow-hidden line-clamp-2'>{level.product.name}</p>

						<div class='flex gap-3 items-center'>
							<p class='text-sm'>{level.company.name}</p>

							<div class='flex gap-2'>
								<div class={merge('w-4 h-4 rounded-full',
									level.company.rating >= 1 ? 'bg-green-500' : level.company.rating >= 0.5
										? 'bg-green-700' : 'bg-green-900')}></div>
								<div class={merge('w-4 h-4 rounded-full',
									level.company.rating >= 2 ? 'bg-green-500' : level.company.rating >= 1.5
										? 'bg-green-700' : 'bg-green-900')}></div>
								<div class={merge('w-4 h-4 rounded-full',
									level.company.rating >= 3 ? 'bg-green-500' : level.company.rating >= 2.5
										? 'bg-green-700' : 'bg-green-900')}></div>
								<div class={merge('w-4 h-4 rounded-full',
									level.company.rating >= 4 ? 'bg-green-500' : level.company.rating >= 3.5
										? 'bg-green-700' : 'bg-green-900')}></div>
								<div class={merge('w-4 h-4 rounded-full',
									level.company.rating >= 5 ? 'bg-green-500' : level.company.rating >= 4.5
										? 'bg-green-700' : 'bg-green-900')}></div>
							</div>
						</div>

					</div>

				</div>

				<p class='border-b-2 border-green-300 mb-2'>Reviews</p>
				<p class='text-sm line-clamp-3'>
					{level.product.reviews[props.randVal % level.product.reviews.length]}</p>
			</Fragment>}

			{props.state === 'success' && <Fragment>
				{props.current > props.quota ? <img src={image_success} class='w-[200px] h-[200px] mx-auto mt-2'/> :
					<p class='text-9xl py-8 text-center font-black'>{props.current}/{props.quota}</p>}
				<p class='text-xl text-center font-black -mt-4 px-6'>
					{SUCCESS_MESSAGES[props.randVal % SUCCESS_MESSAGES.length]}</p>
			</Fragment>}
			{props.state === 'failure' && <Fragment>
				<img src={image_failure} class='w-[200px] h-[200px] mx-auto mt-2'/>
				<p class='text-xl text-center font-black -mt-4 text-red-300 px-6'>
					{FAILURE_MESSAGES[props.randVal % FAILURE_MESSAGES.length]}</p>
			</Fragment>}
		</div>
	);
}
