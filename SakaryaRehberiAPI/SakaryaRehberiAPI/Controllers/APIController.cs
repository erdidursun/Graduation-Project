using Newtonsoft.Json;
using SakaryaRehberiAPI.Models;
using SakaryaRehberiAPI.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Core.Objects.DataClasses;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Helpers;
using System.Web.Http;


namespace SakaryaRehberiAPI.Controllers
{

    [AllowAnonymous]
    public class APIController : ApiController
    {

        Coordinat coord = new Coordinat() { Latitude = -1, Longtitude = -1 };

        DBContext _db = new DBContext();


        #region helpers
        private object getUsers(ICollection<User> users)
        {
            var hostName = GetHostName();

            var Users = from u in users
                        select new
                        {

                            ID = u.User_ID,
                            Email = u.User_Email,
                            SignUpDate = u.User_SignUpDate,
                            Type_ID = u.UserType_ID,
                            Type_Name = u.UserType != null ? u.UserType.UserType_Name : "",
                            ImgPath = u.User_ImgPath.StartsWith("http") ? u.User_ImgPath : Path.Combine(hostName, u.User_ImgPath),
                            Name = u.User_Name,
                            LikeCount = u.UserLikes.Count,
                            CommentCount = u.UserComments.Count
                        };
            return Users.OrderBy(p => p.SignUpDate);
        }
        public string GetHostName()
        {
            return Request.RequestUri.Scheme + "://" + Request.RequestUri.Authority;

        }
        private object getComments(ICollection<UserComment> comments)
        {
            var hostName = GetHostName();
            int addTime = 0;
            if (hostName == "http://tommycarter-001-site1.itempurl.com" || hostName == "http://tommycarter-001-site1.itempurl.com/web")
                addTime = 10;
            var Comments = from c in comments
                           select new
                           {

                               UserName = c.User.User_Name,
                               UserImgPath = c.User.User_ImgPath.StartsWith("http") ? c.User.User_ImgPath : Path.Combine(hostName, c.User.User_ImgPath),
                               Date = c.UserComment_Date.AddHours(addTime),
                               Comment = c.UserComment_Comment,
                               LocationId = c.Location_ID,
                               UserId = c.User_ID,
                               LocationName = c.Location.Location_Name

                           };
            return Comments.OrderBy(p => p.Date);
        }
        private object getImages(ICollection<LocationImage> images)
        {
            var hostName = GetHostName();

            var Images = from i in images
                         select new
                         {
                             LocationID = i.Location_ID,
                             Info = i.LocationImage_Info,
                             Path = Path.Combine(hostName, i.LocationImage_Path)
                         };
            return Images;
        }

        private object getLocations(Coordinat coord, ICollection<Location> locations, int userId = -1, int count = 1)
        {
            var hostName = GetHostName();

            var Locations = (from l in locations
                             select new
                                    {
                                        Images = getImages(l.LocationImages),
                                        Comments = getComments(l.UserComments),
                                        ID = l.Location_ID,
                                        Banner = Path.Combine(hostName, l.Location_Banner),
                                        Name = l.Location_Name,
                                        Info = l.Location_Info,
                                        TypeId = l.LocationType_ID,
                                        ImageCount = l.LocationImages.Count,
                                        Latitude = l.Location_Latitude,
                                        Longtitude = l.Location_Longtitude,
                                        TypeName = l.LocationType != null ? l.LocationType.LocationType_Name : "",
                                        CommentCount = l.UserComments.Count,
                                        LikeCount = l.UserLikes.Count,
                                        DistanceToUser = coord.Longtitude > 0 ? GetDistance(l.Location_Latitude, l.Location_Longtitude, coord.Latitude, coord.Longtitude) : 0,
                                        IsLiked = userId != -1 ? l.UserLikes.FirstOrDefault(u => u.User_ID == userId && u.Location_ID == l.Location_ID) != null ? true : false : false
                                    }).OrderBy(u => u.DistanceToUser).Take(count);
            return Locations;
        }


        //public object getLocations(Coordinat coord, int id, int userId, int count = 1)
        //{
        //    var hostName = GetHostName();
        //    var list = (from location in _db.Locations
        //                where location.Location_ID == id || id == -1
        //                select location).ToList();
        //    try
        //    {
        //        var result = getLocation(coord,list, userId, count);
        //        return result;

        //    }
        //    catch (Exception ex)
        //    {

        //        throw ex;
        //    }



