import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthService {

	person:any;
  handleError:any= {};

  constructor(public http: Http) {
  }

  	login(user) {
        this.person = {};
        this.person.usuario = user.email;
        this.person.contrasenna = user.password;
        console.log(this.person);
        var url = 'https://clicpedidos.co:8443/clicpedidos/api/logueo/login/';
        var response = this.http.post(url, this.person)
            .map(res => res.json() 
            );
        console.log(response, 'nada');
        return response;
    }

    logout(user){
    	this.person = {};
      this.person = user;
      console.log(this.person);
      var any = undefined;
    	var url = 'https://clicpedidos.co:8443/clicpedidos/api/logueo/logout';
    	var response = this.http.post(url, {"token": this.person})
        .map(() => {});
      return response;    
    }
}
