import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component(
	{
		selector: 'mazaya-dashboard',
		templateUrl: './dashboard.component.html',
		styleUrls: [ './dashboard.component.scss' ],
		encapsulation: ViewEncapsulation.Emulated
	})
export class DashboardComponent implements OnInit {
	public lineChartData: any = [

		{ data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'First Dataset' },
		{ data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Second Dataset' }

	];
	public lineChartLabels: string[] = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July' ];
	public lineChartOptions: any = {
		animation: {
			duration: 1000 // general animation time
//      easing: 'easeInOut'
		},
		hover: {
			animationDuration: 1000, // duration of animations when hovering an item
			mode: 'label'
		},
		responsiveAnimationDuration: 1000, // animation duration after a resize
		responsive: true,
		maintainAspectRatio: false,
		legend: {
			position: 'bottom'
		},
		scales: {
			xAxes: [ {
				display: true,
				gridLines: {
					color: '#f3f3f3',
					drawTicks: false
				},
				scaleLabel: {
					display: true,
					labelString: 'Month'
				}
			} ],
			yAxes: [ {
				display: true,
				gridLines: {
					color: '#f3f3f3',
					drawTicks: false
				},
				scaleLabel: {
					display: true,
					labelString: 'Value'
				}
			} ]
		},
		title: {
			display: false,
			text: ''
		}
	};
	public lineChartColors: any = [
		{

			fill: false,
			borderDash: [ 4, 2 ],
			borderColor: '#000',
			pointBorderColor: '#000',
			pointBackgroundColor: '#FFF',
			pointBorderWidth: 2,
			pointHoverBorderWidth: 2,
			pointRadius: 4
		},
		{

			fill: false,
			borderDash: [ 4, 2 ],
			borderColor: '#aa5f56',
			pointBorderColor: '#aa5f56',
			pointBackgroundColor: '#FFF',
			pointBorderWidth: 2,
			pointHoverBorderWidth: 2,
			pointRadius: 4
		}

	];
	public lineChartLegend: Boolean = false;
	public lineChartType: String = 'line';

	public doughnutChartLabels: string[] = [ 'Fast Track', 'Pick Up Luggage', 'Full Package' ];
	public doughnutChartData: number[] = [ 350, 450, 100 ];
	public doughnutChartColors: any[] = [ {
		backgroundColor: [
			'rgba(160, 160, 160, 0.8)',
			'rgba(0, 0, 0, 0.8)',
			'rgba(170, 95, 86, 0.8)' ]
	} ];
	public doughnutChartType = 'doughnut';
	public doughnutChartOptions: any = {
		animation: false,
		responsive: true,
		maintainAspectRatio: false
	};

	public pieChartLabels: string[] = [ 'Fast Track', 'Pick Up Luggage', 'Full Package' ];
	public pieChartData: number[] = [ 300, 500, 100 ];
	public pieChartType = 'pie';
	public pieChartColors: any[] = [
		{
			backgroundColor:
				[
					'rgba(160, 160, 160, 0.8)',
					'rgba(0, 0, 0, 0.8)',
					'rgba(170, 95, 86, 0.8)'
				]
		} ];
	public pieChartOptions: any = {
		animation: false,
		responsive: true,
		maintainAspectRatio: false
	};

	public barChartView: any[] = [ 550, 400 ];
	public barChartShowYAxis = true;
	public barChartShowXAxis = true;
	public barChartGradient = false;
	public barChartShowLegend = false;
	public barChartShowXAxisLabel = true;
	public barChartXAxisLabel = 'Country';
	public barChartShowYAxisLabel = true;
	public barChartYAxisLabel = 'Users';
	public barChartColorScheme = { domain: [ '#a0a0a0', '#aa5f56', '#FF586B', '#AAAAAA' ] };

	public barChartmulti = [
		{
			'name': 'Germany',
			'series': [
				{
					'name': 'Member',
					'value': 730
				},
				{
					'name': 'No Member',
					'value': 894
				}
			]
		},

		{
			'name': 'USA',
			'series': [
				{
					'name': 'Member',
					'value': 787
				},
				{
					'name': 'No Member',
					'value': 827
				}
			]
		},

		{
			'name': 'France',
			'series': [
				{
					'name': 'Member',
					'value': 500
				},
				{
					'name': 'No Member',
					'value': 580
				}
			]
		},
		{
			'name': 'Australia',
			'series': [
				{
					'name': 'Member',
					'value': 600
				},
				{
					'name': 'No Member',
					'value': 650
				}
			]
		}
	];

	public pieChartSingle = [
		{
			'name': 'Germany',
			'value': 894
		},
		{
			'name': 'USA',
			'value': 500
		},
		{
			'name': 'France',
			'value': 720
		}
	];

	public pieChartView: any[] = [ 550, 400 ];

	public pieChartShowLegend = false;

	public pieChartColorScheme = {
		domain: [ '#a0a0a0', '#aa5f56', '#000000', '#AAAAAA' ]
	};

	public pieChartShowLabels = true;
	public pieChartExplodeSlices = false;
	public pieChartDoughnut = true;
	public pieChartGradient = false;

	public pieChart1ExplodeSlices = true;
	public pieChart1Doughnut = false;

	constructor () { }

	ngOnInit () {
	}

}
