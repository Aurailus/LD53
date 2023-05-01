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

export function* nightShift1(): Plot {
	yield { type: 'ui', key: 'info', show: true };
	yield { type: 'ui', key: 'computer', show: true };
	yield { type: 'ui', key: 'checklist', show: true };
	yield { type: 'ui', key: 'clock', show: true };
	yield { type: 'ui', key: 'approvedeny', show: true };
	yield { type: 'ui', key: 'info', show: true };
	yield { type: 'ui', key: 'approve', show: true };
	yield { type: 'ui', key: 'deny', show: true };
	yield { type: 'ui', key: 'clock', show: true };
	yield { type: 'required_evidence', amount: 1 };
	yield { type: 'set_wave', wave: 0 };
	yield { type: 'set_wave_ticks', ticks: 0 };
	yield { type: 'set_quota', quotas: [ 6, 8, 10, 12, 12 ] };
	yield { type: 'set_time_of_day', time: 'night' };
	yield { type: 'set_score_expectation', score: 300 };

	yield {
		type: 'dialogue',
		ring: true,
		endTone: true,
		text: [
			'Welcome to the night shift.',
			'Did you know that the average person spends 1/3 of their life sleeping?',
			'Well, not anymore!',
			'You\'re going to be working the night shift, and you\'re going to be working hard.',
			'At least less orders come in at this time of night.',
			'You\'ll be dealing with a new product, and a new set of problems.',
			'Amozom is counting on you to keep their customers happy.',
			'Good luck!'
		]
	};

	yield { type: 'set_wave_ticks', ticks: 60 };

	let wave = 0;

	while (true) {
		const product = chooseRandom([ Plushie, Cartridge ]);

		let level = {
			type: 'level',
			level: {
				company: getCompany(),
				customer: getName(),
				problems: Math.random() <= 0.1 ? [] : product.generateProblems(10, 1),
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

	yield { type: 'dialogue', ring: true, endTone: true, text: [ 'The new product is starting to come in...',
		'Here\'s a sample for you to poke around at.' ] };

	yield {
		type: 'level',
		level: {
			company: getCompany(),
			customer: getName(),
			problems: [],
			product: Headset
		}
	};

	yield { type: 'await', what: 'complete' };
	yield { type: 'set_wave_ticks', ticks: 100 };

	while (true) {
		const product = chooseRandom([ Plushie, Plushie, Cartridge, Cartridge, Headset, Headset, Headset, Headset ]);

		let level = {
			type: 'level',
			level: {
				company: getCompany(),
				customer: getName(),
				problems: Math.random() <= 0.1 ? [] : product.generateProblems(2, 1),
				product
			}
		} as Action;

		yield level;
		const res: LevelResult = yield { type: 'await', what: 'complete' };
		if (res.complete >= res.quota) yield { type: 'set_wave', wave: ++wave };
		if (wave !== res.wave) {
			wave = Math.max(res.wave, wave);
			if (wave >= 5) {
				break;
			}
			else yield { type: 'set_wave_ticks', ticks: 70 }
		}
	}

	yield { type: 'set_wave_ticks', ticks: 0 };
	yield { type: 'dialogue', ring: true, endTone: true, text: [ 'Good Job.', ] }
	yield { type: 'await', what: 'time', time: 500 };
}
