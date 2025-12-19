namespace CompanyEndAPI.Models;

public class Company
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Website { get; set; }
    public string? Logo { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class Job
{
    public int Id { get; set; }
    public int CompanyId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<string> Requirements { get; set; } = new List<string>();
    public string Location { get; set; } = string.Empty;
    public string CTC { get; set; } = string.Empty;
    public string ExperienceRequired { get; set; } = string.Empty;
    public string Type { get; set; } = "full-time"; // full-time, part-time, contract, internship
    public List<string> Skills { get; set; } = new List<string>();
    public DateTime? ApplicationDeadline { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "active"; // active, closed
}

public class Application
{
    public int Id { get; set; }
    public int JobId { get; set; }
    public string ApplicantName { get; set; } = string.Empty;
    public string ApplicantEmail { get; set; } = string.Empty;
    public string? Resume { get; set; }
    public string? CoverLetter { get; set; }
    public string Status { get; set; } = "applied"; // applied, shortlisted, interviewed, rejected, hired
    public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
}

public class DashboardStats
{
    public int TotalJobs { get; set; }
    public int ActiveJobs { get; set; }
    public int TotalApplications { get; set; }
    public int NewApplications { get; set; } // Last 7 days
    public int HiredCandidates { get; set; }
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Website { get; set; }
}

public class AuthResponse
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public Company? Company { get; set; }
    public string? Token { get; set; }
}