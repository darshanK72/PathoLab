namespace PathoLabAPI.Models
{
    public class TestsMaster
    {
        public string Id { get; set; } = string.Empty;
        public string TestName { get; set; } = string.Empty;
        public int? Price { get; set; }
        public string? Department { get; set; }
        public string? Parameters { get; set; } // JSON
        public string? Columns { get; set; } // JSON
        public string? Interpretation { get; set; }
    }
}
