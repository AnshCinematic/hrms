import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
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
} from "@mui/material";

const LEAVE_TYPES = [
  "Casual Leave",
  "Sick Leave",
  "Earned Leave",
  "Maternity Leave",
  "Paternity Leave",
];
const USER_OPTIONS = [
  { name: "Alice Smith", role: "Employee", id: 1 },
  { name: "Bob Johnson", role: "Manager", id: 2 },
];

function Leaves() {
  // Simulate user context
  const [currentUserId, setCurrentUserId] = useState(1); // Default to Alice
  const currentUser = USER_OPTIONS.find((u) => u.id === currentUserId);
  const isManager = currentUser.role === "Manager";

  // Leave state
  const [leaves, setLeaves] = useState([]);

  // Load leaves from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("leaves");
    if (saved) {
      setLeaves(JSON.parse(saved));
    } else {
      setLeaves([
        {
          id: 1,
          userId: 1,
          userName: "Alice Smith",
          date: "2025-07-10",
          type: "Casual Leave",
          status: "Approved",
          reason: "Family function",
        },
        {
          id: 2,
          userId: 1,
          userName: "Alice Smith",
          date: "2025-08-01",
          type: "Sick Leave",
          status: "Pending",
          reason: "Fever",
        },
        {
          id: 3,
          userId: 3,
          userName: "John Doe",
          date: "2025-08-02",
          type: "Casual Leave",
          status: "Pending",
          reason: "Personal work",
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Search/filter state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

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
    setLeaves([
      ...leaves,
      {
        id: Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        date: form.date,
        endDate: form.endDate,
        type: form.type,
        status: "Pending",
        reason: form.reason,
        halfDay: form.halfDay,
        attachment: form.attachment ? form.attachment.name : null,
      },
    ]);
    setSnackbar({
      open: true,
      message: "Leave applied successfully!",
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

  // Manager actions
  const handleApprove = (leaveId) => {
    setLeaves(
      leaves.map((l) => (l.id === leaveId ? { ...l, status: "Approved" } : l))
    );
    setSnackbar({
      open: true,
      message: "Leave approved!",
      severity: "success",
    });
  };
  const handleReject = (leaveId) => {
    setLeaves(
      leaves.map((l) => (l.id === leaveId ? { ...l, status: "Rejected" } : l))
    );
    setSnackbar({ open: true, message: "Leave rejected!", severity: "info" });
  };

  // Filtered views
  const myLeaves = leaves.filter(
    (l) =>
      l.userId === currentUser.id &&
      (!search ||
        l.type.toLowerCase().includes(search.toLowerCase()) ||
        l.reason.toLowerCase().includes(search.toLowerCase())) &&
      (!statusFilter || l.status === statusFilter) &&
      (!typeFilter || l.type === typeFilter)
  );
  const pendingLeaves = isManager
    ? leaves.filter(
        (l) =>
          l.status === "Pending" &&
          l.userId !== currentUser.id &&
          (!search ||
            l.type.toLowerCase().includes(search.toLowerCase()) ||
            l.reason.toLowerCase().includes(search.toLowerCase()) ||
            l.userName.toLowerCase().includes(search.toLowerCase())) &&
          (!typeFilter || l.type === typeFilter)
      )
    : [];

  return (
    <div className="p-4">
      {/* Filters/Search */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item>
          <FormControl size="small">
            <InputLabel>User</InputLabel>
            <Select
              value={currentUserId}
              label="User"
              onChange={(e) => setCurrentUserId(Number(e.target.value))}
              sx={{ minWidth: 180 }}
            >
              {USER_OPTIONS.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <TextField
            size="small"
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 180 }}
          />
        </Grid>
        <Grid item>
          <FormControl size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl size="small">
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              label="Type"
              onChange={(e) => setTypeFilter(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">All</MenuItem>
              {LEAVE_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Typography variant="h4" gutterBottom>
        Leave Management
      </Typography>

      <Card className="mb-4">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Apply for Leave
          </Typography>
          <Button variant="contained" color="primary" onClick={handleApplyOpen}>
            Apply Leave
          </Button>
        </CardContent>
      </Card>

      {/* Manager: Pending Approvals */}
      {isManager && (
        <>
          <Typography variant="h6" gutterBottom>
            Pending Leave Approvals
          </Typography>
          <Table sx={{ mb: 4 }}>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Half Day</TableCell>
                <TableCell>Attachment</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingLeaves.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9}>No pending leaves</TableCell>
                </TableRow>
              ) : (
                pendingLeaves.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>{l.userName}</TableCell>
                    <TableCell>{l.date}</TableCell>
                    <TableCell>{l.endDate || "-"}</TableCell>
                    <TableCell>{l.type}</TableCell>
                    <TableCell>{l.reason}</TableCell>
                    <TableCell>{l.halfDay ? "Yes" : "No"}</TableCell>
                    <TableCell>{l.attachment ? l.attachment : "-"}</TableCell>
                    <TableCell>{l.status}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        color="success"
                        onClick={() => handleApprove(l.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleReject(l.id)}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </>
      )}

      <Typography variant="h6" gutterBottom>
        My Leave History
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Half Day</TableCell>
            <TableCell>Attachment</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {myLeaves.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7}>No leaves applied</TableCell>
            </TableRow>
          ) : (
            myLeaves.map((l) => (
              <TableRow key={l.id}>
                <TableCell>{l.date}</TableCell>
                <TableCell>{l.endDate || "-"}</TableCell>
                <TableCell>{l.type}</TableCell>
                <TableCell>{l.reason}</TableCell>
                <TableCell>{l.halfDay ? "Yes" : "No"}</TableCell>
                <TableCell>{l.attachment ? l.attachment : "-"}</TableCell>
                <TableCell>{l.status}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Leave Application Dialog */}
      <Dialog open={applyOpen} onClose={handleApplyClose}>
        <DialogTitle>Apply for Leave</DialogTitle>
        <form onSubmit={handleApplySubmit}>
          <DialogContent>
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
              rows={2}
              required
            />
            <div style={{ margin: "16px 0" }}>
              <label>
                <input
                  type="checkbox"
                  name="halfDay"
                  checked={form.halfDay}
                  onChange={handleFormChange}
                  style={{ marginRight: 8 }}
                />
                Half Day
              </label>
            </div>
            <div style={{ margin: "16px 0" }}>
              <label>
                Attachment (optional):
                <input
                  type="file"
                  name="attachment"
                  accept="image/*,application/pdf"
                  onChange={handleFormChange}
                  style={{ display: "block", marginTop: 8 }}
                />
                {form.attachment && (
                  <span style={{ marginLeft: 8 }}>{form.attachment.name}</span>
                )}
              </label>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleApplyClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Apply
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
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
    </div>
  );
}

export default Leaves;
