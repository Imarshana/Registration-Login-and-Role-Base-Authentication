using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RegistrationApi.Models
{
    public class ApplicationSetting
    {
        public string JWT_Secret { get; set; }
        public string Client_URL { get; set; } 
    }
}
