import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', loadComponent: () => import('./company-job-form/company-job-form').then(m => m.CompanyJobForm) },
	{ path: '**', redirectTo: '' }
];
