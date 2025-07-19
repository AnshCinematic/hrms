import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  Schedule,
  Notifications,
  Visibility,
  Comment,
  Email,
} from "@mui/icons-material";

const LEAVE_TYPES = [
  "Casual Leave",
  "Sick Leave",
  "Earned Leave",
  "Maternity Leave",
  "Paternity Leave",
];

const USER_OPTIONS = [
  { name: "Alice Smith", role: "Employee", id: 1, email: "alice@company.com" },
  { name: "Bob Johnson", role: "Manager", id: 2, email: "bob@company.com" },
  { name: "John Doe", role: "Employee", id: 3, email: "john@company.com" },
  { name: "Sarah Wilson", role: "Employee", id: 4, email: "sarah@company.com" },
];

function Leaves() {
  // Simulate user context - in real app this would come from authentication
  const [currentUserId, setCurrentUserId] = useState(2); // Default to Bob (Manager) for testing
  const currentUser = USER_OPTIONS.find((u) => u.id === currentUserId);
  const isManager = currentUser.role === "Manager";

  // Leave state
  const [leaves, setLeaves] = useState([]);

  // Load leaves from localStorage on mount
  useEffect(() => {
    // Force clear localStorage for testing - this ensures demo data loads
    localStorage.removeItem("leaves");

    const saved = localStorage.getItem("leaves");
    console.log("Loading leaves from localStorage:", saved);

    if (saved) {
      const parsedLeaves = JSON.parse(saved);
      console.log("Parsed leaves:", parsedLeaves);
      setLeaves(parsedLeaves);
    } else {
      console.log("No saved leaves found, loading demo data");
      setLeaves([
        // Alice Smith's leaves
        {
          id: 1,
          userId: 1,
          userName: "Alice Smith",
          userEmail: "alice@company.com",
          date: "2025-07-10",
          endDate: "2025-07-12",
          type: "Casual Leave",
          status: "Approved",
          reason: "Family function - cousin's wedding",
          halfDay: false,
          attachment: null,
          appliedAt: "2025-01-15T10:30:00",
          approvedAt: "2025-01-16T09:15:00",
          approvedBy: "Bob Johnson",
          approvalComment:
            "Approved - Family function is important. Enjoy the wedding!",
        },
        {
          id: 2,
          userId: 1,
          userName: "Alice Smith",
          userEmail: "alice@company.com",
          date: "2025-08-01",
          endDate: "2025-08-01",
          type: "Sick Leave",
          status: "Pending",
          reason: "Fever and headache - not feeling well",
          halfDay: false,
          attachment: "medical_certificate.pdf",
          appliedAt: "2025-01-20T14:20:00",
        },
        {
          id: 3,
          userId: 1,
          userName: "Alice Smith",
          userEmail: "alice@company.com",
          date: "2025-09-15",
          endDate: "2025-09-15",
          type: "Casual Leave",
          status: "Approved",
          reason: "Dentist appointment",
          halfDay: true,
          attachment: "appointment_confirmation.pdf",
          appliedAt: "2025-01-25T08:45:00",
          approvedAt: "2025-01-25T11:30:00",
          approvedBy: "Bob Johnson",
          approvalComment: "Approved - Health appointments are important",
        },
        {
          id: 4,
          userId: 1,
          userName: "Alice Smith",
          userEmail: "alice@company.com",
          date: "2025-12-20",
          endDate: "2025-12-31",
          type: "Earned Leave",
          status: "Pending",
          reason: "Christmas and New Year vacation with family",
          halfDay: false,
          attachment: null,
          appliedAt: "2025-01-28T16:15:00",
        },

        // John Doe's leaves
        {
          id: 5,
          userId: 3,
          userName: "John Doe",
          userEmail: "john@company.com",
          date: "2025-08-02",
          endDate: "2025-08-05",
          type: "Casual Leave",
          status: "Pending",
          reason: "Personal work and family vacation to beach",
          halfDay: false,
          attachment: null,
          appliedAt: "2025-01-21T11:45:00",
        },
        {
          id: 6,
          userId: 3,
          userName: "John Doe",
          userEmail: "john@company.com",
          date: "2025-10-10",
          endDate: "2025-10-10",
          type: "Sick Leave",
          status: "Approved",
          reason: "Food poisoning - need rest",
          halfDay: false,
          attachment: "doctor_note.pdf",
          appliedAt: "2025-01-30T07:20:00",
          approvedAt: "2025-01-30T09:00:00",
          approvedBy: "Bob Johnson",
          approvalComment: "Approved - Take care and get well soon",
        },
        {
          id: 7,
          userId: 3,
          userName: "John Doe",
          userEmail: "john@company.com",
          date: "2025-11-15",
          endDate: "2025-11-15",
          type: "Casual Leave",
          status: "Rejected",
          reason: "Friend's birthday party",
          halfDay: true,
          attachment: null,
          appliedAt: "2025-02-01T13:10:00",
          approvedAt: "2025-02-02T10:30:00",
          approvedBy: "Bob Johnson",
          approvalComment:
            "Rejected - Please schedule personal events after work hours",
        },

        // Sarah Wilson's leaves
        {
          id: 8,
          userId: 4,
          userName: "Sarah Wilson",
          userEmail: "sarah@company.com",
          date: "2025-08-10",
          endDate: "2025-08-10",
          type: "Sick Leave",
          status: "Rejected",
          reason: "Doctor appointment for routine checkup",
          halfDay: true,
          attachment: "appointment_letter.pdf",
          appliedAt: "2025-01-22T16:30:00",
          approvedAt: "2025-01-23T10:00:00",
          approvedBy: "Bob Johnson",
          approvalComment:
            "Rejected - Please schedule routine appointments after work hours or on weekends",
        },
        {
          id: 9,
          userId: 4,
          userName: "Sarah Wilson",
          userEmail: "sarah@company.com",
          date: "2025-09-05",
          endDate: "2025-09-07",
          type: "Casual Leave",
          status: "Approved",
          reason: "Sister's graduation ceremony",
          halfDay: false,
          attachment: "graduation_invitation.pdf",
          appliedAt: "2025-02-05T09:30:00",
          approvedAt: "2025-02-05T14:15:00",
          approvedBy: "Bob Johnson",
          approvalComment: "Approved - Congratulations to your sister!",
        },
        {
          id: 10,
          userId: 4,
          userName: "Sarah Wilson",
          userEmail: "sarah@company.com",
          date: "2025-10-20",
          endDate: "2025-10-20",
          type: "Sick Leave",
          status: "Pending",
          reason: "Migraine - severe headache",
          halfDay: true,
          attachment: "medical_prescription.pdf",
          appliedAt: "2025-02-10T12:45:00",
        },

        // Bob Johnson's leaves (as manager)
        {
          id: 11,
          userId: 2,
          userName: "Bob Johnson",
          userEmail: "bob@company.com",
          date: "2025-08-15",
          endDate: "2025-08-17",
          type: "Casual Leave",
          status: "Approved",
          reason: "Team building workshop",
          halfDay: false,
          attachment: "workshop_certificate.pdf",
          appliedAt: "2025-02-12T10:20:00",
          approvedAt: "2025-02-12T15:30:00",
          approvedBy: "HR Manager",
          approvalComment: "Approved - Professional development is encouraged",
        },
        {
          id: 12,
          userId: 2,
          userName: "Bob Johnson",
          userEmail: "bob@company.com",
          date: "2025-11-25",
          endDate: "2025-11-29",
          type: "Earned Leave",
          status: "Pending",
          reason: "Thanksgiving vacation with family",
          halfDay: false,
          attachment: null,
          appliedAt: "2025-02-15T08:00:00",
        },

        // Additional test cases
        {
          id: 13,
          userId: 1,
          userName: "Alice Smith",
          userEmail: "alice@company.com",
          date: "2025-06-15",
          endDate: "2025-06-15",
          type: "Maternity Leave",
          status: "Approved",
          reason: "Prenatal checkup",
          halfDay: true,
          attachment: "prenatal_appointment.pdf",
          appliedAt: "2025-01-10T11:00:00",
          approvedAt: "2025-01-10T13:45:00",
          approvedBy: "Bob Johnson",
          approvalComment: "Approved - Maternity care is a priority",
        },
        {
          id: 14,
          userId: 3,
          userName: "John Doe",
          userEmail: "john@company.com",
          date: "2025-07-25",
          endDate: "2025-07-25",
          type: "Paternity Leave",
          status: "Approved",
          reason: "Wife's ultrasound appointment",
          halfDay: true,
          attachment: "ultrasound_appointment.pdf",
          appliedAt: "2025-01-18T14:30:00",
          approvedAt: "2025-01-19T09:00:00",
          approvedBy: "Bob Johnson",
          approvalComment: "Approved - Supporting your family during pregnancy",
        },
        {
          id: 15,
          userId: 4,
          userName: "Sarah Wilson",
          userEmail: "sarah@company.com",
          date: "2025-09-20",
          endDate: "2025-09-22",
          type: "Earned Leave",
          status: "Pending",
          reason: "Annual family vacation to mountains",
          halfDay: false,
          attachment: "vacation_booking.pdf",
          appliedAt: "2025-02-20T16:00:00",
        },
      ]);
    }
  }, []);

  // Save leaves to localStorage on change
  useEffect(() => {
    localStorage.setItem("leaves", JSON.stringify(leaves));
  }, [leaves]);

  // Leave application dialog state
  const [applyOpen, setApplyOpen] = useState(false);
  const [form, setForm] = useState({
    date: "",
    endDate: "",
    type: "",
    reason: "",
    halfDay: false,
    attachment: null,
  });

  // Approval dialog state
  const [approvalDialog, setApprovalDialog] = useState({
    open: false,
    leave: null,
    action: "", // "approve" or "reject"
    comment: "",
  });

  // Leave details dialog state
  const [detailsDialog, setDetailsDialog] = useState({
    open: false,
    leave: null,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Search/filter state - separate for each table
  const [myLeavesSearch, setMyLeavesSearch] = useState("");
  const [myLeavesStatusFilter, setMyLeavesStatusFilter] = useState("");
  const [myLeavesTypeFilter, setMyLeavesTypeFilter] = useState("");

  const [pendingLeavesSearch, setPendingLeavesSearch] = useState("");
  const [pendingLeavesTypeFilter, setPendingLeavesTypeFilter] = useState("");

  // Handlers
  const handleApplyOpen = () => setApplyOpen(true);
  const handleApplyClose = () => {
    setApplyOpen(false);
    setForm({
      date: "",
      endDate: "",
      type: "",
      reason: "",
      halfDay: false,
      attachment: null,
    });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else if (type === "file") {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!form.date || !form.type || !form.reason) {
      setSnackbar({
        open: true,
        message: "All fields are required",
        severity: "error",
      });
      return;
    }

    const newLeave = {
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      date: form.date,
      endDate: form.endDate,
      type: form.type,
      status: "Pending",
      reason: form.reason,
      halfDay: form.halfDay,
      attachment: form.attachment ? form.attachment.name : null,
      appliedAt: new Date().toISOString(),
    };

    setLeaves([...leaves, newLeave]);

    // Simulate email notification to manager
    if (isManager) {
      console.log(
        `Email sent to ${currentUser.email}: Leave request submitted`
      );
    } else {
      console.log(
        `Email sent to manager: New leave request from ${currentUser.name}`
      );
    }

    setSnackbar({
      open: true,
      message: "Leave applied successfully! Manager will be notified.",
      severity: "success",
    });

    setForm({
      date: "",
      endDate: "",
      type: "",
      reason: "",
      halfDay: false,
      attachment: null,
    });
    handleApplyClose();
  };

  // Enhanced approval handlers
  const handleApprovalOpen = (leave, action) => {
    setApprovalDialog({
      open: true,
      leave,
      action,
      comment: "",
    });
  };

  const handleApprovalClose = () => {
    setApprovalDialog({
      open: false,
      leave: null,
      action: "",
      comment: "",
    });
  };

  const handleApprovalSubmit = () => {
    const { leave, action, comment } = approvalDialog;

    const updatedLeave = {
      ...leave,
      status: action === "approve" ? "Approved" : "Rejected",
      approvedAt: new Date().toISOString(),
      approvedBy: currentUser.name,
      approvalComment: comment,
    };

    setLeaves(leaves.map((l) => (l.id === leave.id ? updatedLeave : l)));

    // Simulate email notification to employee
    console.log(
      `Email sent to ${leave.userEmail}: Leave ${
        action === "approve" ? "approved" : "rejected"
      } by ${currentUser.name}`
    );

    setSnackbar({
      open: true,
      message: `Leave ${
        action === "approve" ? "approved" : "rejected"
      } successfully!`,
      severity: action === "approve" ? "success" : "info",
    });

    handleApprovalClose();
  };

  const handleDetailsOpen = (leave) => {
    setDetailsDialog({
      open: true,
      leave,
    });
  };

  const handleDetailsClose = () => {
    setDetailsDialog({
      open: false,
      leave: null,
    });
  };

  // Filtered views
  console.log("Current user:", currentUser);
  console.log("All leaves:", leaves);
  console.log("Is manager:", isManager);

  const myLeaves = leaves.filter(
    (l) =>
      l.userId === currentUser.id &&
      (!myLeavesSearch ||
        l.type.toLowerCase().includes(myLeavesSearch.toLowerCase()) ||
        l.reason.toLowerCase().includes(myLeavesSearch.toLowerCase())) &&
      (!myLeavesStatusFilter || l.status === myLeavesStatusFilter) &&
      (!myLeavesTypeFilter || l.type === myLeavesTypeFilter)
  );

  console.log("My leaves:", myLeaves);

  const pendingLeaves = isManager
    ? leaves.filter(
        (l) =>
          l.status === "Pending" &&
          l.userId !== currentUser.id &&
          (!pendingLeavesSearch ||
            l.type.toLowerCase().includes(pendingLeavesSearch.toLowerCase()) ||
            l.reason
              .toLowerCase()
              .includes(pendingLeavesSearch.toLowerCase()) ||
            l.userName
              .toLowerCase()
              .includes(pendingLeavesSearch.toLowerCase())) &&
          (!pendingLeavesTypeFilter || l.type === pendingLeavesTypeFilter)
      )
    : [];

  console.log("Pending leaves:", pendingLeaves);

  const getStatusChip = (status) => {
    const statusConfig = {
      Pending: { color: "warning", icon: <Schedule /> },
      Approved: { color: "success", icon: <CheckCircle /> },
      Rejected: { color: "error", icon: <Cancel /> },
    };

    const config = statusConfig[status] || statusConfig.Pending;

    return (
      <Chip
        icon={config.icon}
        label={status}
        color={config.color}
        size="small"
        variant="outlined"
      />
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: 1200, mx: "auto" }}>
      {/* Header and Apply Leave Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight={700} color="primary.main">
          Leave Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleApplyOpen}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          Apply Leave
        </Button>
      </Box>

      {/* Pending Approvals for Managers */}
      {isManager && (
        <Card elevation={1} sx={{ borderRadius: 3, mb: 4 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography
                variant="h6"
                fontWeight={600}
                color="primary.main"
                sx={{ flexGrow: 1 }}
              >
                Pending Leave Approvals
              </Typography>
              <Badge badgeContent={pendingLeaves.length} color="error">
                <Notifications color="action" />
              </Badge>
            </Box>

            {/* Pending Approvals Filters */}
            <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Grid item>
                <TextField
                  size="small"
                  label="Search Employee/Reason"
                  value={pendingLeavesSearch}
                  onChange={(e) => setPendingLeavesSearch(e.target.value)}
                  sx={{ minWidth: 200 }}
                />
              </Grid>
              <Grid item>
                <FormControl size="small">
                  <InputLabel>Leave Type</InputLabel>
                  <Select
                    value={pendingLeavesTypeFilter}
                    label="Leave Type"
                    onChange={(e) => setPendingLeavesTypeFilter(e.target.value)}
                    sx={{ minWidth: 150 }}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    {LEAVE_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Half Day</TableCell>
                  <TableCell>Applied</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingLeaves.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9}>
                      <Box sx={{ textAlign: "center", py: 2 }}>
                        <Typography variant="body1" color="text.secondary">
                          No pending leave requests to approve
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          When employees apply for leaves, they will appear here
                          for your approval
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingLeaves.map((l) => (
                    <TableRow
                      key={l.id}
                      sx={{ "&:hover": { bgcolor: "action.hover" } }}
                    >
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {l.userName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {l.userEmail}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{l.date}</TableCell>
                      <TableCell>{l.endDate || "-"}</TableCell>
                      <TableCell>{l.type}</TableCell>
                      <TableCell>
                        <Tooltip title={l.reason}>
                          <Typography
                            sx={{
                              maxWidth: 150,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {l.reason}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{l.halfDay ? "Yes" : "No"}</TableCell>
                      <TableCell>{formatDate(l.appliedAt)}</TableCell>
                      <TableCell>{getStatusChip(l.status)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleDetailsOpen(l)}
                              color="primary"
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Button
                            size="small"
                            color="success"
                            variant="outlined"
                            onClick={() => handleApprovalOpen(l, "approve")}
                            startIcon={<CheckCircle />}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            onClick={() => handleApprovalOpen(l, "reject")}
                            startIcon={<Cancel />}
                          >
                            Reject
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      <Card elevation={1} sx={{ borderRadius: 3, mb: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={600}
            color="primary.main"
            gutterBottom
          >
            My Leave History
          </Typography>

          {/* My Leave History Filters */}
          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid item>
              <TextField
                size="small"
                label="Search Reason/Type"
                value={myLeavesSearch}
                onChange={(e) => setMyLeavesSearch(e.target.value)}
                sx={{ minWidth: 200 }}
              />
            </Grid>
            <Grid item>
              <FormControl size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={myLeavesStatusFilter}
                  label="Status"
                  onChange={(e) => setMyLeavesStatusFilter(e.target.value)}
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl size="small">
                <InputLabel>Leave Type</InputLabel>
                <Select
                  value={myLeavesTypeFilter}
                  label="Leave Type"
                  onChange={(e) => setMyLeavesTypeFilter(e.target.value)}
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="">All Types</MenuItem>
                  {LEAVE_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Half Day</TableCell>
                <TableCell>Applied</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myLeaves.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>No leaves applied</TableCell>
                </TableRow>
              ) : (
                myLeaves.map((l) => (
                  <TableRow
                    key={l.id}
                    sx={{ "&:hover": { bgcolor: "action.hover" } }}
                  >
                    <TableCell>{l.date}</TableCell>
                    <TableCell>{l.endDate || "-"}</TableCell>
                    <TableCell>{l.type}</TableCell>
                    <TableCell>
                      <Tooltip title={l.reason}>
                        <Typography
                          sx={{
                            maxWidth: 150,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {l.reason}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{l.halfDay ? "Yes" : "No"}</TableCell>
                    <TableCell>{formatDate(l.appliedAt)}</TableCell>
                    <TableCell>{getStatusChip(l.status)}</TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleDetailsOpen(l)}
                          color="primary"
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Leave Application Dialog */}
      <Dialog
        open={applyOpen}
        onClose={handleApplyClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Apply for Leave</DialogTitle>
        <form onSubmit={handleApplySubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Start Date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleFormChange}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={handleFormChange}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <TextField
              select
              label="Type"
              name="type"
              value={form.type}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              required
            >
              {LEAVE_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Reason"
              name="reason"
              value={form.reason}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              required
            />
            <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                name="halfDay"
                checked={form.halfDay}
                onChange={handleFormChange}
                style={{ marginRight: 8 }}
              />
              <Typography>Half Day</Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                Attachment (optional):
              </Typography>
              <input
                type="file"
                name="attachment"
                accept="image/*,application/pdf"
                onChange={handleFormChange}
                style={{ display: "block", marginTop: 8 }}
              />
              {form.attachment && (
                <Typography variant="caption" sx={{ ml: 1 }}>
                  {form.attachment.name}
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleApplyClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Apply
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog
        open={approvalDialog.open}
        onClose={handleApprovalClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {approvalDialog.action === "approve"
            ? "Approve Leave"
            : "Reject Leave"}
        </DialogTitle>
        <DialogContent>
          {approvalDialog.leave && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Leave Request Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Employee
                  </Typography>
                  <Typography variant="body1">
                    {approvalDialog.leave.userName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Type
                  </Typography>
                  <Typography variant="body1">
                    {approvalDialog.leave.type}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Start Date
                  </Typography>
                  <Typography variant="body1">
                    {approvalDialog.leave.date}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    End Date
                  </Typography>
                  <Typography variant="body1">
                    {approvalDialog.leave.endDate || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Reason
                  </Typography>
                  <Typography variant="body1">
                    {approvalDialog.leave.reason}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
          <TextField
            label={`${
              approvalDialog.action === "approve" ? "Approval" : "Rejection"
            } Comment`}
            value={approvalDialog.comment}
            onChange={(e) =>
              setApprovalDialog({ ...approvalDialog, comment: e.target.value })
            }
            fullWidth
            multiline
            rows={3}
            placeholder={`Add a comment for ${
              approvalDialog.action === "approve" ? "approval" : "rejection"
            }...`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleApprovalClose}>Cancel</Button>
          <Button
            onClick={handleApprovalSubmit}
            variant="contained"
            color={approvalDialog.action === "approve" ? "success" : "error"}
          >
            {approvalDialog.action === "approve" ? "Approve" : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Leave Details Dialog */}
      <Dialog
        open={detailsDialog.open}
        onClose={handleDetailsClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Leave Request Details</DialogTitle>
        <DialogContent>
          {detailsDialog.leave && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Employee"
                        secondary={detailsDialog.leave.userName}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Email"
                        secondary={detailsDialog.leave.userEmail}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Leave Type"
                        secondary={detailsDialog.leave.type}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Start Date"
                        secondary={detailsDialog.leave.date}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="End Date"
                        secondary={detailsDialog.leave.endDate || "-"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Half Day"
                        secondary={detailsDialog.leave.halfDay ? "Yes" : "No"}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Request Details
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Reason"
                        secondary={detailsDialog.leave.reason}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Applied At"
                        secondary={formatDate(detailsDialog.leave.appliedAt)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Status"
                        secondary={getStatusChip(detailsDialog.leave.status)}
                      />
                    </ListItem>
                    {detailsDialog.leave.attachment && (
                      <ListItem>
                        <ListItemText
                          primary="Attachment"
                          secondary={
                            <Button
                              size="small"
                              startIcon={<Email />}
                              onClick={() => console.log("Download attachment")}
                            >
                              {detailsDialog.leave.attachment}
                            </Button>
                          }
                        />
                      </ListItem>
                    )}
                  </List>
                </Grid>
              </Grid>

              {detailsDialog.leave.approvedAt && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Approval Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Approved By"
                        secondary={detailsDialog.leave.approvedBy}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Approved At"
                        secondary={formatDate(detailsDialog.leave.approvedAt)}
                      />
                    </ListItem>
                    {detailsDialog.leave.approvalComment && (
                      <ListItem>
                        <ListItemText
                          primary="Comment"
                          secondary={detailsDialog.leave.approvalComment}
                        />
                      </ListItem>
                    )}
                  </List>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailsClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Leaves;
