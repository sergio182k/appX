import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpService {
    static get parameters() {
        return [[Http]];
    }

    person: any;
    errorMessage: any;

    constructor(private http:Http) {
    }

    login(user) {

    }
}

