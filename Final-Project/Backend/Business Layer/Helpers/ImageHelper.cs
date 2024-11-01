using Microsoft.AspNetCore.Http;

namespace Utilities
{
    public class ImageHelper
    {
        public static async Task<string> UploadImageAsync(IFormFile img, string folder, string name)
        {
            string[] ext = { "jpg", "png", "jpeg", "gif", "webp" };
            var extension = img.FileName.Split('.').Last().ToLower();
            if (!ext.Contains(extension)) 
                return string.Empty;
            var fileName = $"{name}.{extension}";
            using (FileStream file = new($"wwwroot/imgs/{folder}/{fileName}", FileMode.Create))
            {
                await img.CopyToAsync(file);
            }
            return fileName;
        }

        public static void RemoveImage(string folder, string fileFullName)
        {
            var filePath = Path.Combine($"wwwroot/imgs/{folder}", fileFullName);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }

    }
}
