using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Web;

namespace SakaryaRehberiAPI.Models
{
    public class DBContext:DbContext
    {
        public DBContext() : base("DbContext") { }
        public DbSet<User> Users { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<LocationImage> LocationImages { get; set; }
        public DbSet<LocationType> LocationTypes { get; set; }
        public DbSet<UserComment> UserComments { get; set; }
        public DbSet<UserLike> UserLikes { get; set; }
        public DbSet<UserType> UserTypes { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {

            //modelBuilder.Conventions.ad>();
        }
    }
}