# CompanyEnd - Professional Company Job Posting Platform

A comprehensive company-side job posting platform built with Angular, designed similar to UpGrad's professional dashboard interface. Features company authentication, detailed job descriptions, application tracking, and analytics.

## 🚀 Features

### Company Authentication
- **Secure Login/Registration**: Companies can register and login to their dashboard
- **Profile Management**: Manage company information and branding
- **Session Management**: Persistent login sessions with automatic logout

### Job Posting Dashboard
- **Professional UI**: Clean, modern interface inspired by UpGrad's design
- **Detailed Job Descriptions**: Rich job posting with requirements, skills, and deadlines
- **Job Management**: Create, edit, and manage job postings
- **Status Tracking**: Open/close jobs and track their lifecycle

### Application Tracking
- **Application Management**: View and manage job applications
- **Status Updates**: Track application progress (Applied → Shortlisted → Interviewed → Hired/Rejected)
- **Candidate Details**: View applicant information and resumes

### Analytics & Insights
- **Dashboard Overview**: Key metrics and statistics
- **Application Trends**: Track application volume and conversion rates
- **Job Performance**: Monitor which jobs attract the most candidates

## 🛠️ Technology Stack

- **Framework**: Angular 20.3.x with Standalone Components
- **Styling**: SCSS with Professional Design System
- **State Management**: RxJS BehaviorSubjects + localStorage
- **Routing**: Angular Router with Route Guards
- **Forms**: Reactive Forms with Validation

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/vsr-2004/Companyend.git
   cd companyend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200/`

## 🎯 Usage

### For New Companies
1. **Register**: Click "Register here" on the login page
2. **Fill Company Details**: Provide company name, email, password, and optional description/website
3. **Demo Data**: The system will automatically seed sample jobs and applications for demonstration

### For Existing Companies
1. **Login**: Use your registered email and password
2. **Dashboard**: Access your comprehensive dashboard with sidebar navigation

### Dashboard Navigation
- **Overview**: Key metrics and statistics
- **Job Postings**: Create and manage job listings
- **Applications**: Track and manage candidate applications
- **Analytics**: View performance insights and trends

### Posting a Job
1. Navigate to "Job Postings" tab
2. Click "+ Post New Job"
3. Fill in detailed job information:
   - Job title and description
   - Location and salary range
   - Required experience and skills
   - Application deadline
4. Save and publish the job

### Managing Applications
1. Go to "Applications" tab
2. View all applications for your jobs
3. Update application status using the dropdown
4. Track hiring progress and metrics

## 🎨 Design Features

- **Professional Color Scheme**: Blue gradient theme similar to UpGrad
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI Components**: Cards, modals, and professional typography
- **Intuitive Navigation**: Sidebar navigation with clear visual hierarchy
- **Interactive Elements**: Hover effects and smooth transitions

## 🔧 Development

### Project Structure
```
src/
├── app/
│   ├── login/                 # Authentication component
│   ├── dashboard/             # Main dashboard component
│   ├── services/              # Business logic services
│   │   ├── auth.service.ts    # Authentication logic
│   │   ├── job.service.ts     # Job and application management
│   │   └── demo-data.service.ts # Sample data seeding
│   ├── models/                # TypeScript interfaces
│   │   ├── company.model.ts   # Data models
│   │   └── college.model.ts   # Legacy models
│   ├── auth.guard.ts          # Route protection
│   └── app.routes.ts          # Application routing
```

### Key Components

- **LoginComponent**: Handles company authentication and registration
- **DashboardComponent**: Main application interface with multiple tabs
- **AuthService**: Manages authentication state and API calls
- **JobService**: Handles job posting and application management
- **AuthGuard**: Protects routes requiring authentication

## 🚀 Deployment

The application is configured for deployment to GitHub Pages and other static hosting platforms.

```bash
# Build for production
npm run build

# The built files will be in the 'dist/' directory
```

## 📊 Demo Data

The application includes demo data seeding that creates:
- Sample company profile
- 3 example job postings with detailed descriptions
- 4 sample applications with different statuses
- Realistic metrics and analytics data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using Angular**
- Enter a company name (optional) and fill the job fields: title, CTC, location, experience required, and description.
- Click "Post Job" to save the job locally. Created jobs will appear below the form.
 - Click "Post Job" to save the job locally. Created jobs will appear below the form. Use "Approach Colleges" next to a job to send it to a college (simulated, stored in localStorage).

This is a demo implementation that uses localStorage to save job entries locally with no backend.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
