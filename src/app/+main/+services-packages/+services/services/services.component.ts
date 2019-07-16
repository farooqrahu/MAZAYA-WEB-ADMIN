import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ServiceModel } from '../../../../models/service.model';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { ViewServiceModalComponent } from '../../../../dialogs/view-service-modal/view-service-modal.component';
import { findIndex } from 'lodash';
import { ServicesService } from '../../../../services/api/services/services.service';
import { capitalize } from '../../../../utils/strings';

@Component({
	           selector: 'mazaya-services',
	           templateUrl: './services.component.html',
	           styleUrls: [ './services.component.scss' ],
	           encapsulation: ViewEncapsulation.Emulated,
	           providers: [ ServicesService ]
           })
export class ServicesComponent implements OnInit {

	statusFilterOptions: any = [
		'all',
		'active',
		'deactivated'
	];

	statusFilter: string = 'all';

	services: any[];

	servicesDataSource: MatTableDataSource<any>;

	@ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

	sortBy: string = 'name';

	columnsToDisplay: string[] = [ 'name', 'tags', 'actions' ];

	searchQuery: string = '';

	constructor (private dialog: MatDialog, private servicesService: ServicesService) {
	}

	ngOnInit () {
		this.loadServices();
	}

	formatStatusFilterOption (str: string) {
		return capitalize(str);
	}

	loadServices (): void {
		let params: HttpParams = new HttpParams();
		params = params.append('sort', this.sortBy);

		this.servicesService.listAll(null, params).subscribe((result: any) => {
			this.services = result.data;
			this.servicesDataSource = new MatTableDataSource(this.services);
			this.servicesDataSource.paginator = this.paginator;
			this.servicesDataSource.filterPredicate = (data: any, filter: string) => {
				return !filter || data.attributes.name.toLowerCase().includes(filter.toLowerCase());
			};
		});
	}

	applyFilter (filterValue: string) {
		this.servicesDataSource.filter = filterValue.trim().toLowerCase();
	}

	viewService (service: any) {
		const dialogRef = this.dialog.open(ViewServiceModalComponent, {
			data: { service }
		});

		dialogRef.afterClosed().subscribe((result: boolean | null) => {
			if ( result !== null && typeof result !== 'undefined' ) {
				if ( result ) {
					const index = findIndex(this.services, (record: ServiceModel) => record.id === service.id);
					if ( index ) {
						this.services.splice(index, 1);
						this.servicesDataSource.data = this.services;
					}
				}
			}
		});
	}
}
