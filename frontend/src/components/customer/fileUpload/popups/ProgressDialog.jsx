import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, LinearProgress, Box, Typography } from '@mui/material';

const ProgressDialog = ({ open, uploadProgress }) => (
  <Dialog
    open={open}
    PaperProps={{
      sx: {
        padding: 2,
        borderRadius: 3,
        width: '400px',
        textAlign: 'center',
      },
    }}
  >
    <DialogTitle
      sx={{
        fontWeight: 'bold',
        fontSize: '1.25rem',
        color: '#4a4a4a',
      }}
    >
      Uploading File
    </DialogTitle>
    <DialogContent>
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress
          variant="determinate"
          value={uploadProgress}
          sx={{
            height: 12,
            borderRadius: 6,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #6a11cb, #2575fc)',
            },
          }}
        />
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            mt: 1,
            fontWeight: 'bold',
            color: '#4a4a4a',
          }}
        >
          {`${uploadProgress}% Completed`}
        </Typography>
      </Box>
    </DialogContent>
  </Dialog>
);

// Prop validation
ProgressDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    uploadProgress: PropTypes.number.isRequired,
  };

export default ProgressDialog;
