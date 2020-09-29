package fG.Model;

public class FiltersApplied{
	public String[] subjects;
	public String[] price;
	public Integer[] ratings;
	
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


	@Override
	public String toString() {
		return "FiltersAppliedModel [subjects=" + subjects + ", price=" + price + ", ratings=" + ratings + "]";
	}
	
	

}
