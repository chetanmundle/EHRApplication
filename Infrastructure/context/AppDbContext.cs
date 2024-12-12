
using App.Core.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Data;


namespace Infrastructure.context
{
    public class AppDbContext : DbContext, IAppDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) 
        {
            
        }

        public DbSet<Employee> Employees { get; set; }

        public IDbConnection GetConnection()
        {
            return this.Database.GetDbConnection();
        }


    }
}
