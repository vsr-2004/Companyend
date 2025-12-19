using Microsoft.AspNetCore.Mvc;
using CompanyEndAPI.Models;
using CompanyEndAPI.Data;

namespace CompanyEndAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JobsController : ControllerBase
{
    private readonly DatabaseContext _dbContext;

    public JobsController(DatabaseContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("company/{companyId}")]
    public async Task<IActionResult> GetJobsByCompany(int companyId)
    {
        try
        {
            var jobs = await _dbContext.GetJobsByCompanyIdAsync(companyId);
            return Ok(jobs);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error retrieving jobs: {ex.Message}");
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetJob(int id)
    {
        try
        {
            var job = await _dbContext.GetJobByIdAsync(id);
            if (job == null)
            {
                return NotFound("Job not found");
            }
            return Ok(job);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error retrieving job: {ex.Message}");
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateJob([FromBody] Job job)
    {
        try
        {
            var jobId = await _dbContext.CreateJobAsync(job);
            var createdJob = await _dbContext.GetJobByIdAsync(jobId);
            return CreatedAtAction(nameof(GetJob), new { id = jobId }, createdJob);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error creating job: {ex.Message}");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateJob(int id, [FromBody] Job job)
    {
        try
        {
            var existingJob = await _dbContext.GetJobByIdAsync(id);
            if (existingJob == null)
            {
                return NotFound("Job not found");
            }

            job.Id = id;
            await _dbContext.UpdateJobAsync(job);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error updating job: {ex.Message}");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteJob(int id)
    {
        try
        {
            var existingJob = await _dbContext.GetJobByIdAsync(id);
            if (existingJob == null)
            {
                return NotFound("Job not found");
            }

            await _dbContext.DeleteJobAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error deleting job: {ex.Message}");
        }
    }
}