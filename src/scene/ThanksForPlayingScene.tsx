import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Howl } from 'howler';

import { merge } from '../Util';

import image_clipboard_lg from '@res/room/clipboard_lg.png';
import image_background_desk from '@res/room/background_desk.png';

import sound_product_interact from '@res/sound/product_interact.wav';
import sound_product_mark from '@res/sound/product_mark.wav';
import sound_clipboard_slide from '@res/sound/clipboard_slide.wav';

interface Props {
	onRestart: () => void;
}

export function ThanksForPlayingScene(props: Props) {
	const [ sceneState, setSceneState ] = useState<'in' | 'out'>('in');

	useEffect(() => {
		new Howl({ src: sound_product_mark, volume: 0.7 }).play();
		setTimeout(() => new Howl({ src: sound_product_interact, volume: 0.7 }).play(), 1100);
		setTimeout(() => new Howl({ src: sound_clipboard_slide, volume: 0.7 }).play(), 1400);
	}, []);

	return (
		<div class={merge('w-screen h-screen overflow-hidden bg-[size:1920px,1080px] bg-center grid place-content-center',
			sceneState === 'in' ? 'animate-scene_in' : 'animate-scene_out')}
			style={{ backgroundImage: `url(${image_background_desk})` }}>

			<div class='w-[688px] h-[872px] bg-cover animate-clipboard_in flex flex-col
				p-14 pr-12 pt-20 font-computer font-black relative'
				style={{ backgroundImage: `url(${image_clipboard_lg})` }}>

				<p class='text-3xl text-stone-600 bg-stone-400/75 p-2 mx-20 my-6 text-center'>THANKS FOR PLAYING</p>

				<div class='mx-12 my-8'>
					<p class='uppercase text-lg text-stone-700'>Game Created By</p>
					<p class='text-5xl text-stone-800 font-dialogue font-normal -mt-3 mb-6'>Auri Collings</p>

					<p class='text-center text-stone-800 mb-6'>This game was inspired by a counterfeit pair of headphones I got from AliExpress literally 10 minutes before the Compo started. So if you liked it, then you have Shop1102480205 Store to Thank.</p>

					<p class='uppercase text-lg text-stone-700'>My Socials</p>
					<p class='text-2xl my-3 text-stone-600 underline'><a href='https://aurail.us/discord' target='_blank'>Discord</a></p>
					<p class='text-2xl my-3 text-stone-600 underline'><a href='https://twitter.com/Aurailus' target='_blank'>Twitter</a></p>
					<p class='text-2xl my-3 text-stone-600 underline'><a href='https://twitch.tv/Aurailus' target='_blank'>Twitch</a></p>
				</div>

				<div class='flex absolute bottom-20 w-full left-0 justify-center gap-4'>
					<button class='bg-stone-400 hover:bg-stone-600110text-stone-900 hover:text-white p-6 py-3 text-xl'
						onClick={props.onRestart}
						>Clear Data and Restart</button>
				</div>
			</div>
		</div>
	);
}
