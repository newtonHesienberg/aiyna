"use client";

import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePickerInput = ({ selectedDate, onChange }) => {
    return (
        <DatePicker
            // Core props passed from the parent
            selected={selectedDate}
            onChange={onChange}

            // Your desired formatting and placeholder
            dateFormat="dd / MM / yyyy"
            placeholderText="dd / mm / yyyy"

            // Optional helpful props
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={60}
            maxDate={new Date()} // Can't select a future date

            className="w-full p-3 border border-slate-300 rounded-md"
        />
    );
};

export default DatePickerInput;