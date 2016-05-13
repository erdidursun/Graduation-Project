using SakaryaRehberiAPI.Models;
using SakaryaRehberiAPI.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;


namespace SakaryaRehberiAPI.Controllers
{

    [AllowAnonymous]
    public class APIController : ApiController
    {

        DBContext _db = new DBContext();



        #region User


        public HttpResponseMessage getTranslate(string text)
        {
            string from = "tr";
            string to = "en";
            String key = "trnsl.1.1.20160404T133544Z.118307a783fa4264.b8bb47bd147e5440f61f898c192922f3e47b93a2";
            String uri = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=" + key + "&text=" + text + "&lang=" + from + "-" + to + "&format=text";
            WebClient c = new WebClient();
            var json = c.DownloadString(uri);
            return Request.CreateResponse(HttpStatusCode.OK, json);
        }
        [HttpPost]
        public async Task<HttpResponseMessage> Login(LoginModel model)
        {
            var user = _db.Users.FirstOrDefault(u => u.User_Email == model.Username && u.User_Password == model.Password);
            if (user != null)
                return Request.CreateResponse(HttpStatusCode.OK,
                    new
                    {
                        ID = user.User_ID,
                        Email = user.User_Email,
                        Type_ID = user.UserType_ID,
                        ImgPath = user.User_ImgPath,
                        Name = user.User_Name
                    });
            else
                return Request.CreateResponse(HttpStatusCode.BadRequest, "credential error");


        }
        [HttpPost]

        public HttpResponseMessage Register(RegisterModel model)
        {

            User _user = new User();

            _user.User_Email = model.User_Email;
            _user.User_Name = model.User_Name;
            _user.User_Password = model.User_Password;
            _user.User_SignUpDate = DateTime.Now;
            _user.UserType_ID = model.UserType_ID.Value;

            _db.Users.Add(_user);
            _db.SaveChanges();
            var data = new
            {
                ID = _user.User_ID,
                Email = _user.User_Email,
                SignUpDate = _user.User_SignUpDate,
                Type_ID = _user.UserType_ID,
                ImgPath = _user.User_ImgPath,
                Name = _user.User_Name,
                LikeCount = _user.UserLikes.Count,
                CommentCount = _user.UserComments.Count

            };
            return Request.CreateResponse(HttpStatusCode.OK, data);
        }
        [HttpGet]

        public HttpResponseMessage Register()
        {
            return Request.CreateResponse(HttpStatusCode.OK, "anan");
        }
       

        [HttpGet]
        public HttpResponseMessage GetUsers(int count = 100)
        {
            var user = from u in _db.Users
                       select new
                       {
                           ID = u.User_ID,
                           Email = u.User_Email,
                           SignUpDate = u.User_SignUpDate,
                           Type_ID = u.UserType_ID,
                           Type_Name = u.UserType.UserType_Name,
                           ImgPath = u.User_ImgPath,
                           Name = u.User_Name,
                           LikeCount = u.UserLikes.Count,
                           CommentCount = u.UserComments.Count
                       };


            return Request.CreateResponse(HttpStatusCode.OK, user);
        }

        [HttpGet]
        public HttpResponseMessage DeleteUser(int UserID)
        {
            var user = _db.Users.Where(u => u.User_ID == UserID).FirstOrDefault();
            if (user != null)
            {
                _db.Entry(user).State = System.Data.Entity.EntityState.Deleted;
                _db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, "success");

            }
            return Request.CreateResponse(HttpStatusCode.Forbidden, "fail");

        }

        public HttpResponseMessage GetUserTypes()
        {
            return Request.CreateResponse(HttpStatusCode.OK, _db.UserTypes.ToList());

        }

        public HttpResponseMessage UpdateUser(User user, int UserID)
        {
            var olduser =_db.Users.Where(u => u.User_ID == UserID).FirstOrDefault();
            if (olduser != null)
            {
                olduser.User_Email = user.User_Email;
                olduser.User_ImgPath = user.User_ImgPath;
                olduser.User_Name = user.User_Name;

                _db.Users.Add(olduser);
                _db.SaveChanges();
           
            return Request.CreateResponse(HttpStatusCode.OK, "");
            }
            return Request.CreateResponse(HttpStatusCode.Forbidden, "fail");

        }

        #endregion

        #region location

        [HttpPost]
        [AllowAnonymous]
        public async Task<HttpResponseMessage> Upload(int locationID, bool isBanner = false)
        {
            if (!Request.Content.IsMimeMultipartContent())
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);

