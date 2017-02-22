import { async, TestBed } from '@angular/core/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { UserService } from './user.service';

describe('UserService', () => {

  let userService: UserService;
  let mockBackend: MockBackend;
  const originalLocalStorage = window.localStorage;
  const mockLocalStorage = {
    setItem: (key, value) => {},
    getItem: key => null,
    removeItem: key => {}
  };

  const user = {
    id: 1,
    login: 'cedric',
    money: 1000,
    registrationInstant: '2015-12-01T11:00:00Z',
    token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.5cAW816GUAg3OWKWlsYyXI4w3fDrS5BpnmbyBjVM7lo'
  };

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      MockBackend,
      BaseRequestOptions,
      {
        provide: Http,
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      },
      UserService
    ]
  }));

  beforeEach(() => {
    userService = TestBed.get(UserService);
    mockBackend = TestBed.get(MockBackend);
    // we use this instead of jasmine.spyOn to make it pass on Firefox
    // https://github.com/jasmine/jasmine/issues/299
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
  });

  afterEach(() => Object.defineProperty(window, 'localStorage', { value: originalLocalStorage }));

  it('should register a user', async(() => {
    // fake response
    const response = new Response(new ResponseOptions({ body: user }));
    // return the response if we have a connection to the MockBackend
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toBe('http://ponyracer.ninja-squad.com/api/users');
      expect(connection.request.method).toBe(RequestMethod.Post);
      connection.mockRespond(response);
    });

    userService.register(user.login, 'password', 1986).subscribe(res => {
      expect(res.id).toBe(1, 'You should transform the Response into a user using the `json()` method.');
    });
  }));

  it('should authenticate a user', async(() => {
    // fake response
    const response = new Response(new ResponseOptions({ body: user }));
    // return the response if we have a connection to the MockBackend
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url)
        .toBe('http://ponyracer.ninja-squad.com/api/users/authentication');
      expect(connection.request.method).toBe(RequestMethod.Post);
      connection.mockRespond(response);
    });

    // spy on the store method
    spyOn(userService, 'storeLoggedInUser');

    const credentials = { login: 'cedric', password: 'hello' };
    userService.authenticate(credentials)
      .subscribe(() => expect(userService.storeLoggedInUser).toHaveBeenCalledWith(user));
  }));

  it('should store the logged in user', () => {
    spyOn(userService.userEvents, 'next');
    spyOn(mockLocalStorage, 'setItem');

    userService.storeLoggedInUser(user);

    expect(userService.userEvents.next).toHaveBeenCalledWith(user);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('rememberMe', JSON.stringify(user));
  });

  it('should retrieve a user if one is stored', () => {
    spyOn(userService.userEvents, 'next');
    spyOn(mockLocalStorage, 'getItem').and.returnValue(JSON.stringify(user));

    userService.retrieveUser();

    expect(userService.userEvents.next).toHaveBeenCalledWith(user);
  });

  it('should retrieve no user if none stored', () => {
    spyOn(userService.userEvents, 'next');
    spyOn(mockLocalStorage, 'getItem');

    userService.retrieveUser();

    expect(userService.userEvents.next).not.toHaveBeenCalled();
  });
});
