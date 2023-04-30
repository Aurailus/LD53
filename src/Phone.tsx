import { Fragment, h } from 'preact';
import { merge } from './Util';

import image_base from '@res/phone/base.png';
import image_receiver from '@res/phone/receiver.png';
import image_receiver_1 from '@res/phone/receiver_1.png';
import image_receiver_2 from '@res/phone/receiver_2.png';
import image_textbox from '@res/phone/textbox.png';
import { useEffect, useRef, useState } from 'preact/hooks';

interface Props {
	state: 'idle' | 'ringing' | 'call';
	dialogue: string[];
	canNext?: boolean;

	onPickup?: () => void;
	onNextDialogue?: () => void;
	onEnd?: () => void;

	class?: string;
	style?: any;
}

const DIALOGUE_STEP_SPEED = 10;

export function Phone(props: Props) {
	const dialogueRef = useRef<HTMLDivElement>(null);
	const [ dialogueHeight, setDialogueHeight ] = useState(0);

	const ringingRef = useRef<number>(0);
	const [ ringingState, setRingingState ] = useState(0);

	const [ phoneState, setPhoneState ] = useState<'idle' | 'ringing' | 'call'>(props.state);

	const [ dialoguePage, setDialoguePage ] = useState(0);
	const [ dialogueStep, setDialogueStep ] = useState(0);

	const handlePickup = () => {
		if (props.dialogue.length === 0 || phoneState !== 'ringing') return;
		props.onPickup?.();
		setPhoneState('call');
	}

	const handleAdvanceText = () => {
		if (dialogueStep < (props.dialogue[dialoguePage]?.length ?? -100)) {
			setDialogueStep(Infinity);
		}
		else {
			if (!(props.canNext ?? true)) return;
			setDialoguePage(page => page + 1);
			setDialogueStep(-15);
			if (dialoguePage >= props.dialogue.length - 1) {
				setPhoneState('idle');
				props.onEnd?.();
			}
		}
	}

	useEffect(() => {
		setPhoneState(props.state);
		setDialogueStep(0);
		setDialoguePage(0);
		clearInterval(ringingRef.current);
		ringingRef.current = 0;
	}, [ props.dialogue, props.state ]);

	useEffect(() => {
		if (phoneState === 'idle' || dialogueStep >= (props.dialogue[dialoguePage]?.length ?? -100)) {
			clearInterval(ringingRef.current);
			setRingingState(0);
			ringingRef.current = 0;
			return;
		}

		console.log('should ring');

		if (!ringingRef.current) {
			ringingRef.current = setInterval(() => {
				setRingingState(state => (state + 1) % 3);
			}, 200) as any as number;
		}
	}, [ phoneState, dialogueStep, dialoguePage ]);

	useEffect(() => {
		if (phoneState !== 'call') return;
		if (dialogueStep >= (props.dialogue[dialoguePage]?.length ?? -100)) return;

		setTimeout(() => {
			const height = dialogueRef.current?.clientHeight ?? 0;
			setDialogueHeight(height);
		}, 25);

		const lastChar = props.dialogue[dialoguePage]?.[dialogueStep - 1];

		const delay = DIALOGUE_STEP_SPEED *
			(lastChar === '.' || lastChar === '!' || lastChar === '?' ? 15 : 1) *
			(lastChar === ',' ? 3 : 1) *
			(lastChar === ' ' ? 0 : 1);

		const timeout = setTimeout(() => {
			setDialogueStep(step => step + 1);
		}, delay);

		return () => clearTimeout(timeout);
	}, [ dialogueStep, dialoguePage, phoneState ]);

	const dialogueSplit = (props.dialogue[dialoguePage] ?? '').split(' ')
		.map((word) => [ word, word.length, 0 ] as [ string, number, number ]);
	for (let i = 0; i < dialogueSplit.length; i++) dialogueSplit[i][2] =
		(i == 0 ? 0 : dialogueSplit[i - 1][2] + dialogueSplit[i - 1][1] + 1);

	return (
		<div class={merge('w-[268px] h-[188px] relative cursor-pointer select-none', props.class)} onClick={handlePickup}>
			<img class='absolute inset-0 w-full h-full' src={image_base}/>
			{ringingState == 0 && <img class='absolute inset-0 w-full h-full interact-none' src={image_receiver}/>}
			{ringingState == 1 && <img class='absolute inset-0 w-full h-full interact-none' src={image_receiver_1}/>}
			{ringingState == 2 && <img class='absolute inset-0 w-full h-full interact-none' src={image_receiver_2}/>}

			{phoneState === 'call' && <div class='fixed z-50 inset-0' onClick={() => handleAdvanceText()}/>}

			<div class='w-screen max-w-4xl absolute left-1/2 -translate-x-1/2 bottom-full text-5xl
				font-dialogue transition-all duration-150 overflow-hidden grid z-30 interact-none'
				style={{ height: `${Math.max(dialogueHeight + 16 + 24, 112)}px` }} onClick={() => handleAdvanceText()}>
					<div class={merge('transition-all duration-300 p-8 pt-4 pb-6 absolute inset-0',
						phoneState === 'call' ? 'opacity-100 scale-100' : 'opacity-0 scale-75')}>
						<div class='absolute inset-0'
							style={{ borderImage: `url(${image_textbox}) 16`, borderImageWidth: '64px' }}/>
						<div class='absolute inset-16 bg-white'/>

						<div class='overflow-visible h-auto relative z-10' ref={dialogueRef}>
							<p class='relative leading-normal'>{dialogueSplit.filter(([ , , start ]) => dialogueStep >= start)
							.map(([ word, , start ], i) => {
								const letters = word.split('').map((char, i) => {
									if (dialogueStep - start >= i) {
										if (char == ' ') return <span key={i + start}>{char}</span>;
										return <span class='animate-dialogue_letter_in inline-block' key={i + start}>{char}</span>
									}
									else {
										return <span key={i + start} class='opacity-0'>{char}</span>
									}
								});

								return <span class='whitespace-pre-wrap inline-block'>{letters} </span>
							})}</p>
						</div>
					</div>
				</div>
		</div>
	);
}
