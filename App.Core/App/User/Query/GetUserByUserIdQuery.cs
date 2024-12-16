using App.Common.Models;
using App.Core.Interface;
using App.Core.Models.User;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace App.Core.App.User.Query
{
    public class GetUserByUserIdQuery : IRequest<AppResponse<UserDto>>
    {
        public int UserId { get; set; }
    }

    internal class GetUserByUserIdQueryH : IRequestHandler<GetUserByUserIdQuery, AppResponse<UserDto>>
    {
        private readonly IUserRepository _userRepository;

        public GetUserByUserIdQueryH(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<AppResponse<UserDto>> Handle(GetUserByUserIdQuery request, CancellationToken cancellationToken)
        {
            var userId = request.UserId;
            var user = await _userRepository.GetUserByUserIdAsync(userId);

            return AppResponse.Success(user);
        }
    }
}
