import { h, ComponentChildren } from 'preact';

export interface Props {
	children: ComponentChildren;
}

export function Info(props: Props) {
	return (
		<div class='w-full h-full bg-black/20 grid overflow-hidden'>
			<div class='relative flex flex-col gap-4 h-auto overflow-y-scroll pt-4 px-2'>
				{props.children}
			</div>
		</div>
	);
}
