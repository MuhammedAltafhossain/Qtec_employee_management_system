using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using qtec_api.Services;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

//Cors origine
// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",policy =>
    {
        policy.WithOrigins("http://localhost:5174") // Add your frontend's URL
              .AllowAnyHeader( )
              .AllowAnyMethod( );
    });
});

// Add DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddAutoMapper(typeof(Program));


builder.Services.AddControllers( ).AddNewtonsoftJson( );
builder.Services.AddEndpointsApiExplorer( );
builder.Services.AddSwaggerGen( );
builder.Services.AddScoped<EmployeeService>( );
builder.Services.AddScoped<DepartmentServices>( );

// Add services to the container.



builder.Services.AddControllers( );
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer( );
builder.Services.AddSwaggerGen( );

var app = builder.Build( );
app.UseCors("AllowSpecificOrigin");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment( ))
{
    app.UseSwagger( );
    app.UseSwaggerUI( );
}

app.UseHttpsRedirection( );

app.UseAuthorization( );

app.MapControllers( );

app.Run( );
