import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DemoDataService } from '../services/demo-data.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './login.html',
    styleUrls: ['./login.scss']
})
export class LoginComponent {
    loginData = {
        email: '',
        password: ''
    };

    registerData = {
        name: '',
        email: '',
        password: '',
        description: '',
        website: ''
    };

    showRegister = false;
    isLoading = false;
    errorMessage = '';

    constructor(
        private authService: AuthService,
        private router: Router,
        private demoDataService: DemoDataService
    ) { }

    onLogin() {
        if (!this.loginData.email || !this.loginData.password) return;

        this.isLoading = true;
        this.errorMessage = '';

        this.authService.login(this.loginData.email, this.loginData.password).subscribe({
            next: (response) => {
                this.isLoading = false;
                if (response.success) {
                    this.demoDataService.seedDemoData();
                    this.router.navigate(['/dashboard']);
                } else {
                    this.errorMessage = response.message || 'Invalid email or password';
                }
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = error.error?.message || 'Login failed. Please try again.';
            }
        });
    }

    onRegister() {
        if (!this.registerData.name || !this.registerData.email || !this.registerData.password) return;

        this.isLoading = true;
        this.errorMessage = '';

        this.authService.register(this.registerData).subscribe({
            next: (response) => {
                this.isLoading = false;
                if (response.success) {
                    // Clear the form and show success message
                    this.registerData = {
                        name: '',
                        email: '',
                        password: '',
                        description: '',
                        website: ''
                    };
                    this.showRegister = false;
                    this.errorMessage = 'Registration successful! Please log in with your credentials.';
                } else {
                    this.errorMessage = response.message || 'Email already exists';
                }
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
            }
        });
    }

    toggleRegister() {
        this.showRegister = !this.showRegister;
        this.errorMessage = '';
    }
}