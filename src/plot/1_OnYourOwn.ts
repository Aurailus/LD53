import { LevelResult } from "../Level";
import { getCompany } from "../company/Company";
import { getName } from "../customer/Customer";
import Plushie from "../product/Plushie";
import { Action, Plot }  from './Plot';
import { Product } from "../product/Product";

export function* onYourOwn(): Plot {
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
	yield { type: 'set_quota', quotas: [ 3, 3, 4, 4, 5 ] };
	yield { type: 'set_score_expectation', score: 175 };
	yield { type: 'set_wave_ticks', ticks: 0 };

	yield {
		type: 'dialogue', ring: true, endTone: true, text: [
			'Welcome back!',
			'It\'s time for your first real day on the job.',
			'I won\'t stick around to help you out this time, but I\'m sure you\'ll do fine.',
			'If you make a mistake, the computer will let you know.',
			'Believe me, it won\'t let you forget.',
			'Try to hit all of your quotas!',
			'Bye now.'
		]
	};

	yield { type: 'set_wave_ticks', ticks: 45 };

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
			if (wave >= 6) break;
			else yield { type: 'set_wave_ticks', ticks: 25 };
		}
	}

	yield { type: 'set_wave_ticks', ticks: 0 };

	yield {
		type: 'dialogue', ring: true, endTone: true, text: [
			'Great job!',
			'You\'re really getting the hang of this.',
			'I\'ll see you tomorrow.'
		]
	};

	yield { type: 'await', what: 'time', time: 1000 };
}
