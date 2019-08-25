using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Options;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using RegistrationApi.Models;

namespace RegistrationApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationUserController : ControllerBase
    {
        private UserManager<ApplicationUser> _userManager;
        private SignInManager<ApplicationUser> _signInManager;
        private readonly ApplicationSetting _appSettings;

        public ApplicationUserController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager,IOptions<ApplicationSetting> appSettings)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _appSettings = appSettings.Value;

        }

        [HttpPost]
        [Route("Register")]
        //POST:/api/ApplicationUser/Register

        public async Task<object> PostApplicationUser(ApplicationUserModel model)
        {
            model.Role = "Admin";
            var applicationUser = new ApplicationUser()
            {
                UserName = model.UserName,
                Email = model.Email,
                FullName = model.FullName
            };
            try
            {
                var result =await _userManager.CreateAsync(applicationUser, model.Password);
                            await _userManager.AddToRoleAsync(applicationUser, model.Role);
                return Ok(result);

            }

            catch(Exception Ex)
            {
                throw Ex;
            }
        }

        [HttpPost]
        [Route("Login")]
        //POST:/api/ApplicationUser/Login
        public async Task<IActionResult> Login(LoginModel model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                //Get Role Assigned to the user
                var role = await _userManager.GetRolesAsync(user);
                IdentityOptions _options = new IdentityOptions();

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim("UserID",user.Id.ToString()),
                        new Claim(_options.ClaimsIdentity.RoleClaimType,role.FirstOrDefault())
                    }),
                    Expires = DateTime.UtcNow.AddHours(5),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.JWT_Secret)), SecurityAlgorithms.HmacSha256Signature)
                };

                var tokenHandler = new JwtSecurityTokenHandler();
                var SecurityToken = tokenHandler.CreateToken(tokenDescriptor);
                var token = tokenHandler.WriteToken(SecurityToken);

                return Ok(new { token });

            }
            else
                return BadRequest(new { message = "User Name or Password is incorrect." });

        }

        [HttpGet]
        [Authorize(Roles ="Admin")]
        [Route("ForAdmin")]

        public string GetForAdmin()
        {
            return "Web method for Admin";
        }


        [HttpGet]
        [Authorize(Roles = "Customer")]
        [Route("ForCustomer")]

        public string GetForCustomer()
        {
            return "Web method for Customer";
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Customer")]
        [Route("ForAdminORCustomer")]

        public string GetForAdminorCustomer()
        {
            return "Web method for Admin or Customer";
        }
    }
}