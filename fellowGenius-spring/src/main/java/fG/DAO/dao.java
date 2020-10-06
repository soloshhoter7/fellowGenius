package fG.DAO;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import javax.security.auth.Subject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;

import fG.Entity.BookingDetails;
import fG.Entity.ExpertiseAreas;
import fG.Entity.ScheduleData;
import fG.Entity.SocialLogin;
import fG.Entity.StudentLogin;
import fG.Entity.StudentProfile;
import fG.Entity.TutorAvailabilitySchedule;
import fG.Entity.TutorLogin;
import fG.Entity.TutorProfile;
import fG.Entity.TutorProfileDetails;
import fG.Entity.TutorVerification;
import fG.Entity.Users;
import fG.Model.StudentLoginModel;
import fG.Model.TutorAvailabilityScheduleModel;
import fG.Model.TutorVerificationModel;
import fG.Repository.repositoryBooking;
import fG.Repository.repositoryExpertiseAreas;
import fG.Repository.repositoryLearningAreas;
import fG.Repository.repositorySocialLogin;
import fG.Repository.repositoryStudentLogin;
import fG.Repository.repositoryStudentProfile;
import fG.Repository.repositoryTutorAvailabilitySchedule;
import fG.Repository.repositoryTutorLogin;
import fG.Repository.repositoryTutorProfile;
import fG.Repository.repositoryTutorProfileDetails;
import fG.Repository.repositoryTutorVerification;
import fG.Repository.repositoryUsers;

@Component
public class dao {
 
	@Autowired
	repositoryUsers repUsers;
	
	@Autowired
	repositoryStudentProfile repStudentProfile;

	@Autowired
	repositoryStudentLogin repStudentLogin;

	@Autowired
	repositoryTutorProfileDetails repTutorProfileDetails;

	@Autowired
	repositoryTutorProfile repTutorProfile;

	@Autowired
	repositoryTutorLogin repTutorLogin;

	@Autowired
	repositoryTutorVerification repTutorVerification;

	@Autowired
	repositorySocialLogin repSocialLogin;

	@Autowired
	repositoryTutorAvailabilitySchedule repTutorSchedule;
	
	@Autowired
	repositoryLearningAreas repLearingAreas;
	
	@Autowired
	repositoryExpertiseAreas repExpertiseAreas;
	
	@Autowired
	repositoryBooking repBooking;
	
	// for saving user profile
		public boolean saveUserLogin(Users user) {
			if (repUsers.save(user) != null) {
				return true;
			} else {
				return false;
			}
		}
		
	// for saving student profile details
	public boolean saveStudentProfile(StudentProfile studentProfile) {
		if (repStudentProfile.emailExist(studentProfile.getEmail()) == null) {
			repStudentProfile.save(studentProfile);
			return true;
		} else {
			return false;
		}
	}
	
	// for getting tutor profile with tid
	public TutorProfile getTutorProfile(Integer tid) {
		return repTutorProfile.idExist(tid);
	}

	// for saving student login details
	public boolean saveStudentLogin(StudentLogin studentLogin) {
		if (repStudentLogin.save(studentLogin) != null) {
			return true;
		} else {
			return false;
		}
	}

	// for validating student login
	public boolean onStudentLogin(StudentLoginModel studentLogin) {
		if (repStudentLogin.validation(studentLogin.getEmail(), studentLogin.getPassword()) != null) {
			return true;
		} else {
			return false;
		}
	}
    
	public boolean findStudentBySid(Integer sid) {
		if(repStudentLogin.idExists(sid)!=null) {
			return true;
		}else {
			return false;
		}
	}
	// for getting student details after login
	public StudentProfile getStudentDetails(String userId) {
		return repStudentProfile.idExist(Integer.valueOf(userId));
	}

	// for saving tutor registration details
	public boolean saveTutorProfile(TutorProfile tutorProfile) {
		if (repTutorProfile.emailExist(tutorProfile.getEmail()) == null) {
			repTutorProfile.save(tutorProfile);
			return true;
		} else {
			return false;
		}
	}

	// for updating basic info of tutor
	public void updateTutorBasicInfo(TutorProfile tutorProfile) {
		repTutorProfile.save(tutorProfile);
	}

