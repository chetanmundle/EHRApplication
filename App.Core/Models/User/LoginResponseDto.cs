using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Models.Users
{
    public class LoginResponseDto
    {
        public int UserId { get; set; }   
        public string Email { get; set; }
        public string UserName { get; set; }
        public string UserTypeName { get; set; }
        public string AccessToken { get; set; }
    }
}
