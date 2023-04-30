import { Level, LevelResult } from "../Level";
import { getCompany } from "../company/Company";
import { getName } from "../customer/Customer";
import Cartridge from "../product/Cartridge";
import Plushie from "../product/Plushie";
import Headset from "../product/Headset";
import { Action, Plot }  from './Plot';

export function* thirdday(): Plot {
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
	yield { type: 'set_wave_ticks', ticks: 20 };
	yield { type: 'set_quota', quotas: [ 3, 4, 5, 10, 10 ] };

	yield {
		type: 'level',
		level: {
			company: getCompany(),
			customer: getName(),
			problems: [],
			product: Cartridge
		}
	};

	yield { type: 'await', what: 'complete' };
}
