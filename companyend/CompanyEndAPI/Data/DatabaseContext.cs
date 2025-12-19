using System.Data.SqlClient;
using System.Data;
using CompanyEndAPI.Models;

namespace CompanyEndAPI.Data;

public class DatabaseContext : IDisposable
{
    private readonly string _connectionString;
    private SqlConnection? _connection;

    public DatabaseContext(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new ArgumentNullException("DefaultConnection connection string is required");
    }

    private SqlConnection GetConnection()
    {
        if (_connection == null)
        {
            _connection = new SqlConnection(_connectionString);
        }
        return _connection;
    }

    public async Task OpenConnectionAsync()
    {
        if (_connection?.State != ConnectionState.Open)
        {
            await GetConnection().OpenAsync();
        }
    }

    public void Dispose()
    {
        _connection?.Dispose();
    }

    // Company operations
    public async Task<Company?> GetCompanyByIdAsync(int id)
    {
        await OpenConnectionAsync();
        using var command = new SqlCommand("SELECT * FROM Companies WHERE Id = @Id", GetConnection());
        command.Parameters.AddWithValue("@Id", id);

        using var reader = await command.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            return new Company
            {
                Id = reader.GetInt32(0),
                Name = reader.GetString(1),
                Email = reader.GetString(2),
                PasswordHash = reader.GetString(3),
                Description = reader.IsDBNull(4) ? null : reader.GetString(4),
                Website = reader.IsDBNull(5) ? null : reader.GetString(5),
                Logo = reader.IsDBNull(6) ? null : reader.GetString(6),
                CreatedAt = reader.GetDateTime(7)
            };
        }
        return null;
    }

    public async Task<Company?> GetCompanyByEmailAsync(string email)
    {
        await OpenConnectionAsync();
        using var command = new SqlCommand("SELECT * FROM Companies WHERE Email = @Email", GetConnection());
        command.Parameters.AddWithValue("@Email", email);

        using var reader = await command.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            return new Company
            {
                Id = reader.GetInt32(0),
                Name = reader.GetString(1),
                Email = reader.GetString(2),
                PasswordHash = reader.GetString(3),
                Description = reader.IsDBNull(4) ? null : reader.GetString(4),
                Website = reader.IsDBNull(5) ? null : reader.GetString(5),
                Logo = reader.IsDBNull(6) ? null : reader.GetString(6),
                CreatedAt = reader.GetDateTime(7)
            };
        }
        return null;
    }

    public async Task<int> CreateCompanyAsync(Company company)
    {
        await OpenConnectionAsync();
        using var command = new SqlCommand(
            @"INSERT INTO Companies (Name, Email, PasswordHash, Description, Website, Logo, CreatedAt)
              VALUES (@Name, @Email, @PasswordHash, @Description, @Website, @Logo, @CreatedAt);
              SELECT SCOPE_IDENTITY();", GetConnection());

        command.Parameters.AddWithValue("@Name", company.Name);
        command.Parameters.AddWithValue("@Email", company.Email);
        command.Parameters.AddWithValue("@PasswordHash", company.PasswordHash);
        command.Parameters.AddWithValue("@Description", (object?)company.Description ?? DBNull.Value);
        command.Parameters.AddWithValue("@Website", (object?)company.Website ?? DBNull.Value);
        command.Parameters.AddWithValue("@Logo", (object?)company.Logo ?? DBNull.Value);
        command.Parameters.AddWithValue("@CreatedAt", company.CreatedAt);

        var result = await command.ExecuteScalarAsync();
        return Convert.ToInt32(result);
    }

    public async Task UpdateCompanyAsync(Company company)
    {
        await OpenConnectionAsync();
        using var command = new SqlCommand(
            @"UPDATE Companies SET Name = @Name, Email = @Email, Description = @Description,
              Website = @Website, Logo = @Logo WHERE Id = @Id", GetConnection());

        command.Parameters.AddWithValue("@Id", company.Id);
        command.Parameters.AddWithValue("@Name", company.Name);
        command.Parameters.AddWithValue("@Email", company.Email);
        command.Parameters.AddWithValue("@Description", (object?)company.Description ?? DBNull.Value);
        command.Parameters.AddWithValue("@Website", (object?)company.Website ?? DBNull.Value);
        command.Parameters.AddWithValue("@Logo", (object?)company.Logo ?? DBNull.Value);

        await command.ExecuteNonQueryAsync();
    }

    // Job operations
    public async Task<List<Job>> GetJobsByCompanyIdAsync(int companyId)
    {
        await OpenConnectionAsync();
        var jobs = new List<Job>();

        using var command = new SqlCommand("SELECT * FROM Jobs WHERE CompanyId = @CompanyId ORDER BY CreatedAt DESC", GetConnection());
        command.Parameters.AddWithValue("@CompanyId", companyId);

        using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            var job = new Job
            {
                Id = reader.GetInt32(0),
                CompanyId = reader.GetInt32(1),
                Title = reader.GetString(2),
                Description = reader.GetString(3),
                Requirements = reader.GetString(4).Split(',').Select(r => r.Trim()).ToList(),
                Location = reader.GetString(5),
                CTC = reader.GetString(6),
                ExperienceRequired = reader.GetString(7),
                Type = reader.GetString(8),
                Skills = reader.GetString(9).Split(',').Select(s => s.Trim()).ToList(),
                ApplicationDeadline = reader.IsDBNull(10) ? null : reader.GetDateTime(10),
                CreatedAt = reader.GetDateTime(11),
                Status = reader.GetString(12)
            };
            jobs.Add(job);
        }
        return jobs;
    }

    public async Task<Job?> GetJobByIdAsync(int id)
    {
        await OpenConnectionAsync();
        using var command = new SqlCommand("SELECT * FROM Jobs WHERE Id = @Id", GetConnection());
        command.Parameters.AddWithValue("@Id", id);

        using var reader = await command.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            return new Job
            {
                Id = reader.GetInt32(0),
                CompanyId = reader.GetInt32(1),
                Title = reader.GetString(2),
                Description = reader.GetString(3),
                Requirements = reader.GetString(4).Split(',').Select(r => r.Trim()).ToList(),
                Location = reader.GetString(5),
                CTC = reader.GetString(6),
                ExperienceRequired = reader.GetString(7),
                Type = reader.GetString(8),
                Skills = reader.GetString(9).Split(',').Select(s => s.Trim()).ToList(),
                ApplicationDeadline = reader.IsDBNull(10) ? null : reader.GetDateTime(10),
                CreatedAt = reader.GetDateTime(11),
                Status = reader.GetString(12)
            };
        }
        return null;
    }

    public async Task<int> CreateJobAsync(Job job)
    {
        await OpenConnectionAsync();
        using var command = new SqlCommand(
            @"INSERT INTO Jobs (CompanyId, Title, Description, Requirements, Location, CTC, ExperienceRequired, Type, Skills, ApplicationDeadline, CreatedAt, Status)
              VALUES (@CompanyId, @Title, @Description, @Requirements, @Location, @CTC, @ExperienceRequired, @Type, @Skills, @ApplicationDeadline, @CreatedAt, @Status);
              SELECT SCOPE_IDENTITY();", GetConnection());

        command.Parameters.AddWithValue("@CompanyId", job.CompanyId);
        command.Parameters.AddWithValue("@Title", job.Title);
        command.Parameters.AddWithValue("@Description", job.Description);
        command.Parameters.AddWithValue("@Requirements", string.Join(", ", job.Requirements));
        command.Parameters.AddWithValue("@Location", job.Location);
        command.Parameters.AddWithValue("@CTC", job.CTC);
        command.Parameters.AddWithValue("@ExperienceRequired", job.ExperienceRequired);
        command.Parameters.AddWithValue("@Type", job.Type);
        command.Parameters.AddWithValue("@Skills", string.Join(", ", job.Skills));
        command.Parameters.AddWithValue("@ApplicationDeadline", (object?)job.ApplicationDeadline ?? DBNull.Value);
        command.Parameters.AddWithValue("@CreatedAt", job.CreatedAt);
        command.Parameters.AddWithValue("@Status", job.Status);

        var result = await command.ExecuteScalarAsync();
        return Convert.ToInt32(result);
    }

    public async Task UpdateJobAsync(Job job)
    {
        await OpenConnectionAsync();
        using var command = new SqlCommand(
            @"UPDATE Jobs SET Title = @Title, Description = @Description, Requirements = @Requirements,
              Location = @Location, CTC = @CTC, ExperienceRequired = @ExperienceRequired, Type = @Type,
              Skills = @Skills, ApplicationDeadline = @ApplicationDeadline, Status = @Status WHERE Id = @Id", GetConnection());

        command.Parameters.AddWithValue("@Id", job.Id);
        command.Parameters.AddWithValue("@Title", job.Title);
        command.Parameters.AddWithValue("@Description", job.Description);
        command.Parameters.AddWithValue("@Requirements", string.Join(", ", job.Requirements));
        command.Parameters.AddWithValue("@Location", job.Location);
        command.Parameters.AddWithValue("@CTC", job.CTC);
        command.Parameters.AddWithValue("@ExperienceRequired", job.ExperienceRequired);
        command.Parameters.AddWithValue("@Type", job.Type);
        command.Parameters.AddWithValue("@Skills", string.Join(", ", job.Skills));
        command.Parameters.AddWithValue("@ApplicationDeadline", (object?)job.ApplicationDeadline ?? DBNull.Value);
        command.Parameters.AddWithValue("@Status", job.Status);

        await command.ExecuteNonQueryAsync();
    }

    public async Task DeleteJobAsync(int id)
    {
        await OpenConnectionAsync();
        using var command = new SqlCommand("DELETE FROM Jobs WHERE Id = @Id", GetConnection());
        command.Parameters.AddWithValue("@Id", id);
        await command.ExecuteNonQueryAsync();
    }

    // Application operations
    public async Task<List<Application>> GetApplicationsByJobIdAsync(int jobId)
    {
        await OpenConnectionAsync();
        var applications = new List<Application>();

        using var command = new SqlCommand("SELECT * FROM Applications WHERE JobId = @JobId ORDER BY AppliedAt DESC", GetConnection());
        command.Parameters.AddWithValue("@JobId", jobId);

        using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            var application = new Application
            {
                Id = reader.GetInt32(0),
                JobId = reader.GetInt32(1),
                ApplicantName = reader.GetString(2),
                ApplicantEmail = reader.GetString(3),
                Resume = reader.IsDBNull(4) ? null : reader.GetString(4),
                CoverLetter = reader.IsDBNull(5) ? null : reader.GetString(5),
                Status = reader.GetString(6),
                AppliedAt = reader.GetDateTime(7)
            };
            applications.Add(application);
        }
        return applications;
    }

    public async Task<int> CreateApplicationAsync(Application application)
    {
        await OpenConnectionAsync();
        using var command = new SqlCommand(
            @"INSERT INTO Applications (JobId, ApplicantName, ApplicantEmail, Resume, CoverLetter, Status, AppliedAt)
              VALUES (@JobId, @ApplicantName, @ApplicantEmail, @Resume, @CoverLetter, @Status, @AppliedAt);
              SELECT SCOPE_IDENTITY();", GetConnection());

        command.Parameters.AddWithValue("@JobId", application.JobId);
        command.Parameters.AddWithValue("@ApplicantName", application.ApplicantName);
        command.Parameters.AddWithValue("@ApplicantEmail", application.ApplicantEmail);
        command.Parameters.AddWithValue("@Resume", (object?)application.Resume ?? DBNull.Value);
        command.Parameters.AddWithValue("@CoverLetter", (object?)application.CoverLetter ?? DBNull.Value);
        command.Parameters.AddWithValue("@Status", application.Status);
        command.Parameters.AddWithValue("@AppliedAt", application.AppliedAt);

        var result = await command.ExecuteScalarAsync();
        return Convert.ToInt32(result);
    }

    public async Task UpdateApplicationStatusAsync(int id, string status)
    {
        await OpenConnectionAsync();
        using var command = new SqlCommand("UPDATE Applications SET Status = @Status WHERE Id = @Id", GetConnection());
        command.Parameters.AddWithValue("@Id", id);
        command.Parameters.AddWithValue("@Status", status);
        await command.ExecuteNonQueryAsync();
    }

    // Dashboard stats
    public async Task<DashboardStats> GetDashboardStatsAsync(int companyId)
    {
        await OpenConnectionAsync();
        var stats = new DashboardStats();

        // Total jobs
        using (var command = new SqlCommand("SELECT COUNT(*) FROM Jobs WHERE CompanyId = @CompanyId", GetConnection()))
        {
            command.Parameters.AddWithValue("@CompanyId", companyId);
            stats.TotalJobs = Convert.ToInt32(await command.ExecuteScalarAsync());
        }

        // Active jobs
        using (var command = new SqlCommand("SELECT COUNT(*) FROM Jobs WHERE CompanyId = @CompanyId AND Status = 'active'", GetConnection()))
        {
            command.Parameters.AddWithValue("@CompanyId", companyId);
            stats.ActiveJobs = Convert.ToInt32(await command.ExecuteScalarAsync());
        }

        // Total applications
        using (var command = new SqlCommand(
            @"SELECT COUNT(*) FROM Applications a
              INNER JOIN Jobs j ON a.JobId = j.Id
              WHERE j.CompanyId = @CompanyId", GetConnection()))
        {
            command.Parameters.AddWithValue("@CompanyId", companyId);
            stats.TotalApplications = Convert.ToInt32(await command.ExecuteScalarAsync());
        }

        // New applications (last 7 days)
        using (var command = new SqlCommand(
            @"SELECT COUNT(*) FROM Applications a
              INNER JOIN Jobs j ON a.JobId = j.Id
              WHERE j.CompanyId = @CompanyId AND a.AppliedAt >= DATEADD(day, -7, GETDATE())", GetConnection()))
        {
            command.Parameters.AddWithValue("@CompanyId", companyId);
            stats.NewApplications = Convert.ToInt32(await command.ExecuteScalarAsync());
        }

        // Hired candidates
        using (var command = new SqlCommand(
            @"SELECT COUNT(*) FROM Applications a
              INNER JOIN Jobs j ON a.JobId = j.Id
              WHERE j.CompanyId = @CompanyId AND a.Status = 'hired'", GetConnection()))
        {
            command.Parameters.AddWithValue("@CompanyId", companyId);
            stats.HiredCandidates = Convert.ToInt32(await command.ExecuteScalarAsync());
        }

        return stats;
    }
}