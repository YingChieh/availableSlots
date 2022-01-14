// 1. get slots for each day
// 2. check conflict
// 3. filter same day appointment
var requiredGap = 30; //min
var currentDay = new Date();

var appointments = [
  {
    start: "2016-01-01T12:00",
    end: "2016-01-01T13:00",
  },
  {
    start: "2016-01-01T13:00",
    end: "2016-01-01T13:30",
  },
  {
    start: "2016-01-01T13:30",
    end: "2016-01-01T14:00",
  },
  {
    start: "2016-01-01T15:15",
    end: "2016-01-01T15:45",
  },
  {
    start: "2016-01-01T15:45",
    end: "2016-01-01T16:45",
  },
];
var dateEvents = appointments.map(function (event) {
  return {
    start: new Date(event.start),
    end: new Date(event.end),
  };
});

function checkCalendarConflict(Start) {
  var hasConflict = false;
  if (!appointments) {
    //logic to get scheduled appointments
  } else {
    //iterate through relevant scheduled appointments
    //if argument `currentDay` has conflict, return true
    //else, return false
    const result = dateEvents.filter(getSameDate);

    for (var i = 0; i < result.length; i++) {
      if (
        result[i].start - Start <= requiredGap * 60 * 1000 &&
        result[i].end - Start > 0
      ) {
        hasConflict = true;
        Start.setHours(result[i].end.getHours());
        Start.setMinutes(result[i].end.getMinutes());
        //console.log(Start);
        break;
      }
    }
  }
  return hasConflict;
}

function getSameDate(appointment) {
  //console.log(currentDay);
  var begin = new Date(appointment.start);
  if (
    begin.getFullYear() == currentDay.getFullYear() &&
    begin.getMonth() == currentDay.getMonth() &&
    begin.getDate() == currentDay.getDate()
  )
    return appointment;
}

function getTimeSlotsForDay(date) {
  var timeSlots = [];
  var dayStart = new Date(date);
  var dayEnd = new Date(date);

  currentDay = dayStart;

  switch (date.getDay()) {
    case 0: //Sunday
      return timeSlots;
    case 6: //Saturday
      dayStart.setHours(10, 0, 0, 0);
      dayEnd.setHours(20, 0, 0, 0);
      break;
    default:
      dayStart.setHours(13, 0, 0, 0);
      dayEnd.setHours(20, 0, 0, 0);
      break;
  }
  do {
    if (!checkCalendarConflict(dayStart)) {
      timeSlots.push(new Date(dayStart));
      dayStart.setHours(
        dayStart.getHours(),
        dayStart.getMinutes() + requiredGap
      );
    }
  } while (dayStart < dayEnd);

  return timeSlots;
}

function AvalibleSlots(date) {
  var initDate = date.split(".");
  var today = new Date(initDate[2], initDate[1] - 1, initDate[0], 0, 0, 0, 0);
  var lastDay = new Date(today);
  lastDay.setDate(today.getDate() + 7);

  var message = "";
  for (var i = new Date(today); i < lastDay; i.setDate(i.getDate() + 1)) {
    message += i.toDateString() + ":\n";
    message +=
      getTimeSlotsForDay(i)
        .map(function (it) {
          return it.toTimeString();
        })
        .join(",\n") + "\n";
  }
  console.log(message);
}

AvalibleSlots("01.01.2016");
