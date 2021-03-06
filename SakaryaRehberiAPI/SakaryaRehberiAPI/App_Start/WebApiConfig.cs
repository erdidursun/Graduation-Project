﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace SakaryaRehberiAPI
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {           
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "{controller}/{action}/{id}",
                defaults: new { controller = "API", action = "Register", id = RouteParameter.Optional }

            );

        }
    }
}
