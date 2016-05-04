using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
namespace SakaryaRehberiAPI.Models
{

    [JsonObject(IsReference = true)] 
    public partial class UserComment
    {

        [Key]

        public int UserComment_ID { get; set; }
        public int User_ID { get; set; }
        public int Location_ID { get; set; }
        public string UserComment_Comment { get; set; }
        public System.DateTime UserComment_Date { get; set; }

        [JsonIgnore]
        public virtual Location Location { get; set; }

        public virtual User User { get; set; }
    }
}
