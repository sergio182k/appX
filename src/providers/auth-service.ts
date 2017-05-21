import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

	private person:any;

  constructor(public http: Http) {
  }

  	login(user) : any {
        this.person = {};
        this.person.usuario = user.email;
        this.person.contrasenna = user.password;
        console.log(this.person);
        const url = 'https://clicpedidos.co:8443/clicpedidos/api/logueo/login/';
        const response = this.http.post(url, this.person)
            .map(res => res.json()
            );
        console.log(response, 'nada');
        return response;
    }

    logout(user): any {
    	this.person = {};
      this.person = user;
      console.log(this.person);
      const url = 'https://clicpedidos.co:8443/clicpedidos/api/logueo/logout';
      const response = this.http.post(url, {"token": this.person})
        .map(() => {});
      return response;
    }
}
