namespace SakaryaRehberiAPI.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class user_social : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "SocialID", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Users", "SocialID");
        }
    }
}
