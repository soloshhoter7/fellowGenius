package fG.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import fG.Model.TutorProfileDetailsModel;
import fG.Model.TutorProfileModel;

@Service
public class AdminService {
	
	@Autowired
	UserService userService;

	public TutorProfileDetailsModel getTutorProfileDetails(Integer tid) {
		TutorProfileDetailsModel tut = new TutorProfileDetailsModel();
		TutorProfileModel tutP = new TutorProfileModel();
		tut = userService.getTutorProfileDetails(tid);
		tutP = userService.getTutorDetails(tid.toString());
		tut.setEmail(tutP.getEmail());
		tut.setDateOfBirth(tutP.getDateOfBirth());
		tut.setContact(tutP.getContact());
		return tut;
	}

}
