using Microsoft.AspNetCore.Mvc;
using CompanyEndAPI.Models;
using CompanyEndAPI.Data;
using BCrypt.Net;

namespace CompanyEndAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly DatabaseContext _dbContext;

    public AuthController(DatabaseContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            // Check if company already exists
            var existingCompany = await _dbContext.GetCompanyByEmailAsync(request.Email);
            if (existingCompany != null)
            {
                return BadRequest(new AuthResponse
                {
                    Success = false,
                    Message = "Company with this email already exists"
                });
            }

            // Hash password
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            // Create new company
            var company = new Company
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = passwordHash,
                Description = request.Description,
                Website = request.Website,
                CreatedAt = DateTime.UtcNow
            };

            var companyId = await _dbContext.CreateCompanyAsync(company);

            // Return success response
            return Ok(new AuthResponse
            {
                Success = true,
                Message = "Company registered successfully",
                Company = await _dbContext.GetCompanyByIdAsync(companyId)
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new AuthResponse
            {
                Success = false,
                Message = $"Registration failed: {ex.Message}"
            });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            // Find company by email
            var company = await _dbContext.GetCompanyByEmailAsync(request.Email);
            if (company == null)
            {
                return Unauthorized(new AuthResponse
                {
                    Success = false,
                    Message = "Invalid email or password"
                });
            }

            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(request.Password, company.PasswordHash))
            {
                return Unauthorized(new AuthResponse
                {
                    Success = false,
                    Message = "Invalid email or password"
                });
            }

            // Return success response (JWT token can be added later)
            return Ok(new AuthResponse
            {
                Success = true,
                Message = "Login successful",
                Company = company
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new AuthResponse
            {
                Success = false,
                Message = $"Login failed: {ex.Message}"
            });
        }
    }
}