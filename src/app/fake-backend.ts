import {
  BaseRequestOptions,
  Http,
  RequestMethod,
  RequestOptions,
  Response,
  ResponseOptions,
  XHRBackend
} from "@angular/http";
import {MockBackend, MockConnection} from "@angular/http/testing";

export function fakeBackendFactory(backend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend) {
  // array in local storage for registered accounts
  let accounts: any[] = JSON.parse(localStorage.getItem('accounts')) || [];

  // configure fake backend
  backend.connections.subscribe((connection: MockConnection) => {
    // wrap in timeout to simulate server api call
    setTimeout(() => {

      // authenticate
      if (connection.request.url.endsWith('/api/authenticate') && connection.request.method === RequestMethod.Post) {
        // get parameters from post request
        let params = JSON.parse(connection.request.getBody());

        // find if any account matches login credentials
        let filteredAccounts = accounts.filter(account => {
          return account.accountname === params.accountname && account.password === params.password;
        });

        if (filteredAccounts.length) {
          // if login details are valid return 200 OK with account details and fake jwt token
          let account = filteredAccounts[0];
          connection.mockRespond(new Response(new ResponseOptions({
            status: 200,
            body: {
              id: account.id,
              accountname: account.accountname,
              firstName: account.firstName,
              lastName: account.lastName,
              token: 'fake-jwt-token'
            }
          })));
        } else {
          // else return 400 bad request
          connection.mockError(new Error('Accountname or password is incorrect'));
        }

        return;
      }

      // get accounts
      if (connection.request.url.endsWith('/api/accounts') && connection.request.method === RequestMethod.Get) {
        // check for fake auth token in header and return accounts if valid, this security is implemented server side in a real application
        if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          connection.mockRespond(new Response(new ResponseOptions({status: 200, body: accounts})));
        } else {
          // return 401 not authorised if token is null or invalid
          connection.mockRespond(new Response(new ResponseOptions({status: 401})));
        }

        return;
      }

      // get account by id
      if (connection.request.url.match(/\/api\/accounts\/\d+$/) && connection.request.method === RequestMethod.Get) {
        // check for fake auth token in header and return account if valid, this security is implemented server side in a real application
        if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          // find account by id in accounts array
          let urlParts = connection.request.url.split('/');
          let id = parseInt(urlParts[urlParts.length - 1]);
          let matchedAccounts = accounts.filter(account => {
            return account.id === id;
          });
          let account = matchedAccounts.length ? matchedAccounts[0] : null;

          // respond 200 OK with account
          connection.mockRespond(new Response(new ResponseOptions({status: 200, body: account})));
        } else {
          // return 401 not authorised if token is null or invalid
          connection.mockRespond(new Response(new ResponseOptions({status: 401})));
        }

        return;
      }

      // create account
      if (connection.request.url.endsWith('/api/accounts') && connection.request.method === RequestMethod.Post) {
        // get new account object from post body
        let newAccount = JSON.parse(connection.request.getBody());

        // validation
        let duplicateAccount = accounts.filter(account => {
          return account.accountname === newAccount.accountname;
        }).length;
        if (duplicateAccount) {
          return connection.mockError(new Error('Accountname "' + newAccount.accountname + '" is already taken'));
        }

        // save new account
        newAccount.id = accounts.length + 1;
        accounts.push(newAccount);
        localStorage.setItem('accounts', JSON.stringify(accounts));

        // respond 200 OK
        connection.mockRespond(new Response(new ResponseOptions({status: 200})));

        return;
      }

      // delete account
      if (connection.request.url.match(/\/api\/accounts\/\d+$/) && connection.request.method === RequestMethod.Delete) {
        // check for fake auth token in header and return account if valid, this security is implemented server side in a real application
        if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          // find account by id in accounts array
          let urlParts = connection.request.url.split('/');
          let id = parseInt(urlParts[urlParts.length - 1]);
          for (let i = 0; i < accounts.length; i++) {
            let account = accounts[i];
            if (account.id === id) {
              // delete account
              accounts.splice(i, 1);
              localStorage.setItem('accounts', JSON.stringify(accounts));
              break;
            }
          }

          // respond 200 OK
          connection.mockRespond(new Response(new ResponseOptions({status: 200})));
        } else {
          // return 401 not authorised if token is null or invalid
          connection.mockRespond(new Response(new ResponseOptions({status: 401})));
        }

        return;
      }

      // pass through any requests not handled above
      let realHttp = new Http(realBackend, options);
      let requestOptions = new RequestOptions({
        method: connection.request.method,
        headers: connection.request.headers,
        body: connection.request.getBody(),
        url: connection.request.url,
        withCredentials: connection.request.withCredentials,
        responseType: connection.request.responseType
      });
      realHttp.request(connection.request.url, requestOptions)
        .subscribe((response: Response) => {
            connection.mockRespond(response);
          },
          (error: any) => {
            connection.mockError(error);
          });

    }, 500);

  });

  return new Http(backend, options);
};

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: Http,
  useFactory: fakeBackendFactory,
  deps: [MockBackend, BaseRequestOptions, XHRBackend]
};
