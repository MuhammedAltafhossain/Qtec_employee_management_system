using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using qtec_api.ModelDto;
using qtec_api.Models;
using qtec_api.Services;
using System.Numerics;

namespace qtec_api.Controllers {
    [ApiController]
    [Route("api/[controller]")]

    public class EmployeesController:ControllerBase {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly EmployeeService _employeeService;

        public EmployeesController(AppDbContext context,IMapper mapper,EmployeeService employeeService)
        {
            _context = context;
            _mapper = mapper;
            _employeeService = employeeService;

        }

        [HttpGet("getAllEmployeeNames")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllEmployeeNames()
        {
            try
            {
                // Retrieve Id and Name of employees
                var employeeData = await _context.Employees
                    .Where(e => e.Status == Status.Active)
                    .Select(e => new { e.Id,e.Name })
                    .ToListAsync( );

                return Ok(new { status = 200,data = employeeData });
            }
            catch (Exception ex)
            {
                // Handle any errors
                return StatusCode(500,new { message = "An error occurred while fetching employee data.",error = ex.Message });
            }
        }



        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Employee>>> SearchEmployees(
            string? name,
            int? departmentId,
            string? position,
            int? minScore,
             int? maxScore,
            int page = 1,
            int pageSize = 10)
        {
            var query = _context.Employees
                .Include(e => e.Department)
                .Include(e => e.PerformanceReviews)
                .Where(e => e.Status == Status.Active);

            if (!string.IsNullOrWhiteSpace(name))
            {
                query = query.Where(e => EF.Functions.Like(e.Name,$"%{name}%"));
            }

            if (departmentId.HasValue)
            {
                query = query.Where(e => e.DepartmentId == departmentId.Value);
            }

            if (!string.IsNullOrWhiteSpace(position))
            {
                query = query.Where(e => e.Position == position);
            }

            if (minScore.HasValue || maxScore.HasValue)
            {
                query = query.Where(e =>
                    e.PerformanceReviews.Any( ) &&
                    (!minScore.HasValue || e.PerformanceReviews.Average(pr => pr.ReviewScore) >= minScore.Value) &&
                    (!maxScore.HasValue || e.PerformanceReviews.Average(pr => pr.ReviewScore) <= maxScore.Value));
            }

            // Calculate the average performance score
            var queryWithScore = query.Select(e => new
            {
                Employee = e,
                AveragePerformanceScore = e.PerformanceReviews.Any( )
                    ? e.PerformanceReviews.Average(pr => pr.ReviewScore)
                    : (double?)null
            });

            // Sort by average performance score descending
            queryWithScore = queryWithScore.OrderByDescending(e => e.Employee.Id);

            // Apply pagination
            var totalItems = await queryWithScore.CountAsync( );
            var employeesWithScores = await queryWithScore
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync( );

            return Ok(new
            {
                Status = 200,
                TotalItems = totalItems,
                Page = page,
                PageSize = pageSize,
                Employees = employeesWithScores.Select(e => new
                {
                    e.Employee.Id,
                    e.Employee.Name,
                    e.Employee.Email,
                    e.Employee.Position,
                    e.Employee.Phone,
                    e.Employee.JoiningDate,
                    DepartmentName = e.Employee.Department?.DepartmentName,
                    DepartmentId = e.Employee.Department?.Id,
                    Budget = e.Employee.Department?.Budget,
                    PerformanceScore = e.AveragePerformanceScore
                })
            });
        }


        [HttpPost]
        public async Task<IActionResult> AddEmployee([FromBody] EmployeeDto employeeDto)
        {
            if (!ModelState.IsValid)
            {
                // Return validation errors as a bad request
                return BadRequest(new
                {
                    message = "Validation failed.",
                    errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                });
            }
            try
            {
                var department = await _context.Departments.FirstOrDefaultAsync(d => d.Id == employeeDto.DepartmentId);
                if (department == null)
                {
                    return StatusCode(400,new { error = "Department not found, Please provide valid Department",});
                }

                await _employeeService.AddEmployeeAsync(
                employeeDto.Name,
                employeeDto.Phone,
                employeeDto.JoiningDate,
                employeeDto.Email,
                employeeDto.Position,
                employeeDto.DepartmentId
            );

                return Ok(new { message = "Employee added successfully." });

            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateEmployee(int id,[FromBody] EmployeeDto employeeDto)
        {
            if (!ModelState.IsValid)
            {
                // Return validation errors as a bad request
                return BadRequest(new
                {
                    message = "Validation failed.",
                    errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                });
            }
            try
            {
                var department = await _context.Departments.FirstOrDefaultAsync(d => d.Id == employeeDto.DepartmentId);
                if (department == null)
                {
                    return StatusCode(400,new { error = "Department not found, Please provide valid Department",});
                }
                await _employeeService.UpdateEmployeeAsync(
                    id,
                    employeeDto.Name,
                    employeeDto.Phone,
                    employeeDto.JoiningDate,
                    employeeDto.Email,
                    employeeDto.Position,
                    employeeDto.DepartmentId
                );

                return Ok(new { message = "Employee update successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(400,new { error = "An error occurred while adding the employee.",details = ex.Message });

            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> SoftDeleteEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null || employee.Status == Status.Inactive)
            {
                return NotFound(new { message = "Employee not found or already deleted." });
            }

            employee.Status = Status.Inactive;
            await _context.SaveChangesAsync( );

            return Ok(new { status = 200,message = "Employee deleted successfully." });
        }

    }



}