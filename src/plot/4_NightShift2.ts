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

export function* nightShift2(): Plot {
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
	yield { type: 'set_quota', quotas: [ 5, 5, 6, 6, 7, 7  ] };
	yield { type: 'set_time_of_day', time: 'night' };
	yield { type: 'set_score_expectation', score: 130 };

	yield {
		type: 'dialogue',
		ring: true,
		endTone: true,
		text: [
			'Remember what I said about the night shift being less busy?',
			'Yeah, well one of other processing stations just went on strike,',
			'And now you\'ve got to pick up the slack.',
			'And don\'t even think about striking.',
			'Unions are evil.',
			'Cya!'
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
				problems: Math.random() <= 0.1 ? [] : product.generateProblems(wave, 1),
				product
			}
		} as Action;

		yield level;
		const res: LevelResult = yield { type: 'await', what: 'complete' };
		if (res.complete >= res.quota) yield { type: 'set_wave', wave: ++wave };
		if (wave !== res.wave) {
			wave = Math.max(res.wave, wave);
			if (wave >= 6) break;
			else yield { type: 'set_wave_ticks', ticks: 25 };
		}
	}

	yield { type: 'set_wave_ticks', ticks: 0 };
	yield { type: 'await', what: 'time', time: 500 };

	yield { type: 'set_wave_ticks', ticks: 0 };
	yield { type: 'dialogue', ring: true, endTone: true, text: [
		'*yawn*',
		'I\'m ready for bed.',
		'Being-on call is hard work, you know.',
		'Anyways, the strikers have been ousted,',
		'and we have a whole new set of minimum wage employees over there now.',
		'So go get some rest.'
	] }

	yield { type: 'await', what: 'time', time: 1000 };
}
