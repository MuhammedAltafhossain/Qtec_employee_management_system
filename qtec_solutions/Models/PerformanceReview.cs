using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace qtec_api.Models {
    public class PerformanceReview {
        public int Id { get; set; }
        [Required]
        public int EmployeeId { get; set; }
        public DateTime ReviewDate { get; set; }
        [Range(1,10,ErrorMessage = "Review Score must be between 1 and 10.")]
        public int ReviewScore { get; set; } // 1-10
        public string ReviewNotes { get; set; }

        // Navigation Property
        public Employee Employee { get; set; }
    }
}
