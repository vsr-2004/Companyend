export interface Company {
    id: number;
    name: string;
    email: string;
    password?: string; // Only used for registration/login requests
    description?: string;
    website?: string;
    logo?: string;
    createdAt: Date;
}

export interface Job {
    id: number;
    companyId: number;
    title: string;
    description: string;
    requirements: string[];
    location: string;
    ctc: string;
    experienceRequired: string;
    type: 'full-time' | 'part-time' | 'contract' | 'internship';
    skills: string[];
    applicationDeadline?: Date;
    createdAt: Date;
    status: 'active' | 'closed';
}

export interface Application {
    id: number;
    jobId: number;
    applicantName: string;
    applicantEmail: string;
    resume?: string;
    coverLetter?: string;
    status: 'applied' | 'shortlisted' | 'interviewed' | 'rejected' | 'hired';
    appliedAt: Date;
}

export interface DashboardStats {
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    newApplications: number;
    hiredCandidates: number;
}