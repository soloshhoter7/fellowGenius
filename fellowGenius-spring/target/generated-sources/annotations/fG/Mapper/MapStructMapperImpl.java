package fG.Mapper;

import fG.Entity.FeaturedExperts;
import fG.Model.FeaturedExpertsModel;
import javax.annotation.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2021-10-02T16:03:36+0530",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 9.0.1 (Oracle Corporation)"
)
@Component
public class MapStructMapperImpl implements MapStructMapper {

    @Override
    public FeaturedExpertsModel featuredExpertToFeaturedExpertModel(FeaturedExperts expert) {
        if ( expert == null ) {
            return null;
        }

        FeaturedExpertsModel featuredExpertsModel = new FeaturedExpertsModel();

        featuredExpertsModel.setName( expert.getName() );
        if ( expert.getExpertId() != null ) {
            featuredExpertsModel.setExpertId( String.valueOf( expert.getExpertId() ) );
        }

        return featuredExpertsModel;
    }
}
