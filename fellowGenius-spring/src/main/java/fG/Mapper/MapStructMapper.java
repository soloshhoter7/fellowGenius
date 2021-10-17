package fG.Mapper;

import org.mapstruct.Mapper;

import fG.Entity.FeaturedExperts;
import fG.Model.FeaturedExpertsModel;

//@Mapper(componentModel = "spring")
public interface MapStructMapper {
	FeaturedExpertsModel featuredExpertToFeaturedExpertDTO(FeaturedExperts expert);

	FeaturedExperts featuredExpertDTOToFeaturedExpert(FeaturedExpertsModel expert);
}
