package fG.Service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import fG.DAO.MeetingDao;
import fG.Entity.BookingDetails;
import fG.Entity.ScheduleData;
import fG.Model.ScheduleTime;

@Service
public class ScheduleService {
	
	@Autowired
	MeetingDao meetingDao;
	
	// for getting next 7 days
	public ArrayList<Date> next7Dates() {
		ArrayList<Date> dateArray = new ArrayList<Date>();
		for (int i = 0; i < 7; i++) {
			Calendar c = Calendar.getInstance();
			c.setTime(new Date());
			c.add(Calendar.DATE, i);
			Date date = c.getTime();
			dateArray.add(date);
		}
		return dateArray;
	}

	// for getting time Array
	public ArrayList<ScheduleTime> getTimeArray(ArrayList<ScheduleData> availableSchedules,Integer tid) {
       
		// time array
		ArrayList<ScheduleTime> timeArray = new ArrayList<ScheduleTime>();

		// date array which contains the next 7 dates in dd/MM/yyyy format
		ArrayList<Date> dateArray = next7Dates();
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		//todayDate string
		 Date todayDate = new Date();
		 String todayDateString = formatter.format(todayDate);
		// outer loop call itself for every date in date array
		for (Date date : dateArray) {
			System.out.println("-----------------------------------------------------------");
			System.out.println("iteration -> " + formatter.format(date));
			System.out.println("-----------------------------------------------------------");
			// inside every date every schedule is called which is inside the available
			// schedules
			for (ScheduleData schedule : availableSchedules) {
				int sh, sm, eh, em;
				System.out.println("new schedule");

				// dates with time
				Date startTimeSchedule = new Date(schedule.StartTime);
				Date endTimeSchedule = new Date(schedule.EndTime);

				System.out.println("start hours ->" + startTimeSchedule.getHours());
				System.out.println("start minutes ->" + startTimeSchedule.getMinutes());
				System.out.println("end hours ->" + endTimeSchedule.getHours());
				System.out.println("end minutes ->" + endTimeSchedule.getMinutes());

				// formatted date strings
				String startTimeString = formatter.format(startTimeSchedule);
				String endTimeString = formatter.format(endTimeSchedule);
				String currentDateString = formatter.format(date);

				// in this condition it is checked whether the start time and end time date
				// matches or not
				if ((currentDateString.equals(startTimeString)) && (currentDateString.equals(endTimeString))) {
					System.out.println("dates are equal !");
					// if is all day is true
					if (schedule.IsAllDay == true) {
						ArrayList<ScheduleTime> timeSlots = new ArrayList<ScheduleTime>();
						sh = 0;
						sm = 0;
						eh = 0;
						em = 0;
						System.out.println("sh :" + sh + "sm :" + sm + "eh :" + eh + "em :" + em);
						timeSlots = createTimeSlots(sh, sm, eh, em, currentDateString);
						for (ScheduleTime tp : timeSlots) {
							timeArray.add(tp);
						}
						// if all day is false
					} else {
						ArrayList<ScheduleTime> timeSlots = new ArrayList<ScheduleTime>();
						sh = startTimeSchedule.getHours();
						sm = startTimeSchedule.getMinutes();
						eh = endTimeSchedule.getHours();
						em = endTimeSchedule.getMinutes();
						System.out.println("sh :" + sh + "sm :" + sm + "eh :" + eh + "em :" + em);
						timeSlots = createTimeSlots(sh, sm, eh, em, currentDateString);
						for (ScheduleTime tp : timeSlots) {
							timeArray.add(tp);
						}
					}
					// if end date is next day
				} else if ((date.compareTo(startTimeSchedule) == 0) && (date.compareTo(endTimeSchedule)) != 0) {
					ArrayList<ScheduleTime> timeSlots = new ArrayList<ScheduleTime>();
					System.out.println();
					sh = startTimeSchedule.getHours();
					sm = startTimeSchedule.getMinutes();
					eh = 0;
					em = 0;
					System.out.println("sh :" + sh + "sm :" + sm + "eh :" + eh + "em :" + em);
					timeSlots = createTimeSlots(sh, sm, eh, em, currentDateString);
					for (ScheduleTime tp : timeSlots) {
						timeArray.add(tp);
					}
					// if start time and endtime date doesn't match
				} else if ((currentDateString.equals(startTimeString) == false)
						&& (currentDateString.equals(endTimeString) == false)) {
					System.out.println("-----------------------------------------------------------");
					System.out.println("dates don't match !");
					int flag = 0;
					for (ScheduleData scheduleException : availableSchedules) {
						System.out.println("-------------------------------------------------");
						System.out.println("New Exception Schedule ");
						System.out.println("schedule ->" + scheduleException);
						Date startTimeExceptionSchedule = new Date(scheduleException.StartTime);
						Date endTimeExceptionSchedule = new Date(scheduleException.EndTime);
						String startTimeExceptionString = formatter.format(startTimeExceptionSchedule);
						String endTimeExceptionString = formatter.format(endTimeExceptionSchedule);
						System.out.println("start time exception ->" + startTimeExceptionSchedule);
						System.out.println("end time exception  ->" + endTimeExceptionSchedule);
						System.out.println("start time exception date->" + startTimeExceptionString);
						System.out.println("end time exception date ->" + endTimeExceptionString);
						System.out.println("current date->" + currentDateString);

						if ((currentDateString.equals(startTimeExceptionString))
								&& (currentDateString.equals(endTimeExceptionString))) {
							if ((scheduleException.RecurrenceID != null) && (scheduleException.RecurrenceRule != null)
									&& (scheduleException.RecurrenceException != null)) {
								flag = 1;
								System.out.println("-----------------------------------------------------------");
								System.out.println("exception found so no recurrence !");

							}
							System.out.println("-----------------------------------------------------------");
						} else {
							System.out.println("current date don't match !");
						}
					}
					if (flag == 0) {
						if ((schedule.RecurrenceRule != null) && (schedule.RecurrenceID == null)) {
							ArrayList<ScheduleTime> timeSlots = new ArrayList<ScheduleTime>();
							sh = startTimeSchedule.getHours();
							sm = startTimeSchedule.getMinutes();
							eh = endTimeSchedule.getHours();
							em = endTimeSchedule.getMinutes();
							System.out.println("sh :" + sh + "sm :" + sm + "eh :" + eh + "em :" + em);
							timeSlots = createTimeSlots(sh, sm, eh, em, currentDateString);
							for (ScheduleTime tp : timeSlots) {
								timeArray.add(tp);
							}
						}
					}
				}
			}
			System.out.println(formatter.format(date));
		}
		System.out.println("-----------------------------------------------------------");
		System.out.println("calling delete Bookings slots");
		timeArray = deleteBookingsFromTimeSlots(timeArray,tid);
		timeArray = eliminateBeforeTimeBookings(timeArray);
		System.out.println(timeArray);
		return timeArray;
	}

