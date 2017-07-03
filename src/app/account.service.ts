import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { Account } from './model/account';

@Injectable()
export class AccountService {
  constructor(private http: Http) { }

  getAll() {
    return this.http.get('/api/accounts', this.jwt()).map((response: Response) => response.json());
  }

  getById(id: number) {
    return this.http.get('/api/accounts/' + id, this.jwt()).map((response: Response) => response.json());
  }

  create(account: Account) {
    return this.http.post('/api/accounts', account, this.jwt()).map((response: Response) => response.json());
  }

  update(account: Account) {
    return this.http.put('/api/accounts/' + account.id, account, this.jwt()).map((response: Response) => response.json());
  }

  delete(id: number) {
    return this.http.delete('/api/accounts/' + id, this.jwt()).map((response: Response) => response.json());
  }

  // private helper methods

  private jwt() {
    // create authorization header with jwt token
    let currentAccount = JSON.parse(localStorage.getItem('currentAccount'));
    if (currentAccount && currentAccount.token) {
      let headers = new Headers({ 'Authorization': 'Bearer ' + currentAccount.token });
      return new RequestOptions({ headers: headers });
    }
  }
}
