package fG.DAO;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;

import fG.Entity.BookingDetails;
import fG.Entity.CategoryList;
import fG.Entity.ExpertiseAreas;
import fG.Model.ScheduleData;
import fG.Entity.StudentProfile;
import fG.Entity.SubcategoryList;
import fG.Entity.TutorAvailabilitySchedule;
import fG.Entity.TutorProfile;
import fG.Entity.TutorProfileDetails;
import fG.Entity.Users;
import fG.Model.TutorAvailabilityScheduleModel;
import fG.Repository.repositoryBooking;
import fG.Repository.repositoryCategory;
import fG.Repository.repositoryExpertiseAreas;
import fG.Repository.repositoryLearningAreas;
import fG.Repository.repositoryStudentProfile;
import fG.Repository.repositorySubCategoryList;
import fG.Repository.repositoryTutorAvailabilitySchedule;
import fG.Repository.repositoryTutorProfile;
import fG.Repository.repositoryTutorProfileDetails;
import fG.Repository.repositoryUsers;

@Component
public class Dao {
 
	@Autowired
	repositoryUsers repUsers;
	
	@Autowired
	repositoryStudentProfile repStudentProfile;


	@Autowired
	repositoryTutorProfileDetails repTutorProfileDetails;

	@Autowired
	repositoryTutorProfile repTutorProfile;


	@Autowired
	repositoryTutorAvailabilitySchedule repTutorSchedule;
	
	@Autowired
	repositoryLearningAreas repLearningAreas;
	
	@Autowired
	repositoryExpertiseAreas repExpertiseAreas;
	
	@Autowired
	repositoryBooking repBooking;
	
	@Autowired
	repositorySubCategoryList repSubCategory;
	
	@Autowired
	repositoryCategory repCategory;
	
