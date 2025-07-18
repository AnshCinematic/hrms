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
  IconButton,
  Tooltip,
  CircularProgress,
  TextField,
} from "@mui/material";
import {
  WorkOutline as VacancyIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { blue, green, orange, purple } from "@mui/material/colors";

export default function Dashboard() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchVacancies();
  }, []);

  const fetchVacancies = () => {
    setLoading(true);
    // Simulate API call - replace with actual fetch in production
    setTimeout(() => {
      const savedVacancies = JSON.parse(localStorage.getItem('vacancies')) || [];
      setVacancies(savedVacancies);
      setLoading(false);
    }, 800);
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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
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
          <Tooltip title="Refresh">
            <IconButton onClick={fetchVacancies}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Filters">
            <IconButton>
              <FilterIcon />
            </IconButton>
          </Tooltip>
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
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: getDeptColor(vacancy.department),
                        mr: 2,
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
                    
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                      sx={{ mb: 2 }}
                    >
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
                          color={
                            vacancy.status === 'active' ? 'success' : 
                            vacancy.status === 'closed' ? 'error' : 'default'
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
    </Box>
  );
}