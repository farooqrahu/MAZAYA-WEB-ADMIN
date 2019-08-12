import { Component, OnInit, ViewChild, ElementRef, NgZone, AfterViewInit } from '@angular/core';
import { AgmMap, LatLng, MapTypeStyle, MapsAPILoader } from '@agm/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as classifyPoint from 'robust-point-in-polygon';
import { LatLngBounds } from '@agm/core';
import { GeoCodingService } from '../../services/geocoding.service';
import { find } from 'lodash';
import { grayScaleMapStyles } from 'app/shared/config/grayScaleMapStyles';
import { GMapsBounds } from 'app/utils/maps-bounds';
import { MyOrderService } from 'app/+order/services/order.service';
import { ProgressIndex } from 'app/+order/models/order.model';

let loadingPosition = true;

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit, AfterViewInit {
  public mapStyles: MapTypeStyle[] = grayScaleMapStyles;
  public locationForm: FormGroup;
  public polyPaths: Array<any> = GMapsBounds;
  public selectedLatitude = 24.7136;
  public selectedLongitude = 46.6753;
  public showInvalidLocation: Boolean = false;
  public progressIndex = ProgressIndex;

  public zoom: number;
  public address: string;
  private geoCoder: any;
  public latitude: number;
  public longitude: number;

  @ViewChild('selectAddressInput', { static: false })
  public searchElementRef: ElementRef;

  @ViewChild(AgmMap, { static: false }) 
  public agmMap: AgmMap;

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private elementRef: ElementRef, private geoLocationService: GeoCodingService, private fb: FormBuilder, private myOrderService: MyOrderService) {
    this.myOrderService.setProgressIndex(this.progressIndex.location);
    this.myOrderService.setProgressLine(this.progressIndex.location);

    this.locationForm = fb.group({
      address: ['', Validators.compose([Validators.required])]
    });

    this.locationForm.valueChanges.subscribe(res => {
      if (this.locationForm.valid) {
        this.myOrderService.setAddress(res.address);
        localStorage.setItem('waAddress', JSON.stringify(res.address));
      } else {
        this.myOrderService.setPassengers(null);
      }
    })
  }

  public getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  async ngOnInit() {
    await this.getUserLocation;
  }

  ngAfterViewInit(): void {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      const el: HTMLInputElement = this.elementRef.nativeElement.querySelector('#address');
      setTimeout(() => {
        let autocomplete = new google.maps.places.Autocomplete(
          <HTMLInputElement>document.getElementById("address"), {
            types: ['address']
          });
  
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();
  
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
  
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();
            this.zoom = 12;

            this.updateLocation(this.latitude, this.longitude);
          });
        });
      }, 1000);
    });
  }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  public get getUserLocation() {
    return new Promise((resolve) => {
      const $this = this;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position: Position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            if (this.checkIfWithinTheBoundary(lat, lng) < 1) {
              $this.updateLocation(lat, lng);
            } else {
              $this.updateLocation(this.selectedLatitude, this.selectedLongitude);
            }
          },
          (error: PositionError) => {
            $this.updateLocation(this.selectedLatitude, this.selectedLongitude);
          });
        resolve(true);
      } else {
        $this.updateLocation(this.selectedLatitude, this.selectedLongitude);
        resolve(true);
      }
    });
  }

  public updateLocation(latitude: number, longitude: number): void {
    this.selectedLatitude = latitude;
    this.selectedLongitude = longitude;

    const LatLng = new google.maps.LatLng(latitude, longitude);

    this.geoLocationService.geocode(LatLng).subscribe((results: any) => {
      setTimeout(() => {
        this.locationForm.get('address').patchValue(results[0].formatted_address);

        localStorage.setItem('waLocation', JSON.stringify(results[0]));

        this.agmMap.latitude = this.selectedLatitude;
        this.agmMap.longitude = this.selectedLongitude;
        this.agmMap.triggerResize();
      });
    }, (error) => {
    });
    loadingPosition = false;
  }

  public updateLocationAfterDrag(data) {
    const lat = data.coords.lat;
    const lng = data.coords.lng;

    if (this.checkIfWithinTheBoundary(lat, lng) < 1) {
      this.updateLocation(lat, lng);
    } else {
      this.showInvalidLocation = true;
    }
  }

  public checkIfWithinTheBoundary(lat, lng) {
    const polygon = this.polyPaths.map(function (obj) {
      return Object.keys(obj).sort().map(function (key) {
        return obj[key];
      });
    });

    const result = classifyPoint(polygon, [lat, lng]);
    return result;
  }
}
