import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { OrderService, MyOrderService } from 'app/+order/services/order.service';
import { find, startCase, lowerCase } from 'lodash';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import { MyOrder, ProgressIndex } from 'app/+order/models/order.model';

let airportList: any[] = [];

@Component({
  selector: 'app-select-flight',
  templateUrl: './select-flight.component.html',
  styleUrls: ['./select-flight.component.scss']
})
export class SelectFlightComponent implements OnInit {
  @ViewChild('calendar', { static: false })
  public calendar: any;

  public progressIndex = ProgressIndex;
  public selectedTab: number = 0;
  public tabText: string[] = ['Arrival', 'Departure'];
  public defaultCityCode: string = 'RUH-AKH-XXN';
  public flightForm: FormGroup;
  public departure: string;
  public destination: string;
  public searchedFlights: any[];
  public flightDate: any;
  public flightNumber: string;
  public order: MyOrder;
  public selectedFlight: any;
  public selectedFlightIndex: number;

  constructor(private myOrderService: MyOrderService, private fb: FormBuilder, private orderService: OrderService) {
    this.orderService.getAirports().pipe(map(ap => ap.data)).subscribe(res => airportList = res);

    this.flightForm = this.fb.group({
      flight: [null, Validators.compose([Validators.required])],
      flightNumber: [null],
      flightDate: [null, Validators.compose([Validators.required])]
    });

    this.flightForm.get('flight').valueChanges.subscribe((flight: any) => {
      if (flight) {
        if (this.selectedTab === 0) {
          this.departure = flight.attributes ? flight.attributes['code'] : flight;
          this.destination = this.defaultCityCode;
        } else {
          this.destination = flight.attributes ? flight.attributes['code'] : flight;
          this.departure = this.defaultCityCode;
        }
      }
    })

    this.myOrderService.setProgressIndex(this.progressIndex.flight);
    this.myOrderService.setProgressLine(this.progressIndex.flight);

    if (localStorage.getItem('waTravelType'))
      localStorage.setItem('waTravelType', 'arrival');
  }

  ngOnInit(): void {
    const selectedFlight = JSON.parse(localStorage.getItem('waSelectedFlight')) || null;
    if (selectedFlight && selectedFlight.attributes) {
      this.destination = selectedFlight.attributes['arrival-city-code'];
      this.departure = selectedFlight.attributes['departure-city-code'];
      this.flightDate = selectedFlight.attributes['scheduled-utc'];

      this.searchFlight();
      this.patchLocalStorageToForm();
    }
  }

  public get getFlightFromLocalStorage(): any {
    return JSON.parse(localStorage.getItem('waSelectedFlight')) || null;
  }

  public isSelected(flight): boolean {
    return flight && flight.attributes['flight-number'] === this.getFlightFromLocalStorage
      && this.getFlightFromLocalStorage.attributes['flight-number'];
  }

  public patchLocalStorageToForm(): void {
    const selectedFlight = this.getFlightFromLocalStorage;
    if (selectedFlight) {
      this.destination = selectedFlight.attributes['arrival-city-code'];
      this.departure = selectedFlight.attributes['departure-city-code'];

      this.flightForm.get('flight').patchValue(selectedFlight);
      this.flightForm.get('flightDate').patchValue(new Date(selectedFlight.attributes['scheduled-utc']));
      this.flightForm.get('flightNumber').patchValue(selectedFlight.attributes['flight-number']);
    }
  }

  public get getSelectedFlightIndex(): number {
    return JSON.parse(localStorage.getItem('waSelectedFlightIndex')) || null;
  }

  public selectFlight(flight: any, index: number): void {
    localStorage.setItem('waSelectedFlightIndex', JSON.stringify(index))
    localStorage.setItem('waSelectedFlight', JSON.stringify(flight));
    this.patchLocalStorageToForm();

    this.myOrderService.setFlight(flight);
  }

  public selectTab(index: number): void {
    this.selectedTab = index;
    this.flightForm.get('flight').patchValue(null);
    if (index === 0)
      localStorage.setItem('waTravelType', 'arrival');
    else
      localStorage.setItem('waTravelType', 'departure');
  }

  public setToLocalStorage(order: MyOrder): void {
    localStorage.setItem('order', JSON.stringify(order));
  }

  public flightDateLong(date: any) {
    return moment(date).local();
  }

  public searchFlight(): void {
    if(!this.departure && !this.destination) return;

    let params = new HttpParams();
    params = params.append('filter[departure-airport-codes]', this.departure);
    params = params.append('filter[arrival-airport-codes]', this.destination);
    params = params.append('filter[date]', moment(this.flightForm.get('flightDate').value || this.flightDate).locale('en').format('YYYY-MM-DD'));
    params = params.append('page[size]', '10');
    params = params.append('page[number]', '1');

    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.append('Accept-Language', 'en');

    this.orderService.getFlights(params, httpHeaders).pipe(map(x => x.data)).subscribe((result: any) => {
      this.searchedFlights = result;
    });
  }

  public openCalendar(event: any) {
    this.calendar.showOverlay(this.calendar.inputfieldViewChild.nativeElement);
    event.stopPropagation();
  }

  public airportResultFormatter(result: any) {
    if (result && result.attributes) {
      let airportName = result.attributes['city-name'] || result.attributes['arrival-city-name'] || result.attributes['departure-city-name'];
      airportName = lowerCase(airportName);
      airportName = startCase(airportName);

      return `${airportName} (${result.attributes['city-code'] || result.attributes['arrival-city-code'] || result.attributes['departure-city-code']})`;
    } else {
      return '';
    }
  }

  public airportSearch(text$: Observable<string>) {
    if (airportList) {
      return text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        map((term: string) => {
          if (term.length < 2) {
            return [];
          } else {
            const cities = airportList.filter((airport: any) => {
              return airport.attributes['city-name']
                && airport.attributes['city-name'].toLowerCase().includes(term.toLowerCase())
                ||
                airport.attributes['city-code']
                && airport.attributes['city-code'].toLowerCase().includes(term.toLowerCase());
            }).slice(0, 10);

            const result = [];
            result.push(cities[0]);
            return result;
          }
        })
      );
    }
    return [];
  }

}
