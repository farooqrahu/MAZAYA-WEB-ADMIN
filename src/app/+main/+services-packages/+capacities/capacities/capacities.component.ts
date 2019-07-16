import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { DeleteCapacityModalComponent } from '../../../../dialogs/delete-capacity-modal/delete-capacity-modal.component';
import { CapacitiesService } from '../../../../services/api/capacities/capacities.service';
import { findIndex, orderBy } from 'lodash';

@Component({
	           selector: 'mazaya-capacities',
	           templateUrl: './capacities.component.html',
	           styleUrls: [ './capacities.component.scss' ],
	           encapsulation: ViewEncapsulation.Emulated
           })
export class CapacitiesComponent implements OnInit {

	capacitiesDataSource: MatTableDataSource<any>;

	capacities: any[];

	@ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

	columnsToDisplay: string[] = [ 'package-name', 'capacity', 'validity', 'actions' ];

	sortBy: string = 'package.name';

	searchQuery: string = '';

	constructor (private capacitiesService: CapacitiesService, private dialog: MatDialog) {

	}

	ngOnInit () {
		this.loadCapacities();
	}

	loadCapacities () {
		this.capacitiesService.listAll().subscribe((result: any) => {
			this.capacities = result.data;
			this.capacitiesDataSource = new MatTableDataSource(this.capacities);
			this.capacitiesDataSource.paginator = this.paginator;
			this.sortCapacities();
		});
  }
  
  public formatNegativeToZero(value: number): number {
    return value < 0 ? 0 : value;
  }

	deleteCapacity (capacity: any) {
		const dialogRef = this.dialog.open(DeleteCapacityModalComponent, {
			data: {
				capacity
			}
		});
		dialogRef.afterClosed().subscribe((result: any) => {
			if ( result !== null && typeof result !== 'undefined' && result ) {
				const index = findIndex(this.capacities, (record: any) => record.id === capacity.id);
				this.capacities.splice(index, 1);
				this.capacitiesDataSource.data = this.capacities;
				this.capacitiesDataSource.filterPredicate = (data: any, filter: string) => {
					return !filter || data.attributes.package.name.toLowerCase().includes(filter.toLowerCase());
				};
			}
		});
	}

	applyFilter (filterValue: string) {
		this.capacitiesDataSource.filter = filterValue.trim().toLowerCase();
	}

	sortCapacities () {
		let type: string, iteratee: string;
		if ( this.sortBy.charAt(0) === '-' ) {
			iteratee = this.sortBy.substr(1);
			type = 'asc';
		} else {
			type = 'desc';
			iteratee = this.sortBy;
		}
		this.capacitiesDataSource.data = orderBy(this.capacities, (_capacity) => {
			return _capacity.attributes[ iteratee ];
		}, [ type ]);
	}

}
