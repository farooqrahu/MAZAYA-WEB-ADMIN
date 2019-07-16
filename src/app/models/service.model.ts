/**
 * Domain model for users.
 */
export class ServiceModel {
	/**
	 * Service ID.
	 * @type {any}
	 */
	id: any;

	/**
	 * Service name.
	 * @type {string}
	 */
	name: string;

	/**
	 * Service description.
	 * @type {string}
	 */
	description: string;

	/**
	 * The image url of the service.
	 * @type {string}
	 */
	imageUrl: string;

	/**
	 * Whether or not the service affects the transport count
	 * @type {boolean}
	 */
	affectCount: boolean;

	/**
	 * Whether or not the service enables driver tracking
	 * @type {boolean}
	 */
	trackable: boolean;

	/**
	 * @type {boolean}
	 */
	serviceable: boolean;

	inPackagesCount: number = 0;

	inOrdersCount: number = 0;

	/**
	 * Initialize the properties.
	 * @param data
	 */
	constructor(public data: any) {
		this.id = this.data.id;
		this.name = this.data.attributes.name;
		this.description = this.data.attributes.description;
		this.imageUrl = this.data.attributes['image-url'];
		this.affectCount = this.data.attributes['affect-count'];
		this.trackable = this.data.attributes.trackable;
		this.serviceable = this.data.attributes.serviceable;
		this.inPackagesCount = this.data.attributes['package-service-count'];
		this.inOrdersCount = this.data.attributes['order-service-count'];
	}

}
