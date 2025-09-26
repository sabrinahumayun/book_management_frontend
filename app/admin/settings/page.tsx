'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import {
  Save,
  ArrowBack,
  Security,
  Settings,
  Shield,
  Warning,
  Add,
  Edit,
} from '@mui/icons-material';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Book Management Portal',
    siteDescription: 'A comprehensive book management system',
    maintenanceMode: false,
    
    // Security Settings
    requireEmailVerification: true,
    allowUserRegistration: true,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    
    // Notification Settings
    emailNotifications: true,
    adminNotifications: true,
    userNotifications: true,
    
    // System Settings
    maxFileSize: 10,
    allowedFileTypes: 'jpg,jpeg,png,pdf',
    autoBackup: true,
    backupFrequency: 'daily',
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveSettings = () => {
    // Simulate API call
    setTimeout(() => {
      setShowSuccess(true);
    }, 1000);
  };

  const handleResetSettings = () => {
    // Reset to default values
    setSettings({
      siteName: 'Book Management Portal',
      siteDescription: 'A comprehensive book management system',
      maintenanceMode: false,
      requireEmailVerification: true,
      allowUserRegistration: true,
      maxLoginAttempts: 5,
      sessionTimeout: 30,
      emailNotifications: true,
      adminNotifications: true,
      userNotifications: true,
      maxFileSize: 10,
      allowedFileTypes: 'jpg,jpeg,png,pdf',
      autoBackup: true,
      backupFrequency: 'daily',
    });
  };

  const handleBackup = () => {
    // Simulate backup process
    setShowSuccess(true);
  };

  const handleRestore = () => {
    // Simulate restore process
    setShowSuccess(true);
  };

  const handleClearCache = () => {
    // Simulate cache clear
    setShowSuccess(true);
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout>
        <Container maxWidth="lg" sx={{ py: 2, px: { xs: 2, sm: 3 } }}>
          {/* Header */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Security sx={{ mr: 2, color: 'primary.main', width: 40, height: 40 }} />
                <Box>
                  <Typography variant="h4" component="h1" fontWeight="bold">
                    Admin Settings
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Configure system settings and preferences
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={handleResetSettings}
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveSettings}
                >
                  Save Settings
                </Button>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* First Row */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {/* General Settings */}
              <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
                <Card>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <Settings sx={{ mr: 1, width: 20, height: 20 }} />
                      General Settings
                    </Typography>
                    <Divider sx={{ mb: 1.5 }} />
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <TextField
                        label="Site Name"
                        value={settings.siteName}
                        onChange={(e) => handleSettingChange('siteName', e.target.value)}
                        fullWidth
                      />
                      
                      <TextField
                        label="Site Description"
                        value={settings.siteDescription}
                        onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                        fullWidth
                        multiline
                        rows={2}
                      />
                      
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.maintenanceMode}
                            onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                          />
                        }
                        label="Maintenance Mode"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* Security Settings */}
              <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
                <Card>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <Security sx={{ mr: 1, width: 20, height: 20 }} />
                      Security Settings
                    </Typography>
                    <Divider sx={{ mb: 1.5 }} />
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.requireEmailVerification}
                            onChange={(e) => handleSettingChange('requireEmailVerification', e.target.checked)}
                          />
                        }
                        label="Require Email Verification"
                      />
                      
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.allowUserRegistration}
                            onChange={(e) => handleSettingChange('allowUserRegistration', e.target.checked)}
                          />
                        }
                        label="Allow User Registration"
                      />
                      
                      <TextField
                        label="Max Login Attempts"
                        type="number"
                        value={settings.maxLoginAttempts}
                        onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                        fullWidth
                      />
                      
                      <TextField
                        label="Session Timeout (minutes)"
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                        fullWidth
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* Second Row */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {/* Notification Settings */}
              <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
                <Card>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <Warning sx={{ mr: 1, width: 20, height: 20 }} />
                      Notification Settings
                    </Typography>
                    <Divider sx={{ mb: 1.5 }} />
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.emailNotifications}
                            onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                          />
                        }
                        label="Email Notifications"
                      />
                      
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.adminNotifications}
                            onChange={(e) => handleSettingChange('adminNotifications', e.target.checked)}
                          />
                        }
                        label="Admin Notifications"
                      />
                      
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.userNotifications}
                            onChange={(e) => handleSettingChange('userNotifications', e.target.checked)}
                          />
                        }
                        label="User Notifications"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* System Settings */}
              <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
                <Card>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <Shield sx={{ mr: 1, width: 20, height: 20 }} />
                      System Settings
                    </Typography>
                    <Divider sx={{ mb: 1.5 }} />
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <TextField
                        label="Max File Size (MB)"
                        type="number"
                        value={settings.maxFileSize}
                        onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                        fullWidth
                      />
                      
                      <TextField
                        label="Allowed File Types"
                        value={settings.allowedFileTypes}
                        onChange={(e) => handleSettingChange('allowedFileTypes', e.target.value)}
                        fullWidth
                      />
                      
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.autoBackup}
                            onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                          />
                        }
                        label="Auto Backup"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* System Actions */}
            <Box sx={{ width: '100%' }}>
              <Card>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="h6" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Add sx={{ mr: 1, width: 20, height: 20 }} />
                    System Actions
                  </Typography>
                  <Divider sx={{ mb: 1.5 }} />
                  
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={handleBackup}
                      sx={{ flex: '1 1 200px', minWidth: 200 }}
                    >
                      Create Backup
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ArrowBack />}
                      onClick={handleRestore}
                      sx={{ flex: '1 1 200px', minWidth: 200 }}
                    >
                      Restore Backup
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ArrowBack />}
                      onClick={handleClearCache}
                      sx={{ flex: '1 1 200px', minWidth: 200 }}
                    >
                      Clear Cache
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Warning />}
                      sx={{ flex: '1 1 200px', minWidth: 200 }}
                    >
                      Reset System
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Container>

        {/* Success Snackbar */}
        <Snackbar
          open={showSuccess}
          autoHideDuration={3000}
          onClose={() => setShowSuccess(false)}
        >
          <Alert onClose={() => setShowSuccess(false)} severity="success">
            Settings saved successfully!
          </Alert>
        </Snackbar>

        {/* Error Snackbar */}
        <Snackbar
          open={showError}
          autoHideDuration={3000}
          onClose={() => setShowError(false)}
        >
          <Alert onClose={() => setShowError(false)} severity="error">
            {errorMessage}
          </Alert>
        </Snackbar>
      </AdminLayout>
    </ProtectedRoute>
  );
}
