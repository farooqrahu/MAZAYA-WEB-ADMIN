import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


@Component(
  {
    selector: 'mazaya-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
  })
export class DashboardComponent implements OnInit {
  public METABASE_SITE_URL = "https://40.118.71.29:3000";
  public METABASE_SECRET_KEY = "f49d2aeea97e321d0fe2eccd3ed1c18dcdd75f6aafe309352f251b7e8e5dc1a8";
  public payload = {
    "resource": { "dashboard": 1 },
    "params": {},
    "exp": 1566016878
  };
  //Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
  public iframeUrl: any;

  constructor(public sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    // const header = {
    //   "typ": "JWT",
    //   "alg": "HS256"
    // }
    // const signature = btoa(JSON.stringify(header)) + "." + btoa(JSON.stringify(this.payload));
    // var hash = CryptoJS.HmacSHA256(
    //   signature, this.METABASE_SECRET_KEY
    // );
    const staticToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZSI6eyJkYXNoYm9hcmQiOjF9LCJwYXJhbXMiOnt9LCJleHAiOjE4OTM3MjYwMjAzNTJ9.1XwBTQXTIuZ0jZy9EbqogPbpKySaCBSvbtFZgw3m4oU`;
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://40.118.71.29:3000/embed/dashboard/${staticToken}`);
  }
}













// public lineChartData: any = [

//   { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'First Dataset' },
//   { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Second Dataset' }

// ];
// public lineChartLabels: string[] = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July' ];
// public lineChartOptions: any = {
//   animation: {
//     duration: 1000 // general animation time
// //      easing: 'easeInOut'
//   },
//   hover: {
//     animationDuration: 1000, // duration of animations when hovering an item
//     mode: 'label'
//   },
//   responsiveAnimationDuration: 1000, // animation duration after a resize
//   responsive: true,
//   maintainAspectRatio: false,
//   legend: {
//     position: 'bottom'
//   },
//   scales: {
//     xAxes: [ {
//       display: true,
//       gridLines: {
//         color: '#f3f3f3',
//         drawTicks: false
//       },
//       scaleLabel: {
//         display: true,
//         labelString: 'Month'
//       }
//     } ],
//     yAxes: [ {
//       display: true,
//       gridLines: {
//         color: '#f3f3f3',
//         drawTicks: false
//       },
//       scaleLabel: {
//         display: true,
//         labelString: 'Value'
//       }
//     } ]
//   },
//   title: {
//     display: false,
//     text: ''
//   }
// };
// public lineChartColors: any = [
//   {

//     fill: false,
//     borderDash: [ 4, 2 ],
//     borderColor: '#000',
//     pointBorderColor: '#000',
//     pointBackgroundColor: '#FFF',
//     pointBorderWidth: 2,
//     pointHoverBorderWidth: 2,
//     pointRadius: 4
//   },
//   {

//     fill: false,
//     borderDash: [ 4, 2 ],
//     borderColor: '#aa5f56',
//     pointBorderColor: '#aa5f56',
//     pointBackgroundColor: '#FFF',
//     pointBorderWidth: 2,
//     pointHoverBorderWidth: 2,
//     pointRadius: 4
//   }

// ];
// public lineChartLegend: Boolean = false;
// public lineChartType: String = 'line';

// public doughnutChartLabels: string[] = [ 'Fast Track', 'Pick Up Luggage', 'Full Package' ];
// public doughnutChartData: number[] = [ 350, 450, 100 ];
// public doughnutChartColors: any[] = [ {
//   backgroundColor: [
//     'rgba(160, 160, 160, 0.8)',
//     'rgba(0, 0, 0, 0.8)',
//     'rgba(170, 95, 86, 0.8)' ]
// } ];
// public doughnutChartType = 'doughnut';
// public doughnutChartOptions: any = {
//   animation: false,
//   responsive: true,
//   maintainAspectRatio: false
// };

// public pieChartLabels: string[] = [ 'Fast Track', 'Pick Up Luggage', 'Full Package' ];
// public pieChartData: number[] = [ 300, 500, 100 ];
// public pieChartType = 'pie';
// public pieChartColors: any[] = [
//   {
//     backgroundColor:
//       [
//         'rgba(160, 160, 160, 0.8)',
//         'rgba(0, 0, 0, 0.8)',
//         'rgba(170, 95, 86, 0.8)'
//       ]
//   } ];
// public pieChartOptions: any = {
//   animation: false,
//   responsive: true,
//   maintainAspectRatio: false
// };

// public barChartView: any[] = [ 550, 400 ];
// public barChartShowYAxis = true;
// public barChartShowXAxis = true;
// public barChartGradient = false;
// public barChartShowLegend = false;
// public barChartShowXAxisLabel = true;
// public barChartXAxisLabel = 'Country';
// public barChartShowYAxisLabel = true;
// public barChartYAxisLabel = 'Users';
// public barChartColorScheme = { domain: [ '#a0a0a0', '#aa5f56', '#FF586B', '#AAAAAA' ] };

// public barChartmulti = [
//   {
//     'name': 'Germany',
//     'series': [
//       {
//         'name': 'Member',
//         'value': 730
//       },
//       {
//         'name': 'No Member',
//         'value': 894
//       }
//     ]
//   },

//   {
//     'name': 'USA',
//     'series': [
//       {
//         'name': 'Member',
//         'value': 787
//       },
//       {
//         'name': 'No Member',
//         'value': 827
//       }
//     ]
//   },

//   {
//     'name': 'France',
//     'series': [
//       {
//         'name': 'Member',
//         'value': 500
//       },
//       {
//         'name': 'No Member',
//         'value': 580
//       }
//     ]
//   },
//   {
//     'name': 'Australia',
//     'series': [
//       {
//         'name': 'Member',
//         'value': 600
//       },
//       {
//         'name': 'No Member',
//         'value': 650
//       }
//     ]
//   }
// ];

// public pieChartSingle = [
//   {
//     'name': 'Germany',
//     'value': 894
//   },
//   {
//     'name': 'USA',
//     'value': 500
//   },
//   {
//     'name': 'France',
//     'value': 720
//   }
// ];

// public pieChartView: any[] = [ 550, 400 ];

// public pieChartShowLegend = false;

// public pieChartColorScheme = {
//   domain: [ '#a0a0a0', '#aa5f56', '#000000', '#AAAAAA' ]
// };

// public pieChartShowLabels = true;
// public pieChartExplodeSlices = false;
// public pieChartDoughnut = true;
// public pieChartGradient = false;

// public pieChart1ExplodeSlices = true;
// public pieChart1Doughnut = false;