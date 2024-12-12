using App.Core.Common.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

using System.Collections.Generic;

namespace ValidatorsAndExceptionFilter.Filters
{
    public class AppExceptionFilterAttribute : ExceptionFilterAttribute
    {
        public override void OnException(ExceptionContext context)
        {

            if (context.Exception is NotFoundException)
            {
                context.HttpContext.Response.StatusCode = 404;
            }else if (context.Exception is BadRequest)
            {
                context.HttpContext.Response.StatusCode = 400;
            }else if(context.Exception is ConflictException){
                context.HttpContext.Response.StatusCode = 409;
            }
            else
            {
                context.HttpContext.Response.StatusCode = 500;
            }

            context.Result = new JsonResult(new Dictionary<string, object>
            {
                { "statusCode", context.HttpContext.Response.StatusCode},
                { "message" , context.Exception.Message },
                { "stackTrace", context.Exception.StackTrace }
            });
        }
    }

}



