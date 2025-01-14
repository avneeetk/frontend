import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import Select from 'react-select';
import CreatableSelect from "react-select/creatable";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { Context } from "../main"; // Import Context for authentication

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const amyloidosisTypeOptions = [
  { value: "AL Amyloidosis", label: "AL Amyloidosis" },
  { value: "AA Amyloidosis", label: "AA Amyloidosis" },
  { value: "Hereditary Amyloidosis", label: "Hereditary Amyloidosis" },
  { value: "Other", label: "Other" },
];

const symptomOptions = [
  { value: "Fatigue", label: "Fatigue" },
  { value: "Swelling (edema)", label: "Swelling (edema)" },
  { value: "Weight Loss", label: "Weight Loss" },
  { value: "Shortness of Breath", label: "Shortness of Breath" },
  { value: "Other", label: "Other" },
];

const medicationOptions = [
  { value: "Chemotherapy", label: "Chemotherapy" },
  { value: "Dexamethasone", label: "Dexamethasone" },
  { value: "Stem Cell Transplant", label: "Stem Cell Transplant" },
  { value: "Other", label: "Other" },
];

const lifestyleOptions = [
  { value: "Dietary Modifications", label: "Dietary Modifications" },
  { value: "Exercise", label: "Exercise" },
  { value: "Regular Monitoring", label: "Regular Monitoring" },
  { value: "Other", label: "Other" },
];

const History = () => {
  const { isAuthenticated } = useContext(Context); // Get authentication state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [amyloidosisTypes, setAmyloidosisTypes] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [treatmentHistory, setTreatmentHistory] = useState("");
  const [currentMedications, setCurrentMedications] = useState([]);
  const [familyHistory, setFamilyHistory] = useState("");
  const [lifestyleFactors, setLifestyleFactors] = useState([]);

  const navigate = useNavigate();
  

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to access this page.");
      navigate("/login"); // Redirect to login page
    }
  }, [isAuthenticated, navigate]);

  // Validate the form before submission
  const isValid = () => {
    if (!firstName || !lastName || !dob || !gender) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  const handleHistorySubmission = async (e) => {
    e.preventDefault();
    if (!isValid()) return;

    try {
      const { data } = await axios.post(
        "https://asgi-backend.onrender.com/api/v1/history/add",
        {
          firstName,
          lastName,
          dob,
          gender,
          amyloidosisTypes: amyloidosisTypes.map((item) => item.value),
          symptoms: symptoms.map((item) => item.value),
          treatmentHistory,
          currentMedications: currentMedications.map((item) => item.value),
          familyHistory,
          lifestyleFactors: lifestyleFactors.map((item) => item.value),
        },
        {
          withCredentials: true, // Send cookies with the request
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(data.message);
      navigate("/")
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="container form-component patient-history-form">
      <h2>Amyloidosis Patient History</h2>
      <form onSubmit={handleHistorySubmission}>
        <div>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="date"
            placeholder="Date of Birth"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
          <Select
            value={gender ? { value: gender, label: gender } : null}
            options={genderOptions}
            onChange={(selected) => setGender(selected?.value || "")}
            placeholder="Select Gender"
            required
          />
        </div>
        <div>
          <CreatableSelect
            isMulti
            options={amyloidosisTypeOptions}
            value={amyloidosisTypes}
            onChange={setAmyloidosisTypes}
            placeholder="Select or Type Amyloidosis Type(s)"
          />
        </div>
        <div>
          <CreatableSelect
            isMulti
            options={symptomOptions}
            value={symptoms}
            onChange={setSymptoms}
            placeholder="Select or Type Symptoms"
          />
        </div>
        <div>
          <textarea
            rows="4"
            value={treatmentHistory}
            onChange={(e) => setTreatmentHistory(e.target.value)}
            placeholder="Previous Treatment History"
          />
        </div>
        <div>
          <CreatableSelect
            isMulti
            options={medicationOptions}
            value={currentMedications}
            onChange={setCurrentMedications}
            placeholder="Select or Type Current Treatment"
          />
        </div>
        <div>
          <textarea
            rows="4"
            value={familyHistory}
            onChange={(e) => setFamilyHistory(e.target.value)}
            placeholder="Family History of Amyloidosis"
          />
        </div>
        <div>
          <CreatableSelect
            isMulti
            options={lifestyleOptions}
            value={lifestyleFactors}
            onChange={setLifestyleFactors}
            placeholder="Select or Type Lifestyle Factors"
          />
        </div>
        <button type="submit" style={{ margin: "10px auto" }}>
          Submit History
        </button>
      </form>
    </div>
  );
};

// Define prop types
History.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

export default History;
