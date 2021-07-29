package fG.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.common.collect.ArrayListMultimap;
import com.google.common.collect.Multimap;

import fG.Entity.AppInfo;
import fG.Entity.CategoryList;
import fG.Entity.SubcategoryList;
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
				
		}	
	}
	@PostConstruct
	public void addCategoriesAndSubCategories(){
		if(repCategory.findAll().isEmpty()) {
		System.out.println("saving categories and sub categories in user service");
		List<String> categories = new ArrayList<String>();
		categories.add("Tools");
		categories.add("Marketing");
		categories.add("Content");
		categories.add("Project Management");
		categories.add("Sales");
		categories.add("E-Comm");
		categories.add("Industry Consulation");
		categories.add("Strategy");
		categories.add("Finance");
		categories.add("HR");
		categories.add("Operations");
		categories.add("IT Support");
		Multimap<String,String> subCategories = ArrayListMultimap.create();
		subCategories.put("Tools", "Ms Excel");
		subCategories.put("Tools", "Ms Word");
		subCategories.put("Tools", "Power Point");
		subCategories.put("Tools", "Tableau");
		subCategories.put("Tools", "Power BI");
		subCategories.put("Tools", "CAD");
		subCategories.put("Tools", "Adobe Illustrator");
		subCategories.put("Marketing", "NPD");
		subCategories.put("Marketing", "GTM");
		subCategories.put("Marketing", "Market Research");
		subCategories.put("Marketing", "Competitive Analysis");
		subCategories.put("Marketing", "Pricing Strategy");
		subCategories.put("Marketing", "Market Development Strategy");
		subCategories.put("Marketing", "Marketing Communication");
		subCategories.put("Marketing", "SEO");
		subCategories.put("Marketing", "SEM");
		subCategories.put("Marketing", "Social Media Marketing");
		subCategories.put("Marketing", "Web Analytics");
		subCategories.put("Marketing", "Loyalty Program Management");
		subCategories.put("Marketing", "Budget Planning");
		subCategories.put("Marketing", "Branding");
		subCategories.put("Content", "Social Media Content");
		subCategories.put("Content", "Product Literature");
		subCategories.put("Content", "Technical Literature");
		subCategories.put("Content", "Resume and Cover Letter");
		subCategories.put("Content", "SOPs");
		subCategories.put("Content", "PR");
		subCategories.put("Content", "Proofreading");
		subCategories.put("Content", "Translation");
		subCategories.put("Content", "Short form Content");
		subCategories.put("Content", "Video Storyboard and Concept");
		subCategories.put("Sales", "Video Script");
		subCategories.put("Sales", "Key Account Management");
		subCategories.put("Sales", "Pre-sales");
		subCategories.put("Sales", "Bid Management");
		subCategories.put("Sales", "General Trade");
		subCategories.put("Sales", "Modern Trade");
		subCategories.put("Sales", "Dealer Management");
		subCategories.put("Sales", "Secondary Sales");
		subCategories.put("Sales", "Tertiary Sales");
		subCategories.put("Sales", "RoI Calculation");
		subCategories.put("E-comm", "Product Research");
		subCategories.put("E-comm", "Product Upload");
		subCategories.put("E-comm", "Store Management");
		subCategories.put("Industry Consulation", "Telecom");
		subCategories.put("Industry Consulation", "FMCG");
		subCategories.put("Industry Consulation", "FMEG");
		subCategories.put("Industry Consulation", "Consumer Durables");
		subCategories.put("Industry Consulation", "Retail");
		subCategories.put("Industry Consulation", "Finance");
		subCategories.put("Industry Consulation", "IT/ITES");
		subCategories.put("Industry Consulation", "Automotive");
		subCategories.put("Industry Consulation", "Pharma");
		subCategories.put("Strategy", "Business Strategy");
		subCategories.put("Strategy", "B Plan");
		subCategories.put("Strategy", "Slide Deck - Pitch");
		subCategories.put("Strategy", "MnA");
		subCategories.put("Finance", "Taxes");
		subCategories.put("Finance", "Accounting and Bookkeeping");
		subCategories.put("Finance", "Contract Management");
		subCategories.put("Finance", "Investor Relations");
		subCategories.put("Finance", "MIS");
		subCategories.put("Finance", "Financial operations");
		subCategories.put("Finance", "Business Finance");
		subCategories.put("Finance", "Financial Forecasting and Modeling");
		subCategories.put("Finance", "Analysis, Valuation and Optimisation");
		subCategories.put("Finance", "Online Trading");
		subCategories.put("Finance", "Personal finance and wealth");
		subCategories.put("HR", "Recruitment");
		subCategories.put("HR", "Organisation Design/ Development");
		subCategories.put("HR", "HR Information system");
		subCategories.put("HR", "Performance Management");
		subCategories.put("HR", "Compensation and Benefit");
		subCategories.put("HR", "LnD");
		subCategories.put("HR", "Rewards");
		subCategories.put("HR", "Org/ Process Transition");
		subCategories.put("Operations", "Inventory Planning");
		subCategories.put("Operations", "Manufacturing");
		subCategories.put("Operations", "Project Management");
		subCategories.put("Operations", "Program Management");
		subCategories.put("Operations", "Quality");
		subCategories.put("Operations", "Logistics");
		subCategories.put("Operations", "Procurement and Vendor Management");
		subCategories.put("IT Support", "Website");
		subCategories.put("IT Support", "App");
		subCategories.put("IT Support", "Ecomm Portal");
		subCategories.put("IT Support", "Analysis and Dashboard");
		subCategories.put("IT Support", "IT support");
		
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
}
