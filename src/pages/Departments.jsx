import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserProvider";
import { hasPermission, getUserDisplayRole } from "../utils/roleUtils";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Fab,
  Button,
  IconButton,
  Tooltip,
  Avatar,
  Chip,
  Divider,
  Box,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Groups as GroupsIcon,
} from "@mui/icons-material";
import { deepPurple, teal, orange } from "@mui/material/colors";

export default function Departments() {
  const navigate = useNavigate();
  const { user: currentUser } = useUser();

  // Role-based access control using utility functions
  const hasDepartmentAccess = hasPermission(
    currentUser,
    "DEPARTMENT_MANAGEMENT"
  );
  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: "Engineering",
      description: "Handles product development and technical operations",
      employeeCount: 24,
    },
    {
      id: 2,
      name: "HR",
      description: "Handles hiring, people operations, and employee relations",
      employeeCount: 8,
    },
    {
      id: 3,
      name: "Sales",
      description:
        "Handles business development, client acquisition, and revenue growth",
      employeeCount: 15,
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentDept, setCurrentDept] = useState({
    name: "",
    description: "",
    employeeCount: 0,
  });

  const handleAdd = () => {
    if (editingId) {
      // Update existing department
      setDepartments(
        departments.map((dept) =>
          dept.id === editingId ? { ...dept, ...currentDept } : dept
        )
      );
      setEditingId(null);
    } else {
      // Add new department
      const newId = Math.max(...departments.map((d) => d.id), 0) + 1;
      setDepartments([...departments, { id: newId, ...currentDept }]);
    }
    setCurrentDept({ name: "", description: "", employeeCount: 0 });
    setOpen(false);
  };

  const handleEdit = (dept) => {
    setCurrentDept({
      name: dept.name,
      description: dept.description,
      employeeCount: dept.employeeCount,
    });
    setEditingId(dept.id);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setDepartments(departments.filter((dept) => dept.id !== id));
  };

  const handleCardClick = (deptId) => {
    navigate(`/departments/${deptId}`);
  };

  const getColorForDept = (name) => {
    const colors = {
      Engineering: deepPurple[500],
      HR: teal[500],
      Sales: orange[500],
    };
    return colors[name] || deepPurple[500];
  };

  return (
    <div className="p-6 relative min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <Box>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            color="primary"
          >
            Departments
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Logged in as: {currentUser?.name} ({getUserDisplayRole(currentUser)}
            )
          </Typography>
        </Box>
        <Typography variant="subtitle1" color="text.secondary">
          {departments.length} departments,{" "}
          {departments.reduce((sum, dept) => sum + dept.employeeCount, 0)}{" "}
          employees
        </Typography>
      </div>

      <Grid container spacing={4}>
        {departments.map((dept) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={dept.id}>
            <Card
              className="shadow-lg transition-all duration-300 hover:shadow-xl"
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                borderLeft: `4px solid ${getColorForDept(dept.name)}`,
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
              }}
              onClick={() => handleCardClick(dept.id)}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <div className="flex items-center mb-3">
                  <Avatar sx={{ bgcolor: getColorForDept(dept.name), mr: 2 }}>
                    <GroupsIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="medium">
                    {dept.name}
                  </Typography>
                </div>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  paragraph
                  sx={{ mb: 2 }}
                >
                  {dept.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <div className="flex justify-between items-center">
                  <Chip
                    label={`${dept.employeeCount} employees`}
                    size="small"
                    icon={<GroupsIcon fontSize="small" />}
                  />
                  {hasDepartmentAccess && (
                    <div>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(dept);
                          }}
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(dept.id);
                          }}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {departments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <GroupsIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No departments found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {hasDepartmentAccess
              ? "Add your first department to get started"
              : "No departments available at the moment"}
          </Typography>
          {hasDepartmentAccess && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
            >
              Add Department
            </Button>
          )}
        </div>
      )}

      {/* Floating Add Button - Only for authorized users */}
      {hasDepartmentAccess && (
        <Tooltip title="Add Department">
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => {
              setCurrentDept({ name: "", description: "", employeeCount: 0 });
              setEditingId(null);
              setOpen(true);
            }}
            sx={{
              position: "fixed",
              bottom: 32,
              right: 32,
              transform: "scale(1)",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      )}

      {/* Add/Edit Department Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          {editingId ? "Edit Department" : "Add New Department"}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Department Name"
            fullWidth
            variant="outlined"
            value={currentDept.name}
            onChange={(e) =>
              setCurrentDept({ ...currentDept, name: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={currentDept.description}
            onChange={(e) =>
              setCurrentDept({ ...currentDept, description: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Employee Count"
            fullWidth
            variant="outlined"
            type="number"
            value={currentDept.employeeCount}
            onChange={(e) =>
              setCurrentDept({
                ...currentDept,
                employeeCount: parseInt(e.target.value) || 0,
              })
            }
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            variant="contained"
            disabled={!currentDept.name.trim()}
            sx={{ px: 3 }}
          >
            {editingId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
