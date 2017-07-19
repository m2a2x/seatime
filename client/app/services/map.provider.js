"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var MapProvider = (function () {
    function MapProvider() {
        this.styles = [
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
        this.mapOptions = {
            // How zoomed in you want the map to start at (always required)
            zoom: 2,
            // Disabling the default UI
            disableDefaultUI: true,
            scrollwheel: false,
            mapTypeControl: false,
            scaleControl: false,
            draggable: false,
            // The latitude and longitude to center the map (always required)
            center: new google.maps.LatLng(53.8838069, 27.4548923),
            // How you would like to style the map.
            // This is where you would paste any style found on Snazzy Maps.
            styles: this.styles
        };
        this.geocoder = new google.maps.Geocoder();
    }
    MapProvider.prototype.set = function (element) {
        // Create the Google Map using our element and options defined above
        this.map = new google.maps.Map(element, this.mapOptions);
    };
    MapProvider.prototype.reset = function () {
        this.map.panTo(this.mapOptions.center);
        this.map.setZoom(this.mapOptions.zoom);
    };
    MapProvider.prototype.setByName = function (name, zoom) {
        var _this = this;
        this.geocoder.geocode({ 'address': name }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                _this.map.panTo(results[0].geometry.location);
                _this.smoothZoom(_this.map, zoom, _this.map.getZoom());
            }
        });
    };
    // the smooth zoom function
    MapProvider.prototype.smoothZoom = function (map, max, cnt) {
        var _this = this;
        if (cnt >= max) {
            return;
        }
        else {
            var z_1;
            z_1 = google.maps.event.addListener(map, 'zoom_changed', function () {
                google.maps.event.removeListener(z_1);
                _this.smoothZoom(map, max, cnt + 1);
            });
            setTimeout(function () {
                map.setZoom(cnt);
            }, 80);
        }
    };
    return MapProvider;
}());
MapProvider = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], MapProvider);
exports.MapProvider = MapProvider;
//# sourceMappingURL=map.provider.js.map