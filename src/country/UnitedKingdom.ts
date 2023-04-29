import type { Country } from './Country';

export const UnitedKingdom: Country = {
	name: 'United Kingdom',
	conditions: [
		{ identifier: '2_year_warranty', description: 'Product must come with at minimum a 2 year warranty.' },
		{ identifier: '60_day_return', description: 'Item may be returned if undamaged within 60 days of purchase.' },
		{ identifier: 'matches_specification', description: 'Product must exactly match specification.' },
		{ identifier: 'electrically_safe', description: 'If electric, must be rated for use in the United Kingdom.' },
		{ identifier: 'carcinogen', description: 'Product must not contain any carcinogens.' }
	]
};
