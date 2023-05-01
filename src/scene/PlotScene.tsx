import { h } from 'preact';
import { Howl } from 'howler';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';

import background_day from '@res/room/background_day.png';
import background_night from '@res/room/background_night.png';
import background_snow from '@res/room/background_snow.png';
import conveyor from '@res/room/conveyor.png';

import sound_conveyor_move from '@res/sound/conveyor_move.wav';
import sound_product_mark from '@res/sound/product_mark.wav';
import sound_voice_1 from '@res/sound/voice_one.wav';
import sound_voice_2 from '@res/sound/voice_two.wav';
import sound_voice_3 from '@res/sound/voice_three.wav';
import sound_voice_4 from '@res/sound/voice_four.wav';
import sound_voice_5 from '@res/sound/voice_five.wav';
import sound_voice_quota_missed from '@res/sound/voice_quota_missed.wav';
import sound_voice_quota_hit from '@res/sound/voice_quota_hit.wav';
import sound_voice_you_will_miss_your_quota from '@res/sound/voice_you_will_miss_your_quota.wav';
import sound_verdict_correct from '@res/sound/verdict_correct.wav';
import sound_verdict_incorrect from '@res/sound/verdict_incorrect.wav';

import Clock from '../Clock';
import { Info } from '../Info';
import { merge } from '../Util';
import { Phone } from '../Phone';
import { Plot } from '../plot/Plot';
import { Checklist } from '../Checklist';
import { ComputerScreen } from '../ComputerScreen';
import { ApproveDenyButtons } from '../ApproveDenyButtons';
import { Level, LevelContext, LevelResult, ResultType } from '../Level';

export interface PlotResult {
	complete: number;
	mistakes: number;
	subScore: number;
	mistakeBonus: number;
	finalScore: number;
	forceAllowContinue?: boolean;
	grade: 's' | 'a' | 'b' | 'c' | 'f';
}

interface Props {
	plot: Plot;
	onComplete: (result: PlotResult) => void;
}

