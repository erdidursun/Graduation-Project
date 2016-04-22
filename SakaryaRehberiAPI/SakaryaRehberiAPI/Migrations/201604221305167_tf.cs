namespace SakaryaRehberiAPI.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class tf : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Users",
                c => new
                    {
                        User_ID = c.Int(nullable: false, identity: true),
                        User_Email = c.String(),
                        User_Password = c.String(),
                        User_SignUpDate = c.DateTime(nullable: false),
                        UserType_ID = c.Int(nullable: false),
                        User_Name = c.String(),
                    })
                .PrimaryKey(t => t.User_ID)
                .ForeignKey("dbo.UserTypes", t => t.UserType_ID, cascadeDelete: true)
                .Index(t => t.UserType_ID);
            
            CreateTable(
                "dbo.UserTypes",
                c => new
                    {
                        UserType_ID = c.Int(nullable: false, identity: true),
                        UserType_Name = c.String(),
                    })
                .PrimaryKey(t => t.UserType_ID);
            
            CreateTable(
                "dbo.UserComments",
                c => new
                    {
                        UserComment_ID = c.Int(nullable: false, identity: true),
                        User_ID = c.Int(nullable: false),
                        Location_ID = c.Int(nullable: false),
                        UserComment_Comment = c.String(),
                        UserComment_Date = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.UserComment_ID)
                .ForeignKey("dbo.Locations", t => t.Location_ID, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.User_ID, cascadeDelete: true)
                .Index(t => t.Location_ID)
                .Index(t => t.User_ID);
            
            CreateTable(
                "dbo.Locations",
                c => new
                    {
                        Location_ID = c.Int(nullable: false, identity: true),
                        Location_Longtitude = c.Double(nullable: false),
                        Location_Latitude = c.Double(nullable: false),
                        Location_Name = c.String(),
                        Location_Info = c.String(),
                        LocationType_ID = c.Int(nullable: false),
                        Location_Banner = c.String(),
                    })
                .PrimaryKey(t => t.Location_ID)
                .ForeignKey("dbo.LocationTypes", t => t.LocationType_ID, cascadeDelete: true)
                .Index(t => t.LocationType_ID);
            
            CreateTable(
                "dbo.LocationTypes",
                c => new
                    {
                        LocationType_ID = c.Int(nullable: false, identity: true),
                        LocationType_Name = c.String(),
                    })
                .PrimaryKey(t => t.LocationType_ID);
            
            CreateTable(
                "dbo.LocationImages",
                c => new
                    {
                        LocationImage_ID = c.Int(nullable: false, identity: true),
                        Location_ID = c.Int(nullable: false),
                        LocationImage_Path = c.String(),
                        LocationImage_Info = c.String(),
                    })
                .PrimaryKey(t => t.LocationImage_ID)
                .ForeignKey("dbo.Locations", t => t.Location_ID, cascadeDelete: true)
                .Index(t => t.Location_ID);
            
            CreateTable(
                "dbo.UserLikes",
                c => new
                    {
                        UserLike_ID = c.Int(nullable: false, identity: true),
                        User_ID = c.Int(nullable: false),
                        Location_ID = c.Int(nullable: false),
                        UserLike_Date = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.UserLike_ID)
                .ForeignKey("dbo.Locations", t => t.Location_ID, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.User_ID, cascadeDelete: true)
                .Index(t => t.Location_ID)
                .Index(t => t.User_ID);
            
        }
        
        public override void Down()
        {
            DropIndex("dbo.UserLikes", new[] { "User_ID" });
            DropIndex("dbo.UserLikes", new[] { "Location_ID" });
            DropIndex("dbo.LocationImages", new[] { "Location_ID" });
            DropIndex("dbo.Locations", new[] { "LocationType_ID" });
            DropIndex("dbo.UserComments", new[] { "User_ID" });
            DropIndex("dbo.UserComments", new[] { "Location_ID" });
            DropIndex("dbo.Users", new[] { "UserType_ID" });
            DropForeignKey("dbo.UserLikes", "User_ID", "dbo.Users");
            DropForeignKey("dbo.UserLikes", "Location_ID", "dbo.Locations");
            DropForeignKey("dbo.LocationImages", "Location_ID", "dbo.Locations");
            DropForeignKey("dbo.Locations", "LocationType_ID", "dbo.LocationTypes");
            DropForeignKey("dbo.UserComments", "User_ID", "dbo.Users");
            DropForeignKey("dbo.UserComments", "Location_ID", "dbo.Locations");
            DropForeignKey("dbo.Users", "UserType_ID", "dbo.UserTypes");
            DropTable("dbo.UserLikes");
            DropTable("dbo.LocationImages");
            DropTable("dbo.LocationTypes");
            DropTable("dbo.Locations");
            DropTable("dbo.UserComments");
            DropTable("dbo.UserTypes");
            DropTable("dbo.Users");
        }
    }
}
