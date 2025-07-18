import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  TextField,
  Button,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Snackbar,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  Container,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  WorkOutline as VacancyIcon,
  Announcement as AnnouncementIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import React from "react";

const DEFAULT_VACANCIES = [
  {
    id: 1,
    department: "Engineering",
    role: "Frontend Developer",
    description: "Looking for experienced React developers",
    postedDate: new Date().toISOString(),
    lastDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
  },
];

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: 1,
    text: "Welcome to our new HR platform!",
    timestamp: new Date().toISOString(),
    author: "Admin",
  },
];

export default function Dashboard() {
  const [vacancies, setVacancies] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("announcements");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [showAnnouncements, setShowAnnouncements] = useState(true);
  const [showJobs, setShowJobs] = useState(true);

  useEffect(() => {
    // Initialize with default data if localStorage is empty
    if (!localStorage.getItem("vacancies")) {
      localStorage.setItem("vacancies", JSON.stringify(DEFAULT_VACANCIES));
    }
    if (!localStorage.getItem("announcements")) {
      localStorage.setItem(
        "announcements",
        JSON.stringify(DEFAULT_ANNOUNCEMENTS)
      );
    }

    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    try {
      const savedVacancies =
        JSON.parse(localStorage.getItem("vacancies")) || DEFAULT_VACANCIES;
      const savedAnnouncements =
        JSON.parse(localStorage.getItem("announcements")) ||
        DEFAULT_ANNOUNCEMENTS;

      setVacancies(savedVacancies);
      setAnnouncements(savedAnnouncements);
    } catch (error) {
      console.error("Error loading data:", error);
      setVacancies(DEFAULT_VACANCIES);
      setAnnouncements(DEFAULT_ANNOUNCEMENTS);
    } finally {
      setLoading(false);
    }
  };

  const handlePostAnnouncement = () => {
    if (!newAnnouncement.trim()) return;

    const newAnnouncementObj = {
      id: Date.now(),
      text: newAnnouncement,
      timestamp: new Date().toISOString(),
      author: "Admin",
    };

    const updatedAnnouncements = [...announcements, newAnnouncementObj];
    setAnnouncements(updatedAnnouncements);
    localStorage.setItem("announcements", JSON.stringify(updatedAnnouncements));

    setNewAnnouncement("");
    showSnackbar("Announcement posted successfully!");
    setView("announcements"); // Switch to announcements view after posting
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const getDeptColor = (deptName) => {
    const colors = {
      Engineering: "#6a1b9a",
      HR: "#2e7d32",
      Sales: "#ef6c00",
      Default: "#1976d2",
    };
    return colors[deptName] || colors.Default;
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  // Merge and sort timeline items
  const timelineItems = [
    ...(showAnnouncements
      ? announcements.map((a) => ({
          ...a,
          type: "announcement",
          date: a.timestamp || a.date,
        }))
      : []),
    ...(showJobs
      ? vacancies.map((v) => ({
          ...v,
          type: "job",
          date: v.postedDate,
        }))
      : []),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{ p: 0, height: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* Header with Toggle */}
      <Box
        sx={{
          p: 3,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Company Dashboard
        </Typography>

        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={showAnnouncements}
                onChange={(e) => setShowAnnouncements(e.target.checked)}
              />
            }
            label="Show Announcements"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showJobs}
                onChange={(e) => setShowJobs(e.target.checked)}
              />
            }
            label="Show Job Openings"
          />
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
        {timelineItems.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "60vh",
            }}
          >
            <AnnouncementIcon
              sx={{ fontSize: 48, color: "text.disabled", mb: 2 }}
            />
            <Typography variant="h5">No items to display</Typography>
          </Box>
        ) : (
          <List sx={{ width: "100%" }}>
            {timelineItems.map((item) => (
              <React.Fragment key={item.id + item.type}>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar>
                          {item.type === "announcement" ? (
                            <AnnouncementIcon />
                          ) : (
                            <VacancyIcon />
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {item.type === "announcement"
                            ? item.author
                            : item.role}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.type === "announcement"
                            ? item.text
                            : `${item.department} Department`}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {formatDate(item.date)}
                        </Typography>
                      </Box>
                    </ListItem>
                  </CardContent>
                </Card>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>

      {/* Announcement Creator (Fixed at Bottom) */}
      {showAnnouncements && (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderTop: "1px solid",
            borderColor: "divider",
            position: "sticky",
            bottom: 0,
            zIndex: 1,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Create Announcement
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Announcement"
              value={newAnnouncement}
              onChange={(e) => setNewAnnouncement(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newAnnouncement.trim())
                  handlePostAnnouncement();
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handlePostAnnouncement}
              disabled={!newAnnouncement.trim()}
              sx={{ height: "100%", minWidth: 120 }}
            >
              Post
            </Button>
          </Box>
        </Paper>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
