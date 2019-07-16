/**
 * Domain model for users.
 */
export class UserModel {
  /**
   * User ID.
   * @type {any}
   */
  id: any;

  /**
   * User email.
   * @type {string}
   */
  email: string;

  /**
   * First name.
   * @type {string}
   */
  firstName: string;

  /**
   * Last name.
   * @type {string}
   */
  lastName: string;

  /**
   * Full name.
   * @type {string}
   */
  fullName: string;

  /**
   * User role name.
   * @type {string}
   */
  role: string;

  /**
   * User status.
   * @type {string}
   */
  status: string;

  /**
   * User phone number.
   * @type {string}
   */
  phoneNumber: string;

  /**
   * Initialize the properties.
   * @param data
   */
  constructor(public data: any) {
    this.id = this.data.id;
    this.email = this.data.attributes.email;
    this.firstName = this.data.attributes['first-name'];
    this.lastName = this.data.attributes['last-name'];
    this.fullName = this.data.attributes['full-name'];
    this.role = '';
    this.status = '';
    this.phoneNumber = this.data.attributes['mobile-number'];
  }

}
