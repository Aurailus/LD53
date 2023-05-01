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

export function* blackFriday(): Plot {
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
	yield { type: 'set_quota', quotas: [ 4, 4, 4, 4, 5, 5 ] };
	yield { type: 'set_score_expectation', score: 120 };
	yield { type: 'set_wave_ticks', ticks: 0 };

	// TODO: RETEST BLACK FRIDAY

	yield {
		type: 'dialogue', ring: true, endTone: true, text: [
			'Hey, it\'s Black Friday today.',
			'You know what that means, right?',
			'Lots of customers, lots of problems.',
			'Good luck!'
		]
	};

	yield { type: 'set_wave_ticks', ticks: 35 };

	let wave = 0;

	while (true) {
		const product = chooseRandom([ Plushie, Cartridge, Cartridge, Headset, Headset ]);

		let level = {
			type: 'level',
			level: {
				company: getCompany(),
				customer: getName(),
				problems: Math.random() <= 0.1 ? [] : product.generateProblems(wave, Math.random() > 0.4 ? 2 : 1),
				product
			}
		} as Action;

		yield level;
		const res: LevelResult = yield { type: 'await', what: 'complete' };
		if (res.complete >= res.quota) yield { type: 'set_wave', wave: ++wave };
		if (wave !== res.wave) {
			wave = Math.max(res.wave, wave);
			if (wave >= 6) break;
			else yield { type: 'set_wave_ticks', ticks: 35 };
		}
	}

	yield { type: 'set_wave_ticks', ticks: 0 };
	yield {
		type: 'dialogue', ring: true, endTone: true, text: [
			'Nice! You really know what you\'re doing.',
			'Now just wait for Christmas...'
		]
	};

	yield { type: 'await', what: 'time', time: 1000 };
}
