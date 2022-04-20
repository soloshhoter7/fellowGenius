package fG.Mapper;

import fG.Entity.Users;
import fG.Model.registrationModel;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class UsersMapper {

    public abstract Users UsersDtoToUser(registrationModel registrationModel);


}
