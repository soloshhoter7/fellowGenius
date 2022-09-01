package fG.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.common.collect.ArrayListMultimap;
import com.google.common.collect.Multimap;

import fG.Entity.AppInfo;
import fG.Entity.CategoryList;
import fG.Entity.SubcategoryList;
import fG.Model.AppInfoModel;
import fG.Repository.repositoryAppInfo;
import fG.Repository.repositoryCategory;
import fG.Repository.repositorySubCategoryList;

@Service
public class AppService {
	@Autowired
	repositoryCategory repCategory;
	
	@Autowired
	repositorySubCategoryList repSubcategory;
		
	@Autowired
	repositoryAppInfo repAppInfo;
	
	@PostConstruct
	private void addAppInfo() {
		if(repAppInfo.findAll().isEmpty()) {
			AppInfo appInfo = new AppInfo();
			appInfo.setKeyName("GST_value");
			appInfo.setValue("18");
			appInfo.setType("Earnings");
			repAppInfo.save(appInfo);
			appInfo.setKeyName("commission");
			appInfo.setValue("12.5");
			appInfo.setType("Earnings");
			repAppInfo.save(appInfo);
			appInfo.setKeyName("redeemedCreditPercentage");
			appInfo.setValue("50");
			appInfo.setType("Earnings");
			repAppInfo.save(appInfo);
			appInfo.setKeyName("admin_id");
			appInfo.setValue("fellowgenius@admin");
			appInfo.setType("login");
			repAppInfo.save(appInfo);
			appInfo.setKeyName("admin_password");
			appInfo.setValue("fg@czdq124c6");
			appInfo.setType("login");
			repAppInfo.save(appInfo);
			appInfo.setKeyName("refund_time");
			appInfo.setValue("120");
			appInfo.setType("Meeting");
			repAppInfo.save(appInfo);
			appInfo.setKeyName("reschedule_time");
			appInfo.setValue("120");
			appInfo.setType("Meeting");
			repAppInfo.save(appInfo);
			
			appInfo.setKeyName("ReferralExpirationTime");
			appInfo.setValue("7");
			repAppInfo.save(appInfo);
			
			appInfo.setKeyName("ReferralMeetingCost");
			appInfo.setValue("500");
			repAppInfo.save(appInfo);
			
			appInfo.setKeyName("ReferralCredit");
			appInfo.setValue("200");
			repAppInfo.save(appInfo);
			
			appInfo.setKeyName("ReferralAmount");
			appInfo.setValue("200");
			repAppInfo.save(appInfo);
				
		}	
	}
	@PostConstruct
	public void addCategoriesAndSubCategories(){
		if(repCategory.findAll().isEmpty()) {
		List<String> categories = new ArrayList<>();
		categories.add("Sales and Business Development");
		categories.add("Marketing");
		categories.add("Finance");
		categories.add("HR");
		categories.add("Operations and SCM");
		categories.add("Strategy and Industry Expertise");
		categories.add("Programming and Technology");
		categories.add("New and Emerging Technologies");
		categories.add("Software Tools");
		categories.add("Personal Development");
		Multimap<String,String> subCategories = ArrayListMultimap.create();
		subCategories.put("Sales and Business Development", "Key Account Management");
		subCategories.put("Sales and Business Development", "Channel Management");
		subCategories.put("Sales and Business Development", "B2C Sales and Distribution");
		subCategories.put("Sales and Business Development", "E-commerce");

		subCategories.put("Marketing", "Product Management");
		subCategories.put("Marketing", "Marketing Communication");
		subCategories.put("Marketing", "Digital Marketing");
		subCategories.put("Marketing", "Brand Management");
		subCategories.put("Marketing", "Content Marketing");

		subCategories.put("Finance", "Accounting and Taxation");
		subCategories.put("Finance", "Contract Management");
		subCategories.put("Finance", "Investor Relations");
		subCategories.put("Finance", "Business Finance and Operations");
		subCategories.put("Finance", "Mergers and Acquisitions");
		
		subCategories.put("HR", "Talent Acquisition");
		subCategories.put("HR", "Organisation Design and Development");
		subCategories.put("HR", "Performance Management");
		subCategories.put("HR", "Compensation and Benefit");
		subCategories.put("HR", "Learning and Development");
		
		subCategories.put("Operations and SCM", "Logistics and Inventory Planning");
		subCategories.put("Operations and SCM", "Manufacturing Processes");
		subCategories.put("Operations and SCM", "Project Management");
		subCategories.put("Operations and SCM", "Procurement and Vendor Management");
		subCategories.put("Operations and SCM", "Quality Assurance");
		
		subCategories.put("Strategy and Industry Expertise", "Telecom");
		subCategories.put("Strategy and Industry Expertise", "FMCG");
		subCategories.put("Strategy and Industry Expertise", "IT/ITES");
		subCategories.put("Strategy and Industry Expertise", "Automotive");
		subCategories.put("Strategy and Industry Expertise", "Pharma");
		subCategories.put("Strategy and Industry Expertise", "Market Development Strategy");
		
		
		subCategories.put("Programming and Technology", "Website Development");
		subCategories.put("Programming and Technology", "Mobile Application Development");
		subCategories.put("Programming and Technology", "Game Development");
		subCategories.put("Programming and Technology", "Technology Architecture");
		subCategories.put("Programming and Technology", "Software QA and Testing");

		
		subCategories.put("New and Emerging technologies", "IoT");
		subCategories.put("New and Emerging technologies", "Blockchain");
		subCategories.put("New and Emerging technologies", "ML & AI");
		subCategories.put("New and Emerging technologies", "RPA");
		subCategories.put("New and Emerging technologies", "Fintech");

		
		subCategories.put("Software Tools", "MS Office Suite");
		subCategories.put("Software Tools", "Data Visualisation");
		subCategories.put("Software Tools", "Data Analytics");
		subCategories.put("Software Tools", "Graphics and Design");
	
		
		subCategories.put("Personal Development", "Career Counselling");
		subCategories.put("Personal Development", "Personal Finance");
		subCategories.put("Personal Development", "Interview Preparation");
		subCategories.put("Personal Development", "Wellness and Life Coaching");

		
		
			for(String categ:categories) {
				CategoryList newCateg = new CategoryList();
				newCateg.setCategoryName(categ);
				repCategory.save(newCateg);
			}
			
			for (Map.Entry entry: subCategories.entries()) {
				CategoryList ct = repCategory.findCategory(entry.getKey().toString());
				if(ct!=null) {
					SubcategoryList sc = new SubcategoryList();
					sc.setCategory(ct);
					sc.setSubCategoryName(entry.getValue().toString());
					repSubcategory.save(sc);
				}
			}
		}
	}

	public ArrayList<AppInfoModel> fetchAllAppInfo() {
		// TODO Auto-generated method stub
		List<AppInfo> AppInfoList=repAppInfo.findAll();
		ArrayList<AppInfoModel> result=new ArrayList<>();
		for(AppInfo appInfo:AppInfoList) {
			AppInfoModel appDTO=new AppInfoModel();
			appDTO.setKey(appInfo.getKeyName());
			appDTO.setValue(appInfo.getValue());
			result.add(appDTO);
		}
		return result;
	}
	public boolean updateAppInfo(AppInfoModel appInfoModel) {
		// TODO Auto-generated method stub
		String key=appInfoModel.getKey();
		String updatedValue=appInfoModel.getValue();
		
		AppInfo appInfo=repAppInfo.keyExist(key);
		appInfo.setValue(updatedValue);
		repAppInfo.save(appInfo);
		return true;
	}
}
