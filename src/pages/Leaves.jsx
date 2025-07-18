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
} from "@mui/material";

function Leaves() {
  return (
    <div className="p-4">
      <Typography variant="h4" gutterBottom>
        Leave Management
      </Typography>

      <Card className="mb-4">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Apply for Leave
          </Typography>
          <Button variant="contained" color="primary">
            Apply Leave
          </Button>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>
        Leave History
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>2025-07-10</TableCell>
            <TableCell>Casual Leave</TableCell>
            <TableCell>Approved</TableCell>
          </TableRow>
          {/* Add more leave rows here */}
        </TableBody>
      </Table>
    </div>
  );
}

export default Leaves;
