namespace PathoLabAPI.Models
{
    public class Patient
    {
        public string Id { get; set; } = string.Empty;
        public string? Designation { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public string? AgeYears { get; set; }
        public string? AgeMonths { get; set; }
        public string? AgeDays { get; set; }
        public string? Gender { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? CollectionDate { get; set; }
        public string? Address { get; set; }
        public string? Referral { get; set; }
        public string? SampleType { get; set; }
        public string? CollectionTime { get; set; }
    }
}
