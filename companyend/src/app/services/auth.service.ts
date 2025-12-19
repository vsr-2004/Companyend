import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Company } from '../models/company.model';

interface AuthResponse {
  success: boolean;
  message: string;
  company?: Company;
  token?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  description?: string;
  website?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentCompanySubject = new BehaviorSubject<Company | null>(null);
  public currentCompany$ = this.currentCompanySubject.asObservable();
  private apiUrl = 'http://localhost:5000/api/auth'; // Update with your API URL

  constructor(private http: HttpClient) {
    // Check if company is logged in on service initialization
    const storedCompany = localStorage.getItem('currentCompany');
    if (storedCompany) {
      this.currentCompanySubject.next(JSON.parse(storedCompany));
    }
  }

  get currentCompany(): Company | null {
    return this.currentCompanySubject.value;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const loginRequest: LoginRequest = { email, password };
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginRequest).pipe(
      tap(response => {
        if (response.success && response.company) {
          localStorage.setItem('currentCompany', JSON.stringify(response.company));
          this.currentCompanySubject.next(response.company);
        }
      })
    );
  }

  register(companyData: Omit<Company, 'id' | 'createdAt'>): Observable<AuthResponse> {
    const registerRequest: RegisterRequest = {
      name: companyData.name,
      email: companyData.email,
      password: companyData.password || '',
      description: companyData.description,
      website: companyData.website
    };

    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerRequest).pipe(
      tap(response => {
        if (response.success && response.company) {
          localStorage.setItem('currentCompany', JSON.stringify(response.company));
          this.currentCompanySubject.next(response.company);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentCompany');
    this.currentCompanySubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentCompany !== null;
  }
}
