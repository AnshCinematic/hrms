import {
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

function Jobs() {
  return (
    <div className="p-4">
      <Typography variant="h4" gutterBottom>
        Job Openings
      </Typography>

      <Card className="mb-4">
        <CardContent className="flex justify-between items-center">
          <Typography variant="h6">Post a New Job</Typography>
          <Button variant="contained" color="primary">
            + Post Job
          </Button>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>
        Current Openings
      </Typography>
      <List className="bg-white rounded shadow">
        <ListItem divider>
          <ListItemText
            primary="Frontend Developer"
            secondary="2 Openings · Remote"
          />
        </ListItem>
        <ListItem divider>
          <ListItemText
            primary="HR Executive"
            secondary="1 Opening · Bangalore Office"
          />
        </ListItem>
      </List>
    </div>
  );
}

export default Jobs;
