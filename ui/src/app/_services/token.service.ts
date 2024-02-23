import { Injectable } from '@angular/core';
import { HttpEvent } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private cache = new Map<string, HttpEvent<any>>();
  constructor() { }

  signOut() {
    window.sessionStorage.clear();
    window.localStorage.clear();
    this.resetCache();
  }
  resetCache() {
    this.cache.clear();
  }
  public saveToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user) {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, user);
  }

  public getUser() {
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  }

}
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';