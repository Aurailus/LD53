import type { Country } from './Country';

export const Canada: Country = {
	name: 'Canada',
	conditions: [
		{ identifier: '1_year_warranty', description: 'Product must come with at minimum a 1 year warranty.' },
		{ identifier: '15_day_warranty', description: 'Item may be returned if undamaged within 15 days of purchase.' },
		{ identifier: 'bilingual_labeling', description: 'Product must be labeled in both English and French.' },
	]
};
