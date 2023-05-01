import { Level, LevelResult } from "../Level";
import { getCompany } from "../company/Company";
import { getName } from "../customer/Customer";
import Cartridge from "../product/Cartridge";
import Plushie from "../product/Plushie";
import Headset from "../product/Headset";
import { Action, Plot }  from './Plot';
import { Product } from "../product/Product";

function chooseRandom<T extends Product>(array: Array<T>): T {
	return array[Math.floor(Math.random() * array.length)];
}

export function* doubleEvidence(): Plot {
	yield { type: 'ui', key: 'info', show: true };
	yield { type: 'ui', key: 'computer', show: true };
	yield { type: 'ui', key: 'checklist', show: true };
	yield { type: 'ui', key: 'clock', show: true };
	yield { type: 'ui', key: 'approvedeny', show: true };
	yield { type: 'ui', key: 'info', show: true };
	yield { type: 'ui', key: 'approve', show: true };
	yield { type: 'ui', key: 'deny', show: true };
	yield { type: 'ui', key: 'clock', show: true };
	yield { type: 'required_evidence', amount: 2 };
	yield { type: 'set_wave', wave: 0 };
	yield { type: 'set_wave_ticks', ticks: 0 };
	yield { type: 'set_quota', quotas: [ 8, 10, 12 ] };
	yield { type: 'set_score_expectation', score: 130 };

	yield {
		type: 'dialogue',
		ring: true,
		endTone: false,
		text: [
			'Welcome back, I hope you had a great weekend!',
			'Oh, right. You worked all weekend.',
			'Well, I hope you have a great next weekend!',
			'Since you\'ve got here, Amozom has noticed a marked increase in returns.',
			'That\'s great! You\'re doing your job well.',
		]
	};

	yield { type: 'await', what: 'time', time: 500 };

	yield {
		type: 'dialogue',
		endTone: true,
		text: [
			'But now they\'re worried that you\'re doing your job a little too well.',
			'All these returns aren\'t great for business.',
			'So Amozom has instated a new policy.',
			'From now on, returns can only be approved if there are TWO problems with the product.',
			'If there\'s only one problem, you\'ll have to deny it.',
			'Good luck!'
		]
	};

	yield { type: 'set_wave_ticks', ticks: 60 };

	let wave = 0;

	while (true) {
		const product = chooseRandom([ Plushie, Cartridge, Cartridge, Headset, Headset ]);
		const minProblems = Math.random() <= 0.4 ? 1 : 2;

		let level = {
			type: 'level',
			level: {
				company: getCompany(),
				customer: getName(),
				problems: Math.random() <= 0.1 ? [] : product.generateProblems(wave, minProblems),
				product
			}
		} as Action;

		yield level;
		const res: LevelResult = yield { type: 'await', what: 'complete' };
		if (res.complete >= res.quota) yield { type: 'set_wave', wave: ++wave };
		if (wave !== res.wave) {
			wave = Math.max(res.wave, wave);
			if (wave >= 3) break;
			else yield { type: 'set_wave_ticks', ticks: 60 };
		}
	}

	yield { type: 'set_wave_ticks', ticks: 0 };

	yield { type: 'dialogue', endTone: true, text: [
		'Great job, seems like you\'re getting the hang of it.',
		'Remember to keep looking for two pieces of evidence!',
		'See you tomorrow!'
	] };

	yield { type: 'await', what: 'time', time: 1000 };
}
