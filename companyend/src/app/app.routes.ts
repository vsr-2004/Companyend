import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
	{ path: '', redirectTo: '/login', pathMatch: 'full' },
	{ path: 'login', loadComponent: () => import('./login/login').then(m => m.LoginComponent) },
	{ path: 'dashboard', loadComponent: () => import('./dashboard/dashboard').then(m => m.DashboardComponent), canActivate: [AuthGuard] },
	{ path: '**', redirectTo: '/login' }
];
