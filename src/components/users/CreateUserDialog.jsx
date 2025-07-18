import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Button,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// Dummy department values
const DEPARTMENT_OPTIONS = [
  "Engineering",
  "Human Resources",
  "Sales",
  "Finance",
  "Marketing",
  "Customer Support",
  "IT",
];

const ROLE_OPTIONS = ["Admin", "Manager", "Employee", "Intern", "HR"];

function CreateUserDialog({
  open,
  onClose,
  onCreate,
  formData,
  setFormData,
  editMode,
}) {
  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleDateChange = (name, value) =>
    setFormData({ ...formData, [name]: value });

  const validate = () => {
    let newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.dob) newErrors.dob = "Date of Birth is required";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.doj) newErrors.doj = "Date of Joining is required";
    if (!formData.ctc) newErrors.ctc = "CTC is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const foundErrors = validate();
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) return;
    onCreate();
    setErrors({});
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{editMode ? "Edit User" : "Create New User"}</DialogTitle>
      <form onSubmit={handleSubmit} noValidate>
        <DialogContent dividers>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            {/* Personal Info */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>1. Personal Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="fullName"
                      label="Full Name"
                      fullWidth
                      value={formData.fullName}
                      onChange={handleChange}
                      error={!!errors.fullName}
                      helperText={errors.fullName || ""}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="email"
                      label="Email Address"
                      fullWidth
                      value={formData.email}
                      onChange={handleChange}
                      error={!!errors.email}
                      helperText={errors.email || ""}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DatePicker
                      label="Date of Birth"
                      value={formData.dob}
                      onChange={(date) => handleDateChange("dob", date)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={!!errors.dob}
                          helperText={errors.dob || ""}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      name="gender"
                      label="Gender"
                      fullWidth
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="address"
                      label="Address"
                      fullWidth
                      multiline
                      rows={2}
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Employment Info */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>2. Employment Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      name="department"
                      label="Department"
                      fullWidth
                      value={formData.department}
                      onChange={handleChange}
                      error={!!errors.department}
                      helperText={errors.department || ""}
                    >
                      {DEPARTMENT_OPTIONS.map((dept) => (
                        <MenuItem key={dept} value={dept}>
                          {dept}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      name="role"
                      label="Designation / Role"
                      fullWidth
                      value={formData.role}
                      onChange={handleChange}
                      error={!!errors.role}
                      helperText={errors.role || ""}
                    >
                      {ROLE_OPTIONS.map((role) => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DatePicker
                      label="Date of Joining"
                      value={formData.doj}
                      onChange={(date) => handleDateChange("doj", date)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={!!errors.doj}
                          helperText={errors.doj || ""}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="employmentType"
                      label="Employment Type"
                      fullWidth
                      value={formData.employmentType}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="workLocation"
                      label="Work Location"
                      fullWidth
                      value={formData.workLocation}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="ctc"
                      label="Base Salary (CTC)"
                      type="number"
                      fullWidth
                      value={formData.ctc}
                      onChange={handleChange}
                      error={!!errors.ctc}
                      helperText={errors.ctc || ""}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Bank & Identification */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>3. Bank & PAN/ID Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="accountHolderName"
                      label="Account Holder Name"
                      fullWidth
                      value={formData.accountHolderName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="bankAccountNumber"
                      label="Bank Account Number"
                      fullWidth
                      value={formData.bankAccountNumber}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="ifscCode"
                      label="IFSC Code"
                      fullWidth
                      value={formData.ifscCode}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="panNumber"
                      label="PAN Number"
                      fullWidth
                      value={formData.panNumber}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="pfAccountNo"
                      label="PF Account No (optional)"
                      fullWidth
                      value={formData.pfAccountNo}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="nationality"
                      label="Nationality"
                      fullWidth
                      value={formData.nationality}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </LocalizationProvider>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {editMode ? "Save Changes" : "Create User"}
          </Button>
        </DialogActions>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {editMode
            ? "User updated successfully!"
            : "User created successfully!"}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

export default CreateUserDialog;
