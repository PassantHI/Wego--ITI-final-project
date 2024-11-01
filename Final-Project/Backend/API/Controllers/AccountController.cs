using API.DTOs.User;
using Business_Layer.Services;
using Data_Layer.Context;
using Data_Layer.Repositories.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AccountController(UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IEmailService emailService,
            IConfiguration configuration)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _configuration = configuration;
            _emailService = emailService;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register(RegisterationDTO model)
        {
            if(!ModelState.IsValid) 
                return BadRequest(ModelState);
            var user = new ApplicationUser
            {
                Email = model.Email,
                UserName = model.UserName,
            };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
                return BadRequest($"Errors occcured while registering user");

           var roleResult = await _userManager.AddToRoleAsync(user, "client");

            if (roleResult.Succeeded)
            {
                await SendConfirmationEmail(user);
                return Ok();
            }
            else
            {
                return BadRequest("User created, but error occurred while assigning role");

            }


        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO loginDTO)
        {
            ApplicationUser?  user = await _signInManager.UserManager.FindByEmailAsync(loginDTO.Email);
            if (user is null)
                return NotFound("Invalid credentials");

            var passwordValid = await _userManager.CheckPasswordAsync(user,loginDTO.Password);

            if (!passwordValid)
                return NotFound("Invalid credentials.");

            if (!user.EmailConfirmed)
            {
                await SendConfirmationEmail(user);
                return BadRequest("Email Not Confirmed");
            }

            var token = await GenerateToken(user);
            return Ok(new { token });
        }

        #region user CRUD


        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetAllUserss(string role = "client")
        {
            var users = await _userManager.GetUsersInRoleAsync(role);

            if (users is null)
            {
                return NotFound();
            }

            List<UserDTO> userDTOs = new List<UserDTO>();
            foreach (var user in users)
            {
                userDTOs.Add(UserDTO.MapToUserDTO(user));
            }
            return Ok(userDTOs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(UserDTO.MapToUserDTO(user));
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> EditUser(string id, UserDTO userDTO)
        {
            if (id != userDTO.Id)
            {
                return BadRequest();
            }

            if (ModelState.IsValid)
            {
                var user = UserDTO.MapToUser(userDTO);
                userDTO.Id = id;

                try
                {
                    await _userManager.UpdateAsync(user);
                }
                catch (Exception)
                {
                    if (!UserExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
            }
            else return BadRequest();

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            try
            {
                await _userManager.DeleteAsync(user);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
            return NoContent();
        }

        private bool UserExists(string id)
        {
            var feature = _userManager.FindByIdAsync(id);
            if (feature == null) return false;
            return true;
        }

        #endregion


        [HttpPost("SendConfirmationEmail")]
        public async Task<IActionResult> SendConfirmationEmail(ApplicationUser userModel)
        {

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(userModel);

            var conLink = Url.Action(nameof(ConfirmEmail), "Account",
                new { userId = userModel.Id, token },
                Request.Scheme
            );

            await _emailService.SendEmailAsync(userModel.Email, "Please Confirm Your Email", conLink);

            return Ok("Confirmation Email send");
        }



        [HttpGet("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return BadRequest("Invalid user ID");
            }

            var result = await _userManager.ConfirmEmailAsync(user, token);

            if (result.Succeeded)
            {
                return Redirect("http://localhost:4200/emailconfirme");
            }

            return BadRequest("Email confirmation failed");
        }

        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDTO changePasswordDTO)
        {
            if (ModelState.IsValid)
            {
                ApplicationUser userModel = await _userManager.FindByEmailAsync(changePasswordDTO.Email);

                if (userModel != null && await _userManager.CheckPasswordAsync(userModel, changePasswordDTO.Password))
                {
                    await _userManager.ChangePasswordAsync(userModel, changePasswordDTO.Password, changePasswordDTO.NewPassword);

                    return Ok(new { message = "Password changed successfully" });

                }
                return BadRequest("wrong email or password");

            }

            return BadRequest();
        }



        [HttpPost("ForgetPassword")]
        public async Task<IActionResult> ForgetPassword(ForgetPasswordDTO forgetDTO)
        {
            ApplicationUser userModel = await _userManager.FindByEmailAsync(forgetDTO.Email);
            if (userModel != null)
            {

                var token = await _userManager.GeneratePasswordResetTokenAsync(userModel);
                var encodedToken = Uri.EscapeDataString(token);

                var url = $"http://localhost:4200/account/reset-password?userId={userModel.Id}&token={encodedToken}";


                await _emailService.SendEmailAsync(forgetDTO.Email, "Reset Password", url);

                return Ok(new { message = "Reset Password Link Send" });
            }
            return BadRequest();

        }


        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDTO resetPasswordDTO)
        {
            if (ModelState.IsValid)
            {
                ApplicationUser userModel = await _userManager.FindByIdAsync(resetPasswordDTO.UserId);
                if (userModel != null)
                {
                    var result = await _userManager.ResetPasswordAsync(userModel, resetPasswordDTO.Token, resetPasswordDTO.Password);
                    if (result.Succeeded)
                    {
                        return Ok(new { message = "password Reset successfully" });
                    }
                    return BadRequest();
                }

            }
            return BadRequest();

        }


        protected async Task<string> GenerateToken(ApplicationUser user)
        {
            var userRoles = await _userManager.GetRolesAsync(user);

            //claims
            List<Claim> userData = [new Claim("userName", user.UserName),
                new Claim(ClaimTypes.NameIdentifier,user.Id)];
            foreach (var userRole in userRoles)
            {
                userData.Add(new Claim(ClaimTypes.Role, userRole));
                userData.Add(new Claim("role", userRole));
            }

            //secret key
            var key = _configuration["JwtSettings:SecretKey"];
            var secretKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key));

            //signing credentials
            var credentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            //token generation
            var token = new JwtSecurityToken(
                claims: userData,
                expires: DateTime.Now.AddDays(90),
                signingCredentials: credentials
                );
            var tokenStr = new JwtSecurityTokenHandler().WriteToken(token);
            return tokenStr;
        }
    }
}