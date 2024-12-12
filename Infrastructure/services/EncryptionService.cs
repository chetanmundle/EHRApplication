using App.Core.Interface;

namespace Infrastructure.Services
{
    public class EncryptionService : IEncryptionService
    {


        // for dotnet official
        //private readonly IDataProtector _protector;

        //public EncryptionService(IDataProtectionProvider provider)
        //{
        //    _protector = provider.CreateProtector("anythiskeyforprotect");
        //}

        //// Convert plaintext in cipher text
        //public string EncryptData(string plainText)
        //{
        //    return _protector.Protect(plainText);
        //}

        //// Convert Ciphertext into plaintext
        //public string DecryptData(string encryptedData)
        //{
        //    return _protector.Unprotect(encryptedData);
        //}

        // for bycrypt
        public string EncryptData(string plainText)
        {
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(plainText);
            return hashedPassword;
        }

        public bool VerifyPassword(string plainText, string hashedPassword)
        {
            // Verify if the password matches the hashed password
            return BCrypt.Net.BCrypt.Verify(plainText, hashedPassword);
        }

        //for sha25f
        //public string Hash(string username)
        //{
        //    using (var sha256 = SHA256.Create())
        //    {
        //        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(username));
        //        return Convert.ToBase64String(bytes);
        //    }
        //}
    }
}
