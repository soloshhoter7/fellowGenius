package fG.Service;

import java.text.DecimalFormat;
import java.text.ParseException;
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
import fG.Model.KeyValueModel;
import fG.Model.ScheduleTime;

@Service
public class ScheduleService {

	@Autowired
	MeetingDao meetingDao;

	static Integer nextDateValue = 0;

	static Integer frameCount = 1;

	// for getting next 7 days
	public ArrayList<Date> getNextNumberOfDates(Date startDate, int days) {
		ArrayList<Date> dateArray = new ArrayList<Date>();
		System.out.println("days:" + days);
		for (int i = 0; i < days; i++) {
			Calendar c = Calendar.getInstance();
			c.setTime(startDate);
			c.add(Calendar.DATE, i);
			Date date = c.getTime();
			dateArray.add(date);
		}
		return dateArray;
	}

	ArrayList<KeyValueModel> breakRecurrenceRuleIntoParts(String rec) {
		ArrayList<KeyValueModel> constraints = new ArrayList<KeyValueModel>();
		String[] breaks = rec.split("[;]", 0);
		for (String br : breaks) {
			System.out.println(br);
			String[] splits = br.split("[=]", 0);
			KeyValueModel p = new KeyValueModel(splits[0], splits[1]);
			constraints.add(p);
		}
		return constraints;
	}

	ArrayList<String> breakByDayInRecurrenceRule(String byDay) {
		ArrayList<String> res = new ArrayList<String>();
		String[] breaks = byDay.split("[,]", 0);
		for (String br : breaks) {
			if (br.equals("SU")) {
				res.add("Sunday");
			} else if (br.equals("MO")) {
				res.add("Monday");
			} else if (br.equals("TU")) {
				res.add("Tuesday");
			} else if (br.equals("WE")) {
				res.add("Wednesday");
			} else if (br.equals("TH")) {
				res.add("Thursday");
			} else if (br.equals("FR")) {
				res.add("Friday");
			} else if (br.equals("SA")) {
				res.add("Saturday");
			}
		}
		return res;
	}

	Integer getDayOfTheWeek(String day) {
		if (day.equals("Sunday")) {
			return 1;
		} else if (day.equals("Monday")) {
			return 2;
		} else if (day.equals("Tuesday")) {
			return 3;
		} else if (day.equals("Wednesday")) {
			return 4;
		} else if (day.equals("Thursday")) {
			return 5;
		} else if (day.equals("Friday")) {
			return 6;
		} else if (day.equals("Saturday")) {
			return 7;
		}
		return 0;
	}

	Boolean checkIfRecurrenceException(String rex, String raw) {
		DecimalFormat formatter = new DecimalFormat("00");
		Integer year = 0, month = 0, d = 0;
		String[] splits = rex.split("[T]", 0);
		year = Integer.valueOf(splits[0].substring(0, 4));
		month = Integer.valueOf(splits[0].substring(4, 6));
		d = Integer.valueOf(splits[0].substring(6, 8));
		String res = formatter.format(d) + "/" + month + "/" + year;
		return res.equals(raw);
	}

	Date addDaysToDate(Date date, Integer days) {
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.add(Calendar.DATE, days);
		return cal.getTime();
	}

	String getDayFromDate(String dateInString) throws ParseException {
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		Date date = formatter.parse(dateInString);
		return new SimpleDateFormat("EEEE").format(date);
	}