	// for saving user profile
	public void saveUserLogin(Users user) {
		repUsers.save(user);
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

	// for updating tutor profile details
	public void updateTutorProfile(TutorProfileDetails tutor) {
		repTutorProfileDetails.save(tutor);
	}
	
	public void updateExpertiseArea(ExpertiseAreas exp) {
		repExpertiseAreas.save(exp);
	}
	// for getting tutors list whose profile completed is 100% for finding tutors 
	public List<TutorProfileDetails> getTutorList(String subject) {
		System.out.println("subject : "+subject);
		List<TutorProfileDetails> tutors = new ArrayList<>();
		CategoryList categ = repCategory.findCategory(subject);
		System.out.println("categ : "+categ);
		if(categ!=null) {
			List<ExpertiseAreas> areas = repExpertiseAreas.searchByCategoryId(categ.getCategoryId());
			System.out.println(areas);
			if(areas!=null) {
				for(ExpertiseAreas results:areas) {
					if(!tutors.contains(results.getUserId())) {
						tutors.add(results.getUserId());
					}
				}
			}	
		}
//		return repTutorProfileDetails.findAllTutors();
		return tutors;
	}

	// for getting tutor details using email
	public TutorProfile getTutorDetails(String userId) {
		return repTutorProfile.idExist(Integer.valueOf(userId));
	}

	// for saving tutor profile details
	public void saveTutorID(TutorProfileDetails tutDetails) {
		repTutorProfileDetails.save(tutDetails);

	}

	// for getting tutor profile details
	public TutorProfileDetails getTutorProfileDetails(Integer tid) {
		System.out.println("oeee"+repTutorProfileDetails.idExist(tid));
		return repTutorProfileDetails.idExist(tid);
	}
    
	public TutorProfileDetails fetchTutorProfileDetailsByBookingId(Integer bookingId) {
		return repTutorProfileDetails.bookingIdExist(bookingId);
	}
	public TutorProfile fetchTutorProfileByBookingId(Integer bookingId) {
		return repTutorProfile.findByBookingId(bookingId);
	}
	// for updating profile completed %
	public void updateProfileCompleted(Integer profileCompleted, Integer tid) {
		repTutorProfileDetails.updateProfileCompleted(profileCompleted, tid);
	}

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
	public void updateStudentProfile(StudentProfile studentProfile) {
		repStudentProfile.save(studentProfile);

	}

	// for fetching top tutor list
	public ArrayList<TutorProfileDetails> fetchTopTutorList(String subject) {
		ArrayList<TutorProfileDetails> topTutors = repTutorProfileDetails.fetchTopTutorList(subject);
		ArrayList<TutorProfileDetails> eliminatingTutors = new ArrayList<>();
		for (TutorProfileDetails availableTeacher : topTutors) {
			if (!checkTutorAvailability(availableTeacher.getTid())) {
				eliminatingTutors.add(availableTeacher);
			}
		}
		topTutors.removeAll(eliminatingTutors);
		return topTutors;
	}

	// for checking tutor availability status
	public boolean checkTutorAvailability(Integer tid) {
		TutorAvailabilitySchedule schedule = repTutorSchedule.fetchAvailableTutor(tid);
		return schedule != null;

	}

	// for changing availability status of tutor
	public void changeAvailabilityStatus(int tid, String availabilityStatus) {
		repTutorSchedule.changeAvailabilityStatus(availabilityStatus, tid);
	}
	
	// for getting student profile
	public StudentProfile getStudentProfile(Integer sid) {
		return repStudentProfile.idExist(sid);
	}

	public void subtractArea(int id, String subject, String role) {
		if(role.equals("Learner")) {
			repLearningAreas.deleteSubject(id, subject);
		}else if(role.equals("Expert")) {
			Integer subCategId;
			SubcategoryList sc = repSubCategory.findSubCategoryByName(subject);
			if(sc!=null) {
				subCategId=sc.getSubCategoryId();
				System.out.println(repExpertiseAreas.deleteSubject(id, subCategId));
			}
		}
	}

	public List<TutorProfileDetails> fetchAllLinkedTutors(Integer userId) {
		List<BookingDetails> bookinglist = repBooking.fetchAllLinkedTutors(userId);
		List<TutorProfileDetails> tutorsList = new ArrayList<>();
		for(BookingDetails id: bookinglist) {
			if(tutorsList.stream().noneMatch(o->o.getBookingId().equals(id.getTutorId()))) {
				tutorsList.add(repTutorProfileDetails.bookingIdExist(id.getTutorId()));		
			}
		}
		return tutorsList;
	}

	public List<TutorProfileDetails> filtersApplied(String[] subjects, String[] price, Integer[] ratings,Integer categId,String[] domains) {
		
		List<ExpertiseAreas> domainWiseFilters = new ArrayList<>();
		if(domains.length != 0) {		
			//Filtering tutors on the basis of domain first
			for(String domain: domains) {
				CategoryList catList = repCategory.findCategory(domain);
				if(catList!=null) {
					List<ExpertiseAreas> tutors = repExpertiseAreas.searchUniqueTutorsByCategoryId(catList.getCategoryId());
					System.out.println(tutors);
					domainWiseFilters.addAll(tutors);
				}
			}
			
		}
		
		
		if(subjects.length>0 && price.length>0) {
			List<ExpertiseAreas> subjectWiseFilters  = new ArrayList<>();
			List<TutorProfileDetails> priceWiseTutors = new ArrayList<>();
			List<TutorProfileDetails> ratingWiseTutors = new ArrayList<>();
			
			// fetch all tutors for required subject
			for(String subject: subjects) {
				SubcategoryList subCateg = repSubCategory.findSubCategoryByName(subject);
				if(subCateg!=null) {
					List<ExpertiseAreas> tutors = repExpertiseAreas.searchBySubCategoryId(subCateg.getSubCategoryId());
					subjectWiseFilters.addAll(tutors);		
				}	
			}
			
			for(String priceRange: price) {
				Integer lowerValue = Integer.valueOf(priceRange.split("-")[0]);
				Integer higherValue = Integer.valueOf(priceRange.split("-")[1]);
				for(ExpertiseAreas subjectWiseFilt: subjectWiseFilters) {
					Long id = subjectWiseFilt.getId();
					if(!priceWiseTutors.contains(subjectWiseFilt.getUserId())) {
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
			List<ExpertiseAreas> subjectWiseFilters  = new ArrayList<>();
			List<TutorProfileDetails> subjectWiseTutors = new  ArrayList<>();
			List<TutorProfileDetails> ratingWiseTutors = new ArrayList<>();
			
			
			for(String subject: subjects) {
				SubcategoryList subCateg = repSubCategory.findSubCategoryByName(subject);
				if(subCateg!=null) {
					List<ExpertiseAreas> tutors = repExpertiseAreas.searchBySubCategoryId(subCateg.getSubCategoryId());
					subjectWiseFilters.addAll(tutors);		
				}	
			}
			
			for(ExpertiseAreas subjectWiseFilt: subjectWiseFilters) {
				if(!subjectWiseTutors.contains(subjectWiseFilt.getUserId())) {
					subjectWiseTutors.add(subjectWiseFilt.getUserId());
				}
			}
			
			for(ExpertiseAreas domainWiseFilt: domainWiseFilters) {
				if(!subjectWiseTutors.contains(domainWiseFilt.getUserId())) {
					subjectWiseTutors.add(domainWiseFilt.getUserId());
				}
			}

			if(ratings.length==0) {
				return subjectWiseTutors;
			}else {
				for(TutorProfileDetails ratingWise: subjectWiseTutors) {
					Integer rating = ratingWise.getRating();
					if(rating>=ratings[0]) {
						ratingWiseTutors.add(ratingWise);
					}
				}
				return ratingWiseTutors;
			}
			
		}
		//CASE 3
		else if(subjects.length==0 && price.length>0) {
			 
			List<TutorProfileDetails> priceWiseTutors = new ArrayList<>();
			List<ExpertiseAreas> priceWiseFilters = new ArrayList<>();
			List<TutorProfileDetails> ratingWiseTutors = new ArrayList<>();
			
			for(String priceRange: price) {
				Integer lowerValue = Integer.valueOf(priceRange.split("-")[0]);
				Integer higherValue = Integer.valueOf(priceRange.split("-")[1]);
				priceWiseFilters.addAll(repExpertiseAreas.searchPrice(lowerValue, higherValue,categId));

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