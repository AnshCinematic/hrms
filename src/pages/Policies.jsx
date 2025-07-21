import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

const POLICY_SECTIONS = [
  {
    key: "hr_policies",
    title: "HR Policies",
    content: (
      <>
        <Typography variant="h6" gutterBottom>
          HR Policies
        </Typography>
        <Typography variant="body1" paragraph>
          Our HR policies cover leave, attendance, benefits, and employee
          conduct. Please read and accept to proceed.
        </Typography>
      </>
    ),
  },
  {
    key: "company_guidelines",
    title: "Company Guidelines",
    content: (
      <>
        <Typography variant="h6" gutterBottom>
          Company Guidelines
        </Typography>
        <Typography variant="body1" paragraph>
          These guidelines outline our expectations for professionalism,
          communication, and collaboration.
        </Typography>
      </>
    ),
  },
  {
    key: "culture_fit",
    title: "Culture Fit",
    content: (
      <>
        <Typography variant="h6" gutterBottom>
          Culture Fit
        </Typography>
        <Typography variant="body1" paragraph>
          Learn about our company values, mission, and what it means to be a
          great team member here.
        </Typography>
      </>
    ),
  },
  {
    key: "posh_policy",
    title: "POSH Policy (Prevention of Sexual Harassment)",
    content: (
      <>
        <Typography variant="h6" gutterBottom>
          POSH Policy
        </Typography>
        <Typography variant="body1" paragraph>
          Our POSH policy ensures a safe and respectful workplace for all.
          Please read and acknowledge your understanding.
        </Typography>
      </>
    ),
  },
];

const LOCAL_STORAGE_KEY = "accepted_policies";

export default function Policies() {
  const [accepted, setAccepted] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setAccepted(JSON.parse(saved));
      setCurrentStep(JSON.parse(saved).length);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(accepted));
  }, [accepted]);

  const handleAccept = () => {
    if (!accepted.includes(currentStep)) {
      setAccepted([...accepted, currentStep]);
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: 800, mx: "auto" }}>
      <Typography
        variant="h4"
        fontWeight={700}
        color="primary.main"
        gutterBottom
      >
        Company Policies
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please review and accept each section to proceed. Accepted sections are
        marked with a check.
      </Typography>
      <List>
        {POLICY_SECTIONS.map((section, idx) => (
          <ListItem key={section.key}>
            <ListItemIcon>
              {accepted.includes(idx) ? (
                <CheckCircleIcon color="success" />
              ) : (
                <RadioButtonUncheckedIcon color="disabled" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={section.title}
              primaryTypographyProps={{
                fontWeight: idx === currentStep ? 700 : 400,
              }}
            />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 3 }} />
      <Card elevation={2} sx={{ borderRadius: 3, mb: 4 }}>
        <CardContent>
          {POLICY_SECTIONS[currentStep] ? (
            <>
              {POLICY_SECTIONS[currentStep].content}
              <Button
                variant="contained"
                color="primary"
                onClick={handleAccept}
                sx={{ mt: 2, borderRadius: 2, fontWeight: 600 }}
                disabled={accepted.includes(currentStep)}
              >
                {accepted.includes(currentStep)
                  ? "Accepted"
                  : "Accept & Continue"}
              </Button>
            </>
          ) : (
            <Typography variant="h6" color="success.main">
              All sections accepted! Thank you for reviewing our policies.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
