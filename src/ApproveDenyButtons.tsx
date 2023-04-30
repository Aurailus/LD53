import { h } from 'preact';

import { useLevel } from './Level';

import image_stamp_background from '@res/room/stamp_background.png';
import image_stamp_approve from '@res/room/stamp_approve.png';
import image_stamp_deny from '@res/room/stamp_deny.png';

import { merge } from './Util';

interface Props {
	onApprove?: () => void;
	onDeny?: () => void;
	allowApprove?: boolean;
	allowDeny?: boolean;
}

export function ApproveDenyButtons(props: Props) {

	return (
		<div class='w-[440px] mx-[20px] aspect-[110/41] shrink-0 bg-cover relative font-dialogue font-black
			flex justify-evenly items-center pr-12 pl-4'
			style={{ backgroundImage: `url(${image_stamp_background})` }}>

			<button
				class={merge('w-[160px] h-[160px] bg-cover opacity-70 hover:opacity-100',
					!(props.allowDeny ?? true) && '!opacity-50 sepia')}
				style={{ backgroundImage: `url(${image_stamp_deny})`}}
				disabled={!(props.allowDeny ?? true)}
				onClick={props.onDeny}>
				<span class='text-3xl text-[#ded6ca] rotate-[-18deg] -mt-0.5
					inline-block font-medium tracking-wide'>Deny</span>
			</button>

			<button
				class={merge('w-[160px] h-[160px] bg-cover opacity-70 hover:opacity-100',
					!(props.allowApprove ?? true) && '!opacity-50 sepia')}
				style={{ backgroundImage: `url(${image_stamp_approve})`}}
				disabled={!(props.allowApprove ?? true)}
				onClick={props.onApprove}>
				<span class='text-3xl text-[#ded6ca] rotate-[-20deg] -mt-1.5
					inline-block font-medium tracking-wide'>Approve</span>
			</button>
		</div>
	);
}
