using AutoMapper;
using CollectifyAPI.Models;
using CollectifyAPI.Dtos;

namespace CollectifyAPI.Helpers
{
    public class Mapper : Profile
    {
        public Mapper()
        {
            CreateMap<AppUser, UserProfile>().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<UserProfile, AppUser>().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
