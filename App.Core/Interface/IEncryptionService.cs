using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Interface
{
    public interface IEncryptionService
    {
        //string Hash(string username);

        string EncryptData(string plainText);

        //string DecryptData(string encryptedData);

        bool VerifyPassword(string password, string hashedPassword);
    }
}
