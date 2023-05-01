import { Level, LevelResult } from "../Level";
import { getCompany } from "../company/Company";
import { getName } from "../customer/Customer";
import Cartridge from "../product/Cartridge";
import Plushie from "../product/Plushie";
import Headset from "../product/Headset";
import Mobile from "../product/Mobile";
import { Action, Plot }  from './Plot';
import { Product } from "../product/Product";

function chooseRandom<T extends Product>(array: Array<T>): T {
	return array[Math.floor(Math.random() * array.length)];
}

export function* smartPhone(): Plot {
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
	yield { type: 'set_quota', quotas: [ 5, 5, 7, 7 ] };
	yield { type: 'set_score_expectation', score: 225 };

	yield {
		type: 'dialogue',
		ring: true,
		text: [
			'We recently started retailing phones on-site.',
			'It\'s been hugely profitable for us, but we\'ve had a few minor quality complaints.',
			'Could you help us out?'
		]
	};

	yield {
		type: 'await',
		what: 'time',
		time: 500
	}

	yield {
		type: 'dialogue',
		endTone: true,
		text: [
			'Since we sell multiple models of phone,',
			'watch that you don\'t approve a refund just because it doesn\'t look the way you were expecting.',
			'As with before, we only want you to approve products with two or more issues.',
		]
	}

	yield { type: 'set_wave_ticks', ticks: 70 };

	let wave = 0;

	while (true) {
		let level = {
			type: 'level',
			level: {
				company: getCompany(),
				customer: getName(),
				problems: Math.random() <= 0.1 ? [] : Mobile.generateProblems(10, Math.random() < 0.3 ? 1 : 2),
				product: Mobile
			}
		} as Action;

		yield level;
		const res: LevelResult = yield { type: 'await', what: 'complete' };
		if (res.complete >= res.quota) yield { type: 'set_wave', wave: ++wave };
		if (wave !== res.wave) {
			wave = Math.max(res.wave, wave);
			if (wave >= 1) break;
			else yield { type: 'set_wave_ticks', ticks: 150 };
		}
	}

	yield { type: 'set_wave_ticks', ticks: 70 };


	while (true) {
		const product = chooseRandom([ Plushie, Cartridge, Headset, Mobile, Mobile, Mobile ]);

		let level = {
			type: 'level',
			level: {
				company: getCompany(),
				customer: getName(),
				problems: Math.random() <= 0.1 ? [] : product.generateProblems(wave, Math.random() < 0.3 ? 1 : 2),
				product
			}
		} as Action;

		yield level;
		const res: LevelResult = yield { type: 'await', what: 'complete' };
		if (res.complete >= res.quota) yield { type: 'set_wave', wave: ++wave };
		if (wave !== res.wave) {
			wave = Math.max(res.wave, wave);
			if (wave >= 4) break;
			else yield { type: 'set_wave_ticks', ticks: 70 };
		}
	}

	yield { type: 'set_wave_ticks', ticks: 0 };

	yield { type: 'dialogue', ring: true, endTone: true, text: [
		'Amozom is considering mandating that employees purchase their own phones from the site.',
		'I don\'t know if I can afford that.'
	 ] };

	yield { type: 'await', what: 'time', time: 500 };
}
