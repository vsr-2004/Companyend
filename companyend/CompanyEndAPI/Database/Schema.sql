-- Create CompanyEndDB database
CREATE DATABASE CompanyEndDB;
GO

USE CompanyEndDB;
GO

-- Create Companies table
CREATE TABLE Companies (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    Website NVARCHAR(500),
    Logo NVARCHAR(500),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- Create Jobs table
CREATE TABLE Jobs (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId INT NOT NULL,
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    Requirements NVARCHAR(MAX) NOT NULL, -- Comma-separated list
    Location NVARCHAR(255) NOT NULL,
    CTC NVARCHAR(100) NOT NULL,
    ExperienceRequired NVARCHAR(100) NOT NULL,
    Type NVARCHAR(50) NOT NULL DEFAULT 'full-time',
    Skills NVARCHAR(MAX) NOT NULL, -- Comma-separated list
    ApplicationDeadline DATETIME2,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    Status NVARCHAR(50) NOT NULL DEFAULT 'active',
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id) ON DELETE CASCADE
);

-- Create Applications table
CREATE TABLE Applications (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    JobId INT NOT NULL,
    ApplicantName NVARCHAR(255) NOT NULL,
    ApplicantEmail NVARCHAR(255) NOT NULL,
    Resume NVARCHAR(MAX),
    CoverLetter NVARCHAR(MAX),
    Status NVARCHAR(50) NOT NULL DEFAULT 'applied',
    AppliedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (JobId) REFERENCES Jobs(Id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IX_Jobs_CompanyId ON Jobs(CompanyId);
CREATE INDEX IX_Jobs_Status ON Jobs(Status);
CREATE INDEX IX_Applications_JobId ON Applications(JobId);
CREATE INDEX IX_Applications_Status ON Applications(Status);
CREATE INDEX IX_Applications_AppliedAt ON Applications(AppliedAt);

-- Insert sample data for testing
INSERT INTO Companies (Name, Email, PasswordHash, Description, Website) VALUES
('TechCorp Inc.', 'hr@techcorp.com', '$2a$11$92C7wGJ8QgU1gYhQ8X9Xue8QzL8QgU1gYhQ8X9Xue8QzL8QgU1gYhQ8X9Xue', 'Leading technology company', 'https://techcorp.com'),
('Innovate Solutions', 'careers@innovate.com', '$2a$11$92C7wGJ8QgU1gYhQ8X9Xue8QzL8QgU1gYhQ8X9Xue8QzL8QgU1gYhQ8X9Xue', 'Innovation-driven solutions provider', 'https://innovate.com');

-- Note: The password for both sample accounts is 'password123'
-- In production, use proper password hashing with BCrypt.Net