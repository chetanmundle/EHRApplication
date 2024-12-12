using App.Common.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.IO;

namespace ImageUpload.Service
{
    public class UploadHandler
    {
        private readonly IWebHostEnvironment _environment;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UploadHandler(IWebHostEnvironment environment, IHttpContextAccessor httpContextAccessor)
        {
            _environment = environment;
            _httpContextAccessor = httpContextAccessor;
        }

        

        public AppResponse<string> Upload(IFormFile file)
        {
            
            // Valid extensions
            List<string> validExtensions = new List<string>() { ".jpg", ".png", ".jpeg" };
            string extension = Path.GetExtension(file.FileName);
            if (!validExtensions.Contains(extension))
            {
                return AppResponse.Fail<string>("", $"Extensions Not Valid {string.Join(',', validExtensions)}",App.Common.Constants.HttpStatusCodes.BadRequest);
            }

            // Size check
            long size = file.Length;
            if (size > (5 * 1024 * 1024))
            {
                return AppResponse.Fail<string>("", "Maximum size can be 5Mb",App.Common.Constants.HttpStatusCodes.BadRequest);
            }

            // Change file name
            string filename = Guid.NewGuid().ToString() + extension;
            string uploadPath = Path.Combine(_environment.ContentRootPath, "wwwroot/Images");

            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }

            using (FileStream stream = new FileStream(Path.Combine(uploadPath, filename), FileMode.Create))
            {
                file.CopyTo(stream);
            }

            // Get the host and scheme from HttpContext
            var request = _httpContextAccessor.HttpContext.Request;
            string scheme = request.Scheme;  
            string host = request.Host.Value; 

            // Generate the full URL
            string fileUrl = $"{scheme}://{host}/wwwroot/Images/{filename}";

            return AppResponse.Success<string>(fileUrl, "File Saved Successfully", App.Common.Constants.HttpStatusCodes.OK);
        }
    }
}
