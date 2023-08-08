﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StreamFeverAPI.Context;
using StreamFeverAPI.Helpers;
using StreamFeverAPI.Models;
using System.Text;
using System.Text.RegularExpressions;

namespace StreamFeverAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        public UserController(AppDbContext appDbContext)
        {
            _context = appDbContext;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User userBody)
        {
            if (userBody == null)
            {
                return BadRequest();
            }

            var user = await _context.Users.
                FirstOrDefaultAsync(u => u.Username == userBody.Username);
            if (user == null)
            {
                return NotFound(new
                {
                    Message = "User Not Found!"
                });
            }

            if (!PasswordHasher.VerifyPassword(userBody.Password, user.Password))
            {
                return BadRequest(new
                {
                    Message = "The Password Is Incorrect!"
                });
            }

            return Ok(new
            {
                Message = "Login Succesful!"
            });
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] User userBody)
        {
            if (userBody == null)
            {
                return BadRequest();
            }

            // CHECK USERNAME
            if (await UsernameExistsAsync(userBody.Username))
                return BadRequest(new
                {
                    Message = "The Username Already Exists!"
                });

            // CHECK PASSWORD STRENGTH
            var errorMessage = PasswordStrength(userBody.Password);
            if (!string.IsNullOrEmpty(errorMessage))
            {
                return BadRequest(new
                {
                    Message = errorMessage.ToString()
                });
            }
            
            userBody.Password = PasswordHasher.HashPassword(userBody.Password);
            userBody.Token = "";
            
            await _context.Users.AddAsync(userBody);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Signup Succesful!"
            });
        }

        private Task<bool> UsernameExistsAsync(string username)
            => _context.Users.AnyAsync(u => u.Username == username);
    
        private string PasswordStrength(string password)
        {
            StringBuilder stringBuilder = new StringBuilder();

            if (password.Length < 8)
                stringBuilder.Append("The Minimum Length For The Password Should be 8!" + Environment.NewLine);

            if (!(Regex.IsMatch(password, "[a-zA-Z]")
                && Regex.IsMatch(password, "[0-9]")))
                stringBuilder.Append("The Password Should Be Alphanumeric!" + Environment.NewLine);

            if (!(Regex.IsMatch(password, "[<, >, @, !, #, $, %, ^, &, *, (, ), _, +, \\[, \\], {, }, ?, :, ;, |, ', \\, ., /, ~, `, -, =]")))
                stringBuilder.Append("The Password Should Contain Special Characters!" + Environment.NewLine);

            return stringBuilder.ToString();
        }
    }
}
