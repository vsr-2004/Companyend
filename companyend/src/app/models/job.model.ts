export interface Job {
    id: string;
    companyId: string;
    title: string;
    ctc: string; // can be a range
    location: string;
    description: string;
    experienceRequired: string;
    approachedColleges?: string[]; // college ids approached
    createdAt?: number;
}
