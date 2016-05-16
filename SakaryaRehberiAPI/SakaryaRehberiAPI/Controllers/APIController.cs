using Newtonsoft.Json;
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
        Coordinat coord = new Coordinat() { Latitude = -1, Longtitude = -1 };
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


        DBContext _db = new DBContext();
        #region User

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
            var user = _db.Users.FirstOrDefault(u => u.User_Email == model.Username && u.User_Password == model.Password);
            if (user != null)
                return Request.CreateResponse(HttpStatusCode.OK,
                    new
                    {
                        ID = user.User_ID,
                        Email = user.User_Email,
                        Type_ID = user.UserType_ID,
                        ImgPath = Path.Combine(GetHostName(), user.User_ImgPath),
                        Name = user.User_Name,
                        TypeName=user.UserType.UserType_Name
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
            _user.User_ImgPath = "Images/UserImages/avatar5.jpg";
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



        #region Locations

        public object getLocationInfo(Coordinat coord, int id, int count = 1)
        {
            var hostName = GetHostName();
            var list = (from location in _db.Locations
                        where location.Location_ID == id || id == -1
                        select location).AsEnumerable<Location>().Select(
                        l => new
                        {
                            Images = from i in l.LocationImages
                                     select new
                                     {

                                         LocationID = i.Location_ID,
                                         Info = i.LocationImage_Info,
                                         Path = Path.Combine(hostName, i.LocationImage_Path)
                                     },
                            Comments = from c in l.UserComments
                                       select new
                                       {

                                           UserName = c.User.User_Name,
                                           UserImgPath = Path.Combine(hostName, c.User.User_ImgPath),
                                           Date = c.UserComment_Date,
                                           Comment = c.UserComment_Comment
                                       },
                            ID = l.Location_ID,
                            Banner = Path.Combine(hostName, l.Location_Banner),
                            Name = l.Location_Name,
                            Info = l.Location_Info,
                            TypeId = l.LocationType_ID,
                            ImageCount = l.LocationImages.Count,
                            Latitude = l.Location_Latitude,
                            Longtitude = l.Location_Longtitude,
                            TypeName = l.LocationType!=null?l.LocationType.LocationType_Name:"",
                            CommentCount = l.UserComments.Count,
                            LikeCount = l.UserLikes.Count,
                            DistanceToUser =0
                           
                        }).OrderBy(u=> u.DistanceToUser).Take(count);

            return list;

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
            _loc.LocationType_ID = loc.Type_ID;
            _db.Locations.Add(_loc);
            _db.SaveChanges();
            return Request.CreateResponse(HttpStatusCode.OK, getLocationInfo(coord,_loc.Location_ID));
        }

        [HttpPost]
        public HttpResponseMessage GetLocations(Coordinat coordinat, int page = 1)
        {
            var list = getLocationInfo(coordinat, -1,page * 90);
            return Request.CreateResponse(HttpStatusCode.OK, list);
        }

        public HttpResponseMessage GetLocationById(int id)
        {

            var list = getLocationInfo(coord,id);
            if (list != null)
            {

                return Request.CreateResponse(HttpStatusCode.OK, list
                    );
            }
            else
                return Request.CreateResponse(HttpStatusCode.NoContent, "");

        }
        public string GetHostName()
        {
            return Request.RequestUri.Scheme + "://" + Request.RequestUri.Authority;

        }

        public HttpResponseMessage GetLocationTypes()
        {
            return Request.CreateResponse(HttpStatusCode.OK, _db.LocationTypes.ToList());
        }


        public int GetDistance(double lat1, double long1, double lat2, double long2)
        {
            var url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + lat1.ToString().Replace(',', '.') + "," + long1.ToString().Replace(',', '.') + "&destinations=" + lat2.ToString().Replace(',', '.') + "," + long2.ToString().Replace(',', '.') + "&key=AIzaSyAmC5YZKQkTD7BZqz3ptRXCsJ2v1bypjk4";
            WebClient c = new WebClient();
            var json = c.DownloadString(url);
            RootObject a = JsonConvert.DeserializeObject<RootObject>(json);
            return a.rows.First().elements.First().distance.value;
            
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

            return Request.CreateResponse(HttpStatusCode.OK);

        }


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
    }}