	// for saving tutor login credentials
	public void saveTutorLogin(TutorLogin tutorLogin) {
		repTutorLogin.save(tutorLogin);
	}

//	// for validating tutor
//	public boolean onTutorLogin(TutorLoginModel tutorLoginModel) {
//		if (repTutorLogin.validation(tutorLoginModel.getEmail(), tutorLoginModel.getPassword()) != null) {
//			return true;
//		} else {
//			return false;
//		}
//	}

	// for updating tutor profile details
	public void updateTutorProfile(TutorProfileDetails tutor) {
		repTutorProfileDetails.save(tutor);
	}

	// for getting tutors list whose profile completed is 100% for finding tutors 
	public List<TutorProfileDetails> getTutorList() {
		return repTutorProfileDetails.findAllTutors();
	}

	// for getting tutor details using email
	public TutorProfile getTutorDetails(String userId) {
		return repTutorProfile.idExist(Integer.valueOf(userId));
	}

	// for saving tutor profile details
	public void saveTutorID(TutorProfileDetails tutDetails) {
		repTutorProfileDetails.save(tutDetails);

	}

	// for saving tutor Verification Details
	public void saveTutorVerification(TutorVerification tutorVerification) {
		repTutorVerification.save(tutorVerification);
	}

	// for updating tutor verification
	public boolean updateTutorVerification(TutorVerificationModel tutorVerify) {
		repTutorVerification.updateTutorVerification(tutorVerify.getCountry(), tutorVerify.getState(),
				tutorVerify.getIdType(), tutorVerify.getIdNumber(), tutorVerify.getIdDocUrl(),
				tutorVerify.getEducationType(), tutorVerify.getEducationInstitution(), tutorVerify.getFieldOfStudy(),
				tutorVerify.getEducationDocUrl(), tutorVerify.getTid());
		return true;
	}

	// for getting tutor profile details
	public TutorProfileDetails getTutorProfileDetails(Integer tid) {
		System.out.println("oeee"+repTutorProfileDetails.idExist(tid));
		return repTutorProfileDetails.idExist(tid);
	}

	// for updating profile completed %
	public void updateProfileCompleted(Integer profileCompleted, Integer tid) {
		repTutorProfileDetails.updateProfileCompleted(profileCompleted, tid);
	}

	// for saving social login details
	public boolean saveSocialLogin(SocialLogin socialLogin) {
		if (repTutorProfile.emailExist(socialLogin.getEmail()) != null) {
			return false;
		} else {
			TutorProfile tutProf = new TutorProfile();
			tutProf.setEmail(socialLogin.getEmail());
			tutProf.setFullName(socialLogin.getFullName());
			repTutorProfile.save(tutProf);
			TutorProfile tProfile = repTutorProfile.emailExist(socialLogin.getEmail());
			Integer tid = tProfile.getTid();
			socialLogin.setTid(tid);

			repSocialLogin.save(socialLogin);

			TutorProfileDetails tutProfileDetails = new TutorProfileDetails();
			tutProfileDetails.setTid(tid);
			tutProfileDetails.setFullName(socialLogin.getFullName());
			tutProfileDetails.setProfileCompleted(12);
			repTutorProfileDetails.save(tutProfileDetails);

			TutorVerification tutVerification = new TutorVerification();
			tutVerification.setTid(tid);
			repTutorVerification.save(tutVerification);

			TutorAvailabilitySchedule tutSchedule = new TutorAvailabilitySchedule();
			tutSchedule.setTid(tid);
			tutSchedule.setFullName(socialLogin.getFullName());
			tutSchedule.setIsAvailable("yes");
			repTutorSchedule.save(tutSchedule);
			return true;
		}

	}
	
//	// for checking social login if id already exists
//	public boolean checkSocialLogin(String email) {
//		if (repSocialLogin.checkSocialLogin(email) != null) {
//			return true;
//		} else {
//			return false;
//		}
//
//	}

	// for saving and updating tutor availability schedule
	public void saveTutorAvailbilitySchedule(TutorAvailabilitySchedule tutSchedule) {
		repTutorSchedule.save(tutSchedule);
	}

