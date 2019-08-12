import { COMMA, ENTER, SPACE, TAB } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CapacitiesService } from '../../../../services/api/capacities/capacities.service';
import { FlightsService } from '../../../../services/api/flights/flights.service';
import { PackagesService } from '../../../../services/api/packages/packages.service';
import { Moment, utc } from 'moment/moment';
import * as moment from 'moment';
import { lowerCase, startCase, uniq, without } from 'lodash';

@Component({
  selector: 'mazaya-capacities-add',
  templateUrl: './capacities-add.component.html',
  styleUrls: ['./capacities-add.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  providers: [PackagesService, FlightsService]
})
export class CapacitiesAddComponent implements OnInit {

  createCapacityForm: FormGroup;
  capacity: FormControl;
  from: FormControl;
  to: FormControl;
  package: FormControl;

  endDateBeforeStartDateError = false;
  startDateBeforeCurrentDateError = false;
  capacityDateOverlapError = false;
  overlappingCapacities: any[] = [];

  capacities: any[];
  airports: any[];
  packages: any[];
  flightType: boolean = false;

  departureAirports: FormControl = new FormControl();
  departureAirportFilter: Observable<string[]>;
  selectedDepartureAirports: any[] = [];
  @ViewChild('departureAirportAutoComplete', { static: true }) departureAirportAutoComplete: MatAutocomplete;
  @ViewChild('departureAirportInput', { static: true }) departureAirportInput: ElementRef;

  arrivalAirports: FormControl = new FormControl();
  arrivalAirportFilter: Observable<string[]>;
  selectedArrivalAirports: any[] = [];
  @ViewChild('arrivalAirportAutoComplete', { static: true }) arrivalAirportAutoComplete: MatAutocomplete;
  @ViewChild('arrivalAirportInput', { static: true }) arrivalAirportInput: ElementRef;

  separatorKeyCodes: number[] = [ENTER, COMMA, TAB, SPACE];

  selectableFlights: any[] = [];
  selectedFlights: FormControl = new FormControl([]);

  public minDate: any;

  constructor(private fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute,
    private capacitiesService: CapacitiesService, private packagesService: PackagesService,
    private flightsService: FlightsService) {

    this.capacity = new FormControl(1, Validators.compose([Validators.required, Validators.min(1)]));
    this.from = new FormControl('', Validators.compose([Validators.required]));
    this.to = new FormControl('', Validators.compose([Validators.required]));
    this.package = new FormControl('', Validators.compose([Validators.required]));

    this.createCapacityForm = fb.group(
      {
        capacity: this.capacity,
        from: this.from,
        to: this.to,
        package: this.package
      }
    );

    this.minDate = moment().format();
  }

  async ngOnInit() {
    this.getPackages();
    await this.getAirports();

    this.departureAirportFilter = this.departureAirports.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filterAirport(val))
      );

    this.arrivalAirportFilter = this.arrivalAirports.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filterAirport(val))
      );
  }

  removeDepartureAirportFromSelection(airport: any): void {
    const index = this.selectedDepartureAirports.indexOf(airport);
    if (index >= 0) {
      this.selectedDepartureAirports.splice(index, 1);
      this.removeFlightsForAirport(airport);
    }
  }

  addDepartureAirport(event: MatAutocompleteSelectedEvent): void {
    this.selectedDepartureAirports.push(event.option.value);
    this.departureAirportInput.nativeElement.value = '';
    this.departureAirports.setValue(null);
    this.getFlightsForAirport(event.option.value);
  }

  removeArrivalAirportFromSelection(airport: any): void {
    const index = this.selectedArrivalAirports.indexOf(airport);
    if (index >= 0) {
      this.selectedArrivalAirports.splice(index, 1);
      this.removeFlightsForAirport(airport);
    }
  }

  addArrivalAirport(event: MatAutocompleteSelectedEvent): void {
    this.selectedArrivalAirports.push(event.option.value);
    this.arrivalAirportInput.nativeElement.value = '';
    this.arrivalAirports.setValue(null);
    this.getFlightsForAirport(event.option.value);
  }

  filterAirport(val: string): string[] {
    if (val && typeof val === 'string') {
      return this.airports.filter(option => {
        return option.attributes.code.toLowerCase().includes(val.toLowerCase()) ||
          option.attributes.description.toLowerCase().includes(val.toLowerCase()) ||
          option.attributes['city-name'].toLowerCase().includes(val.toLowerCase()) ||
          option.attributes['city-code'].toLowerCase().includes(val.toLowerCase()) ||
          (option.attributes.domestic && val.toLowerCase() === 'domestic');
      });
    }
  }

  getAirports() {
    return new Promise((resolve) => {
      this.flightsService.listAirports().subscribe((result: any) => {
        this.airports = result.data;
        resolve(this.airports);
      });
    });
  }

  getFlightsForAirport(airport: any) {
    let departureAirport, arrivalAirport;
    if (this.flightType) {
      arrivalAirport = 'RUH';
      departureAirport = airport.attributes.code;
    } else {
      departureAirport = 'RUH';
      arrivalAirport = airport.attributes.code;
    }
    this.flightsService.getFlightsForRoute(departureAirport, arrivalAirport).subscribe((result: any) => {
      this.selectableFlights.push(...(<any[]>result.data.map((flight: any) => flight.attributes['flight-number'])));
      this.selectableFlights = uniq(this.selectableFlights);
    });
  }

  removeFlightsForAirport(airport: any) {
    let departureAirport, arrivalAirport;
    if (this.flightType) {
      arrivalAirport = 'RUH';
      departureAirport = airport.attributes.code;
    } else {
      departureAirport = 'RUH';
      arrivalAirport = airport.attributes.code;
    }
    this.flightsService.getFlightsForRoute(departureAirport, arrivalAirport).subscribe((result: any) => {
      const flights: string[] = uniq((<any[]>result.data.map((flight: any) => flight.attributes['flight-number'])));
      this.selectableFlights = this.selectableFlights.filter((flight: string) => {
        return !flights.includes(flight);
      });
      this.selectedFlights.setValue((<string[]>this.selectedFlights.value).filter((flight: string) => {
        return !flights.includes(flight);
      }));
    });
  }

  getPackages() {
    this.packagesService.listAll().subscribe((result: any) => {
      this.packages = result.data.filter((_package: any) => !_package.attributes['web-only']);
      this.selectFirstPackage();
    });
  }

  selectFirstPackage() {
    setTimeout(() => this.package.patchValue([this.packages[0].id]));
  }

  listCapacities(): Promise<any[]> {
    return new Promise((resolve) => {
      if (!this.capacities) {
        this.capacitiesService.listAll().subscribe((result: any) => {
          resolve(result.data);
        });
      } else {
        resolve(this.capacities);
      }
    });
  }

  async createCapacity() {
    (<string[]>this.package.value).forEach(async (_package: string, index: number) => {

      this.overlappingCapacities = [];

      const packageId: string = _package;
      const from: Moment = this.from.value;
      const to: Moment = <Moment>this.to.value;
      const capacity = this.capacity.value;

      // Check if 2nd Date is after 1st Date
      this.endDateBeforeStartDateError = to.isSameOrBefore(from, 'minutes');
      // Check if start date is before current date
      this.startDateBeforeCurrentDateError = from.isBefore(moment(), 'minutes');
      // Get all Capacities
      this.capacities = await this.listCapacities();
      // Filter capacities to only include the ones with the currently selected package id
      const capacities = this.capacities.filter((capacity: any) => {
        return parseInt(capacity.attributes.package.id) === parseInt(packageId);
      });
      this.capacityDateOverlapError = false;
      capacities.forEach((capacity: any) => {
        const firstDate = moment(capacity.attributes['from-date-and-time-utc']);
        const secondDate = moment(capacity.attributes['to-date-and-time-utc']);
        const fromCompare = from.clone().utc();
        const toCompare = to.clone().utc();
        const isOverlapFirstDate = fromCompare.isBetween(firstDate, secondDate, 'm', '[]');
        const isOverlapSecondDate = toCompare.isBetween(firstDate, secondDate, 'm', '[]');
        if (isOverlapFirstDate || isOverlapSecondDate) {
          this.capacityDateOverlapError = true;
          this.overlappingCapacities.push(capacity);
        }
      });
      if (!this.capacityDateOverlapError) {
        this.capacitiesService.createForPackage(parseInt(packageId), from.utc().toISOString(false),
          to.utc().toISOString(false), capacity).subscribe(
            (result: any) => {
              if ((index + 1) >= (<number[]>this.package.value).length) {
                this.router.navigate(['..'], { relativeTo: this.activatedRoute });
              }
            });
      }
    });
  }

  airportResultFormatter(result: any) {
    if (result && result.attributes) {
      let airportName = result.attributes['city-name'];
      airportName = lowerCase(airportName);
      airportName = startCase(airportName);

      return `${airportName} (${result.attributes['code']})`;
    } else {
      return '';
    }
  }
}
