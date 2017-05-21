import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CompraService } from '../../providers/compra-service'; 
import { Compra } from '../compra/compra';



@Component({ 
  templateUrl: 'subcategories.html',
})

export class Subcategories{
    imageCategory:any;
    nameCategory:any;
    subCategories:any;
    shownGroup:any;
    verBarra = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, public _compra: CompraService) {
        
        this.nameCategory = navParams.get('nameCategory');
        this.subCategories = navParams.get('listProducts');
        console.log(this.subCategories);

    }
    
    

    isGroupShown(subCategory){
        return this.shownGroup === subCategory;
    }
    
    agregar(producto){
        this.verBarra = true;
        console.log(this.verBarra);
        this._compra.agregar(producto);           
    }

    confirmaCompra(){
        this.navCtrl.push(Compra);
    }

}

