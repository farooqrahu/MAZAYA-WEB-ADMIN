export class OrderModel {
  public orderId: any;
  public status: string;
  public created: any;

  constructor(public data: any) {
    this.orderId = this.data.orderId;
    this.status = this.data.status;
    this.created = this.formatCreated(this.data.created);
  }

  formatCreated(created) {
    let date = new Date(created * 1000);

    return `${(date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }
}
