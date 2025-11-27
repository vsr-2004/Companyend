import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobService } from '../services/job.service';
import { Job } from '../models/job.model';

function uid() { return Date.now().toString(36); }

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'company-job-form',
  template: `
  <div class="page-wrapper page">
    <aside class="sidebar">
      <div class="tabs">
        <button class="tab-btn profile-tab" [class.active]="selectedTab === 'profile'" (click)="selectTab('profile')" aria-selected="{{selectedTab === 'profile'}}">Profile</button>
        <button class="tab-btn post-tab" [class.active]="selectedTab === 'post'" (click)="selectTab('post')" aria-selected="{{selectedTab === 'post'}}">Post Jobs</button>
      </div>
      <div *ngIf="selectedTab === 'post'" class="form-wrapper" id="jobForm">
        <form (ngSubmit)="submit()">
          <div class="form-field">
            <label for="companyName">Company Name</label>
            <input id="companyName" [(ngModel)]="companyName" name="companyName" placeholder="e.g. My Company" />
          </div>

          <div class="form-field">
            <label for="titleInput">Job Title</label>
            <input id="titleInput" [(ngModel)]="title" name="title" required />
          </div>

          <div class="form-field">
            <label for="ctcInput">CTC</label>
            <input id="ctcInput" [(ngModel)]="ctc" name="ctc" required placeholder="e.g. 3-5 LPA" />
          </div>

          <div class="form-field">
            <label for="locationInput">Location</label>
            <input id="locationInput" [(ngModel)]="location" name="location" required />
          </div>

          <div class="form-field">
            <label for="experienceInput">Experience Required</label>
            <input id="experienceInput" [(ngModel)]="experienceRequired" name="experienceRequired" required />
          </div>

          <div class="form-field">
            <label for="descriptionInput">Job Description</label>
            <textarea id="descriptionInput" [(ngModel)]="description" name="description" rows="6"></textarea>
          </div>

          <div class="form-actions">
            <button class="btn primary" type="submit" [disabled]="!title || !ctc || !location || !experienceRequired">Post Job</button>
            <button class="btn secondary" type="button" (click)="clear()">Clear</button>
          </div>
        </form>
      </div>

      <div *ngIf="selectedTab === 'profile'" class="form-wrapper" id="profile">
        <form>
          <div class="form-field">
            <label for="employerName">Company Name</label>
            <input id="employerName" name="employerName" [(ngModel)]="employerName" />
          </div>
          <div class="form-field">
            <label for="employerEmail">Email</label>
            <input id="employerEmail" name="employerEmail" [(ngModel)]="employerEmail" />
          </div>
          <div class="form-field">
            <label for="employerPhone">Phone</label>
            <input id="employerPhone" name="employerPhone" [(ngModel)]="employerPhone" />
          </div>
          <div class="form-field">
            <label for="employerBio">About</label>
            <textarea id="employerBio" name="employerBio" rows="4" [(ngModel)]="employerBio"></textarea>
          </div>
          <div class="form-actions">
            <button class="btn primary" type="button" (click)="saveProfile()">Save Profile</button>
          </div>
        </form>
      </div>
    </aside>

    <main class="content">
      <div class="jobs-header">
        <h3 class="jobs-title">Posted Jobs</h3>
        <div class="meta-text">Total: {{ jobs.length }}</div>
      </div>
      <div class="job-list">
        <div *ngIf="jobs.length === 0" class="job-card empty">No jobs posted yet. Click "Post Jobs" to add one.</div>
        <div *ngFor="let j of jobs" class="job-card">
          <strong>{{ j.title }}</strong>
          <div class="job-meta"><a class="employer-link" (click)="viewEmployer(j)">{{ j.companyId }}</a> • {{ j.location }} • {{ j.ctc }} • <span class="job-date">{{ j.createdAt ? (j.createdAt | date:'short') : '' }}</span></div>
          <div>{{ j.description }}</div>
          <div>Experience: <strong>{{ j.experienceRequired }}</strong></div>
          <div class="job-actions">
            <button class="btn secondary" (click)="delete(j.id)">Delete</button>
          </div>
        </div>
      </div>
    </main>
  </div>
  `,
  styles: [``]
})
export class CompanyJobForm {
  companyName = '';
  title = '';
  ctc = '';
  location = '';
  description = '';
  experienceRequired = '';

  jobs: Job[] = [];
  showForm = false;
  selectedTab: 'profile' | 'post' = 'post';

  // Employer profile fields
  employerName = '';
  employerEmail = '';
  employerPhone = '';
  employerBio = '';

  constructor(private jobService: JobService) {
    this.jobs = this.jobService.getAllJobs();
    // Load persisted employer profile (if available)
    try {
      const raw = localStorage.getItem('employerProfile');
      if (raw) {
        const p = JSON.parse(raw);
        this.employerName = p.name || '';
        this.employerEmail = p.email || '';
        this.employerPhone = p.phone || '';
        this.employerBio = p.bio || '';
        // Use employer name as company if not already present
        if (!this.companyName) this.companyName = this.employerName;
      }
    } catch (e) {
      /* ignore parse error */
    }
  }

  // approachNow removed — single page flow

  submit() {
    const companyName = this.companyName || 'Company';
    const job: Job = {
      id: uid(),
      companyId: companyName,
      title: this.title,
      ctc: this.ctc,
      location: this.location,
      description: this.description,
      experienceRequired: this.experienceRequired,
      approachedColleges: [],
      createdAt: Date.now()
    };
    this.jobService.createJob(job);
    // clear form and refresh
    this.clear();
    this.jobs = this.jobService.getAllJobs();
    // if new job posted, switch user to the jobs list view
    this.selectedTab = 'post';
  }
  clear() {
    this.title = '';
    this.ctc = '';
    this.location = '';
    this.description = '';
    this.experienceRequired = '';
    this.companyName = '';
    // approachNow removed
  }

  // No college/approach functionality required in the simplified single page app.

  delete(id: string) {
    this.jobService.deleteJob(id);
    this.jobs = this.jobService.getAllJobs();
  }

  viewEmployer(job: Job) {
    // Jump to profile tab and populate fields with this job's company
    this.selectedTab = 'profile';
    this.employerName = job.companyId;
    // employer details are not stored on jobs; leave email/phone blank
  }

  // Tab helpers
  selectTab(tab: 'profile' | 'post') {
    this.selectedTab = tab;
    // Prefill company name when switching to post job
    if (tab === 'post' && this.employerName) {
      this.companyName = this.employerName;
    }
  }

  saveProfile() {
    const p = { name: this.employerName, email: this.employerEmail, phone: this.employerPhone, bio: this.employerBio };
    localStorage.setItem('employerProfile', JSON.stringify(p));
    // reflect in companyName if empty
    if (!this.companyName) this.companyName = this.employerName;
    alert('Profile saved');
  }
}
