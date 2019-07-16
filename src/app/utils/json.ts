import { singularize } from './strings';

export function assignAttributes (model: any, includes: any[]): any {
	if ( includes && Array.isArray(includes) ) {
		includes.forEach((include: any) => {
			const key = singularize(include.type);
			if ( !model.attributes[ key] ) {
				model.attributes[ key ] = include;
			} else {
				if ( Array.isArray(model.attributes[ key ]) ) {
					model.attributes[ key ].push(include);
				} else {
					model.attributes[ key ] = [ model.attributes[ key ], include ];
				}
			}
		});
		return model;
	} else {
		return model;
	}
}
