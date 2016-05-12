using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SakaryaRehberiAPI.Models.ViewModels
{
    public class RegisterModel
    {
        public string User_Email { get; set; }
        public string User_Password { get; set; }
        public System.DateTime? User_SignUpDate { get; set; }
        public int? UserType_ID { get; set; }
        public string User_Name { get; set; }
    }
}