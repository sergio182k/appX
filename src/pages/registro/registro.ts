import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../servicios/modal.service';
import { InicioPage } from '../inicio/inicio';
import { RegisterService } from '../../providers/register-service';

@Component({
  templateUrl: 'registro.html', 
  providers: [RegisterService, ModalService]
})

export class RegistroPage {

	registerForm: FormGroup;
	email: any;
  password: any;
  nombre: any;
  apellido: any;
  telefono: any;
  celular: any;
  newUser: any;
  confEmail: any;
  confPassword: any;
  newUserSend: any;
  emailTemp: any;
  confEmailTemp:any;
  terminos:any;

  constructor(private navCtrl: NavController, public formBuilder:FormBuilder, private _registerService: RegisterService, public _modal: ModalService) {

    this.registerForm = this.formBuilder.group({
			email:['',Validators.required],
      password:['', Validators.compose([Validators.required, Validators.minLength(8)])],
      nombre:['', Validators.required],
      apellido:['', Validators.required],
      telefono:['',  Validators.compose([Validators.required, Validators.minLength(7)])],
      confEmail:['', Validators.required],
      confPassword:['', Validators.compose([Validators.required, Validators.minLength(8)])]
		})

    this.email = this.registerForm.controls['email'];
    this.confEmail = this.registerForm.controls['confEmail'];
    this.password = this.registerForm.controls['password'];
    this.confPassword = this.registerForm.controls['confPassword'];
    this.nombre = this.registerForm.controls['nombre'];
    this.apellido = this.registerForm.controls['apellido'];
    this.telefono = this.registerForm.controls['telefono'];

  	this.terminos = false;
    console.log(this.registerForm.controls);

    this.newUser = {};
  }

  registrar(){
    this.emailTemp = this.email.value;
    this.confEmailTemp = this.confEmail.value; 
    if (this.emailTemp != this.confEmailTemp){
      this._modal.showAlert('Error', 'Email no coincide');
    }else{
      if (this.password.value != this.confPassword.value){
        this._modal.showAlert('Error', 'Password no coincide');
      }else{
        this.newUser.correo = this.email.value;
        this.newUser.usuario = this.email.value;
        this.newUser.contrasenna = this.password.value;
        this.newUser.nombres = this.nombre.value;
        this.newUser.apellidos = this.apellido.value;
        this.newUser.telefono = this.telefono.value;
        this.newUser.celular = 0;
        this.newUserSend = this.newUser;
        console.log(this.newUserSend);
        this._registerService.register(this.newUserSend).subscribe(
          data => this._onRegisterSucces(data),
          err => {
              console.log(err);
              this._modal.showAlert('Error', 'Problemas con el servidor')
          },
          () => console.log('End Register')
        );
      }
    }
  }

  _onRegisterSucces(data){
    console.log('llego a suc');
    this._modal.showAlert('Bienvenido', 'Registro Exitoso' );
    this.navCtrl.push(InicioPage);
  }
}
