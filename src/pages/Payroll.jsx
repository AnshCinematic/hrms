import React, { useState, useEffect } from "react";
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
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Tabs,
  Tab,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Download,
  Email,
  Visibility,
  Add,
  Edit,
  Delete,
  AccountBalance,
  Receipt,
  Assessment,
  Send,
  ExpandMore,
  Calculate,
  Print,
  FileCopy,
  Notifications,
  Business,
  Person,
  CalendarToday,
  AttachMoney,
  TrendingUp,
  Security,
} from "@mui/icons-material";
import jsPDF from "jspdf";
import { useUser } from "../context/UserProvider";

// Professional company configuration
const COMPANY_CONFIG = {
  name: "TechCorp Solutions Pvt Ltd",
  address: "123 Business Park, Tech City, TC 12345",
  phone: "+1 (555) 123-4567",
  email: "hr@techcorp.com",
  website: "www.techcorp.com",
  pan: "ABCDE1234F",
  tan: "MUMB12345B",
  gstin: "27ABCDE1234F1Z5",
  logo: "🏢", // In real app, this would be an actual logo
};

// Professional employee data
const EMPLOYEES = [
  {
    id: "e2f1a7d0-3e9c-4b32-b6a7-153a22c86b80",
    name: "Kushal Chakraborty",
    email: "rahul.sharma@example.com",
    designation: "Senior Software Engineer",
    department: "Engineering",
    employeeId: "EMP001",
    pan: "ABCDE1234F",
    aadhar: "1234-5678-9012",
    bankAccount: "123456789012",
    ifsc: "SBIN0001234",
    joiningDate: "2021-01-10",
    basicSalary: 150000,
    hra: 60000,
    da: 30000,
    specialAllowance: 20000,
    pf: 18000,
    tds: 15000,
    netSalary: 227000,
  },
  {
    id: 2,
    name: "Bob Johnson",
    email: "bob.johnson@techcorp.com",
    designation: "Engineering Manager",
    department: "Engineering",
    employeeId: "EMP002",
    pan: "BCDEF2345B",
    aadhar: "2345-6789-0123",
    bankAccount: "2345678901",
    ifsc: "SBIN0001234",
    joiningDate: "2022-06-01",
    basicSalary: 80000,
    hra: 32000,
    da: 16000,
    specialAllowance: 12000,
    pf: 9600,
    tds: 8000,
    netSalary: 122400,
  },
  {
    id: 3,
    name: "Sarah Wilson",
    email: "sarah.wilson@techcorp.com",
    designation: "Product Manager",
    department: "Product",
    employeeId: "EMP003",
    pan: "CDEFG3456C",
    aadhar: "3456-7890-1234",
    bankAccount: "3456789012",
    ifsc: "SBIN0001234",
    joiningDate: "2023-03-10",
    basicSalary: 70000,
    hra: 28000,
    da: 14000,
    specialAllowance: 10000,
    pf: 8400,
    tds: 6000,
    netSalary: 113600,
  },
];

// Professional payslip data
const PAYSLIPS = [
  {
    id: 1,
    employeeId: "e2f1a7d0-3e9c-4b32-b6a7-153a22c86b80",
    month: "June 2025",
    year: 2025,
    basicSalary: 150000,
    hra: 60000,
    da: 30000,
    specialAllowance: 20000,
    grossSalary: 260000,
    pf: 18000,
    tds: 15000,
    otherDeductions: 5000,
    totalDeductions: 38000,
    netSalary: 222000,
    workingDays: 22,
    paidDays: 22,
    generatedBy: "Accountant",
    generatedAt: "2025-06-30T10:00:00",
    status: "Generated",
    emailSent: true,
    emailSentAt: "2025-06-30T10:05:00",
  },
  {
    id: 2,
    employeeId: 2,
    month: "June 2025",
    year: 2025,
    basicSalary: 80000,
    hra: 32000,
    da: 16000,
    specialAllowance: 12000,
    grossSalary: 140000,
    pf: 9600,
    tds: 8000,
    otherDeductions: 3000,
    totalDeductions: 20600,
    netSalary: 119400,
    workingDays: 22,
    paidDays: 22,
    generatedBy: "Accountant",
    generatedAt: "2025-06-30T10:30:00",
    status: "Generated",
    emailSent: true,
    emailSentAt: "2025-06-30T10:35:00",
  },
];

