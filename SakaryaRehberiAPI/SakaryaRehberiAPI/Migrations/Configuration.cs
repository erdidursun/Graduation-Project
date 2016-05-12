namespace SakaryaRehberiAPI.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<SakaryaRehberiAPI.Models.DBContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(SakaryaRehberiAPI.Models.DBContext context)
        {

            context.UserTypes.AddOrUpdate(new Models.UserType() { UserType_ID = 1, UserType_Name = "Kullanýcý" });
            context.UserTypes.AddOrUpdate(new Models.UserType() { UserType_ID = 2, UserType_Name = "Yönetici" });
            context.Users.AddOrUpdate(new Models.User() { User_ID = 1, User_Name = "Erdi Dursun", User_Password = "827ccb0eea8a706c4c34a16891f84e7b", User_Email = "erdidursun09@hotmail.com", UserType_ID = 2, User_SignUpDate = DateTime.Now, User_ImgPath = "Images/UserImages/avatar5.jpg" });
            context.Users.AddOrUpdate(new Models.User() { User_ID = 2, User_Name = "Ozan Ceylan", User_Password = "827ccb0eea8a706c4c34a16891f84e7b", User_Email = "cyln@hotmail.com", UserType_ID = 1, User_SignUpDate = DateTime.Now, User_ImgPath = "Images/UserImages/avatar7.jpg" });
            context.LocationTypes.AddOrUpdate(new Models.LocationType() { LocationType_ID = 1, LocationType_Name = "Tarihi" });
            context.LocationTypes.AddOrUpdate(new Models.LocationType() { LocationType_ID = 2, LocationType_Name = "Doðal Güzellik" });
            context.Locations.AddOrUpdate(new Models.Location() { Location_ID = 1, Location_Name = "Sapanca Gölü", LocationType_ID = 1, Location_Info = "Test", Location_Latitude = 40.7167f, Location_Longtitude = 30.25f, Location_Banner = "Images/locationBannerImages/1.jpg" });
            context.Locations.AddOrUpdate(new Models.Location() { Location_ID = 2, Location_Name = "Poyrazlar Gölü", LocationType_ID = 1, Location_Info = "Test", Location_Latitude = 40.838412f, Location_Longtitude = 30.467250f, Location_Banner = "Images/locationBannerImages/2.jpg" });
            context.LocationImages.AddOrUpdate(new Models.LocationImage() { Location_ID = 1, LocationImage_ID = 1, LocationImage_Info = "Resim 1", LocationImage_Path = "Images/locationImages/1.jpg" });
            context.LocationImages.AddOrUpdate(new Models.LocationImage() { Location_ID = 1, LocationImage_ID = 2, LocationImage_Info = "Resim 2", LocationImage_Path = "Images/locationImages/2.jpg" });
            context.LocationImages.AddOrUpdate(new Models.LocationImage() { Location_ID = 1, LocationImage_ID = 3, LocationImage_Info = "Resim 3", LocationImage_Path = "Images/locationImages/3.jpg" });
            context.LocationImages.AddOrUpdate(new Models.LocationImage() { Location_ID = 1, LocationImage_ID = 4, LocationImage_Info = "Resim 4", LocationImage_Path = "Images/locationImages/4.jpg" });
            context.LocationImages.AddOrUpdate(new Models.LocationImage() { Location_ID = 2, LocationImage_ID = 5, LocationImage_Info = "Resim 1", LocationImage_Path = "Images/locationImages/1.jpg" });
            context.LocationImages.AddOrUpdate(new Models.LocationImage() { Location_ID = 2, LocationImage_ID = 6, LocationImage_Info = "Resim 2", LocationImage_Path = "Images/locationImages/2.jpg" });
            context.LocationImages.AddOrUpdate(new Models.LocationImage() { Location_ID = 2, LocationImage_ID = 7, LocationImage_Info = "Resim 3", LocationImage_Path = "Images/locationImages/3.jpg" });
            context.LocationImages.AddOrUpdate(new Models.LocationImage() { Location_ID = 2, LocationImage_ID = 8, LocationImage_Info = "Resim 4", LocationImage_Path = "Images/locationImages/4.jpg" });

            context.SaveChanges();
        }
    }
}
