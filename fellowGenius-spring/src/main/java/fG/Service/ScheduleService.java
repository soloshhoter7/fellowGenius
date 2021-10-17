  package fG.Service;
import java.text.SimpleDateFormat;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.TimeZone;

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
	
	static Integer nextDateValue=0;
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
        nextDateValue=0;
		// time array
		ArrayList<ScheduleTime> timeArray = new ArrayList<ScheduleTime>();

		// date array which contains the next 7 dates in dd/MM/yyyy format
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
		ArrayList<Date> dateArray = next7Dates();
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		sdf.setTimeZone(TimeZone.getTimeZone("IST"));
		//todayDate string
		 Date todayDate = new Date();
		 String todayDateString = formatter.format(todayDate);
		// outer loop call itself for every date in date array
		for (Date date : dateArray) {
			nextDateValue+=1440;
			System.out.println("-----------------------------------------------------------");
			System.out.println("iteration -> " + formatter.format(date));
			System.out.println("-----------------------------------------------------------");
			// inside every date every schedule is called which is inside the available
			// schedules
			for (ScheduleData schedule : availableSchedules) {
				int sh, sm, eh, em;
				System.out.println("new schedule");
				System.out.println(schedule);
				// dates with time
				
				Date startTimeSchedule = new Date(schedule.StartTime);
				System.out.println(startTimeSchedule);
				
				Date endTimeSchedule = new Date(schedule.EndTime);
				System.out.println(endTimeSchedule);
		
				String istStartDate =  sdf.format(new Date(schedule.StartTime).getTime());
				System.out.println(istStartDate);
				
				String istEndDate =  sdf.format(new Date(schedule.EndTime).getTime());
				System.out.println(istEndDate);
				
				String[] stSplitSpaces= istStartDate.split(" ");
				String[] stSplitColons = stSplitSpaces[1].split(":");
				System.out.println("start hrs ="+stSplitColons[0]);
				System.out.println("start mins ="+stSplitColons[1]);
				
				String[] etSplitSpaces= istEndDate.split(" ");
				String[] etSplitColons = etSplitSpaces[1].split(":");
				System.out.println("end hrs ="+etSplitColons[0]);
				System.out.println("end minutes ="+etSplitColons[1]);
				
			
				System.out.println("start hours ->" + Integer.valueOf(stSplitColons[0])); //stSplitColons[0]
				System.out.println("start minutes ->" +Integer.valueOf(stSplitColons[1])); //stSplitColons[1]
				System.out.println("end hours ->" + Integer.valueOf(etSplitColons[0])); // etSplitColons[0]
				System.out.println("end minutes ->" + Integer.valueOf(etSplitColons[1]));// etSplitColons[1]

				
				Integer startHours =Integer.valueOf(stSplitColons[0]);
				Integer startMinutes = Integer.valueOf(stSplitColons[1]);
				Integer endHours = Integer.valueOf(etSplitColons[0]);
				Integer endMinutes= Integer.valueOf(etSplitColons[1]);
				// formatted date strings
				String startTimeString = formatter.format(startTimeSchedule);
				String endTimeString = formatter.format(endTimeSchedule);
				String currentDateString = formatter.format(date);
				Calendar c = Calendar.getInstance(); 
				c.setTime(date); 
				c.add(Calendar.DATE, 1);
				String nextDateString = formatter.format(c.getTime());
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
						sh = startHours;
						sm = startMinutes;
						eh = endHours;
						em = endMinutes;
						System.out.println("sh :" + sh + "sm :" + sm + "eh :" + eh + "em :" + em);
						timeSlots = createTimeSlots(sh, sm, eh, em, currentDateString);
						for (ScheduleTime tp : timeSlots) {
							timeArray.add(tp);
						}
					}
					// if end date is next day
				} else if ((currentDateString.equals(startTimeString)) && (nextDateString.equals(endTimeString))) {
					ArrayList<ScheduleTime> timeSlots = new ArrayList<ScheduleTime>();
					System.out.println("end date is next day");
					sh = startHours;
					sm = startMinutes;
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
							sh = startHours;
							sm = startMinutes;
							eh = endHours;
							em = endMinutes;
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
		
		timeArray = eliminateBeforeTimeBookings(timeArray);
		timeArray = deleteBookingsFromTimeSlots(timeArray,tid);
		System.out.println("going to enter organise time slots");
		timeArray = organiseTimeSlots(timeArray);
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
		initialTimePacket.setTotalMinutes((sh*60)+sm+nextDateValue);
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
			timePacket.setTotalMinutes((sh*60)+sm+nextDateValue);
			System.out.println("time Packet ->" + timePacket);
			timeArray.add(timePacket);
		}
		System.out.println("-----------------------------------------------------------");
		return timeArray;

	}
	
	// for eliminating before time slots
    public ArrayList<ScheduleTime> eliminateBeforeTimeBookings(ArrayList<ScheduleTime> timeSlots){
    	TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
    	SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
    	formatter.setTimeZone(TimeZone.getTimeZone("Asia/Kolkata"));
    	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		sdf.setTimeZone(TimeZone.getTimeZone("Asia/Kolkata"));
    	ArrayList<ScheduleTime> eliminateArray = new ArrayList<ScheduleTime>();
		//todayDate string
		 Date todayDate = new Date();
		 ZoneId zoneId = ZoneId.of("Asia/Kolkata");
		 LocalTime time = LocalTime.now(zoneId);
		 String todayDateString = formatter.format(todayDate);
		 for(ScheduleTime tp:timeSlots) {
			 if(tp.date.equals(todayDateString)) {
			
				 int totalCurrentMinutes = (time.getHour()*60)+time.getMinute();
				 System.out.println("hours :"+time.getHour()+"minutes :"+time.getMinute());
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
    
    // for deleting bookings from time slots
	public ArrayList<ScheduleTime> deleteBookingsFromTimeSlots(ArrayList<ScheduleTime> timeSlots,Integer tid){
		System.out.println("-----------------------------------------------------------");
		System.out.println("in delete bookings from time slots");
		System.out.println("-----------------------------------------------------------");
		
		//getting date Array for next 7 dates
		ArrayList<Date> dateArray = next7Dates();
		
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		
		ArrayList<ScheduleTime> bookingArray = new ArrayList<ScheduleTime>();
		
		//fetching the list of all the approved tutor meetings
		ArrayList<BookingDetails> tutorBookings = (ArrayList<BookingDetails>) meetingDao.fetchAllTutorBookings(tid);
		
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
						
						
						// case 1
						if(booking.getBookingCase()==1) {
							if(booking.getEndTimeMinute()==0) {
								booking.setEndTimeMinute(30);
								booking.setEndTimeHour(booking.getEndTimeHour()-1);
							}else {
								booking.setEndTimeMinute(0);
							}	
							bookingSlots = createTimeSlots(booking.getStartTimeHour(),booking.getStartTimeMinute(),booking.getEndTimeHour(),booking.getEndTimeMinute(),booking.getDateOfMeeting());
						}
						//case 2
						else if(booking.getBookingCase()==2) {
							if(booking.getStartTimeMinute()==0) {
								booking.setStartTimeMinute(30);
							}else {
								booking.setStartTimeHour(booking.getStartTimeHour()+1);
								booking.setStartTimeMinute(0);
							}
							bookingSlots = createTimeSlots(booking.getStartTimeHour(),booking.getStartTimeMinute(),booking.getEndTimeHour(),booking.getEndTimeMinute(),booking.getDateOfMeeting());
						}
						// case 3
						else if(booking.getBookingCase()==3) {
							bookingSlots = createTimeSlots(booking.getStartTimeHour(),booking.getStartTimeMinute(),booking.getEndTimeHour(),booking.getEndTimeMinute(),booking.getDateOfMeeting());
						}
						// case 5
						else if(booking.getBookingCase()==5) {
							if(booking.getStartTimeMinute()==0) {
								booking.setStartTimeMinute(30);
							}else {
								booking.setStartTimeHour(booking.getStartTimeHour()+1);
								booking.setStartTimeMinute(0);
							}
							if(booking.getEndTimeMinute()==0) {
								booking.setEndTimeMinute(30);
								booking.setEndTimeHour(booking.getEndTimeHour()-1);
							}else {
								booking.setEndTimeMinute(0);
							}	
							bookingSlots = createTimeSlots(booking.getStartTimeHour(),booking.getStartTimeMinute(),booking.getEndTimeHour(),booking.getEndTimeMinute(),booking.getDateOfMeeting());
						}
					
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
	
	public ArrayList<ScheduleTime> organiseTimeSlots(ArrayList<ScheduleTime> timeSlots){
	    ArrayList<ScheduleTime> nonDuplicateSlots = new ArrayList<ScheduleTime>();
	    //for removing duplicates from timeSlots
		for(ScheduleTime slot:timeSlots) {
			if(!nonDuplicateSlots.contains(slot)) {
				nonDuplicateSlots.add(slot);
			}
		}
	  
		//for placing them in ascending order
        
		Collections.sort(nonDuplicateSlots, new Comparator<ScheduleTime>() {
			@Override
			public int compare(ScheduleTime o1, ScheduleTime o2) {
				return o1.getTotalMinutes() - o2.getTotalMinutes();
			}
		});
		timeSlots = nonDuplicateSlots;
		System.out.println(" time slots after reform ->"+timeSlots);
		return timeSlots;
	}
	
	
}