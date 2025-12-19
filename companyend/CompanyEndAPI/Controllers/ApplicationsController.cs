using Microsoft.AspNetCore.Mvc;
using CompanyEndAPI.Models;
using CompanyEndAPI.Data;

namespace CompanyEndAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApplicationsController : ControllerBase
{
    private readonly DatabaseContext _dbContext;

    public ApplicationsController(DatabaseContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("job/{jobId}")]
    public async Task<IActionResult> GetApplicationsByJob(int jobId)
    {
        try
        {
            var applications = await _dbContext.GetApplicationsByJobIdAsync(jobId);
            return Ok(applications);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error retrieving applications: {ex.Message}");
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateApplication([FromBody] Application application)
    {
        try
        {
            var applicationId = await _dbContext.CreateApplicationAsync(application);
            return CreatedAtAction(nameof(GetApplicationsByJob), new { jobId = application.JobId }, application);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error creating application: {ex.Message}");
        }
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateApplicationStatus(int id, [FromBody] string status)
    {
        try
        {
            await _dbContext.UpdateApplicationStatusAsync(id, status);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error updating application status: {ex.Message}");
        }
    }
}