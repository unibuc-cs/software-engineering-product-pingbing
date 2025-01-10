using System.Security.Cryptography;

namespace CollectifyAPI.Helpers
{
    public class Encrypter
    {
        private static readonly string Key = "SqxfIBjPFQqjLbEyIvdQzQ==";

        public static async Task<string?> Encrypt(string plainText)
        {
            if (plainText == null)
            {
                return null;
            }

            using (Aes aes = Aes.Create())
            {
                aes.Key = Convert.FromBase64String(Key);
                aes.GenerateIV();

                using (var ms = new MemoryStream())
                {
                    await ms.WriteAsync(aes.IV, 0, aes.IV.Length);

                    using (var encryptor = aes.CreateEncryptor(aes.Key, aes.IV))
                    using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
                    using (var writer = new StreamWriter(cs))
                    {
                        await writer.WriteAsync(plainText);
                        await writer.FlushAsync();
                    }

                    return Convert.ToBase64String(ms.ToArray());
                }
            }
        }


        public static async Task<string?> Decrypt(string encryptedText)
        {
            if (encryptedText == null)
            {
                return null;
            }

            var fullCipher = Convert.FromBase64String(encryptedText);

            using (Aes aes = Aes.Create())
            {
                aes.Key = Convert.FromBase64String(Key);

                byte[] iv = new byte[aes.BlockSize / 8];
                Array.Copy(fullCipher, 0, iv, 0, iv.Length);

                byte[] cipherText = new byte[fullCipher.Length - iv.Length];
                Array.Copy(fullCipher, iv.Length, cipherText, 0, cipherText.Length);

                using (var decryptor = aes.CreateDecryptor(aes.Key, iv))
                using (var ms = new MemoryStream(cipherText))
                using (var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read))
                using (var reader = new StreamReader(cs))
                {
                    return await reader.ReadToEndAsync();
                }
            }
        }

    }

}