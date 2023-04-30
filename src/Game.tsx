import { h } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';

import { Company } from './company/Company';
import { getName } from './customer/Customer';

import background from '@res/room/background.png';
import conveyor from '@res/room/conveyor.png';
import toolbox_back from '@res/room/toolbox_back.png';

import { Info } from './Info';
import { Phone } from './Phone';
import { Checklist } from './Checklist';
import { ComputerScreen } from './ComputerScreen';
import { Level, LevelContext, LevelResult, ResultType } from './Level';

import { Plot } from './plot/Plot';
import { intro } from './plot/Intro';
import { firstday } from './plot/FirstDay';
import { ApproveDenyButtons } from './ApproveDenyButtons';
import Clock from './Clock';
import { merge } from './Util';

export const TIME_SPEED = 8_000;
export const TIME_HOURS = 8;
export const TIME_MINUTES = 6;
export const TIME_MAX = TIME_MINUTES * TIME_HOURS;

export function Game() {
	const [ plot, setPlot ] = useState<Plot | null>(firstday());
	const [ plotYielding, setPlotYielding ] = useState<null | 'complete' | 'approve' | 'deny'>(null);

	const [ level, setLevel ] = useState<Level | null>(null);
	const [ oldLevel, setOldLevel ] = useState<Level | null>(null);
	const [ currentComplete, setCurrentComplete ] = useState<number>(0);
	const [ flaggedProblems, setFlaggedProblems ] = useState<Set<string>>(new Set());
	const [ requiredEvidence, setRequiredEvidence ] = useState<number>(0);
	const [ computerState, setComputerState ] = useState<'failure' | 'success' | null>(null);

	const [ dialogue, setDialogue ] = useState<string[]>([]);
	const [ ringPhone, setRingPhone ] = useState(false);
	const [ uiVisible, setUiVisible ] = useState<Set<string>>(new Set([ ]));

	const [ time, setTime ] = useState(0);
	const [ timeScale, setTimeScale ] = useState(0);
	const [ quotas, setQuotas ] = useState<number[]>([ 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);
	const handleApprove = () => {
		if (plotYielding === 'deny') return;
		handleComplete('approved');
	};

	const handleDeny = () => {
		if (plotYielding === 'approve') return;
		handleComplete('denied');
	};

	const handleComplete = (verdict: 'approved' | 'denied') => {
		let result: ResultType = 'correct';
		if (level?.problems.length === 0 && verdict === 'denied') result = 'correct';
		else if ((level?.problems.length === 0) || ((level?.problems.length ?? 0) > 0 && verdict === 'denied'))
			result = 'incorrect_verdict';
		else if ([...flaggedProblems.keys()].filter(key => !level?.problems.includes(key)).length)
			result = 'incorrect_invalid_evidence';
		else result = 'correct';

		const level_result: LevelResult = {
			verdict,
			level: JSON.parse(JSON.stringify(level)),
			flaggedProblems,
			result,
			hour: Math.floor(time / TIME_MINUTES),
			currentComplete,
			quota: quotas[Math.floor(time / TIME_MINUTES)]
		};

		setCurrentComplete(l => l + 1);
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
		setFlaggedProblems((problems) => {
			const newProblems = new Set(problems);
			if (newProblems.has(identifier)) newProblems.delete(identifier);
			else newProblems.add(identifier);
			return newProblems;
		});
	}, []);

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
		if (!plot) return;
		const { done, value } = plot.next(ret);
		if (done) setPlot(null);
		if (!value) return;

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
			setDialogue(value.text);
			break;
		case 'level':
			// setOldLevel((oldLevel) => {
				setLevel({ ...value.level });

			// })
			setFlaggedProblems(new Set());
			processPlotEvent();
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
		case 'set_time_speed':
			setTimeScale(value.scale);
			processPlotEvent();
			break;
		case 'set_time':
			setTime(value.time);
			processPlotEvent();
			break;
		case 'set_quota':
			setQuotas(value.quotas);
			processPlotEvent();
			break;
		}

	}

	useEffect(() => processPlotEvent(), [ plot ]);

	useEffect(() => {
		if (timeScale === 0) return;
		const timeout = setTimeout(() => {
			setTime((time) => {
				const newTime = time + 1;
				if (newTime % TIME_MINUTES === 0) {
					setCurrentComplete((levelsThisHour) => {
						const quota = quotas[Math.max(Math.min(Math.floor(time / TIME_MINUTES) - 1, quotas.length - 1), 0)];
						if (levelsThisHour >= quota) {
							return levelsThisHour - quota;
						}
						else {
							setCurrentComplete(0);
							console.error('YOU LOSE');
							return 0;
						}
					})
				}
				return newTime;
			});
		}, TIME_SPEED / timeScale);
		return () => clearTimeout(timeout);
	}, [ time, timeScale, quotas ]);

	const ProductComponent = level?.product?.component!;

	const randVal = useMemo(() => Math.floor(Math.random() * 10000) + 100, [ level ]);

	return (
		<div class='w-screen h-screen bg-black overflow-hidden flex flex-col overflow-hidden'>
			{/* Main Area */}
			<div class='w-screen h-auto flex-grow overflow-hidden grid bg-[size:1920px,1080px] overflow-hidden relative'
				style={{ backgroundImage: `url(${background})`, backgroundPosition: 'bottom left', gridTemplateColumns: '1fr min(33vw, 496px)' }}>

				<div class={merge('absolute left-0 right-0 h-64 w-[300vw] bg-contain interact-none max-w-none',
					'max-h-none bottom-0 left-0 will-change-transform', oldLevel !== null && 'animate-conveyor_move')}
					style={{ backgroundImage: `url(${conveyor})`, transitionDuration: `${1000}ms` }}/>

				{/* Left (Game) Area */}
				<div class='relative'>

					{/* Phone */}
					<Phone state={dialogue.length ? ringPhone ? 'ringing' : 'call' : 'idle'}
						class='!absolute bottom-[20rem] left-[40rem]'
						onEnd={() => processPlotEvent()}
						dialogue={dialogue}/>

					{level !== null && <LevelContext.Provider value={levelContext!}>
						{/* Computer Screen */}
						{uiVisible.has('computer') && <ComputerScreen randVal={randVal} state={computerState}
							current={currentComplete} quota={quotas[Math.min(Math.floor(time / TIME_MINUTES), quotas.length - 1)]}/>}

						{/* Product */}
						<div key={level} class='overflow-auto w-auto h-auto absolute left-1/2 animate-product_on
						-translate-x-1/2 will-change-transform'
							style={{ bottom: `${56 + (level.product.yOffset ?? 0) * 4}px` }}>
							<ProductComponent/>
						</div>

					</LevelContext.Provider>}

					{/* Old Product */}
					{oldLevel !== null && <LevelContext.Provider value={oldLevelContext!}>
						<div key={oldLevel} class='overflow-auto w-auto h-auto absolute left-1/2
							animate-product_off left-1/2 -translate-x-1/2 will-change-transform'
							style={{ bottom: `${56 + (oldLevel.product.yOffset ?? 0) * 4}px` }}>
							<ProductComponent/>
						</div>
					</LevelContext.Provider>}

					{/* Timer */}
					{uiVisible.has('clock') && <Clock time={time}
						quota={quotas[Math.min(Math.floor(time / TIME_MINUTES), quotas.length - 1)]}
						current={currentComplete}/>}
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
