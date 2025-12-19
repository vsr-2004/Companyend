import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job, Application, DashboardStats } from '../models/company.model';

@Injectable({ providedIn: 'root' })
export class JobService {
  private apiUrl = 'http://localhost:5000/api'; // Update with your API URL

  constructor(private http: HttpClient) { }

  getJobs(companyId: number): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/jobs/company/${companyId}`);
  }

  getJob(id: number): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/jobs/${id}`);
  }

  createJob(jobData: Omit<Job, 'id' | 'createdAt'>): Observable<Job> {
    return this.http.post<Job>(`${this.apiUrl}/jobs`, jobData);
  }

  updateJob(job: Job): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/jobs/${job.id}`, job);
  }

  deleteJob(jobId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/jobs/${jobId}`);
  }

  getApplications(jobId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/applications/job/${jobId}`);
  }

  addApplication(applicationData: Omit<Application, 'id' | 'appliedAt'>): Observable<Application> {
    return this.http.post<Application>(`${this.apiUrl}/applications`, applicationData);
  }

  updateApplicationStatus(applicationId: number, status: Application['status']): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/applications/${applicationId}/status`, status);
  }

  getDashboardStats(companyId: number): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats/${companyId}`);
  }
}
