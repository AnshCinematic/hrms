import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  Box,
  CssBaseline,
  Avatar,
  Divider,
  useTheme,
  Paper,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkIcon from "@mui/icons-material/Work";
import LayersIcon from "@mui/icons-material/Layers";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { VerifiedUserOutlined } from "@mui/icons-material";
import React from "react";
import { useUser } from "../context/UserProvider";
import CreateUserDialog from "../components/users/CreateUserDialog.jsx";

const drawerWidth = 240;

const navItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Leaves", icon: <CalendarMonthIcon />, path: "/leaves" },
  { text: "Jobs", icon: <WorkIcon />, path: "/jobs" },
  { text: "Users", icon: <VerifiedUserOutlined />, path: "/users" },
  { text: "Departments", icon: <LayersIcon />, path: "/departments" },
  { text: "Payroll", icon: <WorkIcon />, path: "/payroll" },
];

const APP_NAME = "HRMS Portal";
const LOGO = (
  <Avatar
    sx={{
      bgcolor: "primary.main",
      width: 40,
      height: 40,
      fontWeight: 700,
      fontSize: 24,
    }}
  >
    HR
  </Avatar>
);

const USER = { name: "Alice Smith", role: "Admin" };

export default function MainLayout() {
  const location = useLocation();
  const theme = useTheme();
  const { user } = useUser();
  const [profileOpen, setProfileOpen] = React.useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f7f8fa" }}>
      <CssBaseline />

      {/* Top App Bar */}
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "white",
          color: "primary.main",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar
          sx={{
            minHeight: 64,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {LOGO}
            <Typography
              variant="h6"
              noWrap
              component="div"
              fontWeight={700}
              color="primary.main"
            >
              {APP_NAME}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              cursor: "pointer",
            }}
            onClick={() => setProfileOpen(true)}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.light" }}>
              {user?.username?.[0] || user?.fullName?.[0] || "A"}
            </Avatar>
            <Box>
              <Typography variant="body1" fontWeight={600} color="text.primary">
                {user?.username || user?.fullName || "Alice Smith"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.designation || user?.role || "Admin"}
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Side Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            pt: 0,
            bgcolor: "#212b36",
            color: "#fff",
            borderRight: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
      >
        <Box>
          <Toolbar sx={{ minHeight: 64 }} />
          <Box sx={{ px: 2, py: 3 }}>
            {/* <Typography
              variant="subtitle2"
              color="#b0b8c1"
              sx={{ mb: 2, letterSpacing: 1 }}
            >
              NAVIGATION
            </Typography> */}
            <List>
              {navItems.map((item) => (
                <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    selected={location.pathname === item.path}
                    sx={{
                      borderRadius: 2,
                      bgcolor:
                        location.pathname === item.path
                          ? "primary.main"
                          : "inherit",
                      color:
                        location.pathname === item.path ? "#fff" : "#b0b8c1",
                      "&:hover": {
                        bgcolor:
                          location.pathname === item.path
                            ? "primary.dark"
                            : "#2d3843",
                        color: "#fff",
                      },
                      px: 2,
                      py: 1.2,
                      transition: "all 0.2s",
                    }}
                  >
                    <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
        <Box sx={{ px: 2, py: 3, borderTop: "1px solid #2d3843" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
            onClick={() => setProfileOpen(true)}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.light" }}>
              {user?.username?.[0] || user?.fullName?.[0] || "A"}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600} color="#fff">
                {user?.username || user?.fullName || "Alice Smith"}
              </Typography>
              <Typography variant="caption" color="#b0b8c1">
                {user?.designation || user?.role || "Admin"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          ml: `${drawerWidth}px`,
          mt: 8,
          minHeight: "100vh",
          bgcolor: "#f7f8fa",
          width: { xs: "100vw", sm: `calc(100vw - ${drawerWidth}px)` },
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 800,
            mx: "auto",
            py: { xs: 2, sm: 4 },
            px: { xs: 1, sm: 3 },
            minHeight: "80vh",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              bgcolor: "white",
              borderRadius: 3,
              boxShadow: 2,
              p: { xs: 1, sm: 3 },
              minHeight: "60vh",
            }}
          >
            <Outlet />
          </Paper>
        </Box>
      </Box>
      <CreateUserDialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        onCreate={() => {}}
        formData={user || {}}
        setFormData={() => {}}
        editMode={false}
        readOnly={true}
      />
    </Box>
  );
}
