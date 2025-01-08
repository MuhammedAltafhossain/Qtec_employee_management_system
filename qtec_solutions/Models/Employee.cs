using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace qtec_api.Models {
    public class Employee {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Position { get; set; }
        public DateTime JoiningDate { get; set; }
        public int DepartmentId { get; set; }
        public Status Status { get; set; }

        // Navigation Property
        public Department Department { get; set; }
        public ICollection<PerformanceReview> PerformanceReviews { get; set; }

    }
    public enum Status {
        Active = 1,
        Inactive =0
    }
}
