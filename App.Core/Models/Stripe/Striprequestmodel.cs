namespace App.Core.Models.Stripe
{
    public class Striprequestmodel
    {
        public int UserId { get; set; }
        public string SourceToken { get; set; }
        public int Amount { get; set; }
        public string CustomerName { get; set; }
        public string CustomerEmail { get; set; }
    }
}
