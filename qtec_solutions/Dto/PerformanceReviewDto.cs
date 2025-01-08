using qtec_api.Models;
using System.ComponentModel.DataAnnotations;

namespace qtec_api.Dto {
    public class PerformanceReviewDto {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public DateTime ReviewDate { get; set; }
        [Range(1,10,ErrorMessage = "Review Score must be between 1 and 10.")]
        public int ReviewScore { get; set; } // 1-10
        public string ReviewNotes { get; set; }
    }
}
