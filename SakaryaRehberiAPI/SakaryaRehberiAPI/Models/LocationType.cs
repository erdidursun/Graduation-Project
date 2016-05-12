using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SakaryaRehberiAPI.Models
{


    public partial class LocationType
    {
        public LocationType()
        {
        }
        [Key]

        public int LocationType_ID { get; set; }
        public string LocationType_Name { get; set; }

    }
}
