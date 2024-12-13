using App.Core.Models.User;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Validators.User
{
    internal class CreateProviderDtoValidator : AbstractValidator<CreateProviderDto>
    {
        public CreateProviderDtoValidator()
        {
            RuleFor(x => x.FirstName).NotEmpty().NotNull();
            RuleFor(x => x.LastName).NotEmpty().NotNull();
            RuleFor(x => x.DateOfBirth).NotEmpty().NotNull().LessThanOrEqualTo(DateTime.Now);
            RuleFor(x => x.Email).NotEmpty().NotNull().EmailAddress();
            RuleFor(x => x.PhoneNumber).NotEmpty().NotNull().MaximumLength(15);
            RuleFor(x => x.Gender).NotEmpty().NotNull();
            RuleFor(x => x.BloodGroup).NotEmpty().NotNull();
            RuleFor(x => x.Address).NotEmpty().NotNull().MaximumLength(200);
            RuleFor(x => x.City).NotEmpty().NotNull().MaximumLength(50);
            RuleFor(x => x.StateId).NotEmpty().NotNull();
            RuleFor(x => x.CountryId).NotEmpty().NotNull();
            RuleFor(x => x.ZipCode).NotEmpty().NotNull();
            RuleFor(x => x.Qualification).NotEmpty().NotNull();
            RuleFor(x => x.SpecialisationId).NotEmpty().NotNull();
            RuleFor(x => x.RegistrationNumber).NotEmpty().NotNull();
            RuleFor(x => x.VisitingCharge).NotEmpty().NotNull();
        }
    }
}
