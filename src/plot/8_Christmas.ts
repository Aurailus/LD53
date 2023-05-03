import { Level, LevelResult } from "../Level";
import { getCompany } from "../company/Company";
import { getName } from "../customer/Customer";
import Cartridge from "../product/Cartridge";
import Plushie from "../product/Plushie";
import Headset from "../product/Headset";
import { Action, Plot }  from './Plot';
import { Product } from "../product/Product";
import Mobile from "../product/Mobile";

function chooseRandom<T extends Product>(array: Array<T>): T {
	return array[Math.floor(Math.random() * array.length)];
}

export function* christmas(): Plot {
	yield { type: 'ui', key: 'info', show: true };
	yield { type: 'ui', key: 'computer', show: true };
	yield { type: 'ui', key: 'checklist', show: true };
	yield { type: 'ui', key: 'clock', show: true };
	yield { type: 'ui', key: 'approvedeny', show: true };
	yield { type: 'ui', key: 'info', show: true };
	yield { type: 'ui', key: 'approve', show: true };
	yield { type: 'ui', key: 'deny', show: true };
	yield { type: 'ui', key: 'clock', show: true };
	yield { type: 'required_evidence', amount: 3 };
	yield { type: 'set_wave', wave: 0 };
	yield { type: 'set_time_of_day', time: 'snow' };
	yield { type: 'set_quota', quotas: [ 4, 4, 4, 5, 5 ] };
	yield { type: 'set_score_expectation', score: 225 };
	yield { type: 'set_wave_ticks', ticks: 0 };

	yield {
		type: 'dialogue', ring: true, text: [
			'It\'s Christmas Day.',
			'...',
			'You should know why that makes today special.',
			'Millions of consumerist parents...',
			'...buying thousands of consumerist products...',
			'...for billions of consumerist dollars.',
			'And every time one of those products is counterfeit...',
			'...or broken...',
			'It comes back to us.',
			'This is the biggest day of the year for us.',
			'Your ultimate challenge.'
		]
	};

	yield {
		type: 'await',
		what: 'time',
		time: 1000
	}

	yield {
		type: 'dialogue', endTone: true, text: [
			'Oh, and one last thing.',
			'Because of the volume of returns today,',
			'Amozom has decided to instate a THREE STRIKE POLICY.',
			'Unless a product has three problems, it cannot be returned.',
			'Good luck.'
		]
	};

	yield { type: 'set_wave_ticks', ticks: 60 };

	let wave = 0;

	while (true) {
		const product = chooseRandom([ Plushie, Cartridge, Cartridge, Headset, Headset, Mobile, Mobile, Mobile ]);

		let level = {
			type: 'level',
			level: {
				company: getCompany(),
				customer: getName(),
				problems: Math.random() <= 0.05 ? [] : product.generateProblems(wave, Math.random() > 0.2 ? 3 : 2),
				product
			}
		} as Action;

		yield level;
		const res: LevelResult = yield { type: 'await', what: 'complete' };
		if (res.complete >= res.quota) yield { type: 'set_wave', wave: ++wave };
		if (wave !== res.wave) {
			wave = Math.max(res.wave, wave);
			if (wave >= 5) break;
			else yield { type: 'set_wave_ticks', ticks: 60 };
		}
	}

	yield { type: 'set_wave_ticks', ticks: 0 };
	yield {
		type: 'dialogue', ring: true, endTone: true, text: [
			'It\'s snowing outside.',
			'I\'m gonna go get my children a present.',
			'Have a nice holiday, kid.'
		]
	};

	yield { type: 'await', what: 'time', time: 1000 };
}
