using AutoMapper;
using qtec_api.Dto;
using qtec_api.ModelDto;
using qtec_api.Models;

namespace qtec_api {
    public class AppMapperProfile:Profile {

        public AppMapperProfile()
        {
            CreateMap<DepartmentDto,Department>( );
            CreateMap<PerformanceReviewDto,PerformanceReview>( );
        }
    }
}
