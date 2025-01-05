namespace CollectifyAPI.Dtos
{
    public class LoginTokens
    {
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }


        public LoginTokens() { }
        public LoginTokens(string? accessToken, string? refreshToken)
        {
            AccessToken = accessToken;
            RefreshToken = refreshToken;
        }
    }
}
