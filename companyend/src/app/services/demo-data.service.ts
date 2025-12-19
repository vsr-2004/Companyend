import { Injectable } from '@angular/core';
import { JobService } from './job.service';
import { AuthService } from './auth.service';
import { Job, Application } from '../models/company.model';

@Injectable({
    providedIn: 'root'
})
export class DemoDataService {
    constructor(
        private jobService: JobService,
        private authService: AuthService
    ) { }

    seedDemoData() {
        // Only seed if no data exists
        const existingJobs: Job[] = []; // For demo, assume no existing jobs
        if (existingJobs.length > 0) return;

        // Create demo company
        const demoCompany = {
            name: 'TechCorp Solutions',
            email: 'hr@techcorp.com',
            password: 'demo123',
            description: 'Leading technology solutions provider',
            website: 'https://techcorp.com'
        };

        this.authService.register(demoCompany).subscribe((response: any) => {
            if (response.success && response.company) {
                const currentCompany = response.company;
                // Create demo jobs
                const demoJobs: Omit<Job, 'id' | 'createdAt'>[] = [
                    {
                        companyId: 1, // Placeholder, will be set to actual company id
                        title: 'Senior Software Engineer',
                        description: 'We are looking for an experienced software engineer to join our dynamic team. You will be working on cutting-edge technologies and contributing to innovative projects that impact millions of users.',
                        requirements: [
                            '5+ years of experience in software development',
                            'Strong proficiency in JavaScript/TypeScript',
                            'Experience with React, Angular, or Vue.js',
                            'Knowledge of Node.js and REST APIs',
                            'Familiarity with cloud platforms (AWS/Azure/GCP)'
                        ],
                        location: 'New York, NY',
                        ctc: '$120,000 - $160,000',
                        experienceRequired: '5+ years',
                        type: 'full-time',
                        skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'AWS'],
                        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                        status: 'active'
                    },
                    {
                        companyId: 1,
                        title: 'Product Manager',
                        description: 'Join our product team to drive the development of world-class software products. You will work closely with engineering, design, and business teams to define product strategy and roadmap.',
                        requirements: [
                            '3+ years of product management experience',
                            'Experience in B2B or B2C software products',
                            'Strong analytical and problem-solving skills',
                            'Excellent communication and leadership abilities',
                            'Experience with agile development methodologies'
                        ],
                        location: 'San Francisco, CA',
                        ctc: '$130,000 - $170,000',
                        experienceRequired: '3+ years',
                        type: 'full-time',
                        skills: ['Product Strategy', 'Agile', 'Analytics', 'Leadership'],
                        applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
                        status: 'active'
                    },
                    {
                        companyId: 1,
                        title: 'UX/UI Designer',
                        description: 'We are seeking a talented UX/UI designer to create beautiful and intuitive user experiences. You will collaborate with product and engineering teams to design interfaces that delight our users.',
                        requirements: [
                            '3+ years of UX/UI design experience',
                            'Proficiency in Figma, Sketch, or Adobe Creative Suite',
                            'Strong portfolio demonstrating design process',
                            'Experience with user research and usability testing',
                            'Knowledge of design systems and component libraries'
                        ],
                        location: 'Remote',
                        ctc: '$90,000 - $130,000',
                        experienceRequired: '3+ years',
                        type: 'full-time',
                        skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
                        applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
                        status: 'active'
                    }
                ];

                // Get the actual company ID after registration
                if (currentCompany) {
                    demoJobs.forEach(jobData => {
                        jobData.companyId = currentCompany.id;
                        this.jobService.createJob(jobData).subscribe();
                    });

                    // Create some demo applications
                    const jobs: Job[] = []; // Skip demo applications for now
                    if (jobs.length > 0) {
                        const demoApplications: Omit<Application, 'id' | 'appliedAt'>[] = [
                            {
                                jobId: jobs[0].id,
                                applicantName: 'John Smith',
                                applicantEmail: 'john.smith@email.com',
                                resume: 'john_smith_resume.pdf',
                                coverLetter: 'I am excited to apply for the Senior Software Engineer position...',
                                status: 'shortlisted'
                            },
                            {
                                jobId: jobs[0].id,
                                applicantName: 'Sarah Johnson',
                                applicantEmail: 'sarah.j@email.com',
                                resume: 'sarah_johnson_resume.pdf',
                                coverLetter: 'With 6 years of experience in full-stack development...',
                                status: 'applied'
                            },
                            {
                                jobId: jobs[1].id,
                                applicantName: 'Mike Chen',
                                applicantEmail: 'mike.chen@email.com',
                                resume: 'mike_chen_resume.pdf',
                                coverLetter: 'My background in product management includes...',
                                status: 'interviewed'
                            },
                            {
                                jobId: jobs[1].id,
                                applicantName: 'Emily Davis',
                                applicantEmail: 'emily.davis@email.com',
                                resume: 'emily_davis_resume.pdf',
                                coverLetter: 'I have successfully led product development...',
                                status: 'hired'
                            }
                        ];

                        demoApplications.forEach(appData => {
                            this.jobService.addApplication(appData);
                        });
                    }
                }
            }
        });
    }
}