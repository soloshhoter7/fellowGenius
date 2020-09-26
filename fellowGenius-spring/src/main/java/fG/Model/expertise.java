package fG.Model;

public class expertise {
	String area;
	Integer price;
	public String getArea() {
		return area;
	}
	public void setArea(String area) {
		this.area = area;
	}
	public Integer getPrice() {
		return price;
	}
	public void setPrice(Integer price) {
		this.price = price;
	}
	@Override
	public String toString() {
		return "expertise [area=" + area + ", price=" + price + "]";
	}
}
