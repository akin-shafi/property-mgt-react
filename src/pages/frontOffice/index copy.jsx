import { useEffect, useState } from "react";
import { DayPilot, DayPilotScheduler } from "daypilot-pro-react";
import { hotelBookings, hotelRooms } from "../../hooks/useHotelData"; // Import the data

const Scheduler = () => {
  const [scheduler, setScheduler] = useState(null);
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);
  const config = {
    timeHeaders: [{ groupBy: "Month" }, { groupBy: "Day", format: "d" }],
    scale: "Day",
    days: 365, // Show a year of bookings
    startDate: "2024-09-01",
    timeRangeSelectedHandling: "Enabled",
    eventBorderRadius: "8px",
    onTimeRangeSelected: async (args) => {
      const scheduler = args.control;
      const modal = await DayPilot.Modal.prompt(
        "Enter Booking Details (e.g., 'John Doe - Deluxe Room')",
        "New Booking"
      );
      scheduler.clearSelection();
      if (modal.canceled) {
        return;
      }
      scheduler.events.add({
        start: args.start,
        end: args.end,
        id: DayPilot.guid(),
        resource: args.resource,
        text: modal.result,
      });
    },
  };

  useEffect(() => {
    if (!scheduler) {
      return;
    }

    // Load events and resources from the data file
    setEvents(hotelBookings);
    setResources(hotelRooms);

    scheduler.scrollTo("2024-11-01");
  }, [scheduler]);

  return (
    <div>
      <DayPilotScheduler
        {...config}
        events={events}
        resources={resources}
        controlRef={setScheduler}
      />
    </div>
  );
};

export default Scheduler;
