import * as pluralize from 'pluralize';

export const capitalize = (str: string) => {
	if ( !str ) {
		return str;
	} else {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
};

export const singularize = (str: string) => {
	if ( !str ) {
		return str;
	} else {
		return pluralize.singular(str);
	}
};

export const toTitleCase = (phrase) => {
	return phrase
		.toLowerCase()
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};