export function PlotScene(props: Props) {
	const [ plotYielding, setPlotYielding ] = useState<null | 'complete' | 'approve' | 'deny'>(null);

	const [ level, setLevel ] = useState<Level | null>(null);
	const [ oldLevel, setOldLevel ] = useState<Level | null>(null);
	const [ flaggedProblems, setFlaggedProblems ] = useState<Set<string>>(new Set());

	const [ complete, setComplete ] = useState<number>(0);
	const [ mistakes, setMistakes ] = useState<number>(0);
	const [ score, setScore ] = useState<number>(0);

	const [ wave, setWave ] = useState(0);
	const [ waveTicksLeft, setWaveTicksLeft ] = useState(0);
	const [ waveTicksLeftBase, setWaveTicksLeftBase ] = useState(0);
	const [ quotas, setQuotas ] = useState<number[]>([ 0, 0, 0, 0 ]);

	const [ uiVisible, setUiVisible ] = useState<Set<string>>(new Set([ ]));
	const [ requiredEvidence, setRequiredEvidence ] = useState<number>(0);
	const [ scoreExpectation, setScoreExpectation ] = useState<number>(0);
	const [ timeOfDay, setTimeOfDay ] = useState<'day' | 'night' | 'snow'>('day');

	const [ sceneState, setSceneState ] = useState<'in' | 'out'>('in');
	const [ ringPhone, setRingPhone ] = useState(false);
	const [ phoneEndTone, setPhoneEndTone ] = useState(false);
	const [ dialogue, setDialogue ] = useState<string[]>([]);
	const [ computerState, setComputerState ] = useState<'failure' | 'success' | null>(null);


	function handleApprove() {
		if (plotYielding === 'deny') return;
		handleComplete('approved');
	}

	function handleDeny() {
		if (plotYielding === 'approve') return;
		handleComplete('denied');
	}

	function handlePlotComplete() {
		setWaveTicksLeftBase(0);
		setWaveTicksLeft(0);
		setWave(w => w + 1);
		setSceneState('out');

		const mistakeBonus = Math.max(0, 50 - mistakes * 10);
		const finalScore = score + mistakeBonus;
		const ratio = finalScore / scoreExpectation;

		let grade: 's' | 'a' | 'b' | 'c' | 'f' = 'f';
		if (ratio > 1) grade = 's';
		else if (ratio >= 0.85) grade = 'a';
		else if (ratio >= 0.65) grade = 'b';
		else if (ratio >= 0.5) grade = 'c';

		setTimeout(() => props.onComplete({
			complete,
			mistakes,
			subScore: score,
			finalScore,
			mistakeBonus,
			grade,
			forceAllowContinue: scoreExpectation === 10000
		}), 500);
	}

	const handleComplete = (verdict: 'approved' | 'denied') => {
		let result: ResultType = 'correct';
		if ((level?.problems.length ?? 0) < requiredEvidence && verdict === 'denied') result = 'correct';
		else if (((level?.problems.length ?? 0) < requiredEvidence) ||
			((level?.problems.length ?? 0) >= requiredEvidence && verdict === 'denied'))
			result = 'incorrect_verdict';
		else if ([...flaggedProblems.keys()].filter(key => !level?.problems.includes(key)).length)
			result = 'incorrect_invalid_evidence';
		else result = 'correct';

		const level_result: LevelResult = {
			verdict,
			level: JSON.parse(JSON.stringify(level)),
			flaggedProblems,
			result,
			wave,
			complete: complete + (result === 'correct' ? 1 : 0),
			quota: quotas[Math.min(wave, quotas.length - 1)]
		};

		if (result === 'correct') {
			setComplete(l => l + 1);
			setScore(s => s + 1);

			new Howl({ src: [ sound_product_mark ], volume: 0.5 }).play();
			new Howl({ src: [ sound_verdict_correct ], volume: 0.5 }).play();

			if (complete + 1 === quotas[Math.min(wave, quotas.length - 1)]) {
				new Howl({ src: [ sound_voice_quota_hit ], volume: 0.5 }).play();
			}
		}
		else {
			new Howl({ src: [ sound_product_mark ], volume: 0.5 }).play();
			new Howl({ src: [ sound_verdict_incorrect ], volume: 0.5 }).play();

			setMistakes(m => m + 1);
		}
		setOldLevel(level);
		setComputerState(result === 'correct' ? 'success' : 'failure')
		setLevel(null);
		setTimeout(() => setOldLevel(null), 1000);
		setTimeout(() => setComputerState(null), 800);

		if (plotYielding === 'complete' || plotYielding === 'approve' || plotYielding === 'deny') {
			setPlotYielding(null);
			processPlotEvent(level_result);
		}
	}

	const handleSelectProblem = useCallback((identifier: string) => {
		new Howl({ src: [ sound_product_mark ], volume: 0.5, rate: Math.random() * 0.2 + 0.9 }).play();

		setFlaggedProblems((problems) => {
			const newProblems = new Set(problems);
			if (newProblems.has(identifier)) newProblems.delete(identifier);
			else newProblems.add(identifier);
			return newProblems;
		});
	}, []);

	useEffect(() => {
		console.warn(score);
	}, [ score ]);

	const levelContext = useMemo(() => ({
		...level,
		problemsSet: new Set(level?.problems ?? []),
		flaggedProblems: flaggedProblems
	}) as LevelContext, [ level, flaggedProblems ]);

	const oldLevelContext = useMemo(() => ({
		...oldLevel,
		problemsSet: new Set(oldLevel?.problems ?? []),
		flaggedProblems: new Set()
	}) as LevelContext, [ oldLevel ]);

	const processPlotEvent = (ret?: any) => {
		const { value } = props.plot.next(ret);
		if (!value) return handlePlotComplete();

		switch (value.type) {
		// default:
		// 	console.warn('UNHANDLED PLOT TYPE %s', value.type);
		// 	break;
		case 'await':
			switch (value.what) {
				default:
					setPlotYielding(value.what);
					break;
				case 'time':
					setTimeout(() => processPlotEvent(), value.time);
					break;
			}
			break;
		case 'dialogue':
			setRingPhone(value.ring ?? false);
			setPhoneEndTone(value.endTone ?? false);
			setDialogue(value.text);
			break;
		case 'level':
			setLevel({ ...value.level });
			setFlaggedProblems(new Set());
			processPlotEvent();
			new Howl({ src: [ sound_conveyor_move ], volume: 0.8 }).play();
			break;
		case 'ui':
			setUiVisible((current) => {
				const newSet = new Set(current);
				if (value.show) newSet.add(value.key);
				else newSet.delete(value.key);
				return newSet;
			});
			processPlotEvent();
			break;
		case 'flag_problem':
			handleSelectProblem(value.key);
			processPlotEvent();
			break;
		case 'required_evidence':
			setRequiredEvidence(value.amount);
			processPlotEvent();
			break;
		case 'set_wave_ticks':
			setWaveTicksLeftBase(value.ticks);
			setWaveTicksLeft(value.ticks);
			processPlotEvent();
			break;
		case 'set_wave':
			setWave(value.wave);
			if (waveTicksLeft > 0) setScore(s => s + Math.max(waveTicksLeft, 3));
			setWaveTicksLeft(waveTicksLeftBase);
			setComplete(0);
			processPlotEvent();
			break;
		case 'set_quota':
			setQuotas(value.quotas);
			processPlotEvent();
			break;
		case 'set_score_expectation':
			setScoreExpectation(value.score);
			processPlotEvent();
			break;
		case 'set_time_of_day':
			setTimeOfDay(value.time);
			processPlotEvent();
			break;
		}
	}

	useEffect(() => processPlotEvent(), [ props.plot ]);

	useEffect(() => {
		if (waveTicksLeftBase === 0) return;
		if (waveTicksLeft >= 0) {
			const timeout = setTimeout(() => {
				setWaveTicksLeft((waveTicksLeft) => {
					waveTicksLeft--;

					if (waveTicksLeft === 7) new Howl({ src: [ sound_voice_you_will_miss_your_quota ], volume: 0.5 }).play();
					if (waveTicksLeft === 5) new Howl({ src: [ sound_voice_5 ], volume: 0.5 }).play();
					if (waveTicksLeft === 4) new Howl({ src: [ sound_voice_4 ], volume: 0.5 }).play();
					if (waveTicksLeft === 3) new Howl({ src: [ sound_voice_3 ], volume: 0.5 }).play();
					if (waveTicksLeft === 2) new Howl({ src: [ sound_voice_2 ], volume: 0.5 }).play();
					if (waveTicksLeft === 1) new Howl({ src: [ sound_voice_1 ], volume: 0.5 }).play();
					if (waveTicksLeft === 0) new Howl({ src: [ sound_voice_quota_missed ], volume: 0.5 }).play();
					return waveTicksLeft;
				})
			}, 1000);
			return () => clearTimeout(timeout);
		}
		else {
			setWave((wave) => {
				const newWave = wave + 1;

				setComplete((currentComplete) => {
					const quota = quotas[Math.min(wave, quotas.length - 1)];
					if (currentComplete < quota) setMistakes(m => m + (quota - currentComplete));
					return 0;
				});

				return newWave;
			});

			setWaveTicksLeft(waveTicksLeftBase);
		}
	}, [ waveTicksLeft, waveTicksLeftBase, quotas ]);

	const ProductComponent = level?.product?.component!;
	const OldProductComponent = oldLevel?.product?.component!;

	const randVal = useMemo(() => Math.floor(Math.random() * 10000) + 100, [ level ]);

	const currentQuota = quotas[Math.min(wave, quotas.length - 1)];

	return (
		<div class={merge('w-screen h-screen overflow-hidden flex flex-col overflow-hidden',
			sceneState === 'in' ? 'animate-scene_in' : 'animate-scene_out')}>
			{/* Main Area */}
			<div class='w-screen h-auto flex-grow overflow-hidden grid bg-[size:2400px,1400px] overflow-hidden relative'
				style={{ backgroundImage: `url(${timeOfDay === 'day' ? background_day : timeOfDay === 'snow' ? background_snow : background_night})`, backgroundColor: '#525667', backgroundRepeat: 'no-repeat',
					backgroundPosition: 'bottom left', gridTemplateColumns: '1fr min(33vw, 496px)' }}>

				<div class={merge('absolute left-0 right-0 h-64 w-[300vw] bg-contain interact-none max-w-none',
					'max-h-none bottom-0 left-0 will-change-transform', oldLevel !== null && 'animate-conveyor_move')}
					style={{ backgroundImage: `url(${conveyor})`, transitionDuration: `${1000}ms` }}/>

				{/* Left (Game) Area */}
				<div class='relative'>

					{/* Phone */}
					<Phone state={dialogue.length ? ringPhone ? 'ringing' : 'call' : 'idle'}
						class='!absolute bottom-[20rem] left-[40rem]'
						endTone={phoneEndTone}
						onEnd={() => processPlotEvent()}
						dialogue={dialogue}/>

					<LevelContext.Provider value={levelContext!}>
						{/* Computer Screen */}
						{uiVisible.has('computer') && <ComputerScreen randVal={randVal} state={computerState}
							current={complete} quota={currentQuota}/>}

						{/* Product */}
						{level !== null && <div key={level} class='overflow-auto w-auto h-auto absolute left-1/2 animate-product_on
						-translate-x-1/2 will-change-transform'
							style={{ bottom: `${56 + (level.product.yOffset ?? 0) * 4}px` }}>
							<ProductComponent/>
						</div>}
					</LevelContext.Provider>

					{/* Old Product */}
					{oldLevel !== null && <LevelContext.Provider value={oldLevelContext!}>
						<div key={oldLevel} class='overflow-auto w-auto h-auto absolute left-1/2
							animate-product_off left-1/2 -translate-x-1/2 will-change-transform'
							style={{ bottom: `${56 + (oldLevel.product.yOffset ?? 0) * 4}px` }}>
							<OldProductComponent/>
						</div>
					</LevelContext.Provider>}

					{/* Time warning overlay */}
					{waveTicksLeft <= 5 && waveTicksLeftBase !== 0 &&
						<div class='flex fixed inset-0 items-center justify-center will-change-transform interact-none'>
							<span key={Math.floor(waveTicksLeft)} class={merge('text-5xl animate-time_flash m-0, text-red-500/40')}>{waveTicksLeft}
								</span>
						</div>
					}

					{/* Clock */}
					<Clock current={complete} quota={currentQuota} ticks={waveTicksLeft}/>
				</div>

				{/* Right (Info) Area */}
				{level !== null && uiVisible.has('info') && <LevelContext.Provider value={levelContext!}>
					<div class='relative grid overflow-hidden max-h-full'>
						<Info>
							{uiVisible.has('checklist') && <Checklist onSelectProblem={handleSelectProblem}/>}
							{uiVisible.has('approvedeny') && <ApproveDenyButtons
								onApprove={handleApprove} onDeny={handleDeny}
								allowApprove={uiVisible.has('approve') && flaggedProblems.size >= requiredEvidence && oldLevel === null}
								allowDeny={uiVisible.has('deny') && oldLevel === null}/>
							}
						</Info>
					</div>
				</LevelContext.Provider>}
			</div>
		</div>
	);
}
