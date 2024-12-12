using App.Core.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Interface
{
    public interface IEmailSmtpService
    {
        bool SendEmailOtp(string emailSendTo, string name,string subject, int otp);
        bool SendWlcomeEmail(string emailSendTo, string name,string subject, string username, string password);
        bool SendEmailForConfirmOrder(string emailSendTo, string name,string subject, string username, string body);

        bool SendForgotedPassword(string emailSendTo, string name, string subject, string username, string password);
    }
}
