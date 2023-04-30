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

import Clock from './Clock';
import { merge } from './Util';
import { Plot } from './plot/Plot';
import { intro } from './plot/Intro';
import { firstday } from './plot/FirstDay';
import { ApproveDenyButtons } from './ApproveDenyButtons';
import { secondday } from './plot/SecondDay';
import { thirdday } from './plot/ThirdDay';

export function Game() {
	const [ plot, setPlot ] = useState<Plot | null>(thirdday());
	const [ plotYielding, setPlotYielding ] = useState<null | 'complete' | 'approve' | 'deny'>(null);

	const [ level, setLevel ] = useState<Level | null>(null);
	const [ oldLevel, setOldLevel ] = useState<Level | null>(null);
	const [ complete, setComplete ] = useState<number>(0);
	const [ mistakes, setMistakes ] = useState<number>(0);
	const [ score, setScore ] = useState<number>(0);
	const [ flaggedProblems, setFlaggedProblems ] = useState<Set<string>>(new Set());
	const [ requiredEvidence, setRequiredEvidence ] = useState<number>(0);
	const [ computerState, setComputerState ] = useState<'failure' | 'success' | null>(null);

	const [ dialogue, setDialogue ] = useState<string[]>([]);
	const [ ringPhone, setRingPhone ] = useState(false);
	const [ uiVisible, setUiVisible ] = useState<Set<string>>(new Set([ ]));

	const [ wave, setWave ] = useState(0);
	const [ waveTicksLeft, setWaveTicksLeft ] = useState(0);
	const [ waveTicksLeftBase, setWaveTicksLeftBase ] = useState(0);
	const [ quotas, setQuotas ] = useState<number[]>([ 0, 0, 0, 0 ]);

	const handleApprove = () => {
		if (plotYielding === 'deny') return;
		handleComplete('approved');
	};

	const handleDeny = () => {
		if (plotYielding === 'approve') return;
		handleComplete('denied');
	};

	const handlePlotComplete = () => {
		setPlot(null);
		setWaveTicksLeftBase(0);
		setWaveTicksLeft(0);
		setWave(w => w + 1);

		console.warn('PLOT COMPLETE');
	}

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
			wave,
			complete: complete + 1,
			quota: quotas[Math.min(wave, quotas.length - 1)]
		};

		if (result === 'correct') {
			setComplete(l => l + 1);
			setScore(s => s + 1);
		}
		else {
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
		if (!plot) return;
		const { done, value } = plot.next(ret);
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
			setDialogue(value.text);
			break;
		case 'level':
			setLevel({ ...value.level });
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
		}

	}

	useEffect(() => processPlotEvent(), [ plot ]);

	useEffect(() => {
		if (waveTicksLeftBase === 0) return;
		if (waveTicksLeft >= 0) {
			const timeout = setTimeout(() => setWaveTicksLeft(waveTicksLeft - 1), 1000);
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
					{waveTicksLeft <= 10 && waveTicksLeft % 2 == 0 &&
						<div class='flex fixed inset-0 items-center justify-center will-change-transform interact-none'>
							<span key={Math.floor(waveTicksLeft / 3)} class={merge('text-5xl animate-time_flash m-0',
								complete >= currentQuota ? 'text-green-200/40' : 'text-red-500/40')}>{waveTicksLeft / 2}
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