            var provider = new MultipartMemoryStreamProvider();
            await Request.Content.ReadAsMultipartAsync(provider);
            var location = _db.Locations.FirstOrDefault(u => u.Location_ID == locationID);
            if (location == null)
                return Request.CreateResponse(HttpStatusCode.Forbidden, locationID);
            string DirName = "LocationImages";
            if (isBanner)
                DirName = "LocationBannerImages";
            string path = "";
            foreach (var file in provider.Contents)
            {
                var ext = Path.GetExtension(file.Headers.ContentDisposition.FileName.Trim('\"'));
                var filename = Path.GetRandomFileName().Split('.').First() + ext;
                var buffer = await file.ReadAsByteArrayAsync();
                path = Path.Combine(HttpRuntime.AppDomainAppPath, "Images", DirName, filename);
                File.WriteAllBytes(path, buffer);
                if (!isBanner)
                    _db.LocationImages.Add(new LocationImage() { Location_ID = locationID, LocationImage_Path = Path.Combine("Images", DirName, filename) });
                else
                    location.Location_Banner = Path.Combine("Images", DirName, filename);

                _db.SaveChanges();
            }

            return Request.CreateResponse(HttpStatusCode.OK,"fotoğraf yüklendi");

        }

        [HttpPost]
        public HttpResponseMessage AddLocation(LocationNew loc)
        {
            Location _loc = new Location();
            _loc.Location_Banner = loc.Banner;
            _loc.Location_Info = loc.Info;
            _loc.Location_Name = loc.Name;
            _loc.Location_Latitude = loc.Latitude;
            _loc.Location_Longtitude = loc.Longtitude;
            if (loc.Images != null)
            {
                foreach (var item in loc.Images)
                {
                    _loc.LocationImages.Add(item);
                }
            }
            _loc.LocationType_ID = loc.Type_ID;
            _db.Locations.Add(_loc);
            _db.SaveChanges();
            return Request.CreateResponse(HttpStatusCode.OK, getLocationInfo(_loc.Location_ID));
        }


        public object getLocationInfo(int id, int count = 1)
        {
            var list = (from location in _db.Locations
                        where location.Location_ID == id || id == -1
                        select new
                        {
                            Images = from i in location.LocationImages
                                     select new
                                         {

                                             Image_ID = i.Location_ID,
                                             Info = i.LocationImage_Info,
                                             Path = i.LocationImage_Path
                                         },
                            Comments = from c in location.UserComments
                                       select new
                                       {

                                           UserName = c.User.User_Name,
                                           UserImgPath = c.User.User_ImgPath,
                                           Date = c.UserComment_Date,
                                           Comment = c.UserComment_Comment
                                       },
                            ID = location.Location_ID,
                            Banner = location.Location_Banner,
                            Name = location.Location_Name,
                            Info = location.Location_Info,
                            TypeId = location.LocationType_ID,
                            ImageCount = location.LocationImages.Count,
                            Latitude = location.Location_Latitude,
                            Longtitude = location.Location_Longtitude,
                            TypeName = location.LocationType.LocationType_Name,
                            CommentCount = location.UserComments.Count,
                            LikeCount = location.UserLikes.Count
                        }).Take(count);
            return list;

        }


        public HttpResponseMessage GetLocations(int page = 1)
        {
            var list = getLocationInfo(-1, page * 90);
            return Request.CreateResponse(HttpStatusCode.OK, list);
        }

        public HttpResponseMessage GetLocationById(int id)
        {

            var list = getLocationInfo(id);
            if (list != null)
            {

                return Request.CreateResponse(HttpStatusCode.OK, list
                    );
            }
            else
                return Request.CreateResponse(HttpStatusCode.NoContent, "");

        }

        public HttpResponseMessage GetLocationTypes()
        {
            return Request.CreateResponse(HttpStatusCode.OK, _db.LocationTypes.ToList());
        }


        [HttpPost]
        public HttpResponseMessage SendComment(CommentModel comment)
        {
            var Comment = new UserComment() { Location_ID = comment.LocationId, User_ID = comment.UserId, UserComment_Comment = comment.Comment, UserComment_Date = DateTime.Now };
            _db.UserComments.Add(Comment);
            _db.SaveChanges();
            return Request.CreateResponse(HttpStatusCode.OK, Comment);
        }

        [HttpGet]
        public HttpResponseMessage DeleteLocation(int LocationID)
        {
            var location = _db.Locations.Where(u => u.Location_ID == LocationID).FirstOrDefault();
            if (location != null)
            {
                _db.Entry(location).State = System.Data.Entity.EntityState.Deleted;
                _db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, "success");

            }
            return Request.CreateResponse(HttpStatusCode.Forbidden, "fail");

        }

        #endregion


    }

}
