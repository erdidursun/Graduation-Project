using SakaryaRehberiAPI.Models;
using SakaryaRehberiAPI.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;


namespace SakaryaRehberiAPI.Controllers
{

    [AllowAnonymous]
    public class APIController : ApiController
    {

        DBContext _db = new DBContext();

        #region utilities
        private static string ComputeHash(string hashedPassword, string message)
        {

            var key = Encoding.UTF8.GetBytes(hashedPassword.ToUpper());
            string hashString;

            using (var hmac = new HMACSHA256(key))
            {
                var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(message));
                hashString = Convert.ToBase64String(hash);
            }

            return hashString;
        }

        #endregion

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
            if(user!=null)
              return Request.CreateResponse(HttpStatusCode.OK, 
                  new {
                      ID = user.User_ID ,
                      Email=user.User_Email,
                      Type_ID=user.UserType_ID,
                      ImgPath = user.User_ImgPath,
                      Name=user.User_Name
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
        #endregion


        [HttpPost]
        public async Task<HttpResponseMessage> Upload(int locationID)
        {
            if (!Request.Content.IsMimeMultipartContent())
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);

            var provider = new MultipartMemoryStreamProvider();
            await Request.Content.ReadAsMultipartAsync(provider);
            foreach (var file in provider.Contents)
            {
                var filename = file.Headers.ContentDisposition.FileName.Trim('\"');
                var buffer = await file.ReadAsByteArrayAsync();
                //Do whatever you want with filename and its binaray data.
                string path = Path.Combine(HttpRuntime.AppDomainAppPath, "Images", "LocationImages", filename);
                File.WriteAllBytes(path, buffer);
                _db.LocationImages.Add(new LocationImage() { Location_ID = locationID, LocationImage_Path = Path.Combine("Images", "LocationImages", filename) });
                _db.SaveChanges();
            }

            return Request.CreateResponse(HttpStatusCode.Created);

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
            return Request.CreateResponse(HttpStatusCode.OK, _loc);
        }


        public HttpResponseMessage GetLocations(int page)
        {
            var list = from l in _db.Locations
                       select new
                       {
                           ID = l.Location_ID,
                           Banner = l.Location_Banner,
                           Name = l.Location_Name,
                           Info = l.Location_Info,
                           TypeId = l.LocationType_ID,
                           ImageCount = l.LocationImages.Count,
                           Latitude = l.Location_Latitude,
                           Longtitude = l.Location_Latitude,
                           TypeName = l.LocationType.LocationType_Name,
                           CommentCount = l.UserComments.Count,
                           LikeCount = l.UserLikes.Count
                       };

            return Request.CreateResponse(HttpStatusCode.OK, list);
        }

        public HttpResponseMessage GetLocationById(int id)
        {
            var list = _db.Locations.Where(p => p.Location_ID == id).FirstOrDefault();
            if (list != null)
            {
                list.UserComments = list.UserComments.OrderBy(p => p.UserComment_Date).ToList(); ;
                return Request.CreateResponse(HttpStatusCode.OK, list);
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


        public HttpResponseMessage GetUserTypes()
        {
            return Request.CreateResponse(HttpStatusCode.OK, _db.UserTypes.ToList());

        }




    }

}
