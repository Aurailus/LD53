import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { merge } from '../Util';

interface Props {
	class?: string;
	style?: any;
	src: string;
	onClick?: () => void;
}

export function ClickCheck(props: Props) {
	const canvas = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const image = new Image();
		image.onload = () => {
			const ctx = canvas.current!.getContext('2d')!;
			canvas.current!.width = image.width;
			canvas.current!.height = image.height;
			ctx.drawImage(image, 0, 0);
		}
		image.src = props.src;
	}, [ props.src ])

	function handleClickCheck(evt: MouseEvent) {
		const posX = evt.offsetX / (canvas.current!.clientWidth / canvas.current!.width);
		const posY = evt.offsetY / (canvas.current!.clientHeight / canvas.current!.height);
		const ctx = canvas.current!.getContext('2d')!;
		const pixel = ctx.getImageData(posX, posY, 1, 1).data;
		if (pixel[3] > 0) props.onClick?.();
		else {
			canvas.current!.style.pointerEvents = 'none';
			(document.elementFromPoint(evt.clientX, evt.clientY) as HTMLElement)?.dispatchEvent(new MouseEvent('click', evt));
			canvas.current!.style.pointerEvents = 'auto';
		}
	}


	return (
		<canvas ref={canvas}
			class={merge(props.class, 'select-none')}
			style={props.style}
			onClick={handleClickCheck}
		/>
	)
}