// Tax slabs for Form 16
const TAX_SLABS = [
  { min: 0, max: 300000, rate: 0, description: "Up to ₹3,00,000" },
  { min: 300001, max: 600000, rate: 5, description: "₹3,00,001 to ₹6,00,000" },
  { min: 600001, max: 900000, rate: 10, description: "₹6,00,001 to ₹9,00,000" },
  {
    min: 900001,
    max: 1200000,
    rate: 15,
    description: "₹9,00,001 to ₹12,00,000",
  },
  {
    min: 1200001,
    max: 1500000,
    rate: 20,
    description: "₹12,00,001 to ₹15,00,000",
  },
  { min: 1500001, max: Infinity, rate: 30, description: "Above ₹15,00,000" },
];

function Payroll() {
  const { user: currentUser } = useUser();

  // Role-based access control
  const isAccountant =
    currentUser?.role?.includes("ACCOUNTANT") ||
    currentUser?.role === "ACCOUNTANT";
  const isManager =
    currentUser?.role?.includes("MANAGER") || currentUser?.role === "MANAGER";
  const isHR =
    currentUser?.role?.includes("HR_ADMIN") || currentUser?.role === "HR_ADMIN";
  const isAdmin =
    currentUser?.role?.includes("ADMIN") || currentUser?.role === "ADMIN";
  const isEmployee =
    currentUser?.role?.includes("EMPLOYEE") || currentUser?.role === "EMPLOYEE";

  // Check if user has access to payroll management features
  const hasPayrollAccess = isAccountant || isHR || isAdmin;

  // State management
  const [activeTab, setActiveTab] = useState(0);
  const [payslips, setPayslips] = useState(PAYSLIPS);
  const [employees] = useState(EMPLOYEES);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [payslipDialog, setPayslipDialog] = useState({
    open: false,
    payslip: null,
  });
  const [generateDialog, setGenerateDialog] = useState({ open: false });
  const [form16Dialog, setForm16Dialog] = useState({
    open: false,
    employee: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Payslip generation form
  const [payslipForm, setPayslipForm] = useState({
    employeeId: "",
    month: "",
    year: new Date().getFullYear(),
    basicSalary: "",
    hra: "",
    da: "",
    specialAllowance: "",
    pf: "",
    tds: "",
    otherDeductions: "",
    workingDays: 22,
    paidDays: 22,
  });

  // Form 16 generation form
  const [form16Data, setForm16Data] = useState({
    financialYear: "2024-25",
    pan: "",
    grossSalary: "",
    totalDeductions: "",
    taxableIncome: "",
    totalTax: "",
    tds: "",
  });

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("payslips");
    if (saved) {
      setPayslips(JSON.parse(saved));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("payslips", JSON.stringify(payslips));
  }, [payslips]);

  // Handlers
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePayslipFormChange = (e) => {
    const { name, value } = e.target;
    setPayslipForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Pre-fill payslip form with employee data
  const handleEmployeeSelect = (employeeId) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    if (employee) {
      setPayslipForm({
        employeeId: employee.id,
        month: "",
        year: new Date().getFullYear(),
        basicSalary: employee.basicSalary,
        hra: employee.hra,
        da: employee.da,
        specialAllowance: employee.specialAllowance,
        pf: employee.pf,
        tds: employee.tds,
        otherDeductions: 0,
        workingDays: 22,
        paidDays: 22,
      });
    }
  };

  const calculatePayslip = () => {
    const basic = Number(payslipForm.basicSalary) || 0;
    const hra = Number(payslipForm.hra) || 0;
    const da = Number(payslipForm.da) || 0;
    const special = Number(payslipForm.specialAllowance) || 0;
    const pf = Number(payslipForm.pf) || 0;
    const tds = Number(payslipForm.tds) || 0;
    const other = Number(payslipForm.otherDeductions) || 0;

    const grossSalary = basic + hra + da + special;
    const totalDeductions = pf + tds + other;
    const netSalary = grossSalary - totalDeductions;

    return { grossSalary, totalDeductions, netSalary };
  };

  const generatePayslip = () => {
    const { grossSalary, totalDeductions, netSalary } = calculatePayslip();

    const newPayslip = {
      id: Date.now(),
      employeeId: Number(payslipForm.employeeId),
      month: payslipForm.month,
      year: payslipForm.year,
      basicSalary: Number(payslipForm.basicSalary),
      hra: Number(payslipForm.hra),
      da: Number(payslipForm.da),
      specialAllowance: Number(payslipForm.specialAllowance),
      grossSalary,
      pf: Number(payslipForm.pf),
      tds: Number(payslipForm.tds),
      otherDeductions: Number(payslipForm.otherDeductions),
      totalDeductions,
      netSalary,
      workingDays: Number(payslipForm.workingDays),
      paidDays: Number(payslipForm.paidDays),
      generatedBy: currentUser.name,
      generatedAt: new Date().toISOString(),
      status: "Generated",
      emailSent: false,
    };

    setPayslips((prev) => [...prev, newPayslip]);
    setGenerateDialog({ open: false });
    setPayslipForm({
      employeeId: "",
      month: "",
      year: new Date().getFullYear(),
      basicSalary: "",
      hra: "",
      da: "",
      specialAllowance: "",
      pf: "",
      tds: "",
      otherDeductions: "",
      workingDays: 22,
      paidDays: 22,
    });

    setSnackbar({
      open: true,
      message: "Payslip generated successfully!",
      severity: "success",
    });
  };

  const sendPayslipEmail = (payslip) => {
    const employee = employees.find((emp) => emp.id === payslip.employeeId);

    // Simulate email sending
    console.log(`Sending payslip email to ${employee.email}`);

    setPayslips((prev) =>
      prev.map((p) =>
        p.id === payslip.id
          ? { ...p, emailSent: true, emailSentAt: new Date().toISOString() }
          : p
      )
    );

    setSnackbar({
      open: true,
      message: `Payslip sent to ${employee.name}`,
      severity: "success",
    });
  };

  const downloadPayslipPDF = (payslip) => {
    const employee = employees.find((emp) => emp.id === payslip.employeeId);
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(25, 118, 210);
    doc.text(COMPANY_CONFIG.name, 20, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(COMPANY_CONFIG.address, 20, 30);
    doc.text(
      `Phone: ${COMPANY_CONFIG.phone} | Email: ${COMPANY_CONFIG.email}`,
      20,
      35
    );
    doc.text(`PAN: ${COMPANY_CONFIG.pan} | TAN: ${COMPANY_CONFIG.tan}`, 20, 40);

    // Title
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("PAYSLIP", 20, 55);

    // Employee Details
    doc.setFontSize(12);
    doc.text("Employee Details:", 20, 70);
    doc.setFontSize(10);
    doc.text(`Name: ${employee.name}`, 20, 80);
    doc.text(`Employee ID: ${employee.employeeId}`, 20, 85);
    doc.text(`Designation: ${employee.designation}`, 20, 90);
    doc.text(`Department: ${employee.department}`, 20, 95);
    doc.text(`Month: ${payslip.month} ${payslip.year}`, 20, 100);
    doc.text(
      `Working Days: ${payslip.workingDays} | Paid Days: ${payslip.paidDays}`,
      20,
      105
    );

    // Salary Details - Simple table without autoTable
    let yPos = 120;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Salary Breakdown:", 20, yPos);
    yPos += 15;

    doc.setFontSize(10);
    doc.text("Earnings:", 20, yPos);
    yPos += 8;
    doc.text(
      `Basic Salary: ₹${payslip.basicSalary.toLocaleString()}`,
      30,
      yPos
    );
    yPos += 6;
    doc.text(`HRA: ₹${payslip.hra.toLocaleString()}`, 30, yPos);
    yPos += 6;
    doc.text(`DA: ₹${payslip.da.toLocaleString()}`, 30, yPos);
    yPos += 6;
    doc.text(
      `Special Allowance: ₹${payslip.specialAllowance.toLocaleString()}`,
      30,
      yPos
    );
    yPos += 8;
    doc.text(
      `Gross Salary: ₹${payslip.grossSalary.toLocaleString()}`,
      20,
      yPos
    );
    yPos += 15;

    doc.text("Deductions:", 20, yPos);
    yPos += 8;
    doc.text(`PF: ₹${payslip.pf.toLocaleString()}`, 30, yPos);
    yPos += 6;
    doc.text(`TDS: ₹${payslip.tds.toLocaleString()}`, 30, yPos);
    yPos += 6;
    doc.text(
      `Other Deductions: ₹${payslip.otherDeductions.toLocaleString()}`,
      30,
      yPos
    );
    yPos += 8;
    doc.text(
      `Total Deductions: ₹${payslip.totalDeductions.toLocaleString()}`,
      20,
      yPos
    );
    yPos += 15;

    doc.setFontSize(14);
    doc.setTextColor(25, 118, 210);
    doc.text(`Net Pay: ₹${payslip.netSalary.toLocaleString()}`, 20, yPos);

    // Footer
    yPos += 20;
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(
      "This is a computer generated document. No signature required.",
      20,
      yPos
    );
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPos + 5);

    doc.save(`Payslip_${employee.name}_${payslip.month}_${payslip.year}.pdf`);
  };

  const generateForm16 = (employee) => {
    const annualSalary = employee.basicSalary * 12;
    const annualHRA = employee.hra * 12;
    const annualDA = employee.da * 12;
    const annualSpecial = employee.specialAllowance * 12;
    const grossSalary = annualSalary + annualHRA + annualDA + annualSpecial;

    // Calculate tax based on slabs
    let taxableIncome = grossSalary - 50000; // Standard deduction
    let totalTax = 0;

    for (const slab of TAX_SLABS) {
      if (taxableIncome > slab.min) {
        const slabAmount = Math.min(
          taxableIncome - slab.min,
          slab.max - slab.min
        );
        totalTax += (slabAmount * slab.rate) / 100;
      }
    }

    const doc = new jsPDF();

    // Header
    doc.setFontSize(16);
    doc.setTextColor(25, 118, 210);
    doc.text("FORM 16", 20, 20);
    doc.text(
      "Certificate under Section 203 of the Income-tax Act, 1961",
      20,
      30
    );

    // Employer Details
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Employer Details:", 20, 45);
    doc.setFontSize(10);
    doc.text(`Name: ${COMPANY_CONFIG.name}`, 20, 55);
    doc.text(`Address: ${COMPANY_CONFIG.address}`, 20, 60);
    doc.text(`PAN: ${COMPANY_CONFIG.pan}`, 20, 65);
    doc.text(`TAN: ${COMPANY_CONFIG.tan}`, 20, 70);

    // Employee Details
    doc.setFontSize(12);
    doc.text("Employee Details:", 20, 85);
    doc.setFontSize(10);
    doc.text(`Name: ${employee.name}`, 20, 95);
    doc.text(`PAN: ${employee.pan}`, 20, 100);
    doc.text(`Assessment Year: 2025-26`, 20, 105);

    // Income Details
    let yPos = 115;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Income Details:", 20, yPos);
    yPos += 15;

    doc.setFontSize(10);
    doc.text(`Gross Salary: ₹${grossSalary.toLocaleString()}`, 20, yPos);
    yPos += 8;
    doc.text(`Standard Deduction: ₹50,000`, 20, yPos);
    yPos += 8;
    doc.text(`Taxable Income: ₹${taxableIncome.toLocaleString()}`, 20, yPos);
    yPos += 8;
    doc.text(`Total Tax: ₹${totalTax.toLocaleString()}`, 20, yPos);
    yPos += 8;
    doc.text(`TDS: ₹${(employee.tds * 12).toLocaleString()}`, 20, yPos);

    doc.save(`Form16_${employee.name}_2024-25.pdf`);
  };

  const getEmployeePayslips = (employeeId) => {
    return payslips.filter((p) => p.employeeId === employeeId);
  };

  const getCurrentUserPayslips = () => {
    return payslips.filter((p) => p?.employeeId === currentUser?.id);
  };

  const getPendingPayslips = () => {
    return payslips.filter((p) => !p.emailSent);
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: 1400, mx: "auto" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} color="primary.main">
            Payroll Management System
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Logged in as: {currentUser?.name} (
            {currentUser?.role?.join(", ") || currentUser?.role})
          </Typography>
        </Box>
        {hasPayrollAccess && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setGenerateDialog({ open: true })}
              sx={{ borderRadius: 2, fontWeight: 600 }}
            >
              Generate Payslip
            </Button>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => {
                // Quick generate for current month
                const currentMonth = new Date().toLocaleString("default", {
                  month: "long",
                });
                const currentYear = new Date().getFullYear();

                // Generate payslips for all employees
                employees.forEach((employee) => {
                  const newPayslip = {
                    id: Date.now() + Math.random(),
                    employeeId: employee.id,
                    month: currentMonth,
                    year: currentYear,
                    basicSalary: employee.basicSalary,
                    hra: employee.hra,
                    da: employee.da,
                    specialAllowance: employee.specialAllowance,
                    grossSalary:
                      employee.basicSalary +
                      employee.hra +
                      employee.da +
                      employee.specialAllowance,
                    pf: employee.pf,
                    tds: employee.tds,
                    otherDeductions: 0,
                    totalDeductions: employee.pf + employee.tds,
                    netSalary:
                      employee.basicSalary +
                      employee.hra +
                      employee.da +
                      employee.specialAllowance -
                      (employee.pf + employee.tds),
                    workingDays: 22,
                    paidDays: 22,
                    generatedBy: currentUser?.name || "System",
                    generatedAt: new Date().toISOString(),
                    status: "Generated",
                    emailSent: false,
                  };
                  setPayslips((prev) => [...prev, newPayslip]);
                });

                setSnackbar({
                  open: true,
                  message: `Generated payslips for ${employees.length} employees for ${currentMonth} ${currentYear}`,
                  severity: "success",
                });
              }}
              sx={{ borderRadius: 2, fontWeight: 600 }}
            >
              Quick Generate All
            </Button>
          </Box>
        )}
      </Box>

      {/* Role-based Dashboard */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="My Payslips" />
          {hasPayrollAccess && <Tab label="Payroll Management" />}
          {hasPayrollAccess && <Tab label="Form 16 Generation" />}
          {hasPayrollAccess && <Tab label="Reports & Analytics" />}
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
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
            {getCurrentUserPayslips().length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell>Gross Salary</TableCell>
                    <TableCell>Deductions</TableCell>
                    <TableCell>Net Pay</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getCurrentUserPayslips().map((payslip) => {
                    const employee = employees.find(
                      (emp) => emp.id === payslip.employeeId
                    );
                    return (
                      <TableRow key={payslip.id}>
                        <TableCell>
                          {payslip.month} {payslip.year}
                        </TableCell>
                        <TableCell>
                          ₹{payslip.grossSalary.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          ₹{payslip.totalDeductions.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          ₹{payslip.netSalary.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={payslip.status}
                            color={
                              payslip.status === "Generated"
                                ? "success"
                                : "warning"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  setPayslipDialog({ open: true, payslip })
                                }
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Download />}
                              onClick={() => downloadPayslipPDF(payslip)}
                            >
                              Download
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  py: 4,
                  color: "text.secondary",
                }}
              >
                <Receipt sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" gutterBottom>
                  No Payslips Found
                </Typography>
                <Typography variant="body2">
                  {hasPayrollAccess
                    ? "No payslips have been generated yet. Generate a payslip to get started."
                    : "Your payslips will appear here once they are generated by the HR team."}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 1 && hasPayrollAccess && (
        <Grid container spacing={3}>
          {/* Payroll Overview */}
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  color="primary.main"
                  gutterBottom
                >
                  Payroll Overview
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText
                      primary="Total Employees"
                      secondary={employees.length}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Receipt />
                    </ListItemIcon>
                    <ListItemText
                      primary="Payslips Generated"
                      secondary={payslips.length}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText
                      primary="Pending Email"
                      secondary={getPendingPayslips().length}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* All Payslips */}
          <Grid item xs={12} md={8}>
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  color="primary.main"
                  gutterBottom
                >
                  All Payslips
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>Month</TableCell>
                      <TableCell>Net Pay</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payslips.map((payslip) => {
                      const employee = employees.find(
                        (emp) => emp.id === payslip.employeeId
                      );
                      return (
                        <TableRow key={payslip.id}>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {employee.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {employee.designation}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            {payslip.month} {payslip.year}
                          </TableCell>
                          <TableCell>
                            ₹{payslip.netSalary.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={payslip.status}
                              color={
                                payslip.status === "Generated"
                                  ? "success"
                                  : "warning"
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {payslip.emailSent ? (
                              <Chip label="Sent" color="success" size="small" />
                            ) : (
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Send />}
                                onClick={() => sendPayslipEmail(payslip)}
                              >
                                Send
                              </Button>
                            )}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    setPayslipDialog({ open: true, payslip })
                                  }
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download PDF">
                                <IconButton
                                  size="small"
                                  onClick={() => downloadPayslipPDF(payslip)}
                                >
                                  <Download />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && hasPayrollAccess && (
        <Card elevation={2} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography
              variant="h6"
              fontWeight={600}
              color="primary.main"
              gutterBottom
            >
              Form 16 Generation
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Generate Form 16 certificates for employees for tax filing
              purposes.
            </Typography>
            <Grid container spacing={2}>
              {employees.map((employee) => (
                <Grid item xs={12} md={6} lg={4} key={employee.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {employee.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {employee.designation}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        PAN: {employee.pan}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="contained"
                          startIcon={<Assessment />}
                          onClick={() => generateForm16(employee)}
                          fullWidth
                        >
                          Generate Form 16
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {activeTab === 3 && hasPayrollAccess && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  color="primary.main"
                  gutterBottom
                >
                  Salary Distribution
                </Typography>
                <Box
                  sx={{
                    height: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Chart visualization would go here
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  color="primary.main"
                  gutterBottom
                >
                  Monthly Trends
                </Typography>
                <Box
                  sx={{
                    height: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Trend analysis would go here
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Generate Payslip Dialog */}
      <Dialog
        open={generateDialog.open}
        onClose={() => {
          setGenerateDialog({ open: false });
          // Reset form when dialog closes
          setPayslipForm({
            employeeId: "",
            month: "",
            year: new Date().getFullYear(),
            basicSalary: "",
            hra: "",
            da: "",
            specialAllowance: "",
            pf: "",
            tds: "",
            otherDeductions: "",
            workingDays: 22,
            paidDays: 22,
          });
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Generate New Payslip
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Select an employee to auto-fill their salary structure. You can
            modify values as needed.
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Select Employee</InputLabel>
                <Select
                  value={payslipForm.employeeId}
                  label="Select Employee"
                  onChange={(e) => {
                    handlePayslipFormChange(e);
                    handleEmployeeSelect(e.target.value);
                  }}
                  name="employeeId"
                >
                  {employees.map((emp) => (
                    <MenuItem key={emp.id} value={emp.id}>
                      {emp.name} - {emp.designation}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Month"
                value={payslipForm.month}
                onChange={handlePayslipFormChange}
                name="month"
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
                ].map((month) => (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Employee Salary Preview */}
            {payslipForm.employeeId && (
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    📋 Employee Salary Structure (Pre-filled)
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">
                        Basic Salary
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        ₹{payslipForm.basicSalary?.toLocaleString() || "0"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">
                        HRA
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        ₹{payslipForm.hra?.toLocaleString() || "0"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">
                        DA
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        ₹{payslipForm.da?.toLocaleString() || "0"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">
                        Special Allowance
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        ₹{payslipForm.specialAllowance?.toLocaleString() || "0"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            )}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Basic Salary"
                type="number"
                value={payslipForm.basicSalary}
                onChange={handlePayslipFormChange}
                name="basicSalary"
                helperText="Employee's base salary"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="HRA"
                type="number"
                value={payslipForm.hra}
                onChange={handlePayslipFormChange}
                name="hra"
                helperText="House Rent Allowance"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="DA"
                type="number"
                value={payslipForm.da}
                onChange={handlePayslipFormChange}
                name="da"
                helperText="Dearness Allowance"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Special Allowance"
                type="number"
                value={payslipForm.specialAllowance}
                onChange={handlePayslipFormChange}
                name="specialAllowance"
                helperText="Additional allowances"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="PF"
                type="number"
                value={payslipForm.pf}
                onChange={handlePayslipFormChange}
                name="pf"
                helperText="Provident Fund deduction"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="TDS"
                type="number"
                value={payslipForm.tds}
                onChange={handlePayslipFormChange}
                name="tds"
                helperText="Tax Deducted at Source"
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Calculated Values
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Gross Salary"
                    value={calculatePayslip().grossSalary.toLocaleString()}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Total Deductions"
                    value={calculatePayslip().totalDeductions.toLocaleString()}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Net Salary"
                    value={calculatePayslip().netSalary.toLocaleString()}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGenerateDialog({ open: false })}>
            Cancel
          </Button>
          {payslipForm.employeeId && (
            <Button
              variant="outlined"
              onClick={() => handleEmployeeSelect(payslipForm.employeeId)}
              startIcon={<Edit />}
            >
              Reset to Default
            </Button>
          )}
          <Button
            variant="contained"
            onClick={generatePayslip}
            disabled={
              !payslipForm.employeeId ||
              !payslipForm.month ||
              !payslipForm.basicSalary
            }
          >
            Generate Payslip
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payslip Details Dialog */}
      <Dialog
        open={payslipDialog.open}
        onClose={() => setPayslipDialog({ open: false, payslip: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Payslip Details</DialogTitle>
        <DialogContent>
          {payslipDialog.payslip && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Employee Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Name"
                        secondary={
                          employees.find(
                            (emp) => emp.id === payslipDialog.payslip.employeeId
                          )?.name
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Month"
                        secondary={`${payslipDialog.payslip.month} ${payslipDialog.payslip.year}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Working Days"
                        secondary={`${payslipDialog.payslip.workingDays} / ${payslipDialog.payslip.paidDays}`}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Salary Breakdown
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Gross Salary"
                        secondary={`₹${payslipDialog.payslip.grossSalary.toLocaleString()}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Total Deductions"
                        secondary={`₹${payslipDialog.payslip.totalDeductions.toLocaleString()}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Net Pay"
                        secondary={`₹${payslipDialog.payslip.netSalary.toLocaleString()}`}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setPayslipDialog({ open: false, payslip: null })}
          >
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => downloadPayslipPDF(payslipDialog.payslip)}
          >
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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
    </Box>
  );
}

export default Payroll;
