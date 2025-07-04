import React from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "background.paper",
        borderTop: "1px solid",
        borderColor: "divider",
        py: 0.5,
        px: 2,
        zIndex: 1000,
        opacity: 0.7,
        transition: "opacity 0.3s ease",
        "&:hover": {
          opacity: 1,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <Link
          href="https://something-bice-rho.vercel.app/privacy"
          color="text.secondary"
          underline="hover"
          sx={{
            fontSize: "0.75rem",
            transition: "color 0.2s ease",
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          Privacy Policy
        </Link>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: "0.75rem" }}
        >
          •
        </Typography>
        <Link
          href="https://something-bice-rho.vercel.app/terms"
          color="text.secondary"
          underline="hover"
          sx={{
            fontSize: "0.75rem",
            transition: "color 0.2s ease",
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          Terms of Service
        </Link>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: "0.75rem" }}
        >
          •
        </Typography>
        <Link
          href="https://something-bice-rho.vercel.app/about"
          color="text.secondary"
          underline="hover"
          sx={{
            fontSize: "0.75rem",
            transition: "color 0.2s ease",
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          About Us
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
