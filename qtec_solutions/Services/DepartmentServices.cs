using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using qtec_api.Models.ViewModel;

namespace qtec_api.Services {
    public class DepartmentServices {
        private readonly AppDbContext _context;
        public DepartmentServices(AppDbContext context)
        {
            _context = context;

        }
        public async Task<List<DepartmentScoreModel>> AveragePerformanceScoreByDepartment(int departmentId)
        {
            // SQL query for the stored procedure
            var sql = @"EXEC dbo.AveragePerformanceScoreByDepartment @departmentId";

            // Parameters for the stored procedure
            var parameters = new[]
            {
                new SqlParameter("@DepartmentId", departmentId),

            };

            // Execute the raw SQL query and map results manually
            using var connection = _context.Database.GetDbConnection( );
            await connection.OpenAsync( );


            using var command = connection.CreateCommand( );
            command.CommandText = sql;
            command.Parameters.AddRange(parameters);

            var departmentAverage = new List<DepartmentScoreModel>( );
            using var reader = await command.ExecuteReaderAsync( );
            while (await reader.ReadAsync( ))
            {
                departmentAverage.Add(new DepartmentScoreModel
                {
                    AveragePerformanceScore = reader.GetDouble(reader.GetOrdinal("AveragePerformanceScore")),
                    DepartmentName = reader.GetString(reader.GetOrdinal("DepartmentName")),
                });
            }

            return departmentAverage;
        }
    }
}
