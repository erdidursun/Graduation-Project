namespace SakaryaRehberiAPI.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class tf1 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "User_ImgPath", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Users", "User_ImgPath");
        }
    }
}
