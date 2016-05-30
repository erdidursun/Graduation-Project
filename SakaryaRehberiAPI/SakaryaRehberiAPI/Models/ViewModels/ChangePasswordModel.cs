using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SakaryaRehberiAPI.Models.ViewModels
{
    public class ChangePasswordModel
    {
        public int UserId { get; set; }
        public string Password { get; set; }
        public string Npassword { get; set; }
        public string Npassword2 { get; set; }
    }
}