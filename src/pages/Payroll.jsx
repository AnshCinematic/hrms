import React from "react";
import {
  Box,
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
import { useUser } from "../context/UserProvider";
import jsPDF from "jspdf";
import { TextField, MenuItem } from "@mui/material";

const COMPANY_NAME = "Your Company Pvt Ltd";

// Mock payslip data
const payslips = [
  {
    id: 1,
    month: "June 2025",
    salary: 80000,
    deductions: 5000,
    net: 75000,
    date: "2025-06-30",
  },
  {
    id: 2,
    month: "May 2025",
    salary: 80000,
    deductions: 4000,
    net: 76000,
    date: "2025-05-31",
  },
];

function downloadPayslip(user, payslip) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(COMPANY_NAME, 20, 20);
  doc.setFontSize(14);
  doc.text("Payslip", 20, 35);
  doc.setFontSize(12);
  doc.text(`Employee: ${user?.username || user?.fullName || "-"}`, 20, 50);
  doc.text(`Month: ${payslip.month}`, 20, 60);
  doc.text(`Date: ${payslip.date}`, 20, 70);
  doc.text(`Gross Salary: ₹${payslip.salary}`, 20, 80);
  doc.text(`Deductions: ₹${payslip.deductions}`, 20, 90);
  doc.text(`Net Pay: ₹${payslip.net}`, 20, 100);
  doc.text("------------------------------", 20, 110);
  doc.text("Thank you for your service!", 20, 120);
  doc.save(`Payslip_${payslip.month.replace(/ /g, "_")}.pdf`);
}

export default function Payroll() {
  const { user } = useUser();
  const isAccountant =
    user?.role === "Accountant" || user?.designation === "Accountant";
  const [genForm, setGenForm] = React.useState({
    employee: "",
    month: "",
    salary: "",
    deductions: "",
    net: "",
    date: "",
  });

  const handleGenFormChange = (e) => {
    const { name, value } = e.target;
    setGenForm((prev) => ({
      ...prev,
      [name]: value,
      net:
        name === "salary" || name === "deductions"
          ? String(
              Number(name === "salary" ? value : prev.salary) -
                Number(name === "deductions" ? value : prev.deductions)
            )
          : prev.net,
    }));
  };

  const handleGeneratePayslip = (e) => {
    e.preventDefault();
    if (!genForm.employee || !genForm.month || !genForm.salary) return;
    const payslip = {
      ...genForm,
      net:
        genForm.net ||
        String(Number(genForm.salary) - Number(genForm.deductions || 0)),
      date: new Date().toISOString().split("T")[0],
    };
    downloadPayslip({ username: genForm.employee }, payslip);
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: 700, mx: "auto" }}>
      <Typography
        variant="h4"
        fontWeight={700}
        color="primary.main"
        gutterBottom
        sx={{ mb: 3 }}
      >
        Payroll
      </Typography>
      {isAccountant && (
        <Card elevation={2} sx={{ borderRadius: 3, mb: 4 }}>
          <CardContent>
            <Typography
              variant="h6"
              fontWeight={600}
              color="primary.main"
              gutterBottom
            >
              Generate Payslip (Accountant Only)
            </Typography>
            <Box
              component="form"
              onSubmit={handleGeneratePayslip}
              sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}
            >
              <TextField
                label="Employee Name"
                name="employee"
                value={genForm.employee}
                onChange={handleGenFormChange}
                required
              />
              <TextField
                label="Month"
                name="month"
                value={genForm.month}
                onChange={handleGenFormChange}
                required
                select
              >
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Gross Salary"
                name="salary"
                type="number"
                value={genForm.salary}
                onChange={handleGenFormChange}
                required
              />
              <TextField
                label="Deductions"
                name="deductions"
                type="number"
                value={genForm.deductions}
                onChange={handleGenFormChange}
              />
              <TextField
                label="Net Pay"
                name="net"
                type="number"
                value={
                  genForm.net ||
                  Number(genForm.salary) - Number(genForm.deductions || 0)
                }
                InputProps={{ readOnly: true }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ fontWeight: 600 }}
              >
                Generate Payslip PDF
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
      <Card elevation={2} sx={{ borderRadius: 3, mb: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={600}
            color="primary.main"
            gutterBottom
          >
            My Payslips
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Month</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Gross Salary</TableCell>
                <TableCell>Deductions</TableCell>
                <TableCell>Net Pay</TableCell>
                <TableCell>Download</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payslips.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.month}</TableCell>
                  <TableCell>{p.date}</TableCell>
                  <TableCell>₹{p.salary}</TableCell>
                  <TableCell>₹{p.deductions}</TableCell>
                  <TableCell>₹{p.net}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => downloadPayslip(user, p)}
                    >
                      Download PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
}
