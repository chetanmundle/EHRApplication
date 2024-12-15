using App.Core.Interface;
using App.Core.Interfaces;
using Infrastructure.context;
using Infrastructure.Repository;
using Infrastructure.service;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;


namespace Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services,
           IConfigurationManager configuration)
        {
            // Bind Database context
            services.AddScoped<IAppDbContext, AppDbContext>();

            // Register the service 
            services.AddScoped<ICountryStateRepository, CountryStateRepository>();
            services.AddScoped<ISpecialisationRepository, SpecialisationRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IStripePaymentService, StripePaymentService>();


            // Register the Jwt Service
            services.AddScoped<IJwtService, JwtService>();

            // Register the Encryption Service 
            services.AddScoped<IEncryptionService, EncryptionService>();

            // Register the Mail SMTP Service
            services.AddScoped<IEmailSmtpService, EmailSmtpService>();
 


            services.AddDbContext<AppDbContext>((provider, options) =>
            {
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                        b => b.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName));
            });

            return services;
        }
    }
}
