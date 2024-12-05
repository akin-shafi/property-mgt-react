import { Modal, Dropdown, Menu } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { DayPilot } from "daypilot-pro-react"; // DayPilot Scheduler

const { confirm } = Modal;

export const getSchedulerConfig = (
  scheduler,
  setScheduler,
  events,
  resources,
  navigate // Add router as a parameter
) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const handleExtendEvent = (args, newEnd) => {
    if (args?.start && args?.end && newEnd) {
      confirm({
        title: "Extend Guest Stay",
        content: `Do you want to extend the guest stay details from 
                  startdate: ${args.start.toString()} 
                  enddate: ${args.end.toString()} 
                  to 
                  startdate: ${args.start.toString()} 
                  enddate: ${newEnd.toString()}?`,
        onOk() {
          console.log("Extend confirmed");
          // Logic to handle the extension
        },
        onCancel() {
          console.log("Extend canceled");
        },
      });
    }
  };

  const handleMoveEvent = (args, newStart, newEnd) => {
    console.log("args:", args);
    console.log("newStart:", newStart.value);
    console.log("newEnd:", newEnd.value);

    confirm({
      title: "Move Guest Reservation",
      content: `Do you want to move the guest stay details from 
                startdate: ${args.start?.toString()} 
                enddate: ${args.end?.toString()} 
                to 
                startdate: ${newStart.value?.toString()} 
                enddate: ${newEnd.value?.toString()}?`,
      onOk() {
        console.log("Move confirmed");
        // Logic to handle the move
      },
      onCancel() {
        console.log("Move canceled");
      },
    });
  };

  const handleCreateNew = (args) => {
    confirm({
      title: "Create New Reservation",
      content: "Do you want to create a new reservation?",
      onOk() {
        const start = args.start?.toString();
        const end = args.end?.toString();
        const room = args.resource;

        navigate(
          `/reservations/new?startDate=${encodeURIComponent(
            start
          )}&endDate=${encodeURIComponent(end)}&roomName=${encodeURIComponent(
            room
          )}`
        );
      },
      onCancel() {
        scheduler.clearSelection();
        console.log("Canceled");
      },
    });
  };

  const menu = (
    <Menu>
      <Menu.Item key="viewPayment" onClick={() => console.log(`View Payment`)}>
        View Payment
      </Menu.Item>
      <Menu.Item
        key="viewReservation"
        onClick={() => console.log("View Reservation")}
      >
        View Reservation
      </Menu.Item>
      <Menu.Item
        key="editReservation"
        onClick={() => console.log("Edit Reservation")}
      >
        Edit Reservation
      </Menu.Item>
    </Menu>
  );

  return {
    // timeHeaders: [{ groupBy: "Month" }, { groupBy: "Day", format: "d" }],
    timeHeaders: [
      { groupBy: "Month", format: "MMMM yyyy" },
      { groupBy: "Day", format: "d" },
    ],
    eventHeight: 50,
    bubble: new DayPilot.Bubble({}),
    scale: "Day",
    treeEnabled: true,
    days: 30, // Adjusted for a 30-day view
    eventBorderRadius: "1px",
    startDate: sevenDaysAgo.toISOString().split("T")[0],
    rowHeaderColumns: [
      { title: "Room", width: 80 },
      { title: "Capacity", width: 80 },
      { title: "Status", width: 80 },
    ],

    onBeforeResHeaderRender: function (args) {
      var beds = function (count) {
        return count + " bed" + (count > 1 ? "s" : "");
      };

      // console.log(args.resource);
      args.resource.columns[1].html = beds(args.resource.capacity);
      args.resource.columns[2].html = args.resource.status;

      switch (args.resource.status) {
        case "Dirty":
          args.resource.cssClass = "status_dirty";
          break;
        case "Cleanup":
          args.resource.cssClass = "status_cleanup";
          break;
      }
    },

    onTimeRangeSelected: async (args) => {
      // Only handle the drag events, not single-clicks
      if (args.resource !== args.resourceRoot) {
        handleCreateNew(args);
        // confirm({
        //   title: "Create New Reservation",
        //   content: "Do you want to create a new reservation?",
        //   onOk() {
        //     const start = args.start?.toString();
        //     const end = args.end?.toString();
        //     const room = args.resource;

        //     navigate(
        //       `/reservations/new?startDate=${encodeURIComponent(
        //         start
        //       )}&endDate=${encodeURIComponent(
        //         end
        //       )}&roomName=${encodeURIComponent(room)}`
        //     );
        //   },
        //   onCancel() {
        //     scheduler.clearSelection();
        //     console.log("Canceled");
        //   },
        // });
      }
    },
    onEventResized: (args) => {
      console.log("onEventResized", args);
      handleExtendEvent(args, args.newEnd);
    },
    onEventMoved: (args) => {
      console.log("onEventMoved", args);
      handleMoveEvent(args, args.newStart, args.newEnd);
    },
    // onEventClick: (args) => {
    //   console.log("onEventClick", args);
    // },

    onBeforeRowHeaderRender: (args) => {
      if (args.row.data.image) {
        args.row.columns[0].areas = [
          {
            left: 10,
            top: 8,
            width: 24,
            height: 24,
            image: "cars/" + args.row.data.image,
            style: "border-radius: 50%; overflow: hidden;",
          },
        ];
      }
    },
    onBeforeEventRender: function (args) {
      let start = new DayPilot.Date(args.e.start);
      let end = new DayPilot.Date(args.e.end);

      let today = new DayPilot.Date().getDatePart();
      let now = new DayPilot.Date(); // Define `now` to represent the current date and time

      args.e.html =
        args.e.text +
        " (" +
        start.toString("M/d/yyyy") +
        " - " +
        end.toString("M/d/yyyy") +
        ")";

      switch (args.e.status) {
        case "New": {
          let in2days = today.addDays(1);

          if (start.getTime() < in2days.getTime()) {
            args.e.barColor = "red";
            args.e.toolTip = "Expired (not confirmed in time)";
          } else {
            args.e.barColor = "orange";
            args.e.toolTip = "New";
          }
          break;
        }

        case "Confirmed": {
          let arrivalDeadline = today.addHours(18);

          if (
            start.getTime() < today.getTime() ||
            (start.getTime() === today.getTime() &&
              now.getTime() > arrivalDeadline.getTime())
          ) {
            // must arrive before 6 pm
            args.e.barColor = "#f41616"; // red
            args.e.toolTip = "Late arrival";
          } else {
            args.e.barColor = "green";
            args.e.toolTip = "Confirmed";
          }
          break;
        }

        case "Arrived": {
          // arrived
          let checkoutDeadline = today.addHours(10);

          if (
            end.getTime() < today.getTime() ||
            (end.getTime() === today.getTime() &&
              now.getTime() > checkoutDeadline.getTime())
          ) {
            // must checkout before 10 am
            args.e.barColor = "#f41616"; // red
            args.e.toolTip = "Late checkout";
          } else {
            args.e.barColor = "#1691f4"; // blue
            args.e.toolTip = "Arrived";
          }
          break;
        }

        case "CheckedOut": // checked out
          args.e.barColor = "gray";
          args.e.toolTip = "Checked out";
          break;

        default:
          args.e.toolTip = "Unexpected state";
          break;
      }
      args.e.html =
        args.e.html +
        "<br /><span style='color:gray'>" +
        args.e.toolTip +
        "</span>";

      var paid = args.e.paid;
      var paidColor = "#000";

      args.e.areas = [
        {
          bottom: 10,
          right: 4,
          html:
            "<div style='color:" +
            paidColor +
            "; font-size: 8pt;'>Paid: " +
            paid +
            "%</div>",
          v: "Visible",
        },
        {
          left: 4,
          bottom: 8,
          right: 4,
          height: 2,
          html:
            "<div style='background-color:" +
            paidColor +
            "; height: 100%; width:" +
            paid +
            "%'></div>",
          v: "Visible",
        },
      ];
    },
    onBeforeEventDomAdd: (args) => {
      args.element = (
        <div className=" flex items-center justify-between mb-4">
          <div className="">{args.e.data.text}</div>

          <div className=" text-right">
            <Dropdown overlay={menu} trigger={["click"]}>
              <span className="btn">
                <MoreOutlined className="cursor-pointer" />
              </span>
            </Dropdown>
          </div>
        </div>
      );
    },
  };
};
