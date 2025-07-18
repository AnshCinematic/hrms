import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";

function Departments() {
  return (
    <div className="p-4">
      <Typography variant="h4" gutterBottom>
        Departments
      </Typography>

      <Button variant="contained" className="mb-4" color="primary">
        + Add Department
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Department Name</TableCell>
            <TableCell>Team Size</TableCell>
            <TableCell>Head</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Engineering</TableCell>
            <TableCell>32</TableCell>
            <TableCell>Alice</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>HR</TableCell>
            <TableCell>5</TableCell>
            <TableCell>Bob</TableCell>
          </TableRow>
          {/* Add more departments */}
        </TableBody>
      </Table>
    </div>
  );
}

export default Departments;
