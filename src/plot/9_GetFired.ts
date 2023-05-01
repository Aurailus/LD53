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

export function* getFired(): Plot {
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
	yield { type: 'set_quota', quotas: [ 0 ] };
	yield { type: 'set_wave_ticks', ticks: 0 };
	yield { type: 'set_score_expectation', score: 10000 };

	yield {
		type: 'dialogue', ring: true, text: [
			'Hey there! I hope you had a great New Years!',
			'It\'s been a while since we last talked.',
			'I hope you\'re doing well.'
		]
	};

	yield {
		type: 'await',
		what: 'time',
		time: 500
	}

	yield {
		type: 'dialogue', text: [
			'Anyways, I\'ve got some good news, and some bad news.',
			'Which do you want to hear first?',
			'...',
			'Okay, I\'ll tell you the good news first.',
		]
	};

	yield {
		type: 'await',
		what: 'time',
		time: 500
	}

	yield {
		type: 'dialogue',text: [
			'Amozom reviewed your performance, and they decided that you deserved a raise!',
			'Last week, they promoted you to Level 2 Customer Service Representative!',
			'Congratulations!'
		]
	}


	yield {
		type: 'await',
		what: 'time',
		time: 500
	}

	yield {
		type: 'dialogue',text: [
			'...',
			'Oh, the bad news?',
			'Well...'
		]
	}


	yield {
		type: 'await',
		what: 'time',
		time: 500
	}


	yield {
		type: 'dialogue',text: [
			'A week after that, Corporate decided to cut costs.',
			'And they decided to do a few layoffs.',
			'And on account of your lack of job history for your new position,',
			'you were one of the first to go.',
		]
	}

	yield {
		type: 'await',
		what: 'time',
		time: 500
	}


	yield {
		type: 'dialogue',text: [
			'Oh well!',
			'You win some, you lose some.',
			'See, I lost out too, here.',
			'Now I have to train a new guy.',
			'And I don\'t wanna do that!',
			'So don\'t feel too bad.',
			'We all go through things sometimes.'
		]
	}
	yield {
		type: 'await',
		what: 'time',
		time: 500
	}

	yield {
		type: 'dialogue',text: [
			'Well then, I guess security will be there in a moment to escort you out.',
			'Cya around, kid.'
		]
	}

	yield { type: 'await', what: 'time', time: 500 };
}