	// for receiving tutor availability schedule
	public TutorAvailabilityScheduleModel getTutorAvailabilitySchedule(Integer tid) {
		TutorAvailabilityScheduleModel tutScheduleModel = new TutorAvailabilityScheduleModel();
		ArrayList<ScheduleData> availableSchedules = new ArrayList<ScheduleData>();
		TutorAvailabilitySchedule Schedule = repTutorSchedule.idExist(tid);
		if (Schedule.getAllAvailabilitySchedule() != null) {
			for (String schd : Schedule.getAllAvailabilitySchedule()) {
				availableSchedules.add(new Gson().fromJson(schd, ScheduleData.class));
			}
		}
		tutScheduleModel.setAllAvailabilitySchedule(availableSchedules);
		tutScheduleModel.setFullName(Schedule.getFullName());
		tutScheduleModel.setTid(Schedule.getTid());
		tutScheduleModel.setIsAvailable(Schedule.getIsAvailable());
		return tutScheduleModel;
	}

	// for updating student profile
	public boolean updateStudentProfile(StudentProfile studentProfile) {
		repStudentProfile.save(studentProfile);	
		return true;

	}

	// for fetching top tutor list
	public ArrayList<TutorProfileDetails> fetchTopTutorList(String subject) {
		ArrayList<TutorProfileDetails> topTutors = repTutorProfileDetails.fetchTopTutorList(subject);
		ArrayList<TutorProfileDetails> eliminatingTutors = new ArrayList<TutorProfileDetails>();
		for (TutorProfileDetails availableTeacher : topTutors) {
			int index = topTutors.indexOf(availableTeacher);

			if (checkTutorAvailability(availableTeacher.getTid()) == false) {

				eliminatingTutors.add(availableTeacher);
			}
		}
		topTutors.removeAll(eliminatingTutors);
		return topTutors;
	}

	// for checking tutor availability status
	public boolean checkTutorAvailability(Integer tid) {
		TutorAvailabilitySchedule schedule = new TutorAvailabilitySchedule();
		schedule = repTutorSchedule.fetchAvailableTutor(tid);

		if (schedule == null) {
			System.out.println("found null");
			return false;
		} else {
			return true;
		}

	}

	// for changing availability status of tutor
	public void changeAvailabilityStatus(int tid, String availabilityStatus) {
		repTutorSchedule.changeAvailabilityStatus(availabilityStatus, tid);
	}
	
	// for getting student profile
	public StudentProfile getStudentProfile(Integer sid) {
		return repStudentProfile.idExist(sid);
	}

	//
//	public boolean learningAreasCount(ArrayList<String> learningAreas) {
//		System.out.println(learningAreas);
//		for(String learnAreas: learningAreas) {
//			System.out.println(learnAreas);
//			repLearningAreasCount.learningAreasCount(learnAreas);
//		}
//		return true;
//	}

	public void subtractArea(int id, String subject, String role) {
		if(role.equals("Learner")) {
			repLearingAreas.deleteSubject(id, subject);
		}else if(role.equals("Expert")) {
			System.out.println("called expert");
			System.out.println(id+":"+subject+":"+role);
			System.out.println(repExpertiseAreas.deleteSubject(id, subject));
		}
	}

	public List<TutorProfileDetails> fetchAllLinkedTutors(Integer userId) {
		List<BookingDetails> bookinglist = repBooking.fetchAllLinkedTutors(userId);
		List<TutorProfileDetails> tutorsList = new ArrayList<TutorProfileDetails>();
		for(BookingDetails id: bookinglist) {
			if(!tutorsList.stream().filter(o->o.getTid().equals(id.getTutorId())).findFirst().isPresent()) {
				tutorsList.add(repTutorProfileDetails.idExist(id.getTutorId()));		
			}
		}
		return tutorsList;
	}

