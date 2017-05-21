import { Component } from '@angular/core';
import { ViewController, NavParams} from 'ionic-angular';
import { Geolocation } from 'ionic-native';

@Component({
  	templateUrl: 'maps.html'
})
export class Maps {

	private DIRECTIONSDISPLAYSUPRESSMARKERS: boolean = true;
  private ICONSTEPSDEST: string = 'assets/icon/cart.png';
  private ICONSTEPSSTEP: string = 'assets/icon/circle.png';
  private ICONSTEPSSTART: string = 'assets/icon/walking.png';
  private STYLEMAPNIGHT: boolean = true;
  private STYLENIGHT: [
        {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#263c3f'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#6b9a76'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#38414e'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{color: '#212a37'}]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9ca5b3'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#746855'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#1f2835'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{color: '#f3d19c'}]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{color: '#2f3948'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#17263c'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#515c6d'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#17263c'}]
        }
  ];
  private ZOOMINITIAL: number = 19;
  private WATCHACCURACY: boolean = false;

  private destLat: number;
	private destLong: number;
  private isAfiliado: boolean = false;
	private startLat: number;
	private startLong: number;
  private map: any;
  private marker:any;
  private onlyDest: boolean = false;
  
  private directionsDisplay: any;
  private directionsService: any;
  private stepDisplay: any;
  private markerArray: any;

	constructor(public viewCtrl: ViewController,  private navParams: NavParams) {
		this.destLat = parseFloat(navParams.get('destLat'));
		this.destLong = parseFloat(navParams.get('destLong'));
    this.onlyDest = navParams.get('onlyDest');
    this.isAfiliado = navParams.get('isAfiliado');
    
    this.markerArray = [];
	}
  
  ionViewDidEnter(){
    // Instantiate a directions service.
    this.directionsService = new google.maps.DirectionsService();
	  this.createMap();
    this.createRenderedDirections();
    this.createInfoWindow();
    if(this.onlyDest)
      this.addDestMarker();
    else
      this.getCurrentPosition();
  }

  addDestMarker(){
    let marker = new google.maps.Marker({
      icon: this.ICONSTEPSDEST,
      position: {
        lat: this.destLong,
        lng: this.destLat
      },
      map: this.map
    });
  }

  back(event){
    this.viewCtrl.dismiss();
  }

  createInfoWindow(){
    // Instantiate an info window to hold step text.
    this.stepDisplay = new google.maps.InfoWindow();
  }

  createMap(){
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: this.destLong,
        lng: this.destLat
      },
      styles: this.STYLEMAPNIGHT ? this.STYLENIGHT : [],
      zoom: this.ZOOMINITIAL
    });
  }

  createRenderedDirections(){
    // Create a renderer for directions and bind it to the map.
    let rendererOptions = {
      map: this.map,
      suppressMarkers: this.DIRECTIONSDISPLAYSUPRESSMARKERS
    }
    this.directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
  }

  calcRoute(){
    // First, clear out any existing markerArray
    // from previous calculations.
    for (let i = 0; i < this.markerArray.length; i++) {
      try{
        this.markerArray[i].setMap(null);
      }catch(e){
        console.log(e);
      }
    }
    // Retrieve the start and end locations and create
    // a DirectionsRequest using WALKING directions.
    let request = {
        origin: {
          lat: this.startLat,
          lng: this.startLong
        },
        destination: {
          lat: this.destLong,
          lng: this.destLat
        },
        //travelMode: google.maps.TravelMode.WALKING
        travelMode: google.maps.TravelMode.DRIVING
    };
    // Route the directions and pass the response to a
    // function to create markers for each step.
    this.directionsService.route(request, (response, status) => {
      if (status == google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(response);
        this.showSteps(response);
      }
    });
  }

  showSteps(directionResult) {
    // For each step, place a marker, and add the text to the marker's
    // info window. Also attach the marker to an array so we
    // can keep track of it and remove it when calculating new
    // routes.
    let myRoute = directionResult.routes[0].legs[0];
    for (let i = 0; i < myRoute.steps.length; i++) {
      let marker = null;
      if(i == 0){
        /**
         * startpoint
         */
        marker = new google.maps.Marker({
          icon: this.isAfiliado ? this.ICONSTEPSDEST : this.ICONSTEPSSTART,
          position: myRoute.steps[i].start_point,
          map: this.map
        });
      }
      if(i == myRoute.steps.length - 1){
        /**
         * destpoint
         */
        marker = new google.maps.Marker({
          icon: this.isAfiliado ? this.ICONSTEPSSTART : this.ICONSTEPSDEST,
          position: myRoute.steps[i].start_point,
          map: this.map
        });
      }
      /**
         * steps
         */
        /**
        marker = new google.maps.Marker({
          icon: this.ICONSTEPSSTEP,
          icon: {
            size: {width: 42, height: 68},
            url: this.ICONSTEPSSTEP
          },
          position: myRoute.steps[i].start_point,
          map: this.map
        });
        */
      this.markerArray[i] = marker;
      //this.attachInstructionText(marker, myRoute.steps[i].instructions);
      
    }
  }

  attachInstructionText(marker, text) {
    google.maps.event.addListener(marker, 'click', function() {
      this.stepDisplay.setContent(text);
      this.stepDisplay.open(this.map, marker);
    });
  }

  getCurrentPosition(){
    Geolocation.getCurrentPosition().then((resp) => {
      this.updateCurrentPosition(resp.coords.latitude, resp.coords.longitude);
      //setTimeout(() => this.watchPosition(), 3000);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  watchPosition(){
    let watch = Geolocation.watchPosition({enableHighAccuracy: this.WATCHACCURACY});
    watch.subscribe((data) => {
      if (data['coords'].latitude != this.startLat || data['coords'].longitude != this.startLong)
        this.updateCurrentPosition(data['coords'].latitude, data['coords'].longitude);
    });
  }

  updateCurrentPosition(lat, lng){
    this.startLat = lat;
    this.startLong = lng;
    this.calcRoute();
  }

}

  
