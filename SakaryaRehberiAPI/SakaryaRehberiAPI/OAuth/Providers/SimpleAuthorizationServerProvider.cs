using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json;
using SakaryaRehberiAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Cors;

namespace SakaryaRehberiAPI.OAuth.Providers
{

    public class SimpleAuthorizationServerProvider:OAuthAuthorizationServerProvider
    {
        SehirRehberiEntities db = new SehirRehberiEntities();
        public override  System.Threading.Tasks.Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            //context.OwinContext.Response.Headers.Add("Access-Control-Allow-Methods", new[] { "POST" });

            context.Validated();
            return base.ValidateClientAuthentication(context);
        }

        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
            {
                context.AdditionalResponseParameters.Add(property.Key, property.Value);
            }

            return Task.FromResult<object>(null);
        }
        // OAuthAuthorizationServerProvider sınıfının kaynak erişimine izin verebilmek için ilgili GrantResourceOwnerCredentials metotunu override ediyoruz.
        public override Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            // CORS ayarlarını set ediyoruz.
            context.OwinContext.Response.Headers.Add("Access-Control-Allow-Methods", new[] { "POST" });
            context.OwinContext.Response.Headers.Add("Access-Control-Allow-Headers", new[] { "authorization" });

            //context.OwinContext.Response.Headers.Add("Access-Control-Allow-Headers", new[] { "Content-Type" });
            User user = db.Users.FirstOrDefault(u => u.User_Email.Equals(context.UserName) && u.User_Password.Equals(context.Password));
            // Kullanıcının access_token alabilmesi için gerekli validation işlemlerini yapıyoruz.
            string json=JsonConvert.SerializeObject(user);
            Dictionary<string, string> values = JsonConvert.DeserializeObject<Dictionary<string, string>>(json);
            var props = new AuthenticationProperties(values);
            if (user!=null)
            {
                var identity = new ClaimsIdentity(context.Options.AuthenticationType);

                identity.AddClaim(new Claim(ClaimTypes.Name, context.UserName));
                identity.AddClaim(new Claim(ClaimTypes.Role, "User"));
                var ticket = new AuthenticationTicket(identity, props);

            
                context.Validated(ticket);
            }
            else
            {
                context.SetError("invalid_grant", "Kullanıcı adı veya şifre yanlış.");
            }
            return  base.GrantResourceOwnerCredentials(context);
        }
    }
}