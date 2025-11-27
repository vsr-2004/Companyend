import { Injectable } from '@angular/core';
import { Job } from '../models/job.model';

@Injectable({ providedIn: 'root' })
export class JobService {
  private storageKey = 'companyJobs';

  private loadJobs(): Job[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as Job[];
    } catch {
      return [];
    }
  }

  private saveJobs(jobs: Job[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(jobs));
  }

  getJobsForCompany(companyId: string): Job[] {
    return this.loadJobs().filter((j) => j.companyId === companyId);
  }

  getAllJobs(): Job[] {
    return this.loadJobs();
  }

  createJob(job: Job) {
    const jobs = this.loadJobs();
    jobs.unshift(job);
    this.saveJobs(jobs);
  }

  updateJob(updated: Job) {
    const jobs = this.loadJobs().map((j) => (j.id === updated.id ? updated : j));
    this.saveJobs(jobs);
  }

  deleteJob(id: string) {
    const jobs = this.loadJobs().filter((j) => j.id !== id);
    this.saveJobs(jobs);
  }
}
