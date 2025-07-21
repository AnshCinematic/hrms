import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Box,
  Button,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  WorkOutline as VacancyIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { blue, green, orange } from "@mui/material/colors";
import { useUser } from "../context/UserProvider";
import { hasAnyRole } from "../utils/roleUtils";

export default function DepartmentDetail() {
  const { deptId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useUser();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // CMS state for department info
  const [deptInfo, setDeptInfo] = useState({ name: "", description: "" });
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", description: "" });

  // Mock department data
  const departmentColors = {
    1: { name: "Engineering", color: blue[500] },
    2: { name: "HR", color: green[500] },
    3: { name: "Sales", color: orange[500] },
  };
  const defaultDept = departmentColors[deptId] || {
    name: "Unknown",
    color: "#ccc",
  };

  // Load department info from localStorage or fallback to default
  useEffect(() => {
    const allDeptInfo = JSON.parse(localStorage.getItem("deptInfo")) || {};
    const info = allDeptInfo[deptId] || {
      name: defaultDept.name,
      description: `Welcome to the ${defaultDept.name} department!`,
    };
    setDeptInfo(info);
    setEditForm(info);
  }, [deptId]);

  // Save department info to localStorage
  const handleSaveDeptInfo = () => {
    const allDeptInfo = JSON.parse(localStorage.getItem("deptInfo")) || {};
    allDeptInfo[deptId] = editForm;
    localStorage.setItem("deptInfo", JSON.stringify(allDeptInfo));
    setDeptInfo(editForm);
    setEditMode(false);
    setSnackbar({
      open: true,
      message: "Department info updated!",
      severity: "success",
    });
  };

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setEmployees([
        {
          id: 101,
          empId: "ENG001",
          name: "Alice Johnson",
          email: "alice@company.com",
          phone: "123-456-7890",
          designation: "Software Engineer",
          joinDate: "2020-05-15",
        },
        {
          id: 102,
          empId: "ENG002",
          name: "Bob Smith",
          email: "bob@company.com",
          phone: "987-654-3210",
          designation: "Senior Engineer",
          joinDate: "2018-11-22",
        },
      ]);
      setLoading(false);
    }, 800);
  }, [deptId]);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteEmployee = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* CMS Tools for Department Info */}
      <Card
        elevation={2}
        sx={{ mb: 4, borderRadius: 3, maxWidth: 700, mx: "auto" }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: defaultDept.color, width: 40, height: 40 }}>
              {deptInfo.name[0]}
            </Avatar>
            <Typography variant="h5" fontWeight={700} color="primary.main">
              {deptInfo.name}
            </Typography>
            {hasAnyRole(currentUser, ["ADMIN", "HR"]) && (
              <Button
                size="small"
                variant="outlined"
                sx={{ ml: "auto" }}
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? "Cancel" : "Edit"}
              </Button>
            )}
          </Box>
          {editMode ? (
            <Box
              component="form"
              sx={{ mt: 2 }}
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveDeptInfo();
              }}
            >
              <TextField
                label="Department Name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                fullWidth
                sx={{ mb: 2 }}
                required
              />
              <TextField
                label="Description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                fullWidth
                multiline
                rows={3}
                sx={{ mb: 2 }}
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ fontWeight: 600 }}
              >
                Save
              </Button>
            </Box>
          ) : (
            <Typography variant="body1" sx={{ mt: 1, whiteSpace: "pre-line" }}>
              {deptInfo.description}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Header Section */}
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip title="Back to departments">
            <IconButton
              onClick={() => navigate("/departments")}
              sx={{ color: "primary.main" }}
            >
              <BackIcon />
            </IconButton>
          </Tooltip>
          <Box>
            <Typography variant="h5" component="h1" fontWeight="500">
              {departmentColors[deptId]?.name || "Unknown Department"}{" "}
              Department
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Employee Directory
            </Typography>
          </Box>
          <Chip
            label={`${employees.length} employees`}
            color="primary"
            variant="outlined"
            size="small"
            sx={{ ml: 1 }}
          />
        </Box>

        {hasAnyRole(currentUser, ["ADMIN", "HR"]) && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search employees..."
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: 250 }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
            >
              Add Employee
            </Button>
          </Box>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Employee Table */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 200,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((emp) => (
                <TableRow key={emp.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: departmentColors[deptId]?.color,
                          width: 36,
                          height: 36,
                        }}
                      >
                        <PersonIcon fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography fontWeight="500">{emp.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {emp.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{emp.empId}</TableCell>
                  <TableCell>{emp.designation}</TableCell>
                  <TableCell>{emp.phone}</TableCell>
                  <TableCell>
                    {new Date(emp.joinDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    {hasAnyRole(currentUser, ["ADMIN", "HR"]) && (
                      <>
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEmployee(emp);
                              setOpenDialog(true);
                            }}
                            size="small"
                            sx={{ color: "text.secondary" }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteEmployee(emp.id);
                            }}
                            size="small"
                            sx={{ color: "error.main" }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredEmployees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    {searchTerm ? (
                      <Typography color="text.secondary">
                        No employees match your search
                      </Typography>
                    ) : (
                      <Typography color="text.secondary">
                        No employees found in this department
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Add/Edit Employee Dialog */}
      {hasAnyRole(currentUser, ["ADMIN", "HR"]) && (
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
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
            <PersonIcon />
            {selectedEmployee ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
          <DialogContent sx={{ py: 3 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Full Name"
              fullWidth
              variant="outlined"
              defaultValue={selectedEmployee?.name || ""}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Employee ID"
              fullWidth
              variant="outlined"
              defaultValue={selectedEmployee?.empId || ""}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Designation"
              fullWidth
              variant="outlined"
              defaultValue={selectedEmployee?.designation || ""}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Email"
              fullWidth
              variant="outlined"
              defaultValue={selectedEmployee?.email || ""}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Phone"
              fullWidth
              variant="outlined"
              defaultValue={selectedEmployee?.phone || ""}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              onClick={() => {
                setOpenDialog(false);
                setSelectedEmployee(null);
              }}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: "primary.main",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
            >
              {selectedEmployee ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
