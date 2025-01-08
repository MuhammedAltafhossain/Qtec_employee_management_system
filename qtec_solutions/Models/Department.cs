using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace qtec_api.Models {
    public class Department {
        public int Id { get; set; }
        public string DepartmentName { get; set; }
        public int? ManagerId { get; set; }
        public decimal Budget { get; set; }

        // Navigation Properties
        public Employee Manager { get; set; }
        public List<Employee> Employees { get; set; }
    }


}