        //}
        public int GetDistance(double lat1, double long1, double lat2, double long2)
        {
            if (lat1 > 0 && long1 > 0 && lat2 > 0 && long2 > 0)
            {
                var url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + lat1.ToString().Replace(',', '.') + "," + long1.ToString().Replace(',', '.') + "&destinations=" + lat2.ToString().Replace(',', '.') + "," + long2.ToString().Replace(',', '.') + "&key=AIzaSyAmC5YZKQkTD7BZqz3ptRXCsJ2v1bypjk4";
                WebClient c = new WebClient();
                var json = c.DownloadString(url);
                RootObject a = JsonConvert.DeserializeObject<RootObject>(json);
                return a.rows.First().elements.First().distance.value;
            }
            else return 0;


        }



        #endregion

        #region Users

        [HttpGet]
        public async Task<HttpResponseMessage> ChangeInfo(int userId, string name, string mail)
        {
            var user = _db.Users.FirstOrDefault(u => u.User_ID == userId);
            if (user == null)
                return Request.CreateResponse(HttpStatusCode.Forbidden, userId);
            user.User_Email = mail;
            user.User_Name = name;
            _db.Entry<User>(user).State = EntityState.Modified;
            _db.SaveChanges();
            var list = new List<User>();
            list.Add(user);
            return Request.CreateResponse(HttpStatusCode.OK, getUsers(list));

        }

        [HttpGet]
        public async Task<HttpResponseMessage> ChangePassword(int userId, string password)
        {
            var user = _db.Users.FirstOrDefault(u => u.User_ID == userId);
            if (user == null)
                return Request.CreateResponse(HttpStatusCode.Forbidden, userId);
            user.User_Password = password;
            _db.Entry<User>(user).State = EntityState.Modified;
            _db.SaveChanges();
            var list = new List<User>();
            list.Add(user);
            return Request.CreateResponse(HttpStatusCode.OK, getUsers(list));

        }

       
        [HttpPost]
        public async Task<HttpResponseMessage> ChangeAvatar(int userId)
        {
            if (!Request.Content.IsMimeMultipartContent())
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);

            var provider = new MultipartMemoryStreamProvider();
            await Request.Content.ReadAsMultipartAsync(provider);
            var user = _db.Users.FirstOrDefault(u => u.User_ID == userId);
            if (user == null)
                return Request.CreateResponse(HttpStatusCode.Forbidden, userId);
            string path = "";
            foreach (var file in provider.Contents)
            {
                var ext = Path.GetExtension(file.Headers.ContentDisposition.FileName.Trim('\"'));
                var filename = Path.GetRandomFileName().Split('.').First() + ext;
                var buffer = await file.ReadAsByteArrayAsync();
                path = Path.Combine(HttpRuntime.AppDomainAppPath, "Images", filename);
                File.WriteAllBytes(path, buffer);
                user.User_ImgPath = Path.Combine("Images", filename);
                _db.Entry<User>(user).State = EntityState.Modified;
                _db.SaveChanges();
            }

            var list = new List<User>();
            list.Add(user);
            return Request.CreateResponse(HttpStatusCode.OK, getUsers(list));

        }

        [HttpPost]
        public HttpResponseMessage AddSocialUser(SocialUser user)
        {
            List<User> u = new List<Models.User>();
            var dbUser = _db.Users.FirstOrDefault(p => p.SocialID == user.Mail);
            if (dbUser != null)
            {
                u.Add(dbUser);

            }
            else
            {
                User _user = new Models.User();
                _user.User_Email = user.Mail;
                _user.SocialID = user.Mail;
                _user.User_ImgPath = user.ImgPath;
                _user.User_Password = user.Password;
                _user.UserType_ID = 1;
                _user.User_Name = user.Name;
                _user.User_SignUpDate = DateTime.Now;
                _db.Users.Add(_user);
                _db.SaveChanges();
                u.Add(_user);
            }
            return Request.CreateResponse(HttpStatusCode.OK, getUsers(u));
        }

