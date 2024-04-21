"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import DataForm from "@/components/DataForm";
import { BarLoader } from "react-spinners";
import styled from "styled-components";
import { FiEdit, FiTrash2, FiInfo } from "react-icons/fi"; // Importing icons

Modal.setAppElement("#modal-root");

const DataTable = () => {
  const [data, setData] = useState([]);
  const [editingData, setEditingData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get(
        `${process.env.NEXT_APP_BASE_URL}/api/data`
      );
      setData(result.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (_id) => {
    setIsLoading(true);
    try {
      await axios.delete(`${process.env.NEXT_APP_BASE_URL}/api/data`, {
        data: { _id },
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting data: ", error);
    }
    setIsLoading(false);
  };

  const handleEdit = (data) => {
    setEditingData(data);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingData({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingData(null);
  };

  const openImageModal = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImageUrl("");
  };

  return (
    <Container>
      <ActionButton style={{ marginTop: "50px", padding: "10px 20px" }} onClick={handleAddNew}>Add New Entry</ActionButton>
      {isLoading ? (
        <LoaderContainer>
          <BarLoader color="#36d7b7" />
        </LoaderContainer>
      ) : (
        <>
          <StyledTableWrapper>
            <StyledTable>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Image</th>
                  <th>Description</th>
                  <th>Data Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item._id}>
                    <td>{item.id}</td>
                    <td>{item.title}</td>
                    <td>
                      <FiInfo
                        onClick={() => openImageModal(item.img)}
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                    <td>{item.desc}</td>
                    <td>
                      <FiInfo
                        onClick={() => openImageModal(item.data_img)}
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                    <td>
                      <ButtonContainer>
                        <ActionButton onClick={() => handleEdit(item)}>
                          <FiEdit /> Edit
                        </ActionButton>
                        <ActionButton
                          onClick={() => handleDelete(item._id)}
                          danger
                        >
                          <FiTrash2 /> Delete
                        </ActionButton>
                      </ButtonContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          </StyledTableWrapper>
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Data Form"
            style={{
              content: {
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                maxWidth: "600px",
              },
            }}
          >
            <DataForm
              initialData={editingData}
              onClose={closeModal}
              refreshData={fetchData}
            />
          </Modal>
          <Modal
            isOpen={isImageModalOpen}
            onRequestClose={closeImageModal}
            contentLabel="Image Viewer"
            style={modalStyles}
          >
            <img
              src={selectedImageUrl}
              alt="Modal Content"
              style={{ width: "100%" }}
            />
          </Modal>
        </>
      )}
    </Container>
  );
};

export default DataTable;

// Styled-components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxWidth: "600px",
  },
};

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
`;

const StyledTableWrapper = styled.div`
  overflow-y: auto;
  max-height: 500px;
  width: 100%;
  max-width: 960px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  margin: 30px auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  td {
    text-align: left;
    padding: 12px;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  th {
    text-align: center;
    padding: 12px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    position: sticky;
    top: 0;
    background-color: #fff;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: ${(props) => (props.danger ? "#e74c3c" : "#3498db")};
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;