	public List<TutorProfileDetails> filtersApplied(String[] subjects, String[] price, Integer[] ratings) {
		
		//CASE 1
		if(subjects.length>0 && price.length>0) {
			List<ExpertiseAreas> subjectWiseFilters  = new ArrayList<ExpertiseAreas>();
			List<TutorProfileDetails> priceWiseTutors = new ArrayList<TutorProfileDetails>();
			List<TutorProfileDetails> ratingWiseTutors = new ArrayList<TutorProfileDetails>();
			
			// got all tutors for required subject
			for(String subject: subjects) {
				subjectWiseFilters.addAll(repExpertiseAreas.searchBySubject(subject));		
			}
			
			for(String priceRange: price) {
				Integer lowerValue = Integer.valueOf(priceRange.split("-")[0]);
				Integer higherValue = Integer.valueOf(priceRange.split("-")[1]);
				for(ExpertiseAreas subjectWiseFilt: subjectWiseFilters) {
					Long id = subjectWiseFilt.getId();
					if(!priceWiseTutors.contains(subjectWiseFilt.getUserId())) {
						System.out.println("NULL AE");
//						System.out.println(repExpertiseAreas.searchByPrice(lowerValue, higherValue, id));
						if(repExpertiseAreas.searchByPrice(lowerValue, higherValue, id)!=null) {
							priceWiseTutors.add(repExpertiseAreas.searchByPrice(lowerValue, higherValue, id).getUserId());
						}
						
					}
				}
			}
		
			if(ratings.length==0) {
				return priceWiseTutors;
			}else {
				for(TutorProfileDetails ratingWise: priceWiseTutors) {
					Integer rating = ratingWise.getRating();
					if(rating>=ratings[0]) {
						ratingWiseTutors.add(ratingWise);
					}
				}
				return ratingWiseTutors;
			}
		}
		
		//CASE 2
		else if(subjects.length>0 && price.length==0) {
			List<ExpertiseAreas> subjectWiseFilters  = new ArrayList<ExpertiseAreas>(); 
			List<TutorProfileDetails> subjectWiseTutors = new  ArrayList<TutorProfileDetails>();
			List<TutorProfileDetails> ratingWiseTutors = new ArrayList<TutorProfileDetails>();
			
			for(int i=0; i<subjects.length;i++) {
				subjectWiseFilters.addAll(repExpertiseAreas.searchSubject(subjects[i]));	
			}
			
			for(ExpertiseAreas subjectWiseFilt: subjectWiseFilters) {
				if(!subjectWiseTutors.contains(subjectWiseFilt.getUserId())) {
					subjectWiseTutors.add(subjectWiseFilt.getUserId());
				}
			}

			
			if(ratings.length==0) {
				return subjectWiseTutors;
			}else {
				for(TutorProfileDetails ratingWise: subjectWiseTutors) {
					Integer rating = ratingWise.getRating();
					System.out.println("................................................");
					System.out.println(rating);
					if(rating>=ratings[0]) {
						ratingWiseTutors.add(ratingWise);
					}
				}
				return ratingWiseTutors;
			}
			
		}
		//CASE 3
		else if(subjects.length==0 && price.length>0) {
			 
			List<TutorProfileDetails> priceWiseTutors = new ArrayList<TutorProfileDetails>();
			List<ExpertiseAreas> priceWiseFilters = new ArrayList<ExpertiseAreas>();
			List<TutorProfileDetails> ratingWiseTutors = new ArrayList<TutorProfileDetails>();
			
			for(String priceRange: price) {
				Integer lowerValue = Integer.valueOf(priceRange.split("-")[0]);
				Integer higherValue = Integer.valueOf(priceRange.split("-")[1]);
				priceWiseFilters.addAll(repExpertiseAreas.searchPrice(lowerValue, higherValue));

			}
			
			for(ExpertiseAreas priceWiseFilt : priceWiseFilters) {
				if(!priceWiseTutors.contains(priceWiseFilt.getUserId())) {
					priceWiseTutors.add(priceWiseFilt.getUserId());
				}
			}
			
			if(ratings.length==0) {
				return priceWiseTutors;
			}else {
				for(TutorProfileDetails ratingWise: priceWiseTutors) {
					Integer rating = ratingWise.getRating();
					if(rating>=ratings[0]) {
						ratingWiseTutors.add(ratingWise);
					}
				}
				return ratingWiseTutors;
			}
		}
		
		//CASE 4
		else if(subjects.length==0 && price.length==0) {
			if(ratings.length>0) {
				return repTutorProfileDetails.searchByRatings(ratings[0]);
			}else {
				return null;
			}
			
		}
		return null;	
		
	}

    

}