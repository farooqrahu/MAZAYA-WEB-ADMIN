import { LatLngBounds } from '@agm/core';

declare const google;

export const GMapsBounds: { lat: number, lng: number }[] = [
  { lat: 24.519086, lng: 46.646290 },
  { lat: 24.511355, lng: 46.683787 },
  { lat: 24.520923, lng: 46.773894 },
  { lat: 24.509765, lng: 46.895495 },
  { lat: 24.526996, lng: 46.929959 },
  { lat: 24.533360, lng: 46.937862 },
  { lat: 24.633288, lng: 46.957129 },
  { lat: 24.678891, lng: 46.946838 },
  { lat: 24.800454, lng: 46.967433 },
  { lat: 24.839765, lng: 46.907649 },
  { lat: 24.855984, lng: 46.890461 },
  { lat: 24.872203, lng: 46.875331 },
  { lat: 24.890917, lng: 46.856756 },
  { lat: 25.001000, lng: 46.812824 },
  { lat: 25.041483, lng: 46.751117 },
  { lat: 25.048332, lng: 46.696127 },
  { lat: 25.030861, lng: 46.621903 },
  { lat: 25.017749, lng: 46.579990 },
  { lat: 25.002740, lng: 46.524339 },
  { lat: 24.996454, lng: 46.483796 },
  { lat: 24.989574, lng: 46.465938 },
  { lat: 24.981396, lng: 46.451850 },
  { lat: 24.967453, lng: 46.453394 },
  { lat: 24.949402, lng: 46.456160 },
  { lat: 24.929167, lng: 46.470194 },
  { lat: 24.921123, lng: 46.502499 },
  { lat: 24.900578, lng: 46.507344 },
  { lat: 24.852644, lng: 46.521845 },
  { lat: 24.807815, lng: 46.532209 },
  { lat: 24.739866, lng: 46.541083 },
  { lat: 24.652919, lng: 46.453385 },
  { lat: 24.634719, lng: 46.443364 },
  { lat: 24.611614, lng: 46.443356 },
  { lat: 24.580101, lng: 46.454894 },
  { lat: 24.566886, lng: 46.467307 },
  { lat: 24.552342, lng: 46.487155 },
  { lat: 24.533918, lng: 46.544590 },
  { lat: 24.522525, lng: 46.602748 }
];

export const getGMapsMazayaBounds = (): LatLngBounds =>  {
  const bounds = new google.maps.LatLngBounds();
  GMapsBounds.forEach((element: { lat: number, lng: number }, index) => {
    const point = new google.maps.LatLng(element.lat, element.lng);
    bounds.extend(point);
  });
  return bounds;
};
