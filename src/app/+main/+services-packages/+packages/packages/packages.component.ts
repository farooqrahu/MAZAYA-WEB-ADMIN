import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { PackagesService } from '../../../../services/api/packages/packages.service';
import { capitalize } from '../../../../utils/strings';

@Component(
	{
		selector: 'mazaya-packages',
		templateUrl: './packages.component.html',
		styleUrls: [ './packages.component.scss' ],
		encapsulation: ViewEncapsulation.Emulated,
		providers: [ PackagesService ]
	})
export class PackagesComponent implements OnInit {

	statusFilterOptions: any[] = [
		'all',
		'active',
		'deactivated'
	];

	statusFilter: string = 'all';

	@ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

	packages: any[];

	packagesDataSource: MatTableDataSource<any>;

	sortBy: string = 'name';

	columnsToDisplay: string[] = [ 'name', 'tags', 'services', 'active', 'actions' ];

	searchQuery: string = '';

	constructor (private packagesService: PackagesService) {
	}

	ngOnInit () {
		this.loadPackages();
	}

	formatStatusFilterOption (str: string) {
		return capitalize(str);
	}

	loadPackages (): void {
		let params: HttpParams = new HttpParams();
		params = params.append('sort', this.sortBy);
		params = params.append('filter[web-only]', 'false');

		this.packagesService.listAll(null, params).subscribe((result: any) => {
			this.packages = result.data;
			this.packagesDataSource = new MatTableDataSource(this.packages);
			this.packagesDataSource.paginator = this.paginator;
			this.packagesDataSource.filterPredicate = (data: any, filter: string) => {
				return !filter || data.attributes.name.toLowerCase().includes(filter.toLowerCase());
			};
		});
	}

	applyFilter (filterValue: string) {
		this.packagesDataSource.filter = filterValue.trim().toLowerCase();
	}
}
