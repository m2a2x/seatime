import {Injectable} from "@angular/core";
import * as _ from 'lodash';

import Map = google.maps.Map;
import MapOptions = google.maps.MapOptions;
import MapTypeStyle = google.maps.MapTypeStyle;
import Geocoder = google.maps.Geocoder;
import GeocoderStatus = google.maps.GeocoderStatus;
import GeocoderResult = google.maps.GeocoderResult;
import MapsEventListener = google.maps.MapsEventListener;
import LatLng = google.maps.LatLng;
import Marker = google.maps.Marker;
import Symbol = google.maps.Symbol;


@Injectable()
export class MapProvider {
    private map: Map;

    private geocoder: Geocoder;

    private markers: Marker[] = [];

    private styles: MapTypeStyle[] = [
        {
            "featureType": "administrative",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "labels",
            "stylers": [
                {
                    "hue": "#59cfff"
                },
                {
                    "saturation": 100
                },
                {
                    "lightness": 34
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "administrative.country",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.locality",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [
                {
                    "hue": "#e3e3e3"
                },
                {
                    "saturation": -100
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [
                {
                    "hue": "#ff0000"
                },
                {
                    "saturation": -100
                },
                {
                    "lightness": 100
                },
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "hue": "#ffffff"
                },
                {
                    "saturation": -100
                },
                {
                    "lightness": 100
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "hue": "#deecec"
                },
                {
                    "saturation": -73
                },
                {
                    "lightness": 72
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels",
            "stylers": [
                {
                    "hue": "#bababa"
                },
                {
                    "saturation": -100
                },
                {
                    "lightness": 25
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [
                {
                    "hue": "#ff0000"
                },
                {
                    "lightness": 100
                },
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "hue": "#71d6ff"
                },
                {
                    "saturation": 100
                },
                {
                    "lightness": -5
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        }
    ];

    private mapOptions: MapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 2,

        backgroundColor: 'none',

        // Disabling the default UI
        disableDefaultUI: true,

        scrollwheel: false,

        mapTypeControl: false,

        scaleControl: false,

        draggable: false,

        disableDoubleClickZoom: true,

        // The latitude and longitude to center the map (always required)
        center: new google.maps.LatLng(53.8838069, 27.4548923), // Minsk

        // How you would like to style the map.
        // This is where you would paste any style found on Snazzy Maps.
        styles: this.styles
    };

    constructor() {
        this.geocoder = new google.maps.Geocoder();
    }

    public set(element: Element) {
        // Create the Google Map using our element and options defined above
        this.map = new google.maps.Map(element, this.mapOptions);
    }

    public reset(): void {
        this.clearMarkers();
        this.map.panTo(this.mapOptions.center);
        this.map.setZoom(this.mapOptions.zoom);
    }

    public setByName(name: string, zoom: number): void {
        this.geocoder.geocode({'address' : name}, (results: GeocoderResult[], status: GeocoderStatus): void => {
            if (status == google.maps.GeocoderStatus.OK) {
                this.map.panTo(results[0].geometry.location);
                this.smoothZoom(this.map, zoom, this.map.getZoom());
            }
        });
    }

    public setMarker(lat: number, ln: number, title: string) {
        let location: LatLng = new google.maps.LatLng(lat, ln);

        let icon: Symbol = {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#21C2FF',
            fillOpacity: 0.9,
            scale: 10,
            strokeWeight: 0
        };

        this.markers.push(new google.maps.Marker({
            position: location,
            title: title,
            icon: icon,
        }));

        _.each(this.markers, (marker: Marker): void => {
            marker.setMap(this.map);
        });
    }

    public clearMarkers(): void {
        _.each(this.markers, (marker: Marker): void => {
            marker.setMap(null);
        });
        this.markers.length = 0;
    }

    public setByCoodrinate(lat: number, ln: number, zoom: number): Promise<boolean> {
        let location: LatLng = new google.maps.LatLng(lat, ln);
        this.map.panTo(location);
        return new Promise((resolve) => {
            this.smoothZoom(this.map, zoom, this.map.getZoom(), () => {
                resolve(true);
            });
        });
    }

    // the smooth zoom function
    public smoothZoom (map: Map, max: number, cnt: number, cb?: Function): void {
        if (cnt >= max) {
            if (cb) {
                cb();
            }
            return;
        }
        let z: MapsEventListener;
        z = google.maps.event.addListener(map, 'zoom_changed', () => {
            google.maps.event.removeListener(z);
            this.smoothZoom(map, max, cnt + 1, cb);
        });
        setTimeout(() => {
            map.setZoom(cnt)
        }, 80);
    }
}