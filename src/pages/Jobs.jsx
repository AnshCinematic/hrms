import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Divider,
  Button,
  TextField,
  CircularProgress,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  WorkOutline as VacancyIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreIcon,
  CheckCircle as ActiveIcon,
  Cancel as ClosedIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { blue, green, orange, purple } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

export default function Jobs() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentVacancy, setCurrentVacancy] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({
    role: "",
    department: "",
    description: "",
    lastDate: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchVacancies();
  }, [refreshCounter]);

  const fetchVacancies = () => {
    setLoading(true);
    setTimeout(() => {
      const savedVacancies =
        JSON.parse(localStorage.getItem("vacancies")) || [];
      setVacancies(savedVacancies);
      setLoading(false);
    }, 500);
  };

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => {
    setOpenDialog(false);
    setForm({ role: "", department: "", description: "", lastDate: "" });
  };
  const handleFormChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleCreateJob = (e) => {
    e.preventDefault();
    if (!form.role || !form.department) {
      setSnackbar({
        open: true,
        message: "Role and Department are required",
        severity: "error",
      });
      return;
    }
    const newVacancy = {
      id: Date.now(),
      role: form.role,
      department: form.department,
      description: form.description,
      lastDate: form.lastDate,
      postedDate: new Date().toISOString().split("T")[0],
      status: "active",
    };
    const updatedVacancies = [newVacancy, ...vacancies];
    setVacancies(updatedVacancies);
    localStorage.setItem("vacancies", JSON.stringify(updatedVacancies));
    setSnackbar({
      open: true,
      message: "Job created successfully!",
      severity: "success",
    });
    handleDialogClose();
  };

  const filteredVacancies = vacancies.filter(
    (vacancy) =>
      (!searchTerm ||
        vacancy.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vacancy.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vacancy.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!departmentFilter || vacancy.department === departmentFilter) &&
      (!statusFilter || vacancy.status === statusFilter)
  );

  const getDeptColor = (deptName) => {
    const colors = {
      Engineering: purple[500],
      HR: green[500],
      Sales: orange[500],
    };
    return colors[deptName] || blue[500];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleMenuOpen = (event, vacancy) => {
    setAnchorEl(event.currentTarget);
    setCurrentVacancy(vacancy);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentVacancy(null);
  };

  const changeStatus = (newStatus) => {
    const updatedVacancies = vacancies.map((v) =>
      v.id === currentVacancy.id ? { ...v, status: newStatus } : v
    );
    setVacancies(updatedVacancies);
    localStorage.setItem("vacancies", JSON.stringify(updatedVacancies));
    handleMenuClose();
  };

  const navigate = useNavigate();

  // Get unique departments for filter dropdown
  const departmentOptions = Array.from(
    new Set((vacancies || []).map((v) => v.department))
  ).filter(Boolean);

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Job Vacancies
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            size="small"
            placeholder="Search vacancies..."
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 250 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Department</InputLabel>
            <Select
              value={departmentFilter}
              label="Department"
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {departmentOptions.map((dep) => (
                <MenuItem key={dep} value={dep}>
                  {dep}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => setRefreshCounter((prev) => prev + 1)}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            color="primary"
            onClick={handleDialogOpen}
            sx={{ fontWeight: 600, borderRadius: 2 }}
          >
            + Create Job
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredVacancies.length > 0 ? (
            filteredVacancies.map((vacancy) => (
              <Grid item xs={12} sm={6} md={4} key={vacancy.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderLeft: `4px solid ${getDeptColor(vacancy.department)}`,
                    transition: "all 0.3s",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 3,
                    },
                  }}
                  onClick={() => navigate(`/jobs/${vacancy.id}`)}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: getDeptColor(vacancy.department),
                            width: 40,
                            height: 40,
                          }}
                        >
                          <VacancyIcon fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="medium">
                            {vacancy.role}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {vacancy.department} Department
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, vacancy)}
                        size="small"
                      >
                        <MoreIcon />
                      </IconButton>
                    </Box>

                    <Typography variant="body2" paragraph sx={{ mb: 2 }}>
                      {vacancy.description}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Posted
                        </Typography>
                        <Typography variant="body2">
                          {formatDate(vacancy.postedDate)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Closes
                        </Typography>
                        <Typography variant="body2">
                          {formatDate(vacancy.lastDate)}
                        </Typography>
                      </Box>
                      <Box>
                        <Chip
                          label={vacancy.status}
                          size="small"
                          color={
                            vacancy.status === "active" ? "success" : "error"
                          }
                          icon={
                            vacancy.status === "active" ? (
                              <ActiveIcon />
                            ) : (
                              <ClosedIcon />
                            )
                          }
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  py: 8,
                  border: "1px dashed",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <VacancyIcon
                  sx={{ fontSize: 48, color: "text.disabled", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary">
                  No vacancies found
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {searchTerm
                    ? "Try a different search"
                    : "Create vacancies in Departments section"}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}

      {/* Job Creation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <SendIcon />
          Create New Job
        </DialogTitle>
        <form onSubmit={handleCreateJob}>
          <DialogContent sx={{ py: 3 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Role/Position"
              name="role"
              fullWidth
              variant="outlined"
              value={form.role}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              margin="dense"
              label="Department"
              name="department"
              fullWidth
              variant="outlined"
              value={form.department}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              margin="dense"
              label="Job Description"
              name="description"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              value={form.description}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Last Date to Apply"
              name="lastDate"
              fullWidth
              variant="outlined"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={form.lastDate}
              onChange={handleFormChange}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={handleDialogClose} variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SendIcon />}
              sx={{ fontWeight: 600 }}
            >
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => changeStatus("active")}
          disabled={currentVacancy?.status === "active"}
        >
          <ActiveIcon color="success" sx={{ mr: 1 }} /> Mark Active
        </MenuItem>
        <MenuItem
          onClick={() => changeStatus("closed")}
          disabled={currentVacancy?.status === "closed"}
        >
          <ClosedIcon color="error" sx={{ mr: 1 }} /> Mark Closed
        </MenuItem>
      </Menu>
    </Box>
  );
}
