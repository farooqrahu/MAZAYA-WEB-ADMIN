import { Injectable } from '@angular/core';

@Injectable()
export class OrderService {

  private data: any = [
    { orderId: '00001', status: 'pending', created: '1524752656' },
    { orderId: '00002', status: 'pending', created: '1524752656' },
    { orderId: '00003', status: 'pending', created: '1524752656' },
    { orderId: '00004', status: 'completed', created: '1524835456' },
    { orderId: '00005', status: 'completed', created: '1524835456' },
    { orderId: '00006', status: 'completed', created: '1525353856' },
    { orderId: '00007', status: 'completed', created: '1525353856' },
    { orderId: '00008', status: 'canceled', created: '1527341056' },
    { orderId: '00009', status: 'canceled', created: '1527341056' },
    { orderId: '00010', status: 'completed', created: '1527341056' },
    { orderId: '00011', status: 'completed', created: '1527341056' },
    { orderId: '00012', status: 'completed', created: '1527341056' },
    { orderId: '00013', status: 'completed', created: '1527341056' },
    { orderId: '00014', status: 'completed', created: '1527341056' },
    { orderId: '00015', status: 'completed', created: '1527341056' },
    { orderId: '00016', status: 'completed', created: '1527341056' },
    { orderId: '00017', status: 'completed', created: '1527341056' },
    { orderId: '00018', status: 'completed', created: '1527341056' },
    { orderId: '00019', status: 'completed', created: '1527341056' },
    { orderId: '00020', status: 'completed', created: '1527341056' },
    { orderId: '00021', status: 'completed', created: '1527341056' },
    { orderId: '00022', status: 'completed', created: '1527341056' },
    { orderId: '00023', status: 'completed', created: '1527341056' },
    { orderId: '00024', status: 'completed', created: '1527341056' },
    { orderId: '00025', status: 'completed', created: '1527341056' },
    { orderId: '00026', status: 'completed', created: '1527341056' },
    { orderId: '00027', status: 'completed', created: '1527341056' },
    { orderId: '00028', status: 'completed', created: '1527341056' },
    { orderId: '00029', status: 'completed', created: '1527341056' },
    { orderId: '00030', status: 'completed', created: '1527341056' },
    { orderId: '00031', status: 'pending', created: '1524752656' },
    { orderId: '00032', status: 'pending', created: '1524752656' },
    { orderId: '00033', status: 'pending', created: '1524752656' },
    { orderId: '00034', status: 'completed', created: '1524835456' },
    { orderId: '00035', status: 'completed', created: '1524835456' },
    { orderId: '00036', status: 'completed', created: '1525353856' },
    { orderId: '00037', status: 'completed', created: '1525353856' },
    { orderId: '00038', status: 'canceled', created: '1527341056' },
    { orderId: '00039', status: 'canceled', created: '1527341056' },
    { orderId: '00040', status: 'completed', created: '1527341056' },
    { orderId: '00041', status: 'completed', created: '1527341056' },
    { orderId: '00042', status: 'completed', created: '1527341056' },
    { orderId: '00043', status: 'completed', created: '1527341056' },
    { orderId: '00044', status: 'completed', created: '1527341056' },
    { orderId: '00045', status: 'completed', created: '1527341056' },
    { orderId: '00046', status: 'completed', created: '1527341056' },
    { orderId: '00047', status: 'completed', created: '1527341056' },
    { orderId: '00048', status: 'completed', created: '1527341056' },
    { orderId: '00049', status: 'completed', created: '1527341056' },
    { orderId: '00050', status: 'completed', created: '1527341056' },
    { orderId: '00051', status: 'pending', created: '1524752656' },
    { orderId: '00052', status: 'pending', created: '1524752656' },
    { orderId: '00053', status: 'pending', created: '1524752656' },
    { orderId: '00054', status: 'completed', created: '1524835456' },
    { orderId: '00055', status: 'completed', created: '1524835456' },
    { orderId: '00056', status: 'completed', created: '1525353856' },
    { orderId: '00057', status: 'completed', created: '1525353856' },
    { orderId: '00058', status: 'canceled', created: '1527341056' },
    { orderId: '00059', status: 'canceled', created: '1527341056' },
    { orderId: '00060', status: 'completed', created: '1527341056' },
    { orderId: '00061', status: 'completed', created: '1527341056' },
    { orderId: '00062', status: 'completed', created: '1527341056' },
    { orderId: '00063', status: 'completed', created: '1527341056' },
    { orderId: '00064', status: 'completed', created: '1527341056' },
    { orderId: '00065', status: 'completed', created: '1527341056' },
    { orderId: '00066', status: 'completed', created: '1527341056' },
    { orderId: '00067', status: 'completed', created: '1527341056' },
    { orderId: '00068', status: 'completed', created: '1527341056' },
    { orderId: '00069', status: 'completed', created: '1527341056' },
    { orderId: '00070', status: 'completed', created: '1527341056' },
  ];

  private viewableOrder: any;

  constructor() {}

  getOrders() {
    return this.data;
  }

  orderExists(orderId) {
    return this.data.filter(item => item.orderId === orderId);
  }

  setViewableOrder(found) {
    this.viewableOrder = found;
  }

  getViewableOrder() {
    return this.viewableOrder;
  }

}
