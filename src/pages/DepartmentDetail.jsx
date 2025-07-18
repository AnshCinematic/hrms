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

export default function DepartmentDetail() {
  const { deptId } = useParams();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openVacancyDialog, setOpenVacancyDialog] = useState(false);
  const [vacancyForm, setVacancyForm] = useState({
    role: "",
    description: "",
    lastDate: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Mock department data
  const department = {
    1: { name: "Engineering", color: blue[500] },
    2: { name: "HR", color: green[500] },
    3: { name: "Sales", color: orange[500] },
  }[deptId] || { name: "Unknown", color: "#ccc" };

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
          joinDate: "2020-05-15"
        },
        { 
          id: 102, 
          empId: "ENG002", 
          name: "Bob Smith", 
          email: "bob@company.com", 
          phone: "987-654-3210", 
          designation: "Senior Engineer",
          joinDate: "2018-11-22"
        },
      ]);
      setLoading(false);
    }, 800);
  }, [deptId]);

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const handleCreateVacancy = () => {
    const newVacancy = {
      id: Date.now(),
      department: department.name,
      role: vacancyForm.role,
      description: vacancyForm.description,
      lastDate: vacancyForm.lastDate,
      postedDate: new Date().toISOString().split('T')[0],
      status: "active"
    };

    // Get existing vacancies
    const existingVacancies = JSON.parse(localStorage.getItem('vacancies')) || [];
    const updatedVacancies = [...existingVacancies, newVacancy];
    
    // Save to localStorage
    localStorage.setItem('vacancies', JSON.stringify(updatedVacancies));
    
    // Trigger storage event to update other tabs
    window.dispatchEvent(new Event('storage'));
    
    setSnackbar({
      open: true,
      message: "Vacancy created and posted to Jobs page!",
      severity: "success",
    });
    
    setVacancyForm({ role: "", description: "", lastDate: "" });
    setOpenVacancyDialog(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Back to departments">
            <IconButton onClick={() => navigate('/departments')} sx={{ color: 'primary.main' }}>
              <BackIcon />
            </IconButton>
          </Tooltip>
          <Box>
            <Typography variant="h5" component="h1" fontWeight="500">
              {department.name} Department
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
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<VacancyIcon />}
            onClick={() => setOpenVacancyDialog(true)}
            sx={{ bgcolor: 'secondary.main' }}
          >
            Create Vacancy
          </Button>
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
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Employee Table */}
      <Paper elevation={0} sx={{ 
        border: '1px solid', 
        borderColor: 'divider', 
        borderRadius: 2,
        overflow: 'hidden'
      }}>
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: 200 
          }}>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: department.color, width: 36, height: 36 }}>
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
                  <TableCell>{new Date(emp.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEmployee(emp);
                          setOpenDialog(true);
                        }}
                        size="small"
                        sx={{ color: 'text.secondary' }}
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
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
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
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <PersonIcon />
          {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Full Name"
            fullWidth
            variant="outlined"
            defaultValue={selectedEmployee?.name || ''}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Employee ID"
            fullWidth
            variant="outlined"
            defaultValue={selectedEmployee?.empId || ''}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Designation"
            fullWidth
            variant="outlined"
            defaultValue={selectedEmployee?.designation || ''}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            variant="outlined"
            defaultValue={selectedEmployee?.email || ''}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Phone"
            fullWidth
            variant="outlined"
            defaultValue={selectedEmployee?.phone || ''}
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
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
          >
            {selectedEmployee ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Vacancy Creation Dialog */}
      <Dialog open={openVacancyDialog} onClose={() => setOpenVacancyDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ 
          bgcolor: 'secondary.main', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <VacancyIcon />
          Create New Vacancy
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Role/Position"
            fullWidth
            variant="outlined"
            value={vacancyForm.role}
            onChange={(e) => setVacancyForm({...vacancyForm, role: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Job Description"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={vacancyForm.description}
            onChange={(e) => setVacancyForm({...vacancyForm, description: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Last Date to Apply"
            fullWidth
            variant="outlined"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={vacancyForm.lastDate}
            onChange={(e) => setVacancyForm({...vacancyForm, lastDate: e.target.value})}
          />
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Preview of Hiring Message:
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
              {vacancyForm.role || vacancyForm.description || vacancyForm.lastDate ? (
                `New vacancy in ${department.name} department:\n\n` +
                `Role: ${vacancyForm.role || '-'}\n` +
                `Description: ${vacancyForm.description || '-'}\n` +
                `Last date to apply: ${vacancyForm.lastDate || '-'}\n\n` +
                `Interested candidates should apply immediately!`
              ) : (
                "Fill the form to see the generated message"
              )}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={() => setOpenVacancyDialog(false)} 
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            startIcon={<SendIcon />}
            onClick={handleCreateVacancy}
            disabled={!vacancyForm.role}
            sx={{ 
              bgcolor: 'secondary.main',
              '&:hover': {
                bgcolor: 'secondary.dark',
              }
            }}
          >
            Post to Jobs
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}