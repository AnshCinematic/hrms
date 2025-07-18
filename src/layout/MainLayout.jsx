import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  Box,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FeedIcon from "@mui/icons-material/Feed";
import WorkIcon from "@mui/icons-material/Work";
import LayersIcon from "@mui/icons-material/Layers";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const drawerWidth = 220;

const navItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Feeds", icon: <FeedIcon />, path: "/feeds" },
  { text: "Leaves", icon: <CalendarMonthIcon />, path: "/leaves" },
  { text: "Jobs", icon: <WorkIcon />, path: "/jobs" },
  { text: "Departments", icon: <LayersIcon />, path: "/departments" },
];

export default function MainLayout() {
  const location = useLocation();

  return (
    <Box sx={{ display: "flex" }}>
      {/* Top App Bar */}
      <AppBar position="fixed" sx={{ zIndex: 1201, bgcolor: "#1976d2" }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            HRMS Portal
          </Typography>
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
            pt: 8,
          },
        }}
      >
        <Toolbar />
        <List>
          {navItems.map((item) => (
            <ListItem
              key={item.text}
              button
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          ml: `${drawerWidth}px`,
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
