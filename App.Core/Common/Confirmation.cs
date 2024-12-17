using Domain.Entities;
using static System.Net.Mime.MediaTypeNames;

namespace App.Core.Common
{
    public static class Confirmation
    {
        static public string AppointmentConfirmationBody(string patientName, string providerName, string appointmentDate, string appointmentTime)
        {
            string body = $@" 
<!DOCTYPE html>
<html lang=""en"">

<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>EHR_Application - Appointment Confirmation</title>
</head>

<body style=""font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f9;"">
    <div style=""width: 100%; max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);"">
        <div style=""text-align: center; margin-bottom: 20px;"">
            <h1 style=""color: #2c3e50;"">EHR_Application</h1>
            <p style=""color: #7f8c8d; font-size: 16px;"">Appointment Confirmation</p>
        </div>

        <div style=""font-size: 16px; color: #34495e; margin-bottom: 20px;"">
            <p style=""color: #2c3e50; font-weight: bold;"">Patient Name: <span style=""font-weight: normal;"">{patientName}</span></p>
            <p style=""color: #34495e; padding: 5px 0;""><strong>Provider Name:</strong> {providerName}</p>
            <p style=""color: #34495e; padding: 5px 0;""><strong>Appointment Date:</strong> {appointmentDate}</p>
            <p style=""color: #34495e; padding: 5px 0;""><strong>Appointment Time:</strong> {appointmentTime}</p>
        </div>

        <div style=""text-align: center; margin-top: 20px;"">
            <a href=""#"" style=""background-color: #3498db; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;"">Confirm Appointment</a>
        </div>
    </div>
</body>

</html>
";
            return body;
        }


        public static string AppointmentCancellationBody(string appointmentDate, string appointmentTime)
        {
            string body = $@"
<!DOCTYPE html>
<html lang=""en"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>EHR_Application - Appointment Cancellation</title>
</head>
<body style=""font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f9;"">
    <div style=""width: 100%; max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);"">
        <div style=""text-align: center; margin-bottom: 20px;"">
            <h1 style=""color: #2c3e50;"">EHR_Application</h1>
            <p style=""color: #7f8c8d; font-size: 16px;"">Appointment Cancellation Mail</p>
        </div>

        <div style=""font-size: 16px; color: #34495e; margin-bottom: 20px;"">
            <p style=""color: #34495e; padding: 5px 0;""> appointment is Cancelled. Below are the details of your scheduled appointment:</p>

            <p style=""color: #34495e; padding: 5px 0;""><strong>Appointment Date:</strong> {appointmentDate}</p>
            <p style=""color: #34495e; padding: 5px 0;""><strong>Appointment Time:</strong> {appointmentTime}</p>
           
        </div>

       

       
    </ div >
</ body >
</ html >
";
            return body;
        }
    }
}
