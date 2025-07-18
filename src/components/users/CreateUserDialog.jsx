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
  readOnly,
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

  // Helper to get value from either camelCase, snake_case, or nested account
  const getVal = (key, fallback = "") => {
    return (
      formData[key] ||
      formData[key.replace(/([A-Z])/g, "_$1").toLowerCase()] ||
      (formData.account
        ? formData.account[key] ||
          formData.account[key.replace(/([A-Z])/g, "_$1").toLowerCase()]
        : undefined) ||
      fallback
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {readOnly ? "My Profile" : editMode ? "Edit User" : "Create New User"}
      </DialogTitle>
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
                      value={getVal("fullName") || getVal("name")}
                      onChange={handleChange}
                      error={!!errors.fullName}
                      helperText={errors.fullName || ""}
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="email"
                      label="Email Address"
                      fullWidth
                      value={getVal("email")}
                      onChange={handleChange}
                      error={!!errors.email}
                      helperText={errors.email || ""}
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DatePicker
                      label="Date of Birth"
                      value={
                        getVal("dob") ||
                        getVal("dateOfBirth") ||
                        getVal("date_of_birth") ||
                        null
                      }
                      onChange={(date) => handleDateChange("dob", date)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={!!errors.dob}
                          helperText={errors.dob || ""}
                          disabled={readOnly}
                        />
                      )}
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      name="gender"
                      label="Gender"
                      fullWidth
                      value={getVal("gender")}
                      onChange={handleChange}
                      disabled={readOnly}
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
                      value={getVal("address")}
                      onChange={handleChange}
                      disabled={readOnly}
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
                      value={getVal("department")}
                      onChange={handleChange}
                      error={!!errors.department}
                      helperText={errors.department || ""}
                      disabled={readOnly}
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
                      value={getVal("role") || getVal("designation")}
                      onChange={handleChange}
                      error={!!errors.role}
                      helperText={errors.role || ""}
                      disabled={readOnly}
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
                      value={
                        getVal("doj") ||
                        getVal("dateOfJoining") ||
                        getVal("date_of_joining") ||
                        null
                      }
                      onChange={(date) => handleDateChange("doj", date)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={!!errors.doj}
                          helperText={errors.doj || ""}
                          disabled={readOnly}
                        />
                      )}
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="employmentType"
                      label="Employment Type"
                      fullWidth
                      value={
                        getVal("employmentType") || getVal("employment_type")
                      }
                      onChange={handleChange}
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="workLocation"
                      label="Work Location"
                      fullWidth
                      value={getVal("workLocation") || getVal("work_location")}
                      onChange={handleChange}
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="ctc"
                      label="Base Salary (CTC)"
                      type="number"
                      fullWidth
                      value={
                        getVal("ctc") ||
                        getVal("baseSalary") ||
                        getVal("base_salary")
                      }
                      onChange={handleChange}
                      error={!!errors.ctc}
                      helperText={errors.ctc || ""}
                      disabled={readOnly}
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
                      value={
                        getVal("accountHolderName") ||
                        getVal("account_holder_name")
                      }
                      onChange={handleChange}
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="bankAccountNumber"
                      label="Bank Account Number"
                      fullWidth
                      value={
                        getVal("bankAccountNumber") ||
                        getVal("bank_account_number")
                      }
                      onChange={handleChange}
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="ifscCode"
                      label="IFSC Code"
                      fullWidth
                      value={getVal("ifscCode") || getVal("ifsc_code")}
                      onChange={handleChange}
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="panNumber"
                      label="PAN Number"
                      fullWidth
                      value={getVal("panNumber") || getVal("pan_number")}
                      onChange={handleChange}
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="pfAccountNo"
                      label="PF Account No (optional)"
                      fullWidth
                      value={
                        getVal("pfAccountNo") || getVal("pf_account_number")
                      }
                      onChange={handleChange}
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="nationality"
                      label="Nationality"
                      fullWidth
                      value={getVal("nationality")}
                      onChange={handleChange}
                      disabled={readOnly}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </LocalizationProvider>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="secondary">
            {readOnly ? "Close" : "Cancel"}
          </Button>
          {!readOnly && (
            <Button type="submit" variant="contained" color="primary">
              {editMode ? "Save Changes" : "Create User"}
            </Button>
          )}
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
