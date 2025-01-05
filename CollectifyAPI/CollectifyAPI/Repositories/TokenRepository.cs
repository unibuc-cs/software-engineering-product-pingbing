using Microsoft.EntityFrameworkCore;
using CollectifyAPI.Models;
using CollectifyAPI.Data;

namespace CollectifyAPI.Repositories
{
    public class TokenRepository : GenericRepository<UserRefreshToken>
    {
        public TokenRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<UserRefreshToken?> GetRefreshTokenAsync(string userId, string refreshToken)
        {
            var token = await _dbSet.FirstOrDefaultAsync(t => t.UserId == userId && t.RefreshToken == refreshToken);

            if (token == null)
            {
                return null;
            }

            return token;
        }
    }
}
