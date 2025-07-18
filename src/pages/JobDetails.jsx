import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const jobs = JSON.parse(localStorage.getItem("vacancies")) || [];
    setJob(jobs.find((j) => String(j.id) === String(jobId)));
  }, [jobId]);

  if (!job) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5" color="error" gutterBottom>
          Job not found
        </Typography>
        <Button variant="contained" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: 700, mx: "auto" }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back to Jobs
      </Button>
      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <WorkOutlineIcon color="primary" sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h5" fontWeight={700} color="primary.main">
                {job.role}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {job.department} Department
              </Typography>
            </Box>
            <Chip
              label={job.status}
              color={job.status === "active" ? "success" : "default"}
              sx={{ ml: "auto" }}
            />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Job Description
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, whiteSpace: "pre-line" }}>
            {job.description || "No description provided."}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Posted Date
              </Typography>
              <Typography variant="body2">{job.postedDate}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Last Date to Apply
              </Typography>
              <Typography variant="body2">{job.lastDate || "-"}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