	int WeekFromStart(Date start, Date curr) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(start);
		int startWeekOfYear = cal.get(Calendar.WEEK_OF_YEAR);
		cal.setTime(curr);
		int endWeekOfYear = cal.get(Calendar.WEEK_OF_YEAR);
		return (endWeekOfYear - startWeekOfYear) + 1;
	}

	int diffInDates(Date startDate, Date endDate) {
		ArrayList<String> datesInBetween = new ArrayList<String>();
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		Calendar cal = Calendar.getInstance();
		cal.setTime(startDate);
		int startDayOfTheYear = cal.get(Calendar.DAY_OF_YEAR);
		cal.setTime(endDate);
		int endDayOfTheYear = cal.get(Calendar.DAY_OF_YEAR);
		int diffInDates = endDayOfTheYear - startDayOfTheYear;
		return diffInDates;
	}

	Date removeTimeFromDate(Date date) throws ParseException {
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		date = formatter.parse(formatter.format(date));
		return date;
	}

	// for getting time Array
	public ArrayList<ScheduleTime> getTimeArray(ArrayList<ScheduleData> availableSchedules, Integer tid)
			throws ParseException {
		nextDateValue = 0;
		// time array
		ArrayList<ScheduleTime> timeArray = new ArrayList<ScheduleTime>();

		// date array which contains the next 7 dates in dd/MM/yyyy format
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
		ArrayList<Date> dateArray = getNextNumberOfDates(new Date(), 7);
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		sdf.setTimeZone(TimeZone.getTimeZone("IST"));
		// todayDate string
		Date todayDate = new Date();
		String todayDateString = formatter.format(todayDate);
		// outer loop call itself for every date in date array
		for (Date date : dateArray) {
			nextDateValue += 1440;
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

				int diffInDays = diffInDates(startTimeSchedule, endTimeSchedule);
				System.out.println("difference of days =>" + diffInDays);
				String istStartDate = sdf.format(new Date(schedule.StartTime).getTime());
				System.out.println(istStartDate);

				String istEndDate = sdf.format(new Date(schedule.EndTime).getTime());
				System.out.println(istEndDate);

				String[] stSplitSpaces = istStartDate.split(" ");
				String[] stSplitColons = stSplitSpaces[1].split(":");
				System.out.println("start hrs =" + stSplitColons[0]);
				System.out.println("start mins =" + stSplitColons[1]);

				String[] etSplitSpaces = istEndDate.split(" ");
				String[] etSplitColons = etSplitSpaces[1].split(":");
				System.out.println("end hrs =" + etSplitColons[0]);
				System.out.println("end minutes =" + etSplitColons[1]);

				System.out.println("start hours ->" + Integer.valueOf(stSplitColons[0])); // stSplitColons[0]
				System.out.println("start minutes ->" + Integer.valueOf(stSplitColons[1])); // stSplitColons[1]
				System.out.println("end hours ->" + Integer.valueOf(etSplitColons[0])); // etSplitColons[0]
				System.out.println("end minutes ->" + Integer.valueOf(etSplitColons[1]));// etSplitColons[1]

				Integer startHours = Integer.valueOf(stSplitColons[0]);
				Integer startMinutes = Integer.valueOf(stSplitColons[1]);
				Integer endHours = Integer.valueOf(etSplitColons[0]);
				Integer endMinutes = Integer.valueOf(etSplitColons[1]);
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

				if (schedule.RecurrenceRule != null && schedule.RecurrenceRule != "") {
					System.out.println("SCHEDULE WITH RECURRENCE RULE");
					ArrayList<KeyValueModel> constraints = breakRecurrenceRuleIntoParts(schedule.RecurrenceRule);
					System.out.println(constraints);
					String frequency = "";
					Integer interval = 0;
					String deLimitCon = "";
					String untilCon = "";
					Integer countCon = 0;
					Boolean isByDayCon = false;
					String byDayCon = "";
					// parsing the constraints from recurrence rule
					for (KeyValueModel con : constraints) {
						if (con.getKeyName().equals("FREQ")) {
							frequency = con.getValueName();
						} else if (con.getKeyName().equals("INTERVAL")) {
							interval = Integer.valueOf(con.getValueName());
						} else if (con.getKeyName().equals("UNTIL")) {
							deLimitCon = "UNTIL";
							System.out.println(con.getValueName());
							Integer year = 0, month = 0, d = 0;
							String[] splits = con.getValueName().split("[T]", 0);
							year = Integer.valueOf(splits[0].substring(0, 4));
							month = Integer.valueOf(splits[0].substring(4, 6));
							d = Integer.valueOf(splits[0].substring(6, 8));
							untilCon = d + "/" + month + "/" + year;
						} else if (con.getKeyName().equals("COUNT")) {
							deLimitCon = "COUNT";
							countCon = Integer.valueOf(con.getValueName());
						} else if (con.getKeyName().equals("BYDAY")) {
							isByDayCon = true;
							byDayCon = con.getValueName();
						}
					}

					Date lastDate = new Date();
					Date maxDate = dateArray.get(dateArray.size() - 1);
					ArrayList<String> validDatesAccInterval = new ArrayList<String>();
					ArrayList<String> excludeDatesAccRecException = new ArrayList<String>();
					long weekFromStart = WeekFromStart(startTimeSchedule, date);
					System.out.println("week from start : " + weekFromStart);
					if (frequency.equals("DAILY")) {
						System.out.println("its a DAILY recurrence rule");
						// finding the valid dates according to the interval

						for (int i = 0; i < 7 * weekFromStart; i += interval) {
							validDatesAccInterval.add(formatter.format(addDaysToDate(startTimeSchedule, i)));
						}
						System.out.println("VALID DATES ACC TO INTERVAL ARE :" + validDatesAccInterval);

					} else if (frequency.equals("WEEKLY")) {
						System.out.println("its a WEEKLY recurrence rule");
						// finding the valid dates according to the interval and byDays
						ArrayList<String> byDays = breakByDayInRecurrenceRule(byDayCon);
						System.out.println(byDays);

						String Day = getDayFromDate(currentDateString);
						if (weekFromStart % interval == 1 || interval == 1) {
							System.out.println("week is valid");
							String d = getDayFromDate(currentDateString);
							Integer dayOfTheWeek = getDayOfTheWeek(d);
							for (int i = dayOfTheWeek; i <= 7; i++) {
								String Date = formatter.format(addDaysToDate(date, (i - dayOfTheWeek)));
								if (byDays.contains(getDayFromDate(Date))) {
									validDatesAccInterval.add(Date);
								}
							}
						}
					}

					// matching the end constraints
					if (validDatesAccInterval.contains(currentDateString)) {
						if (deLimitCon.equals("UNTIL")) {
							lastDate = formatter.parse(untilCon);
							System.out.println("CONSTRAINT IS UNTIL");
							if (maxDate.getTime() > lastDate.getTime()) {
								maxDate = lastDate;
							}
						} else if (deLimitCon.equals("COUNT")) {
							ArrayList<String> validDatesAccCount = new ArrayList<String>();
							if (frequency.equals("DAILY")) {
								for (int i = 0; validDatesAccCount.size() < countCon; i += interval) {
									validDatesAccCount.add(formatter.format(addDaysToDate(startTimeSchedule, i)));
								}
								System.out.println("valid dates acc to count : " + validDatesAccCount);
							} else if (frequency.equals("WEEKLY")) {
								ArrayList<String> byDays = breakByDayInRecurrenceRule(byDayCon);
								System.out.println(byDays);
								String d = getDayFromDate(formatter.format(startTimeSchedule));
								Integer dayOfTheWeek = getDayOfTheWeek(d);
								Date StartingDate = startTimeSchedule;
								System.out.println("Starting Date ->"+StartingDate);
								for (int j = 1; validDatesAccCount.size()<countCon&&j<=weekFromStart; j++) {
									System.out.println("j="+j);
									System.out.println(j%interval);
									if (j % interval == 1 || interval == 1) {
										System.out.println("called");
										for (int i = dayOfTheWeek; i <= 7&&validDatesAccCount.size()<countCon; i++) {
											String Date = formatter.format(addDaysToDate(StartingDate, (i - dayOfTheWeek)));
											if (byDays.contains(getDayFromDate(Date))) {
												validDatesAccCount.add(Date);
											}
										}
									}
									System.out.println("Starting Date ->"+StartingDate);
									System.out.println("days added"+(8-dayOfTheWeek));
									StartingDate = addDaysToDate(StartingDate,(8-dayOfTheWeek));
									dayOfTheWeek = getDayOfTheWeek(getDayFromDate(formatter.format(StartingDate)));
									System.out.println("day of The Week : "+dayOfTheWeek);
									System.out.println("Starting Date ->"+StartingDate);
									System.out.println("valid dates acc to count : " + validDatesAccCount);
								}
								System.out.println("valid dates acc to count : " + validDatesAccCount);
								
							}
							lastDate = formatter.parse(validDatesAccCount.get(validDatesAccCount.size() - 1));
							System.out.println("CONSTRAINT IS COUNT");
							if (maxDate.getTime() > lastDate.getTime()) {
								maxDate = lastDate;
							}
						}
						maxDate = removeTimeFromDate(maxDate);
						System.out.println("last date : " + lastDate);
						System.out.println("last date formatted : " + formatter.format(lastDate));
						System.out.println("max date : " + maxDate);
						System.out.println("max date formatted : " + formatter.format(maxDate));
						Boolean excludeRex = false; // for parent event
						Boolean isRex = false; // for occurrence event

						// checking for recurrence Exception
						if (schedule.RecurrenceException != null && schedule.RecurrenceException != "") {
							System.out.println("Exception found :" + formatter.format(date));
							if (schedule.RecurrenceID != null) {
								System.out.println("occurrence event");
								if (checkIfRecurrenceException(schedule.RecurrenceException, formatter.format(date))) {
									isRex = true;
								}
							} else {
								System.out.println("parent event");
								String[] rexDates = schedule.RecurrenceException.split("[,]", 0);
								System.out.println("exception dates:" + rexDates);
								for (String rexD : rexDates) {
									System.out.println("rexDate =>" + rexD);
									if (checkIfRecurrenceException(rexD, formatter.format(date))) {
										System.out.println("called !");
										excludeRex = true;
										break;
									}
								}
							}

						}
						System.out.println("exclude Rex:" + excludeRex);
						System.out.println("isRex:" + isRex);

						date = removeTimeFromDate(date);
						System.out.println(date + ":" + date.getTime());
						System.out.println(maxDate + ":" + maxDate.getTime());
						if (date.getTime() <= maxDate.getTime()) {
							System.out.println((!excludeRex && schedule.RecurrenceID == null));
							if ((!excludeRex && schedule.RecurrenceID == null) || isRex) {
								if (diffInDays > 0) {
									ArrayList<Date> nextDates = getNextNumberOfDates(date, diffInDays + 1);
									System.out.println("nextDates =>" + nextDates);
									for (int i = 0; i < nextDates.size(); i++) {
										if (i == 0) {
											ArrayList<ScheduleTime> timeSlots = new ArrayList<ScheduleTime>();
											sh = startHours;
											sm = startMinutes;
											eh = 24;
											em = 0;
											System.out.println("sh :" + sh + "sm :" + sm + "eh :" + eh + "em :" + em);
											timeSlots = createTimeSlots(sh, sm, eh, em,
													formatter.format(nextDates.get(i)));
											for (ScheduleTime tp : timeSlots) {
												timeArray.add(tp);
											}
										} else if (i == nextDates.size() - 1) {
											ArrayList<ScheduleTime> timeSlots = new ArrayList<ScheduleTime>();
											sh = 0;
											sm = 0;
											eh = endHours;
											em = endMinutes;
											System.out.println("sh :" + sh + "sm :" + sm + "eh :" + eh + "em :" + em);
											timeSlots = createTimeSlots(sh, sm, eh, em,
													formatter.format(nextDates.get(i)));
											for (ScheduleTime tp : timeSlots) {
												timeArray.add(tp);
											}
										} else {
											ArrayList<ScheduleTime> timeSlots = new ArrayList<ScheduleTime>();
											sh = 0;
											sm = 0;
											eh = 24;
											em = 0;
											System.out.println("sh :" + sh + "sm :" + sm + "eh :" + eh + "em :" + em);
											timeSlots = createTimeSlots(sh, sm, eh, em,
													formatter.format(nextDates.get(i)));
											for (ScheduleTime tp : timeSlots) {
												timeArray.add(tp);
											}
										}
									}
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

							}

						}
					}
				} else {
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
					} else if (currentDateString.equals(startTimeString)
							&& !(currentDateString.equals(endTimeString))) {
						System.out.println("dates are different");
						System.out.println("diff in days=>" + diffInDays);
						if (diffInDays > 0) {
							ArrayList<Date> nextDates = getNextNumberOfDates(date, diffInDays + 1);
							System.out.println("nextDates =>" + nextDates);
							System.out.println("nextDates size =>" + nextDates.size());

							for (int i = 0; i < nextDates.size(); i++) {
								System.out.println("day :" + (i + 1));
								if (i == 0) {
									ArrayList<ScheduleTime> timeSlots = new ArrayList<ScheduleTime>();
									sh = startHours;
									sm = startMinutes;
									eh = 24;
									em = 0;
									System.out.println("sh :" + sh + "sm :" + sm + "eh :" + eh + "em :" + em + " date:"
											+ formatter.format(nextDates.get(i)));
									timeSlots = createTimeSlots(sh, sm, eh, em, formatter.format(nextDates.get(i)));
									for (ScheduleTime tp : timeSlots) {
										timeArray.add(tp);
									}
								} else if (i == nextDates.size() - 1) {
									ArrayList<ScheduleTime> timeSlots = new ArrayList<ScheduleTime>();
									sh = 0;
									sm = 0;
									eh = endHours;
									em = endMinutes;
									System.out.println("sh :" + sh + "sm :" + sm + "eh :" + eh + "em :" + em + " date:"
											+ formatter.format(nextDates.get(i)));
									timeSlots = createTimeSlots(sh, sm, eh, em, formatter.format(nextDates.get(i)));
									for (ScheduleTime tp : timeSlots) {
										timeArray.add(tp);
									}
								} else {
									ArrayList<ScheduleTime> timeSlots = new ArrayList<ScheduleTime>();
									sh = 0;
									sm = 0;
									eh = 24;
									em = 0;
//									System.out.println("sh :" + sh + "sm :" + sm + "eh :" + eh + "em :" + em);
									System.out.println("sh :" + sh + "sm :" + sm + "eh :" + eh + "em :" + em + " date:"
											+ formatter.format(nextDates.get(i)));
									timeSlots = createTimeSlots(sh, sm, eh, em, formatter.format(nextDates.get(i)));
									for (ScheduleTime tp : timeSlots) {
										timeArray.add(tp);
									}
								}
							}
						}
					}
				}
			}
			System.out.println(formatter.format(date));
		}
		
		timeArray = organiseTimeSlots(timeArray);
		timeArray = deleteBookingsFromTimeSlots(timeArray, tid);
		timeArray = eliminateBeforeTimeBookings(timeArray);
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

		System.out.println();
		ArrayList<ScheduleTime> timeArray = new ArrayList<ScheduleTime>();
		ScheduleTime initialTimePacket = new ScheduleTime();
		initialTimePacket.setHours(sh);
		initialTimePacket.setMinutes(sm);
		initialTimePacket.setDate(date);
		initialTimePacket.setTotalMinutes((sh * 60) + sm + nextDateValue);
		initialTimePacket.setFrame(frameCount);
		timeArray.add(initialTimePacket);

