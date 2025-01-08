using AutoMapper;
using Azure.Core.Serialization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using qtec_api.Dto;
using qtec_api.Models;

namespace qtec_api.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class PerformanceReviewsController:ControllerBase {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public PerformanceReviewsController(AppDbContext context,IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // Create Performance Review
        [HttpPost]
        public async Task<IActionResult> CreateReview([FromBody] PerformanceReviewDto review)
        {
            if (!ModelState.IsValid)
                return StatusCode(400,new { error = "Invalid input data",});


            var employee = await _context.Employees.FirstOrDefaultAsync(d => d.Id == review.EmployeeId && d.Status == Status.Active);
            if (employee == null)
            {
                return StatusCode(400,new { error = "Employee not found",});

            }

            var newReview = _mapper.Map<PerformanceReview>(review);
            _context.PerformanceReviews.Add(newReview);
            await _context.SaveChangesAsync( );
            return Ok("Performance Review Added successfully");
        }

        // Get Performance Reviews by Employee
        [HttpGet("employee/{employeeId}")]
        public async Task<IActionResult> GetReviewsByEmployee(int employeeId)
        {
            var reviews = await _context.PerformanceReviews
                .Where(r => r.EmployeeId == employeeId)
                .ToListAsync( );

            return Ok(reviews);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdatePerformanceReview(int id,[FromBody] PerformanceReviewDto performanceReview)
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
               

                // Fetch the review to update
                var fetchReview = await _context.PerformanceReviews.FirstOrDefaultAsync(d => d.Id == id);
                if (fetchReview == null)
                {
                    return NotFound(new { status = 400,error = "Review not found. Please provide a valid review ID." });
                }



                // Update the Review properties
                fetchReview.EmployeeId = performanceReview.EmployeeId;
                fetchReview.ReviewDate = performanceReview.ReviewDate;
                fetchReview.ReviewNotes = performanceReview.ReviewNotes;
                fetchReview.ReviewScore = performanceReview.ReviewScore;
                // Mark the entity as modified
                _context.Entry(fetchReview).State = EntityState.Modified;

                // Save changes
                await _context.SaveChangesAsync( );

                return Ok(new { message = "Review updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500,new
                {
                    error = "An error occurred while updating the Review.",
                    details = ex.Message
                });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetPerformanceReview(string? search = null,int page = 1,int pageSize = 10)
        {
            var query = _context.PerformanceReviews
                .Include(d => d.Employee)
                .AsQueryable( );

            // Apply search filter only if 'search' is not null or empty
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(d =>
                    d.Employee.Name.Contains(search)
                );
            }

            // Apply consistent ordering (Order by Id descending)
            query = query.OrderByDescending(d => d.Id);

            // Get total count for pagination
            var totalCount = await query.CountAsync( );

            // Apply pagination
            var performanceReview = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(d => new
                {
                    d.Id,
                    d.EmployeeId,
                    d.Employee.Name,
                    d.ReviewDate,
                    d.ReviewScore,
                    d.ReviewNotes
                })
                .ToListAsync( );

            // Return paginated data with metadata
            return Ok(new
            {
                status = 200,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                Data = performanceReview
            });
        
    }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePreformanceReview(int id)
        {
            var review = await _context.PerformanceReviews.FindAsync(id);
            if (review == null)
            {
                return NotFound(new { message = "Review not found or already deleted." });
            }
            _context.PerformanceReviews.Remove(review);
            await _context.SaveChangesAsync( );

            return Ok(new { status = 200,message = "Review deleted successfully." });
        }
    }

}
