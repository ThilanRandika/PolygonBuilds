import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';

const ModelCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  maxWidth: 345,
  margin: theme.spacing(2),
}));

const CloseButton = styled(IconButton)({
  position: 'absolute',
  top: 8,
  right: 8,
  color: '#ff0000', // Adjust color to make it visible
  backgroundColor: "#ff000019", // Add background for better contrast
  '&:hover': {
    backgroundColor: '#ff00003a',
  },
});

const ScrollableBox = styled(Box)({
  maxHeight: '400px', // Fixed height for scrollable area
  overflowY: 'auto', // Add vertical scrollbar
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
});

const FixedCardMedia = styled(CardMedia)({
  width: '100%',
  height: '140px',
  objectFit: 'cover', // Ensure the image fills the area while maintaining aspect ratio
});

const getFileNameFromUrl = (url) => {
  const decodedUrl = decodeURIComponent(url);
  const fileNameWithParams = decodedUrl.split("/").pop(); // Get the last part
  const fileName = fileNameWithParams.split("?")[0]; // Remove query parameters
  return fileName;
};

const ModelModal = ({
  open,
  onClose,
  userModels,
  handleAddToCart,
  handleRemoveModel,
  handleDeleteAllModels,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  console.log('userModels', userModels);

  if (!userModels || userModels.length === 0) {
    return null;
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'auto',
          maxWidth: '800px', // Fixed width for the modal
          height: '500px', // Fixed height for the modal
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h6" gutterBottom>
          You have uploaded models! Do you want to add them to your cart?
        </Typography>
        <ScrollableBox>
          {userModels.map((model) => (
            <ModelCard key={model._id}>
              <CloseButton onClick={() => handleRemoveModel(model._id)}>
                <CloseIcon />
              </CloseButton>
              <FixedCardMedia
                component="img"
                image={model.imageUrl} // Use imageUrl from the model
                alt={model.name || 'Model Image'}
              />
              <CardContent>
                <Typography variant="body1" noWrap>
                  {getFileNameFromUrl(model.fileUrl)}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleAddToCart(model._id, model.fileUrl, model.imageUrl)}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </ModelCard>
          ))}
        </ScrollableBox>

        {/* Close button with tooltip */}
        <Tooltip
          open={showTooltip}
          title="This will delete all the displayed models"
          placement="top"
          onOpen={() => setShowTooltip(true)}
          onClose={() => setShowTooltip(false)}
        >
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: '#000000',
              backgroundColor: "#00000018",
              '&:hover': {
                backgroundColor: '#00000039',
              },
            }}
            onClick={() => {
              handleDeleteAllModels();
              onClose(); // Close the modal when the button is clicked
            }}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDeleteAllModels}
          >
            Done
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModelModal;
