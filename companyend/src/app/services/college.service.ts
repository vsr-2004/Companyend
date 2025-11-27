import { Injectable } from '@angular/core';
import { College } from '../models/college.model';
import { Job } from '../models/job.model';

@Injectable({ providedIn: 'root' })
export class CollegeService {
  private storageKey = 'colleges';
  private notificationsKey = 'collegeNotifications';

  constructor() {
    // If no seed colleges, seed a few for demo.
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      const seed: College[] = [
        { id: 'c1', name: 'State Tech University', location: 'City A', email: 'placements@stut.edu' },
        { id: 'c2', name: 'Metro Engineering College', location: 'City B', email: 'placements@metroec.edu' },
        { id: 'c3', name: 'National Institute of Science', location: 'City C', email: 'placements@nis.edu' }
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(seed));
    }
  }

  private loadColleges(): College[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return [];
    try { return JSON.parse(raw) as College[]; } catch { return []; }
  }

  getColleges(): College[] {
    return this.loadColleges();
  }

  sendJobToCollege(job: Job, collegeId: string) {
    // We'll store a small notification entry in localStorage for demo
    const raw = localStorage.getItem(this.notificationsKey);
    const arr = raw ? JSON.parse(raw) : [];
    arr.unshift({ id: Date.now().toString(36), jobId: job.id, collegeId, createdAt: new Date().toISOString() });
    localStorage.setItem(this.notificationsKey, JSON.stringify(arr));
  }
}
