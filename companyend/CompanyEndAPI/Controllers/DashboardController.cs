using Microsoft.AspNetCore.Mvc;
using CompanyEndAPI.Models;
using CompanyEndAPI.Data;

namespace CompanyEndAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly DatabaseContext _dbContext;

    public DashboardController(DatabaseContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("stats/{companyId}")]
    public async Task<IActionResult> GetDashboardStats(int companyId)
    {
        try
        {
            var stats = await _dbContext.GetDashboardStatsAsync(companyId);
            return Ok(stats);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error retrieving dashboard stats: {ex.Message}");
        }
    }
}