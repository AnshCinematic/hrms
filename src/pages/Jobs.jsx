import { useState, useEffect } from "react";
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
  MenuItem
} from "@mui/material";
import {
  WorkOutline as VacancyIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreIcon,
  CheckCircle as ActiveIcon,
  Cancel as ClosedIcon
} from "@mui/icons-material";
import { blue, green, orange, purple } from "@mui/material/colors";

export default function Jobs() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentVacancy, setCurrentVacancy] = useState(null);

  useEffect(() => {
    fetchVacancies();
  }, [refreshCounter]);

  const fetchVacancies = () => {
    setLoading(true);
    setTimeout(() => {
      const savedVacancies = JSON.parse(localStorage.getItem('vacancies')) || [];
      setVacancies(savedVacancies);
      setLoading(false);
    }, 500);
  };

  const filteredVacancies = vacancies.filter(vacancy =>
    vacancy.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vacancy.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vacancy.description.toLowerCase().includes(searchTerm.toLowerCase())
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
    const updatedVacancies = vacancies.map(v => 
      v.id === currentVacancy.id ? { ...v, status: newStatus } : v
    );
    setVacancies(updatedVacancies);
    localStorage.setItem('vacancies', JSON.stringify(updatedVacancies));
    handleMenuClose();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h4" fontWeight="bold">
          Job Vacancies
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
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
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => setRefreshCounter(prev => prev + 1)}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredVacancies.length > 0 ? (
            filteredVacancies.map((vacancy) => (
              <Grid item xs={12} sm={6} md={4} key={vacancy.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderLeft: `4px solid ${getDeptColor(vacancy.department)}`,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Avatar sx={{ 
                          bgcolor: getDeptColor(vacancy.department),
                          width: 40, 
                          height: 40 
                        }}>
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
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
                          color={vacancy.status === 'active' ? 'success' : 'error'}
                          icon={vacancy.status === 'active' ? <ActiveIcon /> : <ClosedIcon />}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                py: 8,
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 2
              }}>
                <VacancyIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No vacancies found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {searchTerm ? 'Try a different search' : 'Create vacancies in Departments section'}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => changeStatus('active')} disabled={currentVacancy?.status === 'active'}>
          <ActiveIcon color="success" sx={{ mr: 1 }} /> Mark Active
        </MenuItem>
        <MenuItem onClick={() => changeStatus('closed')} disabled={currentVacancy?.status === 'closed'}>
          <ClosedIcon color="error" sx={{ mr: 1 }} /> Mark Closed
        </MenuItem>
      </Menu>
    </Box>
  );
}