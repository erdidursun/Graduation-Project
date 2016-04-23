using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
namespace SakaryaRehberiAPI.Models
{

    public class User
    {
        public User()
        {
            this.UserComments = new HashSet<UserComment>();
            this.UserLikes = new HashSet<UserLike>();
        }
        [Key]
        public int User_ID { get; set; }
        public string User_Email { get; set; }
        public string User_Password { get; set; }
        public System.DateTime User_SignUpDate { get; set; }
        public int UserType_ID { get; set; }
        public string User_Name { get; set; }

        public string User_ImgPath { get; set; }

        [JsonIgnore]
        public virtual UserType UserType { get; set; }
        [JsonIgnore]
        public virtual ICollection<UserComment> UserComments { get; set; }
        [JsonIgnore]

        public virtual ICollection<UserLike> UserLikes { get; set; }
    }
}
