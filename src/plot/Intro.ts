import { Level, LevelResult } from "../Level";
import { getCompany } from "../company/Company";
import { getName } from "../customer/Customer";
import Plushie from "../product/Plushie";
import { Action, Plot }  from './Plot';

export function* intro(): Plot {
	// yield {
	// 	type: 'level',
	// 	level: {
	// 		company: Company[0],
	// 		customer: getName(),
	// 		problems: [ 'beheaded' ],
	// 		product: Plushie
	// 	}
	// };

	// yield {
	// 	type: 'ui',
	// 	key: 'info',
	// 	show: true
	// };

	// yield {
	// 	type: 'ui',
	// 	key: 'checklist',
	// 	show: true
	// };

	// yield {
	// 	type: 'ui',
	// 	key: 'approvedeny',
	// 	show: true
	// }

	// return;

	/*
	 * Intro exposition.
	 */

	yield { type: 'await', what: 'time', time: 1000 };
	yield { type: 'ui', key: 'computer', show: true };
	yield { type: 'required_evidence', amount: 0 };

	yield {
		type: 'dialogue',
		ring: true,
		text: [
			'Hey there new hire, how do you like the office? I heard they gave you one of the window seats. Jealous!',
			'Aaanyways, I\'m your supervisor, Jim. I thought I\'d give you a little call to help you learn the ropes.',
			'I know, I know. I\'m sure you\'ve already read the full employee handbook, but a quick refresher can\'t hurt.',
			'Sometimes people show up without having even read the job description. Ridiculous, right?',
			'I\'m sure you\'re more responsible than that, though. Surely.'
		],
	};

	yield {
		type: 'await',
		what: 'time',
		time: 500
	};

	yield {
		type: 'dialogue',
		text: [
			'Alright, you see that conveyor belt in front of you? That\'s where the products come in.',
			'At Amozom, we process thousands of return requests every day. It\'s a big job, but that\'s why we\'re the best in the business.',
			'Looks like the first product is coming in now. Let\'s take a look.',
		]
	};

	/*
	 * First product approval demonstration.
	 */

	yield {
		type: 'level',
		level: {
			company: getCompany(),
			customer: getName(),
			problems: [ 'beheaded' ],
			product: Plushie
		}
	};

	yield {
		type: 'await',
		what: 'time',
		time: 1000,
	}

	yield {
		type: 'dialogue',
		text: [
			'Ooooh, yikes. I wouldn\'t want my child playing with that thing!',
			'Last I checked, plushies are usually supposed a have a head.',
			'Seems pretty cut and dry to me, so let\'s approve the return.'
		]
	};

	yield { type: 'ui', key: 'info', show: true }
	yield { type: 'ui', key: 'approvedeny', show: true }
	yield { type: 'ui', key: 'approve', show: true }

	yield {
		type: 'await',
		what: 'approve'
	};

	yield {
		type: 'await',
		what: 'time',
		time: 200,
	};

	/*
	 * Second product approval demonstration with evidence demonstration.
	 */

	yield {
		type: 'dialogue',
		text: [
			'Alright, looks like we\'ve got another one coming up. Let\'s see what we\'re dealing with here.'
		]
	};

	yield {
		type: 'level',
		level: {
			company: getCompany(),
			customer: getName(),
			problems: [ 'ears', 'tail', 'color', 'tag' ],
			product: Plushie
		}
	};

	yield { type: 'await', what: 'time', time: 500, };

	yield {
		type: 'dialogue',
		text: [
			'Hmmm. At first glance, this product looks fine...',
			'But if the customer submitted a return, then there must be something wrong with it...',
			'Here, let\'s take a closer look.'
		]
	}

	yield { type: 'ui', key: 'checklist', show: true };

	yield { type: 'await', what: 'time', time: 500 };

	yield {
		type: 'dialogue',
		text: [
			'Alright, here\'s the specifications for the plush. Let\'s see if we can spot any inconsistencies.',
			'Ah, yeah look at that. Almost everything about this is wrong.',
			'The ears, the tail, even the color is off. And the tag is for some random other brand!',
			'Looks like we\'ve got a counterfeit on our hands.'
		]
	};

	yield { type: 'flag_problem', key: 'color' };
	yield { type: 'await', what: 'time', time: 150 };
	yield { type: 'flag_problem', key: 'tail' };
	yield { type: 'await', what: 'time', time: 150 };
	yield { type: 'flag_problem', key: 'ears' };
	yield { type: 'await', what: 'time', time: 150 };
	yield { type: 'flag_problem', key: 'tag' };
	yield { type: 'await', what: 'time', time: 150 };

	yield {
		type: 'dialogue',
		text: [
			'Notice how I circled the mistakes on the product specification?',
			'Despite the benevolence of our corporate overlords, the higher-ups still want us to provide evidence for our decisions.',
			'So make sure you\'re always thorough when you\'re checking the products,',
			'And that you mark down any evidence you find BEFORE you approve the return.',
			'Otherwise, I might have to write you up, and I don\'t wanna do that!',
			'Now go ahead and approve it.'
		]
	}

	yield { type: 'required_evidence', amount: 1 };
	yield { type: 'await', what: 'approve' };

	/*
	 * Flagging your own problems #1.
	 */

	yield {
		type: 'dialogue',
		text: [
			'Okay, how about you try your hand at a few of these, and I\'ll let you know how you\'re doing.'
		]
	};

	yield { type: 'ui', key: 'deny', show: true }

	let level: Action = {
		type: 'level',
		level: {
			company: getCompany(),
			customer: getName(),
			problems: [ 'ears', 'tail', 'color', 'tag' ],
			product: Plushie
		}
	};

	yield level;
	while (true) {
		const res: LevelResult = yield { type: 'await', what: 'complete' };
		if (res.result === 'incorrect_verdict') {
			yield level;
			yield { type: 'await', what: 'time', time: 400 };
			yield {
				type: 'dialogue',
				text: [
					'Oh, uh, looks like you accidentally denied this one.',
					'There are a lot of problems with this product, take a closer look.',
				]
			}
		}
		else if (res.result === 'incorrect_invalid_evidence') {
			yield level;
			yield { type: 'await', what: 'time', time: 400 };
			yield {
				type: 'dialogue',
				text: [
					'Oh, uh, you flagged some issues that aren\'t there.',
					'Take a moment to double check everything, and then give it another try.',
				]
			}
		}
		else {
			yield {
				type: 'dialogue',
				text: [
					'Nice job! You\'re a natural at this.',
					'Let\'s try another one.'
				]
			}
			break;
		}
	}

	level = {
		type: 'level',
		level: {
			company: getCompany(),
			customer: getName(),
			problems: [ 'beheaded' ],
			product: Plushie
		}
	}

	yield level;
	while (true) {
		const res: LevelResult = yield { type: 'await', what: 'complete' };
		if (res.result === 'incorrect_verdict') {
			yield level;
			yield { type: 'await', what: 'time', time: 400 };
			yield {
				type: 'dialogue',
				text: [
					'This product has definitely been damaged. That\'s approval-worthy right there.',
					'Check the specifications and mark the right item, and then you can approve the request.',
				]
			}
		}
		else if (res.result === 'incorrect_invalid_evidence') {
			yield level;
			yield { type: 'await', what: 'time', time: 400 };
			yield {
				type: 'dialogue',
				text: [
					'Oh, uh, you flagged some issues that aren\'t there.',
					'Take a moment to double check everything, and then give it another try.',
				]
			}
		}
		else {
			yield {
				type: 'dialogue',
				text: [
					'Great! You\'re rocking it.',
					'Here\'s another.'
				]
			}
			break;
		}
	}

	level = {
		type: 'level',
		level: {
			company: getCompany(),
			customer: getName(),
			problems: [ 'eyes' ],
			product: Plushie
		}
	}

	yield level;
	while (true) {
		const res: LevelResult = yield { type: 'await', what: 'complete' };
		if (res.result === 'incorrect_verdict') {
			yield level;
			yield { type: 'await', what: 'time', time: 400 };
			yield {
				type: 'dialogue',
				text: [
					'This one\'s really subtle.',
					'Take a look at the reference image, and read all of the specifications carefully.',
					'You should see the problem.'
				]
			}
		}
		else if (res.result === 'incorrect_invalid_evidence') {
			yield level;
			yield { type: 'await', what: 'time', time: 400 };
			yield {
				type: 'dialogue',
				text: [
					'Oh, uh, you flagged some issues that aren\'t there.',
					'Take a moment to double check everything, and then give it another try.',
				]
			}
		}
		else {
			yield {
				type: 'dialogue',
				text: [
					'Awesome! Here\'s the last one.',
				]
			}
			break;
		}
	}

	level = {
		type: 'level',
		level: {
			company: getCompany(),
			customer: getName(),
			problems: [],
			product: Plushie
		}
	} as Action;

	yield level;
	let res: LevelResult = yield { type: 'await', what: 'complete' };

	if (res.result === 'incorrect_verdict') {
		yield level;
		yield { type: 'await', what: 'time', time: 400 };
		yield {
			type: 'dialogue',
			text: [
				'Hold on a sec there!',
				'Looks like we\'ve just got ourselves our first invalid return.',
				'Here, take a look at the product specification.',
				'There\'s nothing wrong with this plushie!',
				'*sigh*',
				'As much as I want to believe that everybody is honest and fair to us innocent megacorporations,',
				'Some people\'ll still try to take advantage of us.',
				'If you ever get a return that doesn\'t have any problems,',
				'You\'ll need to make sure you deny it.'
			]
		}
	}
	else {
		yield {
			type: 'dialogue',
			text: [
				'Wow, you\'re ahead of the game.',
				'I was trying to trick you with that one, but you saw right through it.',
				'You\'re ready to start working on real returns now.'
			]
		}
	}

	if (res.result !== 'correct') {
		yield level;
		while (true) {
			const res: LevelResult = yield { type: 'await', what: 'complete' };
			if (res.verdict === 'approved') {
				yield level;
				yield { type: 'await', what: 'time', time: 400 };
				yield {
					type: 'dialogue',
					text: [
						'Wait a moment, remember what we said?',
						'There\'s nothing wrong with this product. You have to deny the return.'
					]
				}
			}
			else {
				yield {
					type: 'dialogue',
					text: [
						'Hey, there you go! I think you\'ve really got a knack for this job.'
					]
				}
				break;
			}
		}
	}

	yield {
		type: 'dialogue',
		text: [
			'Wow, look at the time! It\'s already 5:00.',
			'Well, It\'s been great meeting you, but it\'s time for me to clock out.',
			'You\'ll be fine on your own, right?',
			'Alright, good luck!',
			'...',
			'...',
			'Oh, and one more thing.',
			'Amozom has a pretty strict quota for the number of returns you need to process every hour.',
			'So watch the clock! If you don\'t meet your quota, you\'ll be fired.',
			'Alright, cya!'
		]
	}
}
