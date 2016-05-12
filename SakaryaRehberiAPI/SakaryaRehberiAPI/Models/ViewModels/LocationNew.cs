using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SakaryaRehberiAPI.Models.ViewModels
{
    public class LocationNew
    {
        public int ID { get; set; }
        public double Longtitude { get; set; }
        public double Latitude { get; set; }
        public string Name { get; set; }
        public string Info { get; set; }
        public int  Type_ID { get; set; }
        public string Banner { get; set; }
    }
}