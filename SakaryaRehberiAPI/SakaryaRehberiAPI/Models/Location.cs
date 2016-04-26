//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace SakaryaRehberiAPI.Models
{
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public partial class Location
    {
        public Location()
        {
            this.LocationImages = new HashSet<LocationImage>();
            this.UserComments = new HashSet<UserComment>();
            this.UserLikes = new HashSet<UserLike>();
        }
        [Key]

        public int Location_ID { get; set; }
        public double Location_Longtitude { get; set; }
        public double Location_Latitude { get; set; }
        public string Location_Name { get; set; }
        public string Location_Info { get; set; }
        public int LocationType_ID { get; set; }
        public string Location_Banner { get; set; }

        public virtual LocationType LocationType { get; set; }

        public virtual ICollection<LocationImage> LocationImages { get; set; }

        public virtual ICollection<UserComment> UserComments { get; set; }

        public virtual ICollection<UserLike> UserLikes { get; set; }
    }
}
