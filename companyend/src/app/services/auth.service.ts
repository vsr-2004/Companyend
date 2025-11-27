// AuthService removed — no login flow in single page app. Kept as a stub.
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _companyName: string | null = null;

  login(companyName: string) {
    this._companyName = companyName;
    localStorage.setItem('companyName', companyName);
  }

  logout() {
    this._companyName = null;
    localStorage.removeItem('companyName');
  }

  get companyName() {
    if (!this._companyName) {
      this._companyName = localStorage.getItem('companyName');
    }
    return this._companyName;
  }

  isLoggedIn() {
    return !!this.companyName;
  }
}
