using lab1.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace lab1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly Data.AppDbContext _context;
        public ProductsController(Data.AppDbContext context)
        {
            _context = context;
        }


        //Get All Produts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Models.Product>>> GetProducts()
        {
            var products = await _context.Products.ToListAsync();
            return Ok(products);
        }

        //Get Product by Id
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Models.Product>>> GetbyId(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        // Create Product 
        [HttpPost]
        public ActionResult Add(Product p)
        {
            if (p == null)
                return BadRequest("Product data is missing.");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Products.Add(p);
            _context.SaveChanges();

            return Created("ADD SUCCESS", p);
        }

        //Edit Product
        [HttpPut("{id}")]
        public ActionResult Edit(Product p, int id)
        {
            if (p == null)
                return BadRequest("Product data is missing.");

            if (p.Id != id)
                return BadRequest();
            _context.Entry(p).State = EntityState.Modified;
            _context.SaveChanges();
            return Accepted("EDIT SUCCESS", p);

        }
        //Delete Product
        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null)
            {
                return NotFound();
            }
            _context.Products.Remove(product);
            _context.SaveChanges();
            return Ok("DELETE SUCCESS");

        }

    }
}
