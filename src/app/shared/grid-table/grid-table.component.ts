import { Component, OnInit, Input } from '@angular/core';

@Component(
	{
		selector: 'mazaya-grid-table',
		templateUrl: './grid-table.component.html',
		styleUrls: [ './grid-table.component.scss' ]
	})
export class GridTableComponent implements OnInit {

	activeTag = '';
	chosenSortOption = '';
	currentPage = 1;
	domainModel: any;
	gridTitle = '';
	limit = 10;
	offset = 0;
	perPage: any = [ 10, 20, 50 ];
	selectedPerPage = 10;
	searchPlaceholder = '';
	tags: any = [];
	records: any = [];
	recordsFiltered: any = [];
	service: any;

	@Input()
	manageFilter: boolean;

	constructor () {}

	ngOnInit () {}

	changePage (page) {
		this.currentPage = page;
		this.limit = page * this.selectedPerPage;
		this.offset = this.limit - this.selectedPerPage;
	}

	makeSingular (text: string) {
		let chunks = text.split('');
		let lastChunkIndex = chunks.length - 1;

		if ( chunks[ lastChunkIndex ] == 's' ) {
			chunks.splice(lastChunkIndex, 1);
		}

		return chunks.join('');
	}

	nextPage () {
		this.currentPage = this.currentPage + 1;
		this.changePage(this.currentPage);
	}

	onclickTag (event, tag, property) {
		if ( tag === 'All' ) {
			this.records = this.recordsFiltered;
		}
		else {
			this.records = this.recordsFiltered.filter(item => {
				return item[ property ] === tag.toLowerCase(0);
			});
		}

		this.activeTag = tag;
	}

	previousPage () {
		if ( this.currentPage === 1 ) {
			return;
		}

		this.currentPage = this.currentPage - 1;
		this.changePage(this.currentPage);
	}

	showPerPage (count) {
		this.selectedPerPage = count;
		this.records = this.parseRecords(1, count);
		this.recordsFiltered = this.parseRecords(1, count);
	}

	parseRecords (offset = 0, limit = 10) {
		let result = [];

		for ( let i = offset; i < limit; i++ ) {
			result.push(new this.domainModel(this.records[ i ]));
		}

		return result;
	}

}
