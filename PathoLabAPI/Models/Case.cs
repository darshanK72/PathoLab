namespace PathoLabAPI.Models
{
    public class Case
    {
        public string Id { get; set; } = string.Empty;
        public string? PatientId { get; set; }
        public string? PatientName { get; set; }
        public string? Referral { get; set; }
        public string? SampleType { get; set; }
        public string? CollectionDate { get; set; }
        public string? CollectionTime { get; set; }
        public string? Date { get; set; }
        public string? Status { get; set; }
        public string? Tests { get; set; } // Will store JSON
    }
}
