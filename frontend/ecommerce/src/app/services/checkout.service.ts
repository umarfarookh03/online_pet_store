import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country } from '../common/country';
import { map } from 'rxjs';
import { response } from 'express';
import { State } from '../common/state';
import { Purchase } from '../common/purchase';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  countriesUrl = 'http://localhost:8080/api/countries';
  statesUrl = 'http://localhost:8080/api/states';
  purchasseUrl = 'http://localhost:8080/api/checkout/purchase';

  constructor(private httpClient: HttpClient) {}

  placeOrder(purchase: Purchase) {
    return this.httpClient.post<Purchase>(this.purchasseUrl, purchase);
  }

  getCountries() {
    return this.httpClient
      .get<GetResponseCountries>(this.countriesUrl)
      .pipe(map((response) => response._embedded.countries));
  }

  getStates(theCountryCode: string) {
    return this.httpClient
      .get<GetResponseStates>(
        this.statesUrl + '/search/findByCountryCode?code=' + theCountryCode
      )
      .pipe(map((response) => response._embedded.states));
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  };
}
interface GetResponseStates {
  _embedded: {
    states: State[];
  };
}
