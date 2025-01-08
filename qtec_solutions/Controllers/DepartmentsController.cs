using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using qtec_api.Dto;
using qtec_api.ModelDto;
using qtec_api.Models;
using qtec_api.Services;

namespace qtec_api.Controllers {


    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentsController:ControllerBase {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly DepartmentServices _departmentServices;

        public DepartmentsController(AppDbContext context,IMapper mapper,DepartmentServices departmentServices)
        {
            _context = context;
            _mapper = mapper;
            _departmentServices = departmentServices;
        }

        // Create Department
        [HttpPost]
        public async Task<IActionResult> CreateDepartment([FromBody] DepartmentDto department)
        {

            if (!ModelState.IsValid)
                return StatusCode(400,new { error = "Invalid input data",});

            if (_context.Departments.Any(d => d.DepartmentName == department.DepartmentName))
            {
                return StatusCode(400,new { error = "A department with the same name already exists.",});
            }

            if (department.ManagerId.HasValue)
            {
                var employee = await _context.Employees.FirstOrDefaultAsync(d => d.Id == department.ManagerId);
                if (employee == null)
                {
                    return StatusCode(400,new { error = "Manager not found",});

                }

            }
            else
            {
                department.ManagerId = null;
            }



            var newDepartment = _mapper.Map<Department>(department);

            _context.Departments.Add(newDepartment);
            await _context.SaveChangesAsync( );
            return Ok("Department Added successfully");

        }

        [HttpGet]
        public async Task<IActionResult> GetDepartments(string? search = null,int page = 1,int pageSize = 10)
        {
            var query = _context.Departments
                .Include(d => d.Manager)
                .AsQueryable( );

            // Apply search filter only if 'search' is not null or empty
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(d =>
                    d.DepartmentName.Contains(search) ||
                    (d.Manager != null && d.Manager.Name.Contains(search))
                );
            }

            // Get total count for pagination
            var totalCount = await query.CountAsync( );

            // Apply pagination
            var departments = await query
                .OrderBy(d => d.Id) // Optional: Order by Id or any other field
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(d => new
                {
                    d.Id,
                    d.DepartmentName,
                    d.Budget,
                    Manager = d.Manager == null ? null : new
                    {
                        d.Manager.Id,
                        d.Manager.Name,
                        d.Manager.Email,
                        d.Manager.Position
                    }
                })
                .ToListAsync( );

            // Return paginated data with metadata
            return Ok(new
            {
                status = 200,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                Data = departments
            });
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateDepartment(int id,[FromBody] DepartmentDto department)
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
                // Check if DepartmentName already exists for another department
                var isDuplicateName = await _context.Departments
             .AnyAsync(d => d.DepartmentName == department.DepartmentName && d.Id != id);
                if (isDuplicateName)
                {
                    return BadRequest(new { status = 400,error = "A department with this name already exists." });
                }

                // Fetch the department to update
                var fetchDepartment = await _context.Departments.FirstOrDefaultAsync(d => d.Id == id);
                if (fetchDepartment == null)
                {
                    return NotFound(new { status = 400,error = "Department not found. Please provide a valid department ID." });
                }

                // Validate ManagerId if provided
                if (department.ManagerId.HasValue)
                {
                    var employee = await _context.Employees.FirstOrDefaultAsync(e => e.Id == department.ManagerId);
                    if (employee == null)
                    {
                        return BadRequest(new { status = 200,error = "Manager not found." });
                    }
                }
                else
                {
                    department.ManagerId = null;
                }

                // Update the department properties
                fetchDepartment.DepartmentName = department.DepartmentName;
                fetchDepartment.Budget = department.Budget;
                fetchDepartment.ManagerId = department.ManagerId;

                // Mark the entity as modified
                _context.Entry(fetchDepartment).State = EntityState.Modified;

                // Save changes
                await _context.SaveChangesAsync( );

                return Ok(new { message = "Department updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500,new
                {
                    error = "An error occurred while updating the department.",
                    details = ex.Message
                });
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            try
            {
                var department = await _context.Departments.FindAsync(id);
                if (department == null)
                {
                    return NotFound(new { message = "Department not found or already deleted." });
                }
                _context.Departments.Remove(department);
                await _context.SaveChangesAsync( );

                return Ok(new { status = 200,message = "Department deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500,new
                {
                    error = "An error occurred while updating the department.",
                    details = ex.Message
                });
            }

        }

        [HttpGet("departmentAverage/{id}")]
        public async Task<IActionResult> GetAveragePerformanceScoreByDepartmentId(int id)
        {
            try
            {
                var departmentAverage = await _departmentServices.AveragePerformanceScoreByDepartment(
                       id);
                if (departmentAverage == null)
                {
                    return NotFound(new { message = "Data Not found." });
                }

                return Ok(new { status = 200,data = departmentAverage });
            }
            catch (Exception ex)
            {
                return StatusCode(500,new
                {
                    error = "An error occurred while updating the department.",
                    details = ex.Message
                });
            }

        }
    }
}