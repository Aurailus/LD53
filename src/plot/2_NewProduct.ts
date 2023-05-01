import { LevelResult } from "../Level";
import { getCompany } from "../company/Company";
import { getName } from "../customer/Customer";
import Cartridge from "../product/Cartridge";
import Plushie from "../product/Plushie";
import { Action, Plot }  from './Plot';

export function* newProduct(): Plot {
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
	yield { type: 'set_quota', quotas: [ 3, 4, 5, 8, 10 ] };
	yield { type: 'set_score_expectation', score: 120 };

	yield {
		type: 'dialogue', ring: true, endTone: true, text: [
			'Thank Amazom it\'s friday!',
			'I\'m ready to go home.',
		]
	};

	yield { type: 'set_wave_ticks', ticks: 20 };

	let wave = 0;

	while (true) {
		let level = {
			type: 'level',
			level: {
				company: getCompany(),
				customer: getName(),
				problems: Math.random() <= 0.1 ? [] : Plushie.generateProblems(wave, 1),
				product: Plushie
			}
		} as Action;

		yield level;
		const res: LevelResult = yield { type: 'await', what: 'complete' };
		if (res.complete >= res.quota) yield { type: 'set_wave', wave: ++wave };
		if (wave !== res.wave) {
			wave = Math.max(res.wave, wave);
			if (wave >= 3) {
				break;
			}
			else yield { type: 'set_wave_ticks', ticks: 20 }
		}
	}

	yield { type: 'set_wave_ticks', ticks: 0 }

	yield { type: 'dialogue', ring: true, text: [
		'Hello again!',
		'Corporate has informed me that we\'re going to be dealing with another product.',
	] }

	yield {
		type: 'level',
		level: {
			company: getCompany(),
			customer: getName(),
			problems: [],
			product: Cartridge
		}
	} as Action;

	yield { type: 'dialogue', text: [
		'I\'ve sent along a few samples for you to take a look at.',
		'You can click on the product to view different parts of it.',
		'You may need to inspect all of the parts to find a problem.',
	] }

	while (true) {
		if ((yield { type: 'await', what: 'complete' }).result === 'correct') break;;
		yield {
			type: 'level',
			level: {
				company: getCompany(),
				customer: getName(),
				problems: Math.random() <= 0.1 ? [] : Cartridge.generateProblems(wave - 3, 1),
				product: Cartridge
			}
		} as Action;
	}

	yield { type: 'set_wave_ticks', ticks: 0 };

	while (true) {
		let level = {
			type: 'level',
			level: {
				company: getCompany(),
				customer: getName(),
				problems: Math.random() <= 0.1 ? [] : Cartridge.generateProblems(wave - 3, 1),
				product: Cartridge
			}
		} as Action;

		yield level;
		const res: LevelResult = yield { type: 'await', what: 'complete' };
		if (res.complete >= res.quota) yield { type: 'set_wave', wave: ++wave };
		if (wave !== res.wave) break;
	}

	yield { type: 'dialogue', endTone: true, text: [
		'Alright, returns are piling up, so you\'re gonna have to get back to work!',
		'Good luck!'
	] };

	yield { type: 'set_wave_ticks', ticks: 40 };

	while (true) {
		const type = Math.random() < 0.6 ? Plushie : Cartridge;
		let level = {
			type: 'level',
			level: {
				company: getCompany(),
				customer: getName(),
				problems: Math.random() <= 0.1 ? [] : type.generateProblems(wave - 3, 1),
				product: type
			}
		} as Action;

		yield level;
		const res: LevelResult = yield { type: 'await', what: 'complete' };
		if (res.complete >= res.quota) break;
		if (wave !== res.wave) break;
	}

	yield { type: 'set_wave', wave: 100 };
	yield { type: 'set_wave_ticks', ticks: 0 };

	yield { type: 'dialogue', ring: true, endTone: true, text: [
		'That\'s all for today!',
		'Great job, I\'ll be seeing you tomorrow.'
	] };

	yield { type: 'await', what: 'time', time: 1000 };
}