	// for creating time packets
	public ArrayList<ScheduleTime> createTimeSlots(int sh, int sm, int eh, int em, String date) {
		System.out.println("-----------------------------------------------------------");
		System.out.println("in create Time slots");
		System.out.println("sh :" + sh + "sm :" + sm + "eh :" + eh + "em :" + em);
		ArrayList<ScheduleTime> timeArray = new ArrayList<ScheduleTime>();
		ScheduleTime initialTimePacket = new ScheduleTime();
		initialTimePacket.setHours(sh);
		initialTimePacket.setMinutes(sm);
		initialTimePacket.setDate(date);
		timeArray.add(initialTimePacket);

//    	ScheduleTime timePacket = new ScheduleTime();
		if (eh == 0) {
			eh = 24;
		}
		while (sh <= eh) {
//			System.out.println("called !");
			ScheduleTime timePacket = new ScheduleTime();
			int totalStartTime = (sh * 60) + sm;
			int totalEndTime = ((eh * 60) + em) ;
			if (totalStartTime < totalEndTime) {
				sm = sm + 30;
				if (sm == 60) {
					sm = 0;
					sh += 1;
				}
			} else {
				break;
			}
			timePacket.setHours(sh);
			timePacket.setMinutes(sm);
			timePacket.setDate(date.toString());
			System.out.println("time Packet ->" + timePacket);
			timeArray.add(timePacket);
		}
		System.out.println("-----------------------------------------------------------");
		return timeArray;

	}
    public ArrayList<ScheduleTime> eliminateBeforeTimeBookings(ArrayList<ScheduleTime> timeSlots){
    	SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
    	ArrayList<ScheduleTime> eliminateArray = new ArrayList<ScheduleTime>();
		//todayDate string
		 Date todayDate = new Date();
		 String todayDateString = formatter.format(todayDate);
		 for(ScheduleTime tp:timeSlots) {
			 if(tp.date.equals(todayDateString)) {
			
				 int totalCurrentMinutes = (todayDate.getHours()*60)+todayDate.getMinutes();
				 int tpTotalMinutes = (tp.getHours()*60)+tp.getMinutes();
				 if(tpTotalMinutes<totalCurrentMinutes) {
                     System.out.println("today's date before time");
					 eliminateArray.add(tp);
				 }
			 }
		 }
		 System.out.println(eliminateArray);
		 timeSlots.removeAll(eliminateArray);
		 return timeSlots; 
    }
	public ArrayList<ScheduleTime> deleteBookingsFromTimeSlots(ArrayList<ScheduleTime> timeSlots,Integer tid){
		System.out.println("-----------------------------------------------------------");
		System.out.println("in delete bookings from time slots");
		System.out.println("-----------------------------------------------------------");
		
		//getting date Array for next 7 dates
		ArrayList<Date> dateArray = next7Dates();
		
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		
		ArrayList<ScheduleTime> bookingArray = new ArrayList<ScheduleTime>();
		
		//fetching the list of all the approved tutor meetings
		ArrayList<BookingDetails> tutorBookings = (ArrayList<BookingDetails>) meetingDao.fetchApprovedListTutor(tid);
		
		// for finding all the bookings, converting them to slots and then adding them to booking array
		for(Date currentDate:dateArray) {

			String currentDateString = formatter.format(currentDate);
			System.out.println("-----------------------------------------------------------");
			System.out.println("Iteration -> "+currentDateString);
			System.out.println("-----------------------------------------------------------");
			if(tutorBookings!=null) {
			System.out.println("bookings are not null !");
			System.out.println(tutorBookings);
			for(BookingDetails booking:tutorBookings) {
					
					System.out.println("booking date ->"+booking.getDateOfMeeting());
					
					if(currentDateString.equals(booking.getDateOfMeeting())) {
						System.out.println("booking and current date matches !");
						
						ArrayList<ScheduleTime> bookingSlots = new ArrayList<ScheduleTime>();
						
						bookingSlots = createTimeSlots(booking.getStartTimeHour(),booking.getStartTimeMinute(),booking.getEndTimeHour(),booking.getEndTimeMinute(),booking.getDateOfMeeting());
						
					    for(ScheduleTime slot:bookingSlots) {
					    	bookingArray.add(slot);
					    }
					}
				}
			}else {
				System.out.println("no approved meetings ! for date ->"+currentDateString);
			}
		 }	
		//removing slots of bookings
		
		System.out.println("booking array ->"+bookingArray);
        timeSlots.removeAll(bookingArray);
        System.out.println("time array ->"+timeSlots);
		return timeSlots;
	}
	
	
//	public static void main(String[] args) throws ParseException 
//    { 
//        compareDates(); 
//    } 
}
