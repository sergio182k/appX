import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class RegisterService {
	private newUserSend:any;


  	constructor(public http: Http) {
  	}

	public register(newUser): any {
		console.log('llego a register');
		this.newUserSend = newUser;
		const url = 'https://clicpedidos.co:8443/clicpedidos/api/persona/ingresarPersona/';
		const response = this.http.post(url, this.newUserSend)
			.map((res) => {});
		console.log(response, 'nada');
		return response;
	}
}
