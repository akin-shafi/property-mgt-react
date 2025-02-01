"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

export function DateNavigation() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="flex items-center gap-2">
      <button className="p-2 hover:bg-gray-100 rounded-full">
        <ChevronLeft className="w-4 h-4" />
      </button>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="dd-MM-yy"
        className="text-center cursor-pointer"
      />
      <button className="p-2 hover:bg-gray-100 rounded-full">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
