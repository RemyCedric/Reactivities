using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string DisplayName { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [RegularExpression("^([a-zA-Z]{4,8})$", ErrorMessage = "Password must contain between 4 and 8 alphabetical character")]
        public string Password { get; set; }
        public string Username { get; set; }
    }
}