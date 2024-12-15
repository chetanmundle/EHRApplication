using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Models.Users
{
    public class ForgetPasswordDto
    {
        public string Email { get; set; }
        public int Otp {  get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
