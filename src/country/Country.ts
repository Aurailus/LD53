export type CountryCondition = {
	identifier: string;
	description: string;
};

export interface Country {
	name: string;
	conditions: CountryCondition[];
}
