import { Directive, ElementRef, EventEmitter, OnInit, Output, AfterViewInit} from "@angular/core";
import { MapsAPILoader } from "@agm/core";
import { getGMapsMazayaBounds } from "app/utils/maps-bounds";

declare const google;

@Directive({
  selector: "[mazayaGooglePlaces]"
})
export class GooglePlacesDirective implements OnInit, AfterViewInit {
  private element: HTMLInputElement;

  @Output("selectPlace") callback: EventEmitter<string> = new EventEmitter();

  constructor(private elRef: ElementRef, private mapsAPILoader: MapsAPILoader) {
    this.element = elRef.nativeElement;
  }

  ngAfterViewInit(): void {
    this.mapsAPILoader.load().then(() => {
      const bounds = getGMapsMazayaBounds();
      const autocomplete = new google.maps.places.Autocomplete(this.element, {
        bounds,
        strictBounds: true
      });

      autocomplete.addListener("place_changed", () => {
        this.callback.next(autocomplete.getPlace());
      });
    });
  }


  ngOnInit() {
  }
}