//    	ScheduleTime timePacket = new ScheduleTime();
		if (eh == 0) {
			eh = 24;
		}
		while (sh <= eh) {
//			System.out.println("called !");
			ScheduleTime timePacket = new ScheduleTime();
			int totalStartTime = (sh * 60) + sm;
			int totalEndTime = ((eh * 60) + em);
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
			timePacket.setTotalMinutes((sh * 60) + sm + nextDateValue);
			timePacket.setFrame(frameCount);
			System.out.println("time Packet ->" + timePacket);
			timeArray.add(timePacket);
		}
		frameCount++;
		System.out.println("-----------------------------------------------------------");
		return timeArray;

	}

	// for eliminating before time slots
	public ArrayList<ScheduleTime> eliminateBeforeTimeBookings(ArrayList<ScheduleTime> timeSlots) {
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		formatter.setTimeZone(TimeZone.getTimeZone("Asia/Kolkata"));
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		sdf.setTimeZone(TimeZone.getTimeZone("Asia/Kolkata"));
		ArrayList<ScheduleTime> eliminateArray = new ArrayList<ScheduleTime>();
		// todayDate string
		Date todayDate = new Date();
		ZoneId zoneId = ZoneId.of("Asia/Kolkata");
		LocalTime time = LocalTime.now(zoneId);
		String todayDateString = formatter.format(todayDate);
		for (ScheduleTime tp : timeSlots) {
			if (tp.date.equals(todayDateString)) {

				int totalCurrentMinutes = (time.getHour() * 60) + time.getMinute();
				System.out.println("hours :" + time.getHour() + "minutes :" + time.getMinute());
				int tpTotalMinutes = (tp.getHours() * 60) + tp.getMinutes();
				if (tpTotalMinutes < totalCurrentMinutes) {
					System.out.println("today's date before time");
					eliminateArray.add(tp);
				}
			}
		}
		System.out.println(eliminateArray);
		timeSlots.removeAll(eliminateArray);
		return timeSlots;
	}
	ArrayList<ScheduleTime> findBookingOverlappingSlots(ArrayList<ScheduleTime> bookingSlots,ArrayList<ScheduleTime> timeSlots){
		ArrayList<ScheduleTime> frameSlots = new ArrayList<ScheduleTime>();
		System.out.println(timeSlots);
		System.out.println(bookingSlots);
		Integer frame=timeSlots.get(timeSlots.indexOf(bookingSlots.get(0))).frame;
		System.out.println("Frame no. corresponding to booking :"+frame);
		frameSlots = getSlotsForFrameNumber(frame, timeSlots);
		return frameSlots; 
	}
	Integer findBookingCase(ArrayList<ScheduleTime> bookingSlots,ArrayList<ScheduleTime> frameSlots) {
		Integer frameSlotsSize=frameSlots.size();
		Integer bookingSlotsSize=bookingSlots.size();
		Integer bookingCase =0;
		if((bookingSlots.get(0).equals(frameSlots.get(0)))&&!(bookingSlots.get(bookingSlotsSize-1).equals(frameSlots.get(frameSlotsSize-1)))) {
			bookingCase = 1;
		}else if(!(bookingSlots.get(0).equals(frameSlots.get(0)))&&!(bookingSlots.get(bookingSlotsSize-1).equals(frameSlots.get(frameSlotsSize-1)))) {
			bookingCase =2;
		}else if(!(bookingSlots.get(0).equals(frameSlots.get(0)))&&(bookingSlots.get(bookingSlotsSize-1).equals(frameSlots.get(frameSlotsSize-1)))) {
			bookingCase =3;
		}else if((bookingSlots.get(0).equals(frameSlots.get(0)))&&(bookingSlots.get(bookingSlotsSize-1).equals(frameSlots.get(frameSlotsSize-1)))) {
			bookingCase =4;
		}
		return bookingCase;
	}
	// for deleting bookings from time slots
	public ArrayList<ScheduleTime> deleteBookingsFromTimeSlots(ArrayList<ScheduleTime> timeSlots, Integer tid) {
		System.out.println("-----------------------------------------------------------");
		System.out.println("in delete bookings from time slots");
		System.out.println("-----------------------------------------------------------");

		// getting date Array for next 7 dates
		ArrayList<Date> dateArray = getNextNumberOfDates(new Date(), 7);

		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");

		ArrayList<ScheduleTime> bookingArray = new ArrayList<ScheduleTime>();
		ArrayList<ScheduleTime> slotsToBeAdded = new ArrayList<ScheduleTime>();
		// fetching the list of all the approved tutor meetings
		ArrayList<BookingDetails> tutorBookings = (ArrayList<BookingDetails>) meetingDao.findAllTutorBookings(tid);

		// for finding all the bookings, converting them to slots and then adding them
		// to booking array
		for (Date currentDate : dateArray) {

			String currentDateString = formatter.format(currentDate);
			System.out.println("-----------------------------------------------------------");
			System.out.println("Iteration -> " + currentDateString);
			System.out.println("-----------------------------------------------------------");
			if (tutorBookings != null) {
				System.out.println("bookings are not null !");
				System.out.println(tutorBookings);
				for (BookingDetails booking : tutorBookings) {

					System.out.println("booking date ->" + booking.getDateOfMeeting());
					
					if (currentDateString.equals(booking.getDateOfMeeting())) {
						System.out.println("booking and current date matches !");

						ArrayList<ScheduleTime> bookingSlots = new ArrayList<ScheduleTime>();
						bookingSlots = createTimeSlots(booking.getStartTimeHour(), booking.getStartTimeMinute(),
								booking.getEndTimeHour(), booking.getEndTimeMinute(), booking.getDateOfMeeting());
						ArrayList<ScheduleTime> overlappingFrameSlots = findBookingOverlappingSlots(bookingSlots, timeSlots);
						Integer bookingCase = findBookingCase(bookingSlots, overlappingFrameSlots);
						System.out.println(overlappingFrameSlots);
						System.out.println("booking case =>"+bookingCase);
						if(bookingCase==1) {
							bookingSlots.remove(bookingSlots.size()-1);
						}else if(bookingCase==2) {
							Integer startIndex=0,endIndex=0;
							startIndex = overlappingFrameSlots.indexOf(bookingSlots.get(0));
							endIndex = overlappingFrameSlots.indexOf(bookingSlots.get(bookingSlots.size()-1));
							System.out.println(bookingSlots.get(bookingSlots.size()-1));
							System.out.println("start Index:"+startIndex);
							System.out.println("end Index:"+endIndex);
							for(int i = endIndex;i<overlappingFrameSlots.size();i++) {
								ScheduleTime slot = new ScheduleTime();
								slot = overlappingFrameSlots.get(i);
								slot.setFrame(frameCount);
								slotsToBeAdded.add(slot);
							}
							frameCount++;
							
							System.out.println(overlappingFrameSlots);
							System.out.println(slotsToBeAdded);
							bookingSlots.clear();
							for(int j=startIndex+1;j<overlappingFrameSlots.size()-1;j++) {
								bookingSlots.add(overlappingFrameSlots.get(j));
							}
							System.out.println("booking slots to be removed=>"+bookingSlots);
						}else if(bookingCase==3) {
							bookingSlots.remove(0);
						}
						for (ScheduleTime slot : bookingSlots) {
							bookingArray.add(slot);
						}
					}
				}
			} else {
				System.out.println("no approved meetings ! for date ->" + currentDateString);
			}
		}

		// removing slots of bookings
		System.out.println("booking array ->" + bookingArray);
		timeSlots.removeAll(bookingArray);
		for(ScheduleTime s:slotsToBeAdded) {
			timeSlots.add(s);
		}
		System.out.println("time array ->" + timeSlots);
		return timeSlots;
	}
	
	//get Slots from frame number
	public ArrayList<ScheduleTime> getSlotsForFrameNumber(int frame, ArrayList<ScheduleTime> timeSlots) {
		ArrayList<ScheduleTime> frameSlots = new ArrayList<ScheduleTime>();
		for (int i = 0; i < timeSlots.size(); i++) {
			if (timeSlots.get(i).getFrame() == frame) {
				frameSlots.add(timeSlots.get(i));
			}
		}
		return frameSlots;
	}
	//sorting slots, merging overlapping slots, removing duplicate slots
	public ArrayList<ScheduleTime> organiseTimeSlots(ArrayList<ScheduleTime> timeSlots) {
		ArrayList<ScheduleTime> nonDuplicateSlots = new ArrayList<ScheduleTime>();
		ArrayList<ScheduleTime> finalNonDuplicateSlots = new ArrayList<ScheduleTime>();
		// for removing duplicates from timeSlots
		for (ScheduleTime slot : timeSlots) {
			if (!nonDuplicateSlots.contains(slot)) {
				nonDuplicateSlots.add(slot);
			} else {
				ScheduleTime conflictingSlot = nonDuplicateSlots.get(nonDuplicateSlots.indexOf(slot));
				System.out.println(slot);
				System.out.println(conflictingSlot);
				if (!conflictingSlot.getFrame().equals(slot.getFrame())) {
					ArrayList<ScheduleTime> currentFrameSlots = getSlotsForFrameNumber(slot.getFrame(), timeSlots);
					ArrayList<ScheduleTime> conflictingFrameSlots = getSlotsForFrameNumber(conflictingSlot.getFrame(),
							timeSlots);
					System.out.println("conflictingFrameSlots =>"+conflictingFrameSlots);
					System.out.println("current frame slots =>"+currentFrameSlots);
					if (conflictingFrameSlots.contains(currentFrameSlots.get(0))
							&& conflictingFrameSlots.contains(currentFrameSlots.get(currentFrameSlots.size() - 1))) {
						System.out.println("Complete overlap");
					} else {
						System.out.println("partial overlap");
						currentFrameSlots.removeAll(conflictingFrameSlots);
						for (ScheduleTime cs : currentFrameSlots) {
							cs.setFrame(conflictingSlot.getFrame());
							nonDuplicateSlots.add(cs);
						}
					}
				}

			}
		}
		
		for(ScheduleTime s:nonDuplicateSlots) {
			if(!finalNonDuplicateSlots.contains(s)) {
				finalNonDuplicateSlots.add(s);
			}
		}
		// for placing them in ascending order

		Collections.sort(finalNonDuplicateSlots, new Comparator<ScheduleTime>() {
			@Override
			public int compare(ScheduleTime o1, ScheduleTime o2) {
				return o1.getTotalMinutes() - o2.getTotalMinutes();
			}
		});
		timeSlots = finalNonDuplicateSlots;
		System.out.println(" time slots after reform ->" + timeSlots);
		return timeSlots;
	}

}