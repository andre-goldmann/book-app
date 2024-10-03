import { Component, AfterViewInit } from '@angular/core';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import XYZ from 'ol/source/XYZ';
import {Icon, Stroke, Style} from "ol/style";
import {GraphhopperService} from "../graphhopper.service";
import {LineString} from "ol/geom";

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [

  ],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {

  map!: Map;
  showContextMenu = false;
  contextMenuContent = '';
  routeLayer!: VectorLayer<VectorSource>;

  constructor(private graphhopperService: GraphhopperService) {}

  ngAfterViewInit() {
    this.initMap();
    this.getUserLocation();
    this.addRouteLayer();
    this.fetchAndDisplayRoute();
  }

  initMap() {

    const styles = [
      {
        featureType: "all",
        elementType: "labels",
        stylers: [
          { visibility: "off" }
        ]
      },
      {
        featureType: "poi",
        elementType: "all",
        stylers: [
          { visibility: "off" }
        ]
      }
    ];

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
            attributions: '© Google',
          })
        })
      ],
      view: new View({
        center: fromLonLat([12.3731968, 51.3900544]), // Center on Coppistraße
        zoom: 14
      })
    });

// Apply styles to the map
    this.map.setProperties({
      'styles': styles
    });

    this.map.on('click', (event) => {
      const feature = this.map.forEachFeatureAtPixel(event.pixel, (feature) => feature);

      if (feature) {
        this.showContextMenu = true;
        this.contextMenuContent = 'You clicked on a feature!';
      } else {
        this.showContextMenu = false;
      }
    });
  }

  /*getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        //console.info(position.coords);
        const coords = fromLonLat([position.coords.longitude - 0.0011141000000005619, position.coords.latitude - 0.019467300000002297]);
        console.info("current: " , coords);
        //const coords = fromLonLat([position.coords.longitude, position.coords.latitude]);
        //const coordsGog = fromLonLat([12.3688059, 51.3673103]);
        //51.3673103,12.3688059
        //console.info(position.coords.longitude - 12.3688059);
        //console.info(position.coords.latitude - 51.3673103);
        this.map.getView().setCenter(coords);
        this.map.getView().setZoom(18);

        // Create a feature with a point geometry
        const bookFeature = new Feature({
          geometry: new Point(coords) // Replace with your desired coordinates
        });

// Create a style for the book icon
        const bookStyle = new Style({
          image: new Icon({
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: 'assets/book-svgrepo-com.svg', // Replace with the path to your book icon image
            scale: 0.5 // Adjust this value to change the size of the icon
          })
        });

// Apply the style to the feature
        bookFeature.setStyle(bookStyle);

        const marker = new Feature(new Point(coords));
        const vectorSource = new VectorSource({
          //features: [marker]
          features: [bookFeature]
        });
        const vectorLayer = new VectorLayer({
          source: vectorSource
        });
        this.map.addLayer(vectorLayer);
      });
    }
  }*/

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords = fromLonLat([position.coords.longitude - 0.0011141000000005619, position.coords.latitude - 0.019467300000002297]);
        //const coords = fromLonLat([position.coords.longitude, position.coords.latitude]);
        this.map.getView().setCenter(coords);
        this.map.getView().setZoom(18);

        // Create a feature for the current location
        const locationFeature = new Feature({
          geometry: new Point(coords)
        });

        // Create a style for the location icon
        const locationStyle = new Style({
          image: new Icon({
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: 'assets/location-pin.svg', // Replace with your location icon
            scale: 0.5
          })
        });

        locationFeature.setStyle(locationStyle);

        const vectorSource = new VectorSource({
          features: [locationFeature]
        });

        const vectorLayer = new VectorLayer({
          source: vectorSource
        });

        this.map.addLayer(vectorLayer);
      });
    }
  }

  addRouteLayer() {
    this.routeLayer = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        stroke: new Stroke({
          color: '#ff0000',
          width: 3
        })
      })
    });
    this.map.addLayer(this.routeLayer);
  }

  fetchAndDisplayRoute() {
    const start: [number, number] = [12.3731968, 51.3900544]; // Coppistraße
    const end: [number, number] = [12.3754851, 51.3841807]; // St. Georg

    this.graphhopperService.getRoute(start, end).subscribe(
      (response) => {
        const coordinates = this.decode(response.paths[0].points, false);
        const transformedCoordinates = coordinates.map((coord: number[]) => fromLonLat(coord));

        const routeFeature = new Feature({
          geometry: new LineString(transformedCoordinates)
        });

        this.routeLayer.getSource()!.addFeature(routeFeature);
        this.map.getView().fit(this.routeLayer.getSource()!.getExtent(), { padding: [50, 50, 50, 50] });
      },
      (error) => {
        console.error('Error fetching route:', error);
      }
    );
  }

  doSomething(): void {
    console.log('Button clicked!');
    // Add your custom logic here
  }

  decode (encoded:string, is3D:boolean) {
    var len = encoded.length;
    var index = 0;
    var array = [];
    var lat = 0;
    var lng = 0;
    var ele = 0;

    while (index < len) {
      var b;
      var shift = 0;
      var result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      var deltaLat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += deltaLat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      var deltaLon = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += deltaLon;

      if (is3D) {
        // elevation
        shift = 0;
        result = 0;
        do {
          b = encoded.charCodeAt(index++) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
        } while (b >= 0x20);
        var deltaEle = ((result & 1) ? ~(result >> 1) : (result >> 1));
        ele += deltaEle;
        array.push([lng * 1e-5, lat * 1e-5, ele / 100]);
      } else
        array.push([lng * 1e-5, lat * 1e-5]);
    }
    // var end = new Date().getTime();
    // console.log("decoded " + len + " coordinates in " + ((end - start) / 1000) + "s");
    return array;
  };

}
