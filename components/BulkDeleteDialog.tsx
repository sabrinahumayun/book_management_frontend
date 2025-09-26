'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
} from '@mui/material';
import { Warning, Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';

interface BulkDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  title: string;
  items: Array<{ id: number; name: string; subtitle?: string }>;
  selectedCount: number;
  itemType: 'users' | 'books' | 'feedback';
}

export default function BulkDeleteDialog({
  open,
  onClose,
  onConfirm,
  isLoading,
  title,
  items,
  selectedCount,
  itemType,
}: BulkDeleteDialogProps) {
  const handleConfirm = () => {
    if (selectedCount === 0) {
      toast.error('No items selected for deletion');
      return;
    }
    onConfirm();
  };

  const getItemTypeLabel = () => {
    switch (itemType) {
      case 'users':
        return 'user';
      case 'books':
        return 'book';
      case 'feedback':
        return 'review';
      default:
        return 'item';
    }
  };

  const getItemTypeLabelPlural = () => {
    switch (itemType) {
      case 'users':
        return 'users';
      case 'books':
        return 'books';
      case 'feedback':
        return 'reviews';
      default:
        return 'items';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
          color: 'white',
          fontWeight: 600,
          fontSize: '1.25rem',
          py: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Warning sx={{ fontSize: 28 }} />
          {title}
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body1" fontWeight="600" gutterBottom>
              ⚠️ This action cannot be undone!
            </Typography>
            <Typography variant="body2">
              You are about to permanently delete {selectedCount} {selectedCount === 1 ? getItemTypeLabel() : getItemTypeLabelPlural()}. 
              This action will remove all associated data and cannot be reversed.
            </Typography>
          </Alert>
          
          {selectedCount > 0 && (
            <Box>
              <Typography variant="h6" fontWeight="600" color="text.primary" gutterBottom>
                Selected {getItemTypeLabelPlural()} ({selectedCount}):
              </Typography>
              <Box 
                sx={{ 
                  maxHeight: 300, 
                  overflow: 'auto',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  backgroundColor: 'rgba(0,0,0,0.02)'
                }}
              >
                <List dense>
                  {items.slice(0, 10).map((item) => (
                    <ListItem key={item.id} sx={{ py: 1 }}>
                      <ListItemIcon>
                        <Delete color="error" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.name}
                        secondary={item.subtitle}
                        primaryTypographyProps={{ fontWeight: 500 }}
                        secondaryTypographyProps={{ color: 'text.secondary' }}
                      />
                    </ListItem>
                  ))}
                  {items.length > 10 && (
                    <ListItem sx={{ py: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                      <ListItemText 
                        primary={`... and ${items.length - 10} more ${getItemTypeLabelPlural()}`}
                      />
                    </ListItem>
                  )}
                </List>
              </Box>
            </Box>
          )}
          
          <Typography variant="body2" color="error.main" sx={{ fontWeight: 500 }}>
            🗑️ This will permanently remove all selected {getItemTypeLabelPlural()} and cannot be undone.
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 4, pt: 0, gap: 2 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          disabled={isLoading}
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1,
            borderColor: 'text.secondary',
            color: 'text.secondary',
            '&:hover': {
              borderColor: 'text.primary',
              backgroundColor: 'rgba(0,0,0,0.04)',
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={isLoading || selectedCount === 0}
          startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <Delete />}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1,
            background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
            boxShadow: '0 4px 15px rgba(245, 101, 101, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
              boxShadow: '0 6px 20px rgba(245, 101, 101, 0.6)',
            },
            '&:disabled': {
              background: 'rgba(0,0,0,0.12)',
              boxShadow: 'none',
            }
          }}
        >
          {isLoading ? 'Deleting...' : `Delete ${selectedCount} ${getItemTypeLabelPlural()}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
