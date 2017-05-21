import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';


/*
  Generated class for the RegisterService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class RegisterService {
	newUserSend:any;


  	constructor(public http: Http) {
    	console.log('Hello RegisterService Provider');
  	}

	register(newUser){
		console.log('llego a register');
		this.newUserSend = newUser;
		var url = 'https://clicpedidos.co:8443/clicpedidos/api/persona/ingresarPersona/';
		var response = this.http.post(url, this.newUserSend)
			.map((res) => {});
		console.log(response, 'nada');
		return response;
	}
}
