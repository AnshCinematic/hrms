// src/pages/Users.jsx
import React, { useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import CreateUserDialog from "../components/users/CreateUserDialog.jsx";
import { useUser } from "../context/UserProvider";

const demoUsers = [
  {
    id: 1,
    fullName: "Alice Smith",
    email: "alice@company.com",
    dob: "1990-01-01",
    gender: "Female",
    address: "123 Main St",
    department: "Engineering",
    role: "Admin",
    doj: "2020-01-15",
    employmentType: "Full Time",
    workLocation: "HQ",
    ctc: 1200000,
    accountHolderName: "Alice Smith",
    bankAccountNumber: "1234567890",
    ifscCode: "BANK0001",
    panNumber: "ABCDE1234F",
    pfAccountNo: "PF123456",
    nationality: "Indian",
  },
  {
    id: 2,
    fullName: "Bob Johnson",
    email: "bob@company.com",
    dob: "1985-05-10",
    gender: "Male",
    address: "456 Side St",
    department: "Human Resources",
    role: "Employee",
    doj: "2021-03-20",
    employmentType: "Part Time",
    workLocation: "Remote",
    ctc: 800000,
    accountHolderName: "Bob Johnson",
    bankAccountNumber: "9876543210",
    ifscCode: "BANK0002",
    panNumber: "XYZAB9876K",
    pfAccountNo: "PF654321",
    nationality: "Indian",
  },
];

function Users() {
  const [users, setUsers] = useState(demoUsers);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dob: null,
    gender: "",
    address: "",
    department: "",
    role: "",
    doj: null,
    employmentType: "",
    workLocation: "",
    ctc: "",
    accountHolderName: "",
    bankAccountNumber: "",
    ifscCode: "",
    panNumber: "",
    pfAccountNo: "",
    nationality: "",
  });
  const [deleteIndex, setDeleteIndex] = useState(null);
  const { user, loading: userLoading, error: userError } = useUser();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleOpen = () => {
    setEditIndex(null);
    setFormData({
      fullName: "",
      email: "",
      dob: null,
      gender: "",
      address: "",
      department: "",
      role: "",
      doj: null,
      employmentType: "",
      workLocation: "",
      ctc: "",
      accountHolderName: "",
      bankAccountNumber: "",
      ifscCode: "",
      panNumber: "",
      pfAccountNo: "",
      nationality: "",
    });
    setOpen(true);
  };

  const handleEdit = (idx) => {
    setEditIndex(idx);
    setFormData(users[idx]);
    setOpen(true);
  };

  const handleClose = () => {
    setFormData({
      fullName: "",
      email: "",
      dob: null,
      gender: "",
      address: "",
      department: "",
      role: "",
      doj: null,
      employmentType: "",
      workLocation: "",
      ctc: "",
      accountHolderName: "",
      bankAccountNumber: "",
      ifscCode: "",
      panNumber: "",
      pfAccountNo: "",
      nationality: "",
    });
    setOpen(false);
    setEditIndex(null);
  };

  console.log(formData, users);
  const handleCreateUser = () => {
    if (editIndex !== null) {
      // Edit mode
      const updatedUsers = [...users];
      updatedUsers[editIndex] = { ...formData, id: users[editIndex].id };
      setUsers(updatedUsers);
    } else {
      // Create mode
      setUsers([
        ...users,
        { ...formData, id: users.length ? users[users.length - 1].id + 1 : 1 },
      ]);
    }
    handleClose();
  };

  const handleDelete = (idx) => {
    setDeleteIndex(idx);
  };

  const confirmDelete = () => {
    setUsers(users.filter((_, i) => i !== deleteIndex));
    setDeleteIndex(null);
  };

  const cancelDelete = () => setDeleteIndex(null);

  return (
    <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: 1200, mx: "auto" }}>
      <Typography
        variant="h4"
        fontWeight={700}
        color="primary.main"
        gutterBottom
        sx={{ mb: 3 }}
      >
        Users
      </Typography>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => setProfileOpen(true)}
        sx={{ mb: 2, borderRadius: 2, fontWeight: 600 }}
      >
        View My Profile
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ mb: 2, borderRadius: 2, fontWeight: 600 }}
      >
        + Create User
      </Button>
      <Card elevation={2} sx={{ borderRadius: 3, mb: 4 }}>
        <CardContent>
          <TableContainer component={Box}>
            <Table>
              <TableHead sx={{ bgcolor: "#f4f6f8" }}>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>DOB</TableCell>
                  <TableCell>DOJ</TableCell>
                  <TableCell>CTC</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, idx) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      {user.dob
                        ? typeof user.dob === "string"
                          ? user.dob
                          : user.dob.toLocaleDateString()
                        : ""}
                    </TableCell>
                    <TableCell>
                      {user.doj
                        ? typeof user.doj === "string"
                          ? user.doj
                          : user.doj.toLocaleDateString()
                        : ""}
                    </TableCell>
                    <TableCell>{user.ctc}</TableCell>
                    <TableCell>{user.gender}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1, borderRadius: 2 }}
                        onClick={() => handleEdit(idx)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        sx={{ borderRadius: 2 }}
                        onClick={() => handleDelete(idx)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      <CreateUserDialog
        open={open}
        onClose={handleClose}
        onCreate={handleCreateUser}
        formData={formData}
        setFormData={setFormData}
        editMode={editIndex !== null}
      />
      <CreateUserDialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        onCreate={() => {}}
        formData={user || {}}
        setFormData={() => {}}
        editMode={false}
        readOnly={true}
      />
      {/* Delete Confirmation Dialog */}
      {deleteIndex !== null && (
        <Dialog open={true} onClose={cancelDelete}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete user "{users[deleteIndex].fullName}
            "?
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelDelete}>Cancel</Button>
            <Button color="error" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

export default Users;
