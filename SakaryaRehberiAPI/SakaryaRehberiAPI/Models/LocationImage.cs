using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
namespace SakaryaRehberiAPI.Models
{
    public  class LocationImage
    {
        [Key]
        public int LocationImage_ID { get; set; }
    
        public int Location_ID { get; set; }

        public string LocationImage_Path { get; set; }

        public string LocationImage_Info { get; set; }
    }
}
