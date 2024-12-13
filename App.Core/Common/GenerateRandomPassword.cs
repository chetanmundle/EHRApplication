using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Common
{
    public static class GenerateRandomPassword
    {
        public static string GeneratePassword()
        {

            var random = new Random();
            int length = random.Next(8, 11);

            // Character for getting the values
            const string upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string lowerCase = "abcdefghijklmnopqrstuvwxyz";
            const string numbers = "0123456789";
            const string specialCharacters = "!@#$%&*-=+<>?";

            // Appending the At least one From the Above....
            var password = new StringBuilder();
            password.Append(upperCase[random.Next(upperCase.Length)]);
            password.Append(lowerCase[random.Next(lowerCase.Length)]);
            password.Append(numbers[random.Next(numbers.Length)]);
            password.Append(specialCharacters[random.Next(specialCharacters.Length)]);

            // Fill the rest of the password length with a mix of all characters
            string allCharacters = upperCase + lowerCase + numbers + specialCharacters;
            for (int i = 4; i < length; i++)
            {
                password.Append(allCharacters[random.Next(allCharacters.Length)]);
            }

            // Shuffle the password to ensure randomness
            return new string(password.ToString().OrderBy(_ => random.Next()).ToArray());
        }
    }
}
