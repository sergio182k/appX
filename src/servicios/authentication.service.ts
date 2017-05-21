import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';
import { InicioPage } from '../pages/inicio/inicio';
import { BusquedaPage } from '../pages/busqueda/busqueda';


export class User{
	constructor(public email: string, public password: string){}
}

var users = [
  new User('juan','juanpass'),
  new User('jose','josepass')
];

var cont = 1;

@Injectable()
export class AuthenticationService{
	constructor(private nav: NavController) {
  	}

  	logout(){
  		localStorage.removeItem("user");
  		this.nav.push(InicioPage);
  	}

  	login(user){
      var authenticatedUser = null;
      for(var i = 0; i <= cont; i++){
        if (users[i].email == user.email && users[i].password == user.password ) {
          authenticatedUser = user.email;
        }
      } 
  		if (authenticatedUser){
  			localStorage.setItem("user", authenticatedUser);
  			this.nav.push(BusquedaPage);
  			return true;
  		}
  		return false;
  	}

  	checkCredentials(){
  		if (localStorage.getItem("user") === null){
  			this.nav.push(InicioPage);
  		}
  	}

    addUser(email, password){
      var usuario = new User(email,password);
      users.push(usuario);
      console.log(users);
      cont++;
    }
}