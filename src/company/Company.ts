import seedrandom from 'seedrandom';

export type CompanyCondition = {
	identifier: string;
	description: string;
};

const CompanyConditions: CompanyCondition[] = [
	{ identifier: 'unopened', description: 'Product must be unopened.' },
	{ identifier: 'local_return', description: 'Product must be returned within the country.' },
	{ identifier: 'photo_evidence', description: 'Photo evidence of problem must be provided.' },
	{ identifier: 'low_weight', description: 'Product must weigh less than 1kg.' },
	{ identifier: 'low_cost', description: 'Product must cost less than $100.' },
	{ identifier: 'high_cost', description: 'Product must cost more than $100.' }
];

const CompanyNames: string[] = [ 'Azzure', 'Cytek', 'Cyteck', 'Cyteq', 'Gogole', 'Gogle', 'SciPhone', 'Sinnung', 'Socki', 'Socky', 'Suny', 'Sunyii', 'Gorro', 'Backit', 'Backl', 'Barck', 'Sangsum', 'Aplle', 'Aupi', 'Nokla', 'Noklia', 'Nuuk', 'Nuk', 'Qwerty', 'Queq', 'Palm', 'Paml', 'Pan', 'Porsh', 'Xiii', 'Xanomi', 'Zylo', 'Ziix', 'Logotek', 'Lonavo', 'Raybon', 'Racoon', 'Radt', 'Radit', 'Finx', 'Funnki', 'Deck', 'Dqck', 'Giggle', 'Banana', 'Banans', 'Mangu', 'Mnnnu', 'Lemnz', 'Frrst', 'FireTek', 'FasPhone', 'Tekno', 'Tasti', 'TikTuk', 'Epple', 'Endroid', 'Yoooop', 'Yogl', 'Toasted Games', 'Aurailus Design', 'ECO-CAP' ];

export interface Company {
	name: string;
	rating: number;
	conditions: CompanyCondition[];
}

const rng = seedrandom('company');

export const Companies = CompanyNames.map((name: string, i): Company => {
	const numConditions = Math.floor(rng() * 3 + 1);
	const conditions: CompanyCondition[] = [];

	while (conditions.length < numConditions) {
		const potentialCondition = CompanyConditions[Math.floor(rng() * CompanyConditions.length)];
		if (!conditions.includes(potentialCondition)) {
			conditions.push(potentialCondition);
		}
	}

	return {
		name,
		rating: Math.floor(Math.pow(rng(), 1/2) * 10 + 1) / 2,
		conditions
	}
});

export function getCompany() {
	return Companies[Math.floor(rng() * CompanyNames.length)];
}
