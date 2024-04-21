"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

// Styled components
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 500px;
  margin: auto;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const StyledLabel = styled.label`
  font-size: 14px;
  font-weight: bold;
  color: #000;
`;

const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;

  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const DataForm = ({ initialData = {}, onClose, refreshData }) => {
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false); // Define isLoading state

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission action

    setIsLoading(true); // Set loading state

    const apiEndpoint = `${process.env.NEXT_APP_BASE_URL}/api/data`;
    const httpMethod = initialData._id ? "patch" : "post";

    // Convert the `id` field to a number
    const payload = {
      ...formData,
      id: parseInt(formData.id, 10), // Ensure `id` is sent as a number
    };

    // If updating (PATCH), add the `_id` field to the payload
    if (httpMethod === "patch") {
      payload._id = initialData._id;
    }

    try {
      await axios({
        method: httpMethod,
        url: apiEndpoint,
        data: payload,
        headers: { "Content-Type": "application/json" },
      });

      // Success: Close the modal, refresh data, reset form
      refreshData();
      onClose();
    } catch (error) {
      console.error("Error submitting form: ", error);
      // Handle form submission error (e.g., show an error message)
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <FormGroup>
        <StyledLabel htmlFor="id">ID</StyledLabel>
        <StyledInput
          id="id"
          name="id"
          value={formData.id || ""}
          onChange={handleChange}
          placeholder="Id"
          required
        />
      </FormGroup>
      <FormGroup>
        <StyledLabel htmlFor="img">Image URL</StyledLabel>
        <StyledInput
          id="img"
          name="img"
          value={formData.img || ""}
          onChange={handleChange}
          placeholder="Image URL"
          required
        />
      </FormGroup>
      <FormGroup>
        <StyledLabel htmlFor="title">Title</StyledLabel>
        <StyledInput
          id="title"
          name="title"
          value={formData.title || ""}
          onChange={handleChange}
          placeholder="Title"
          required
        />
      </FormGroup>
      <FormGroup>
        <StyledLabel htmlFor="data_img">Data's Image URL</StyledLabel>
        <StyledInput
          id="data_img"
          name="data_img"
          value={formData.data_img || ""}
          onChange={handleChange}
          placeholder="Data's Image URL"
          required
        />
      </FormGroup>
      <FormGroup>
        <StyledLabel htmlFor="desc">Description</StyledLabel>
        <StyledInput
          id="desc"
          name="desc"
          value={formData.desc || ""}
          onChange={handleChange}
          placeholder="Description"
          required
        />
      </FormGroup>
      <FormGroup>
        <StyledLabel htmlFor="link">Project URL</StyledLabel>
        <StyledInput
          id="link"
          name="link"
          value={formData.link || ""}
          onChange={handleChange}
          placeholder="Project URL"
          required
        />
      </FormGroup>
      <FormGroup>
        <StyledLabel htmlFor="git">GitHub URL</StyledLabel>
        <StyledInput
          id="git"
          name="git"
          value={formData.git || ""}
          onChange={handleChange}
          placeholder="GitHub URL"
          required
        />
      </FormGroup>
      <SubmitButton type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Submit"}
      </SubmitButton>
    </StyledForm>
  );
};

export default DataForm;
