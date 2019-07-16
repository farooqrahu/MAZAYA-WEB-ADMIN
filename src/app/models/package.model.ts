/**
 * Domain model for users.
 */
export class PackageModel {
  /**
   * User ID.
   * @type {any}
   */
  id: any;

  /**
   * Package name.
   * @type {string}
   */
  name: string;

  /**
   * Package description.
   * @type {string}
   */
  description: string;

  /**
   * The image url of the package.
   * @type {string}
   */
  imageUrl: string;

  /**
   * An array of services.
   * @type {any[]}
   */
  services: any[];

  /**
   * An array of availabilities.
   * @type {any[]}
   */
  availabilities: any[];

  webOnly: boolean;

  /**
   * Initialize the properties.
   * @param data
   */
  constructor(public data: any) {
    this.id = this.data.id;
    this.name = this.data.attributes.name;
    this.description = this.data.attributes.description;
    this.imageUrl = this.data.attributes['image-url-web'];
    this.services = this.data.attributes.services;
    this.availabilities = this.data.attributes.availabilities;
    this.webOnly = this.data.attributes['web-only'];
  }

}

export interface VoucherPackage {
  "discount-percentage": number,
  "discount-amount": number,
  "redemptions": number,
  "package-id": number,
  "status-id": number,
  "package-availability-id": number,
  "isPercentage"?: boolean
}
