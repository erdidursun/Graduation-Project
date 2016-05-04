using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SakaryaRehberiAPI.Models.ViewModels
{
    public class CommentModel
    {
        public int UserId { get; set; }
        public int LocationId { get; set; }
        public string Comment{ get; set; }
    }
}