        [HttpPost]
        public HttpResponseMessage SendComment(CommentModel comment)
        {
            var Comment = new UserComment() { Location_ID = comment.LocationId, User_ID = comment.UserId, UserComment_Comment = comment.Comment, UserComment_Date = DateTime.Now };
            _db.UserComments.Add(Comment);
            _db.SaveChanges();
            return Request.CreateResponse(HttpStatusCode.OK, Comment);
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Login(LoginModel model)
        {
            var user = _db.Users.Where(u => u.User_Email == model.Username && u.User_Password == model.Password).ToList();
            if (user != null)
                return Request.CreateResponse(HttpStatusCode.OK, getUsers(user));
            else
                return Request.CreateResponse(HttpStatusCode.BadRequest, "credential error");


        }

        [HttpPost]
        public HttpResponseMessage Register(RegisterModel model)
        {

            User _user = new User();
            var hostName = GetHostName();
            _user.User_Email = model.User_Email;
            _user.User_Name = model.User_Name;
            _user.User_Password = model.User_Password;
            _user.User_SignUpDate = DateTime.Now;
            _user.UserType_ID = model.UserType_ID.Value;
            _user.User_ImgPath = "Images/UserImages/avatar5.jpg";
            _db.Users.Add(_user);
            _db.SaveChanges();
            var data = new
            {
                ID = _user.User_ID,
                Email = _user.User_Email,
                SignUpDate = _user.User_SignUpDate,
                Type_ID = _user.UserType_ID,
                Type_Name = _user.UserType != null ? _user.UserType.UserType_Name : "",
                ImgPath = _user.User_ImgPath.StartsWith("http") ? _user.User_ImgPath : Path.Combine(hostName, _user.User_ImgPath),
                Name = _user.User_Name,
                Password = _user.User_Password,
                LikeCount = _user.UserLikes.Count,
                CommentCount = _user.UserComments.Count
            };
            return Request.CreateResponse(HttpStatusCode.OK, data);
        }

        [HttpGet]
        public HttpResponseMessage GetUserById(int userId)
        {
            var user = (from u in _db.Users where u.User_ID == userId select u).ToList();
            return Request.CreateResponse(HttpStatusCode.OK, getUsers(user));

        }

        [HttpGet]
        public HttpResponseMessage GetUserComments(int userId)
        {
            var comments = (from comment in _db.UserComments
                            where comment.User_ID == userId
                            select comment).ToList();




            return Request.CreateResponse(HttpStatusCode.OK, getComments(comments));

        }

        [HttpGet]
        public HttpResponseMessage GetUserLikes(int userId)
        {
            //var hostName = GetHostName();
            //a
            //if (hostName == "http://tommycarter-001-site1.itempurl.com" || hostName == "http://tommycarter-001-site1.itempurl.com/web")
            //    addTime = 10;
            var locations = (from like in _db.UserLikes
                             join u in _db.Users on like.User_ID equals u.User_ID
                             join l in _db.Locations on like.Location_ID equals l.Location_ID
                             where like.User_ID == userId
                             select new
                             {
                                 UserName = u.User_Name,
                                 LocationName = l.Location_Name,
                                 LocationId = l.Location_ID,
                                 Date = like.UserLike_Date
                             }).OrderBy(d => d.Date).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, locations);

        }

        [HttpGet]
        public HttpResponseMessage Register()
        {
            return Request.CreateResponse(HttpStatusCode.OK, "se");
        }

        [HttpGet]
        public HttpResponseMessage getUsers(int count = 100)
        {
            var users = (from u in _db.Users select u).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, getUsers(users));
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
        public HttpResponseMessage GetUserTypes()
        {
            return Request.CreateResponse(HttpStatusCode.OK, _db.UserTypes.ToList());

        }

