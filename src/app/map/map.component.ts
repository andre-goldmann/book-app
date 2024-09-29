import { Component, AfterViewInit } from '@angular/core';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import XYZ from 'ol/source/XYZ';
import {Icon, Style} from "ol/style";

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
  ngAfterViewInit() {
    this.initMap();
    this.getUserLocation();
  }

  initMap() {
    /*this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });*/
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
        center: [0, 0],
        zoom: 2
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

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        //console.info(position.coords);
        const coords = fromLonLat([position.coords.longitude - 0.0011141000000005619, position.coords.latitude - 0.019467300000002297]);
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
  }

  doSomething(): void {
    console.log('Button clicked!');
    // Add your custom logic here
  }

}
