package fG.Controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fG.Model.TutorProfileDetailsModel;
import fG.Model.TutorProfileModel;
import fG.Service.AdminService;
import fG.Service.UserService;

@RestController
//@CrossOrigin(origins = "${crossOrigin}")
//@CrossOrigin(origins = {"https://fellowgenius.com","https://www.fellowgenius.com"})
@RequestMapping("/fellowGenius/Admin")
public class AdminController {

	@Autowired
	UserService service;
	
	@Autowired
	AdminService adminService;

	// for getting tutor profile details after login
	@PreAuthorize("hasAuthority('Admin')")
	@RequestMapping(value = "/getTutorProfileDetails", produces = { "application/json" })
	public TutorProfileDetailsModel getTutorProfileDetails(String tid) {
		return adminService.getTutorProfileDetails(Integer.valueOf(tid));
	}

		
}
