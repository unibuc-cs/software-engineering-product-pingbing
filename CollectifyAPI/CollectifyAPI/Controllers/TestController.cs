using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CollectifyAPI.Controllers
{
    [ApiController]
    [Route("api/test")]
    public class TestController : Controller
    {
        [HttpGet]
        [Route("adminTest")]
        [Authorize("admin")]
        public IActionResult AdminTest()
        {
            return Ok("Success");
        }

        [HttpGet]
        [Route("userTest")]
        [Authorize]
        public IActionResult UserTest()
        {
            return Ok("Success");
        }
    }
}
