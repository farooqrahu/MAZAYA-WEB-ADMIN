export interface JsonApiLinks {
	next?: string;
	last?: string
}

export interface JsonApiMeta {
	'total-records'?: string
}

export interface JsonApiResponse {
	data: any[];
	links: JsonApiLinks;
	meta?: JsonApiMeta;
	included?: any[];
}
