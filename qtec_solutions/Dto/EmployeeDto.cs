using qtec_api.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace qtec_api.ModelDto {
    public class EmployeeDto {
        [Required(ErrorMessage = "The Name field is required.")]
        public string Name { get; set; }
        [Required(ErrorMessage = "The Phone field is required.")]
        [MinLength(11,ErrorMessage = "Phone number must be at least 11 characters long.")]
        [MaxLength(11,ErrorMessage = "Phone number must be at most 11 characters long.")]
        [RegularExpression(@"^\d{11}$",ErrorMessage = "Phone number must only contain 11 digits.")]
        public string Phone { get; set; }
        [Required(ErrorMessage = "The JoiningDate field is required.")]
        public DateTime JoiningDate { get; set; }
        [Required(ErrorMessage = "The Email field is required.")]
        [EmailAddress]
        public string Email { get; set; }
        [Required(ErrorMessage = "The Position field is required.")]
        public string Position { get; set; }
        [Required(ErrorMessage = "The DepartmentId field is required.")]
        [Range(1,int.MaxValue,ErrorMessage = "DepartmentId must be greater than 0.")]
        public int DepartmentId { get; set; }
    }
}
