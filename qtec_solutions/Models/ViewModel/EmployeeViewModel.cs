namespace qtec_api.Models.ViewModel {
    public class EmployeeViewModel {
        public int id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Position { get; set; }
        public string Phone { get; set; }
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public decimal Budget { get; set; }
        public int PerformanceScore { get; set; }

    }
}
