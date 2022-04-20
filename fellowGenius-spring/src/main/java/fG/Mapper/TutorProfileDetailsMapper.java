package fG.Mapper;

import fG.Entity.ExpertiseAreas;
import fG.Entity.TutorProfileDetails;
import fG.Model.TutorProfileDetailsModel;
import fG.Model.expertise;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.awt.geom.Area;
import java.util.ArrayList;

@Mapper(componentModel = "spring")
public abstract class TutorProfileDetailsMapper {

    @Mapping(target = "areaOfExpertise",source = "tutorProfileDetails",
    qualifiedByName = "getAreaOfExpertise")
    public abstract TutorProfileDetailsModel EntityToDto(TutorProfileDetails tutorProfileDetails);

@Named("getAreaOfExpertise")
    public ArrayList<expertise> getAreaOfExpertise(TutorProfileDetails tutorProfileDetails){

    ArrayList<expertise> AreaOfExpertise=new ArrayList<>();
    for(ExpertiseAreas area: tutorProfileDetails.getAreaOfExpertise()){
        expertise exp=new expertise();
        exp.setCategory(area.getCategory().getCategoryName());
        exp.setSubCategory(area.getSubCategory().getSubCategoryName());
        exp.setPrice(area.getPrice());
        AreaOfExpertise.add(exp);
    }

    return AreaOfExpertise;
}

}
