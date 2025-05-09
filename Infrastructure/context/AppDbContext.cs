﻿
using App.Core.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Reflection;


namespace Infrastructure.context
{
    public class AppDbContext : DbContext, IAppDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) 
        {
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            base.OnModelCreating(modelBuilder);
        }

        //public DbSet<Employee> Employees { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<State> States { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<SOAPNotes> SOAPNotes { get; set; }
        public DbSet<Specialisation> Specialisation { get; set; }
        public DbSet<UserType> UserTypes { get; set; }

        public DbSet<Otp> Otps { get; set; }



        public IDbConnection GetConnection()
        {
            return this.Database.GetDbConnection();
        }


    }
}