        [HttpGet]
        public HttpResponseMessage UpdateUser(User user, int UserID)
        {
            var olduser = _db.Users.Where(u => u.User_ID == UserID).FirstOrDefault();
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

        [HttpGet]
        public HttpResponseMessage UpdateYetki(int typeID, int UserID) 
        {
            var euser = _db.Users.Where(u => u.User_ID == UserID).FirstOrDefault();
            if (euser != null)
            {
                euser.UserType_ID = typeID;

                _db.Entry<User>(euser).State = EntityState.Modified;
                _db.SaveChanges();

                return Request.CreateResponse(HttpStatusCode.OK, euser);
            }
            return Request.CreateResponse(HttpStatusCode.Forbidden, "fail");

        
        }
        #endregion

        #region Locations

        [HttpGet]
        public HttpResponseMessage GetSearchLocation()
        {
            var data = from p in _db.Locations
                       select new
                       {
                           ID = p.Location_ID,
                           Name = p.Location_Name,
                           TypeName = p.LocationType.LocationType_Name
                       };
            return Request.CreateResponse(HttpStatusCode.OK, data);

        }
        [HttpGet]
        public HttpResponseMessage LikeLocation(int locationId, int userId)
        {
            var location = _db.Locations.FirstOrDefault(l => l.Location_ID == locationId);
            var user = _db.Users.FirstOrDefault(l => l.User_ID == userId);

            if (location == null || user == null)
                return Request.CreateResponse(HttpStatusCode.BadRequest, "");
            var UserLike = new UserLike()
            {
                Location_ID = locationId,
                UserLike_Date = DateTime.Now,
                User_ID = userId
            };
            _db.UserLikes.Add(UserLike);
            _db.SaveChanges();
            return Request.CreateResponse(HttpStatusCode.OK, UserLike);

        }

        [HttpGet]
        public HttpResponseMessage UnLikeLocation(int locationId, int userId)
        {
            var like = _db.UserLikes.FirstOrDefault(u => u.User_ID == userId && u.Location_ID == locationId);

            if (like == null)
                return Request.CreateResponse(HttpStatusCode.BadRequest, "");
            _db.Entry<UserLike>(like).State = EntityState.Deleted;
            _db.SaveChanges();
            return Request.CreateResponse(HttpStatusCode.OK, "ok");

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
            _loc.LocationType_ID = loc.TypeId;
            _db.Locations.Add(_loc);
            _db.SaveChanges();
            var list = new List<Location>();
            list.Add(_loc);
            return Request.CreateResponse(HttpStatusCode.OK, getLocations(coord, list, -1));
        }

        [HttpPost]
        public HttpResponseMessage GetLocations(Coordinat coordinat, int userId = -1, int page = 1)
        {
            var hostName = GetHostName();
            var list = (from location in _db.Locations
                        select location).ToList();
            try
            {
                var result = getLocations(coordinat, list, userId, page * 60);
                return Request.CreateResponse(HttpStatusCode.OK, result); ;

            }
            catch (Exception ex)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.InnerException);
            }


        }

        [HttpPost]
        public HttpResponseMessage UpdateLocation(int locationId,LocationNew loc){

            var location = _db.Locations.FirstOrDefault(p => p.Location_ID == locationId);
            if(location==null)
                return Request.CreateResponse(HttpStatusCode.NoContent, "");
            else
            {

                location.Location_Name = loc.Name;
                location.LocationType_ID = loc.TypeId;
                location.Location_Latitude=loc.Latitude;
                location.Location_Longtitude = loc.Longtitude;
                location.Location_Info = loc.Info;
                _db.Entry<Location>(location).State = EntityState.Modified;
                _db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, location);

            }


        }

        public HttpResponseMessage GetLocationById(int id, int userId = -1)
        {
            var list = (from location in _db.Locations
                        where location.Location_ID == id
                        select location).ToList();
            var result = getLocations(coord, list, userId);
            if (result != null)
            {

                return Request.CreateResponse(HttpStatusCode.OK, result);
            }
            else
                return Request.CreateResponse(HttpStatusCode.NoContent, "");

        }


        public HttpResponseMessage GetCommentByLocationId(int id)
        {
            var data = _db.Locations.FirstOrDefault(p => p.Location_ID == id);
            if (data != null)
            {
                var result = getComments(data.UserComments);
                return Request.CreateResponse(HttpStatusCode.OK, result);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, "null");

            }

        }




        public HttpResponseMessage GetLocationTypes()
        {
            return Request.CreateResponse(HttpStatusCode.OK, _db.LocationTypes.ToList());
        }
        [HttpGet]
        public HttpResponseMessage AddLocationType(string name)
        {
            LocationType _type = new LocationType();
            _type.LocationType_Name = name;
            _db.LocationTypes.Add(_type);
            _db.SaveChanges();
            return Request.CreateResponse(HttpStatusCode.OK, _type);

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

        [HttpPost]
        public async Task<HttpResponseMessage> Upload(int locationID, bool isBanner = false)
        {
            if (!Request.Content.IsMimeMultipartContent())
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);

            var provider = new MultipartMemoryStreamProvider();
            await Request.Content.ReadAsMultipartAsync(provider);
            var location = _db.Locations.FirstOrDefault(u => u.Location_ID == locationID);
            if (location == null)
                return Request.CreateResponse(HttpStatusCode.Forbidden, locationID);
        
            string path = "";
            foreach (var file in provider.Contents)
            {
                var ext = Path.GetExtension(file.Headers.ContentDisposition.FileName.Trim('\"'));
                var filename = Path.GetRandomFileName().Split('.').First() + ext;
                var buffer = await file.ReadAsByteArrayAsync();
                path = Path.Combine(HttpRuntime.AppDomainAppPath, "Images", filename);
                File.WriteAllBytes(path, buffer);
                if (!isBanner)
                    _db.LocationImages.Add(new LocationImage() { Location_ID = locationID, LocationImage_Path = Path.Combine("Images", filename) });
                else
                    location.Location_Banner = Path.Combine("Images", filename);

                _db.SaveChanges();
            }

            return Request.CreateResponse(HttpStatusCode.OK);

        }

        #endregion

        #region distance

        public class Distance
        {
            public string text { get; set; }
            public int value { get; set; }
        }

        public class Duration
        {
            public string text { get; set; }
            public int value { get; set; }
        }

        public class Element
        {
            public Distance distance { get; set; }
            public Duration duration { get; set; }
            public string status { get; set; }
        }

        public class Row
        {
            public List<Element> elements { get; set; }
        }

        public class RootObject
        {
            public List<string> destination_addresses { get; set; }
            public List<string> origin_addresses { get; set; }
            public List<Row> rows { get; set; }
            public string status { get; set; }
        }
        public class Coordinat
        {
            public double Latitude { get; set; }
            public double Longtitude { get; set; }

        }
    }
        #endregion
}