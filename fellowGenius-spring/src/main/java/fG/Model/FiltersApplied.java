package fG.Model;

import java.util.Arrays;

public class FiltersApplied{
	public String[] subjects;
	public String[] price;
	public Integer[] ratings;
	String domain;
	public String[] getSubjects() {
		return subjects;
	}


	public void setSubjects(String[] subjects) {
		this.subjects = subjects;
	}


	public String[] getPrice() {
		return price;
	}


	public void setPrice(String[] price) {
		this.price = price;
	}


	public Integer[] getRatings() {
		return ratings;
	}


	public void setRatings(Integer[] ratings) {
		this.ratings = ratings;
	}

	
	public String getDomain() {
		return domain;
	}


	public void setDomain(String domain) {
		this.domain = domain;
	}


	@Override
	public String toString() {
		return "FiltersApplied [subjects=" + Arrays.toString(subjects) + ", price=" + Arrays.toString(price)
				+ ", ratings=" + Arrays.toString(ratings) + ", domain=" + domain + "]";
	}


	

}
