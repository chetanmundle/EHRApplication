using App.Core.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using App.Core.Common;
using Domain.Entities;

namespace Infrastructure.service
{
    public class EmailSmtpService : IEmailSmtpService
    {
        // Hardcoded SMTP configuration
        private string smtpHost = "smtp.gmail.com"; // Change to your SMTP host
        private int smtpPort = 587;                // Change to your SMTP port
        private string smtpUsername = "chetanmundlesd@gmail.com"; // Your email address
        private string smtpPassword = "wiiryglqlkmovzew"; // Your email password
        private bool enableSsl = true;             // Set to true if your SMTP requires SSL
        private bool isHtml = true;
        public bool SendEmailOtp(string emailSendTo, string name, string subject, int otp)
        {

            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                Credentials = new NetworkCredential(smtpUsername, smtpPassword),
                EnableSsl = enableSsl
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(smtpUsername, "ECom_Application"),
                Subject = subject,
                Body = $@"<div style=""font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2"">
  <div style=""margin:50px auto;width:70%;padding:20px 0"">
    <div style=""border-bottom:1px solid #eee"">
      <a href="""" style=""font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600"">ECom_Application</a>
    </div>
    <p style=""font-size:1.1em"">Hi,</p>
    <p>Thank you for choosing Us. Use the following OTP. OTP is valid for 5 minutes</p>
    <h2 style=""background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;"">

{otp}

</h2>
    <p style=""font-size:0.9em;"">Regards,<br />Your Brand</p>
    <hr style=""border:none;border-top:1px solid #eee"" />
    <div style=""float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300"">
      <p>ECom_Application</p>
      <p>1600 Amphitheatre Parkway</p>
      <p>California</p>
    </div>
  </div>
</div>",
                IsBodyHtml = isHtml
            };

            mailMessage.To.Add(emailSendTo);

            client.Send(mailMessage);
            return true;

        }



        public bool SendWlcomeEmail(string emailSendTo, string name, string subject, string username, string password)
        {
            //// Hardcoded SMTP configuration
            //string smtpHost = "smtp.gmail.com"; // Change to your SMTP host
            //int smtpPort = 587;                // Change to your SMTP port
            //string smtpUsername = "chetanmundlesd@gmail.com"; // Your email address
            //string smtpPassword = "wiiryglqlkmovzew"; // Your email password
            //bool enableSsl = true;             // Set to true if your SMTP requires SSL
            //bool isHtml = true;

            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                Credentials = new NetworkCredential(smtpUsername, smtpPassword),
                EnableSsl = enableSsl
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(smtpUsername, "ECom_Application"),
                Subject = subject,
                Body = $@"
<div style=""font-family: Helvetica, Arial, sans-serif; min-width: 320px; max-width: 600px; margin: 0 auto; padding: 20px; box-sizing: border-box; overflow: auto; line-height: 1.5;"">
  <div style=""padding: 5px; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);"">
    <div style=""border-bottom: 1px solid #eee; text-align: center;"">
      <a href=""#"" style=""font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600;"">Ecom_Application</a>
    </div>
    <p style=""font-size: 1.1em; text-align: left;"">Hi,</p>
    <p style=""text-align: left;"">Thank you for choosing Ecom Application. Use the following credentials to log in:</p>
    <div style=""margin: 20px auto; text-align: center;"">
      <h5 style=""background: #00466a; margin: 5px auto; padding: 5px; color: #fff; border-radius: 4px; max-width: 80%; word-wrap: break-word;"">
        Email: <span style=""color: #fff;"">{emailSendTo}</span>
      </h5>
      <h5 style=""background: #00466a; margin: 5px auto; padding: 5px; color: #fff; border-radius: 4px; max-width: 80%; word-wrap: break-word;"">
        Username: <span style=""color: #fff;"">{username}</span>
      </h5>
      <h5 style=""background: #00466a; margin: 5px auto; padding: 5px; color: #fff; border-radius: 4px; max-width: 80%; word-wrap: break-word;"">
        Password: <span style=""color: #fff;"">{password}</span>
      </h5>
    </div>
    <p style=""font-size: 0.9em; text-align: left;"">Regards,<br />Ecom Application</p>
    <hr style=""border: none; border-top: 1px solid #eee;"" />
    <div style=""text-align: right; padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1.2; font-weight: 300;"">
      <p>Ecom_Application</p>
      <p>1600 Amphitheatre Parkway</p>
      <p>California</p>
    </div>
  </div>
</div>

",
                IsBodyHtml = isHtml
            };

            mailMessage.To.Add(emailSendTo);

            client.Send(mailMessage);
            return true;
        }

        public bool SendForgotedPassword(string emailSendTo, string name, string subject, string username, string password)
        {
            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                Credentials = new NetworkCredential(smtpUsername, smtpPassword),
                EnableSsl = enableSsl
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(smtpUsername, "ECom_Application"),
                Subject = subject,
                Body = $@"
<div style=""font-family: Helvetica, Arial, sans-serif; min-width: 320px; max-width: 600px; margin: 0 auto; padding: 20px; box-sizing: border-box; overflow: auto; line-height: 1.5;"">
  <div style=""padding: 5px; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);"">
    <div style=""border-bottom: 1px solid #eee; text-align: center;"">
      <a href=""#"" style=""font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600;"">Ecom_Application</a>
    </div>
    <p style=""font-size: 1.1em; text-align: left;"">Hi,</p>
    <p style=""text-align: left;"">Thank you for choosing Ecom Application. Use the following credentials to Forget Password:</p>
    <div style=""margin: 20px auto; text-align: center;"">
      <h5 style=""background: #00466a; margin: 5px auto; padding: 5px; color: #fff; border-radius: 4px; max-width: 80%; word-wrap: break-word;"">
        Email: <span style=""color: #fff;"">{emailSendTo}</span>
      </h5>
      <h5 style=""background: #00466a; margin: 5px auto; padding: 5px; color: #fff; border-radius: 4px; max-width: 80%; word-wrap: break-word;"">
        Username: <span style=""color: #fff;"">{username}</span>
      </h5>
      <h5 style=""background: #00466a; margin: 5px auto; padding: 5px; color: #fff; border-radius: 4px; max-width: 80%; word-wrap: break-word;"">
        Password: <span style=""color: #fff;"">{password}</span>
      </h5>
    </div>
    <p style=""font-size: 0.9em; text-align: left;"">Regards,<br />Ecom Application</p>
    <hr style=""border: none; border-top: 1px solid #eee;"" />
    <div style=""text-align: right; padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1.2; font-weight: 300;"">
      <p>Ecom_Application</p>
      <p>1600 Amphitheatre Parkway</p>
      <p>California</p>
    </div>
  </div>
</div>

",
                IsBodyHtml = isHtml
            };

            mailMessage.To.Add(emailSendTo);

            client.Send(mailMessage);
            return true;
        }



        public bool SendEmailForConfirmOrder(string emailSendTo, string name, string subject, string username, string bodyData)
        {
            //// Hardcoded SMTP configuration
            //string smtpHost = "smtp.gmail.com"; // Change to your SMTP host
            //int smtpPort = 587;                // Change to your SMTP port
            //string smtpUsername = "chetanmundlesd@gmail.com"; // Your email address
            //string smtpPassword = "wiiryglqlkmovzew"; // Your email password
            //bool enableSsl = true;             // Set to true if your SMTP requires SSL
            //bool isHtml = true;

            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                Credentials = new NetworkCredential(smtpUsername, smtpPassword),
                EnableSsl = enableSsl
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(smtpUsername, "ECom_Application"),
                Subject = subject,
                Body =bodyData,
                IsBodyHtml = isHtml
            };

            mailMessage.To.Add(emailSendTo);

            client.Send(mailMessage);
            return true;
        }

    }
}