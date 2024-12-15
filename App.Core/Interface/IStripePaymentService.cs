using App.Common.Models;
using App.Core.Models.Stripe;
using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Interface
{
    public interface IStripePaymentService
    {
        Task<AppResponse<PaymentIntent>> CreateStripePayment(Striprequestmodel striprequestmodel);
    }
}
