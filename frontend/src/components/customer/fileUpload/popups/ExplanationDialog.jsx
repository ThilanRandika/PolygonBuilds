import PropTypes from 'prop-types';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Typography,
    Button,
    TextField,
    IconButton,
  } from '@mui/material';
  import CloseIcon from '@mui/icons-material/Close';
  import { useNavigate } from 'react-router-dom';
  
  const ExplanationDialog = ({
    open,
    setOpenDialog,
    isEmailMode,
    setIsEmailMode,
    email,
    emailError,
    handleEmailChange,
    handleUpload,
  }) => {
    const navigate = useNavigate();
  
    return (
      <Dialog open={open} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          Privacy Guarantee
          <IconButton
            aria-label="close"
            onClick={() => setOpenDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {!isEmailMode ? (
            <>
              <DialogContentText
                sx={{
                  fontSize: '1rem',
                  color: '#4a4a4a',
                  mb: 3,
                }}
              >
                We guarantee that your uploaded files will remain private. For added security, you can{' '}
                <Typography component="span" sx={{ fontWeight: 'bold', display: 'inline' }}>
                  log in
                </Typography>{' '}
                or{' '}
                <Typography component="span" sx={{ fontWeight: 'bold', display: 'inline' }}>
                  proceed with an email address
                </Typography>{' '}
                for communication.
              </DialogContentText>
              <DialogActions
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                }}
              >
                <Button
                  onClick={() => {
                    setOpenDialog(false);
                    navigate('/login');
                  }}
                  color="primary"
                  variant="contained"
                  sx={{
                    flex: 1,
                    textTransform: 'none',
                    height: '48px',
                    backgroundColor: '#3b82f6',
                    '&:hover': {
                      backgroundColor: '#2563eb',
                    },
                  }}
                >
                  Log In
                </Button>
                <Button
                  onClick={() => setIsEmailMode(true)}
                  color="primary"
                  variant="outlined"
                  sx={{
                    flex: 1,
                    textTransform: 'none',
                    height: '48px',
                    color: '#2563eb',
                    borderColor: '#2563eb',
                    '&:hover': {
                      backgroundColor: '#eff6ff',
                    },
                  }}
                >
                  Proceed with Email
                </Button>
              </DialogActions>
            </>
          ) : (
            <>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  mb: 1,
                }}
              >
                Welcome to Poligonbuilds Network
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  color: '#6b7280',
                  mb: 3,
                }}
              >
                To view your quote, please enter your email address or{' '}
                <Typography
                  component="span"
                  sx={{
                    color: '#2563eb',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setOpenDialog(false);
                    navigate('/login');
                  }}
                >
                  sign in
                </Typography>
                .
              </Typography>
              <TextField
                fullWidth
                placeholder="Your work email *"
                variant="outlined"
                value={email}
                onChange={handleEmailChange}
                error={emailError}
                helperText={emailError ? 'Please enter a valid email address' : ''}
                InputProps={{
                  style: {
                    borderRadius: '8px',
                    height: '48px',
                  },
                }}
                sx={{
                  mb: 3,
                }}
              />
              <Button
                fullWidth
                onClick={handleUpload}
                color="primary"
                variant="contained"
                disabled={!email || emailError}
                sx={{
                  textTransform: 'none',
                  height: '48px',
                  backgroundColor: '#c7d2fe',
                  color: '#374151',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#a5b4fc',
                  },
                }}
              >
                Go to your quote
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  ExplanationDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpenDialog: PropTypes.func.isRequired,
    isEmailMode: PropTypes.bool.isRequired,
    setIsEmailMode: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
    emailError: PropTypes.bool.isRequired,
    handleEmailChange: PropTypes.func.isRequired,
    handleUpload: PropTypes.func.isRequired,
  };
  
  export default ExplanationDialog;
  