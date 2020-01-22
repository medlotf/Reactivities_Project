using System.Collections.Generic;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ValuesController : ControllerBase
    {
        private readonly DataContext context;

        public ValuesController(DataContext _context)
        {
            context = _context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Value>>> Get()
        {
            var res = await context.Values.ToListAsync();
            return Ok(res);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Value>> Get(int id)
        {
            var res = await context.Values.FindAsync(id);
            return Ok(res);
        }
    }
}
