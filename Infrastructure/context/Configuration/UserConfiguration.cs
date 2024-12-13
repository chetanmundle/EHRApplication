using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.context.Configuration
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(u => u.UserId);
            builder.HasAlternateKey(u=> u.UserName);
            builder.Property(u  => u.FirstName).HasMaxLength(100).IsRequired();
            builder.Property(u  => u.LastName).HasMaxLength(100).IsRequired();
            builder.Property(u  => u.Email).HasMaxLength(100).IsRequired();
            builder.Property(u  => u.PhoneNumber).HasMaxLength(15).IsRequired();
            builder.Property(u  => u.Address).HasMaxLength(150).IsRequired();
            builder.Property(u  => u.City).HasMaxLength(100).IsRequired();

        }

     
    }
}
