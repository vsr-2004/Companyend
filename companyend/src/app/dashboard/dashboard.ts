import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { JobService } from '../services/job.service';
import { Company, Job, Application, DashboardStats } from '../models/company.model';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
    currentCompany: Company | null = null;
    activeTab: string = 'overview';
    showJobForm: boolean = false;
    editingJob: Job | null = null;
    showProfileDropdown: boolean = false;

    jobs: Job[] = [];
    applications: Application[] = [];
    stats: DashboardStats = {
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        newApplications: 0,
        hiredCandidates: 0
    };

    jobFormData = {
        title: '',
        type: 'full-time' as Job['type'],
        description: '',
        location: '',
        ctc: '',
        experienceRequired: '',
        applicationDeadline: '',
        skillsInput: '',
        requirementsInput: ''
    };

    constructor(
        private authService: AuthService,
        private jobService: JobService,
        private router: Router
    ) { }

    ngOnInit() {
        this.authService.currentCompany$.subscribe(company => {
            this.currentCompany = company;
            if (!company) {
                this.router.navigate(['/login']);
                return;
            }
            this.loadData();
        });
    }

    setActiveTab(tab: string) {
        this.activeTab = tab;
    }

    getTabTitle(): string {
        switch (this.activeTab) {
            case 'overview': return 'Dashboard Overview';
            case 'jobs': return 'Job Postings';
            case 'applications': return 'Applications';
            case 'analytics': return 'Analytics';
            default: return 'Dashboard';
        }
    }

    getCompanyInitials(): string {
        if (!this.currentCompany?.name) return 'C';
        return this.currentCompany.name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .join('')
            .substring(0, 2);
    }

    toggleProfileDropdown() {
        this.showProfileDropdown = !this.showProfileDropdown;
    }

    reloadDashboard() {
        window.location.reload();
    }

    viewProfile() {
        // TODO: Implement view profile functionality
        console.log('View profile clicked');
        this.showProfileDropdown = false;
    }

    editProfile() {
        // TODO: Implement edit profile functionality
        console.log('Edit profile clicked');
        this.showProfileDropdown = false;
    }

    loadData() {
        if (!this.currentCompany) return;

        // Load jobs
        this.jobService.getJobs(this.currentCompany.id).subscribe({
            next: (jobs) => {
                this.jobs = jobs;
            },
            error: (error) => {
                console.error('Error loading jobs:', error);
            }
        });

        // Load dashboard stats
        this.jobService.getDashboardStats(this.currentCompany.id).subscribe({
            next: (stats) => {
                this.stats = stats;
            },
            error: (error) => {
                console.error('Error loading dashboard stats:', error);
            }
        });
    }

    getApplicationCount(jobId: number): number {
        // For now, return 0 since we're not loading all applications at once
        // This could be optimized later by loading application counts separately
        return 0;
    }

    getJobTitle(jobId: number): string {
        const job = this.jobs.find(j => j.id === jobId);
        return job ? job.title : 'Unknown Job';
    }

    viewJobDetails(job: Job) {
        // Load applications for this job
        this.jobService.getApplications(job.id).subscribe({
            next: (applications) => {
                // TODO: Implement job details modal with applications
                console.log('View job details:', job, 'Applications:', applications);
            },
            error: (error) => {
                console.error('Error loading applications:', error);
            }
        });
    }

    editJob(job: Job) {
        this.editingJob = job;
        this.jobFormData = {
            title: job.title,
            type: job.type,
            description: job.description,
            location: job.location,
            ctc: job.ctc,
            experienceRequired: job.experienceRequired,
            applicationDeadline: job.applicationDeadline ? job.applicationDeadline.toISOString().split('T')[0] : '',
            skillsInput: job.skills.join(', '),
            requirementsInput: job.requirements.join('\n')
        };
        this.showJobForm = true;
    }

    toggleJobStatus(job: Job) {
        const updatedJob = {
            ...job,
            status: job.status === 'active' ? 'closed' : 'active' as Job['status']
        };
        this.jobService.updateJob(updatedJob).subscribe({
            next: () => {
                this.loadData();
            },
            error: (error) => {
                console.error('Error updating job status:', error);
            }
        });
    }

    deleteJob(job: Job) {
        if (confirm(`Are you sure you want to delete "${job.title}"?`)) {
            this.jobService.deleteJob(job.id).subscribe({
                next: () => {
                    this.loadData();
                },
                error: (error) => {
                    console.error('Error deleting job:', error);
                }
            });
        }
    }

    saveJob() {
        if (!this.currentCompany) return;

        const jobData: Omit<Job, 'id' | 'createdAt'> = {
            companyId: this.currentCompany.id,
            title: this.jobFormData.title,
            description: this.jobFormData.description,
            requirements: this.jobFormData.requirementsInput.split('\n').filter(r => r.trim()),
            location: this.jobFormData.location,
            ctc: this.jobFormData.ctc,
            experienceRequired: this.jobFormData.experienceRequired,
            type: this.jobFormData.type,
            skills: this.jobFormData.skillsInput.split(',').map(s => s.trim()).filter(s => s),
            applicationDeadline: this.jobFormData.applicationDeadline ? new Date(this.jobFormData.applicationDeadline) : undefined,
            status: 'active'
        };

        const operation = this.editingJob
            ? this.jobService.updateJob({ ...jobData, id: this.editingJob.id, createdAt: this.editingJob.createdAt })
            : this.jobService.createJob(jobData);

        (operation as Observable<any>).subscribe(() => {
            this.showJobForm = false;
            this.editingJob = null;
            this.resetJobForm();
            this.loadData();
        }, (error: any) => {
            console.error('Error saving job:', error);
        });
    }

    resetJobForm() {
        this.jobFormData = {
            title: '',
            type: 'full-time',
            description: '',
            location: '',
            ctc: '',
            experienceRequired: '',
            applicationDeadline: '',
            skillsInput: '',
            requirementsInput: ''
        };
    }

    viewApplicationDetails(application: Application) {
        // TODO: Implement application details modal
        console.log('View application details:', application);
    }

    updateApplicationStatus(applicationId: number, event: any) {
        const status = event.target.value;
        this.jobService.updateApplicationStatus(applicationId, status).subscribe({
            next: () => {
                // Reload applications for the current job if we're viewing job details
                // For now, just log success
                console.log('Application status updated successfully');
            },
            error: (error) => {
                console.error('Error updating application status:', error);
            }
        });
    }

    getConversionRate(): number {
        if (this.stats.totalApplications === 0) return 0;
        return Math.round((this.stats.hiredCandidates / this.stats.totalApplications) * 100);
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event) {
        const target = event.target as HTMLElement;
        const profileSection = target.closest('.profile-section');
        if (!profileSection) {
            this.showProfileDropdown = false;
        }
    }
}