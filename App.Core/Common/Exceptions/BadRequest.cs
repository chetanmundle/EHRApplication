using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Common.Exceptions
{
    public class BadRequest : Exception
    {
        public BadRequest(string message) : base(message)
        {

        }
    }
}
