import { Fragment, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { Plot } from './plot/Plot';
import { ThanksForPlayingScene } from './scene/ThanksForPlayingScene';
import { EndPlotScene } from './scene/EndPlotScene';
import { PlotResult, PlotScene } from './scene/PlotScene';

import { intro } from './plot/0_Intro';
import { onYourOwn } from './plot/1_OnYourOwn';
import { newProduct } from './plot/2_NewProduct'
import { nightShift1 } from './plot/3_NightShift1';
// import { thirdday } from './plot/3_NightShift1';
import { doubleEvidence } from './plot/5_DoubleEvidence';
import { fifthday } from './plot/5_FifthDay';
import { nightShift2 } from './plot/4_NightShift2';
import { blackFriday } from './plot/6_BlackFriday';
import { smartPhone } from './plot/7_SmartPhone';
import { christmas } from './plot/8_Christmas';
import { getFired } from './plot/9_GetFired';

type GameState = {
	type: 'thanks_for_playing';
} | {
	type: 'plot';
	plot: Plot;
} | {
	type: 'end_plot',
	result: PlotResult;
}

const PLOTS = [
	intro,
	onYourOwn,
	newProduct,
	nightShift1,
	nightShift2,
	doubleEvidence,
	blackFriday,
	smartPhone,
	christmas,
	getFired
];

export const PLOT_SAVE_KEY = 'current_plot';

export function Game() {
	// window.localStorage.setItem(PLOT_SAVE_KEY, '9');

	// const [ state, setState ] = useState<GameState>({ type: 'plot', plot: intro() });
	const [ state, setState ] = useState<GameState>({ type: 'thanks_for_playing' });

	useEffect(() => setPlot(parseInt(window.localStorage.getItem(PLOT_SAVE_KEY) ?? '0', 10)), []);

	function setPlot(plot: number) {
		window.localStorage.setItem(PLOT_SAVE_KEY, plot.toString());
		if (plot >= PLOTS.length) return setState({ type: 'thanks_for_playing' });
		else {
			setState({ type: 'plot', plot: PLOTS[plot]() });
		}
	}

	function handleFullRestart() {
		window.localStorage.setItem(PLOT_SAVE_KEY, '0');
		setPlot(0);
	}

	function handleStartGame() {
		const currentPlot = parseInt(window.localStorage.getItem(PLOT_SAVE_KEY) ?? '0', 10);
		setPlot(currentPlot);
		// setState({ type: 'end_plot', result: { complete: 0, mistakes: 0, subScore: 0, mistakeBonus: 50, finalScore: 50, grade: 's' } });
	}

	function handlePlotComplete(result: PlotResult) {
		setState({ type: 'end_plot', result });
	}

	function handlePlotNext() {
		const currentPlot = parseInt(window.localStorage.getItem(PLOT_SAVE_KEY) ?? '0', 10);
		setPlot(currentPlot + 1);
	}

	function handlePlotRestart() {
		const currentPlot = parseInt(window.localStorage.getItem(PLOT_SAVE_KEY) ?? '0', 10);
		setPlot(currentPlot);
	}

	return (
		<Fragment>
			{state.type === 'thanks_for_playing' && <ThanksForPlayingScene onRestart={handleFullRestart}/>}
			{state.type === 'plot' && <PlotScene plot={state.plot} onComplete={handlePlotComplete} />}
			{state.type === 'end_plot' && <EndPlotScene result={state.result}
				onContinue={handlePlotNext} onRestart={handlePlotRestart} />}
		</Fragment>
	)
}
