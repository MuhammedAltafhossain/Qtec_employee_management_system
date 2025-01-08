using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using qtec_api.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace qtec_api.Dto {
    public class DepartmentDto {
        [Key]
        public int Id { get; set; }
        [Required]
        public string DepartmentName { get; set; }

        [ForeignKey("Manager")]
        public int? ManagerId { get; set; }
        public decimal Budget { get; set; }

    }
}
