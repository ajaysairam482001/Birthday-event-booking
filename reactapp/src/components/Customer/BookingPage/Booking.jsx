import React, { useState, useContext, useEffect } from "react";
import BookEventSecondPage from "./BookEventSecondPage";
import axios from "axios";
import Swal from "sweetalert2";
import Navbaar from "../Navbaar/Navbaar";
import { useLocation } from "react-router-dom";
import "./Booking.css";
import { BaseUrl } from "../../../utils/authApi";
import UserContext from "../../../UserContext";

import TextField from "@mui/material/TextField";

export default function Booking() {
  const { appUser } = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventData, setEventData] = useState({});
  const [animationComplete, setAnimationComplete] = useState(false);
  const currentDate = new Date().toISOString().split("T")[0];

  const jwtToken = appUser?.token;
  const headers = {
    Authorization: `Bearer ${jwtToken}`,
  };

  const location = useLocation();

  const themeimgUrl = location.state?.themeimgUrl;
  const cost = location.state?.cost;
  const themeName = location.state?.themeName;
  const themeId = location.state?.themeId;

  const requiredFields = [
    "applicantName",
    "applicantAddress",
    "applicantMobile",
    "applicantEmail",
    "eventAddress",
    "eventDate",
    "eventTime",
    "noOfPeople",
  ];

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await axios.post(`${BaseUrl}/user/addEvent`, { headers }, eventData);
      Swal.fire("Success", res.data, "success");
    } catch (e) {
      console.log(e, e.message);
      Swal.fire("Error", "An error occurred while submitting the form.", "error");
    }
  }

  const handleNextPage = async (e) => {
    e.preventDefault();

    // Check if any required field is empty
    const emptyFields = requiredFields.filter((field) => isFieldEmpty(field));

    if (!isValidDate) {
      // Display the Swal alert if the date is not valid
      Swal.fire("Invalid Date", "Please select a valid date.", "warning");
      return;
    }

    if (emptyFields.length > 0) {
      const message = `Please fill the following fields: ${emptyFields.join(", ")}`;
      Swal.fire("Error", message, "error");
      emptyFields.forEach((field) => {
        const fieldElement = document.getElementById(field);
        if (fieldElement) {
          fieldElement.classList.add("error");
        }
      });
      return;
    }

    handleSubmit(e);
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = (e) => {
    e.preventDefault();
    setCurrentPage(currentPage - 1);
  };

  const isFirstPageFilled = () => {
    // Check if all the required fields on the first page are filled
    return (
      eventData.eventName &&
      eventData.applicantName &&
      eventData.applicantAddress &&
      eventData.applicantMobile &&
      eventData.applicantEmail &&
      eventData.eventAddress &&
      eventData.eventDate &&
      eventData.eventTime &&
      eventData.noOfPeople
    );
  };

  function handleChange(e) {
    const { name, value } = e.target;

    setEventData((prev) => {
      return {
        ...prev,
        [name]: value,
        userId: appUser?.id,
        eventImg: themeimgUrl,
        eventName: themeName,
        eventCost: cost,
        themeId: themeId,
      };
    });
  }

  useEffect(() => {
    // Set a delay to mark the animation as complete
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const [minEventDate, setMinEventDate] = useState(currentDate);
  const [isValidDate, setIsValidDate] = useState(true);

  const handleEventDateChange = (e) => {
    const selectedDate = e.target.value;
    if (selectedDate < currentDate) {
      setIsValidDate(false);
    } else {
      setIsValidDate(true);
      setEventData((prev) => ({ ...prev, eventDate: selectedDate }));
    }
  };

  const isFieldEmpty = (fieldName) => {
    return !eventData[fieldName] || eventData[fieldName].trim() === "";
  };

  const getInputClassName = (fieldName) => {
    return isFieldEmpty(fieldName) ? "input-form error" : "input-form";
  };

  return (
    <div>
      <div className="booking-first-page-main-navbar">
        <Navbaar />
      </div>
      <div className="main-container">
        <div className="apply-form">
          <div className={`theme-card-container ${animationComplete ? "fade-out" : ""}`}>
            {!animationComplete && <img className="theme-card-image" src={themeimgUrl} alt="Selected Theme" />}
          </div>

          {animationComplete && (
            <>
              {currentPage === 1 && (
                <form className="form-container">
                  <TextField
                    data-testid="enterName"
                    id="enterName"
                    className={`input-form ${getInputClassName("eventName")}`}
                    type="text"
                    value={themeName}
                    name="eventName"
                    label="Enter Event Name"
                    readOnly
                    style={{ fontWeight: "bold" }}
                    onChange={handleChange}
                  />

              <TextField
                className={getInputClassName("applicantName")}
                type="text"
                name="applicantName"
                id="applicantName"
                label="Enter Applicant Name"
                value={eventData.applicantName || ""}
                onChange={handleChange}
                required
              />

              <TextField
                className={getInputClassName("applicantAddress")}
                type="text"
                name="applicantAddress"
                id="applicantAddress"
                label="Enter Applicant Address"
                value={eventData.applicantAddress || ""}
                onChange={handleChange}
                required
              />

              <TextField
                type="number"
                className={getInputClassName("applicantMobile")}
                name="applicantMobile"
                id="applicantMobile"
                label="Enter Applicant Mobile"
                value={eventData.applicantMobile || ""}
                onChange={handleChange}
                required
              />

              <TextField
                className={getInputClassName("applicantEmail")}
                type="text"
                name="applicantEmail"
                id="applicantEmail"
                label="Enter Applicant Email"
                value={eventData.applicantEmail || ""}
                onChange={handleChange}
                required
              />

              <TextField
                className={getInputClassName("eventAddress")}
                type="text"
                name="eventAddress"
                id="enterPanNo"
                label="Enter Event Address"
                value={eventData.eventAddress || ""}
                onChange={handleChange}
                required
              />

              <TextField
                type="date"
                className={`input-form ${getInputClassName("eventDate")}`}
                name="eventDate"
                value={eventData.eventDate || ""}
                onChange={handleEventDateChange}
                required
                min={minEventDate} // Set the min attribute to disable previous dates
              />

              <TextField
                className={getInputClassName("eventTime")}
                type="time"
                name="eventTime"
                id="enterAmount"
                value={eventData.eventTime || ""}
                onChange={handleChange}
                required
              />

              <TextField
                type="number"
                className={getInputClassName("number-input")}
                name="noOfPeople"
                id="noOfPeople"
                label="Enter Number of People"
                value={eventData.noOfPeople || ""}
                onChange={handleChange}
                required
              />
             
            
             </form>
              )}

              {currentPage === 2 && (
                <BookEventSecondPage handleSubmit={handleSubmit} eventData={eventData} setEventData={setEventData} />
              )}

              <div className="page-buttons">
                {currentPage > 1 && (
                  <button className="page-button previous-button" onClick={handlePreviousPage}>
                    Previous
                  </button>
                )}
                {currentPage < 2 && (
                  <button className="page-button next-button" onClick={handleNextPage} disabled={!isValidDate}>
                    Next
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}