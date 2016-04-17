using SakaryaRehberiAPI.Models;
using SakaryaRehberiAPI.Models.ViewModels;
using System;
using System.Collections.Generic;
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
using TokenAuthorization.Core.Account;
using TokenAuthorization.Core.Attributes;

namespace SakaryaRehberiAPI.Controllers
{

    public class APIController : ApiController
    {
        SehirRehberiEntities _db = new SehirRehberiEntities();


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
        [AllowAnonymous]
        [HttpPost]

        public HttpResponseMessage Register(RegisterModel model)
        {
            return Request.CreateResponse(HttpStatusCode.OK, model);
        }

        #endregion


    }

}
