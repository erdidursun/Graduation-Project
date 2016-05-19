using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SakaryaRehberiAPI.Models.ViewModels
{
    public class SocialUser
    {
        public string ProviderName { get; set; }
        public string Mail { get; set; }
        public string Password { get; set; }
        public string ImgPath { get; set; }
        public string Name { get; set; }

    }
}