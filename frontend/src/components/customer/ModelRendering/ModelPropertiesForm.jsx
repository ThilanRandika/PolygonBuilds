import { useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  Typography,
  TextareaAutosize,
} from '@mui/material';

const ModelPropertiesForm = () => {
  const [formData, setFormData] = useState({
    quantity: '',
    process: '',
    technology: '',
    material: '',
    finish: '',
    threadTappedHoles: false,
    inserts: false,
    postAssembly: false,
    inspection: '',
    certification: {
      as9100: false,
      iso9001: false,
      cpkPp: false,
      certificateConformance: false,
      ndtInspection: false,
    },
    specialInstructions: '',
    color: '',
    verticalResolutionVisible: false,
    verticalResolution: '',
    verticalResolutionLetTeamDecide: false,
    infilTypeVisible: false,
    infilType: '',
    infilTypeLetTeamDecide: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleCertificationChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      certification: {
        ...prevState.certification,
        [name]: checked,
      },
    }));
  };

  const toggleVisibility = (field) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Add logic to handle form submission
  };

  return (
    <div style={{ padding: '20px' }}> {/* Padding applied here */}
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" gutterBottom>
          Part Properties
        </Typography>

        {/* Quantity */}
        <TextField
          label="Quantity"
          variant="outlined"
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />

        {/* Process */}
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Process</InputLabel>
          <Select name="process" value={formData.process} onChange={handleInputChange}>
            <MenuItem value="Plastic 3D Printing">Plastic 3D Printing</MenuItem>
            <MenuItem value="Metal 3D Printing">Metal 3D Printing</MenuItem>
          </Select>
        </FormControl>

        {/* Technology */}
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Technology</InputLabel>
          <Select name="technology" value={formData.technology} onChange={handleInputChange}>
            <MenuItem value="SLS">Selective Laser Sintering (SLS)</MenuItem>
            <MenuItem value="FDM">Fused Deposition Modeling (FDM)</MenuItem>
            <MenuItem value="SLA">Stereolithography (SLA)</MenuItem>
          </Select>
        </FormControl>

        {/* Material */}
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Material</InputLabel>
          <Select name="material" value={formData.material} onChange={handleInputChange}>
            <MenuItem value="Nylon">Nylon</MenuItem>
            <MenuItem value="PLA">PLA</MenuItem>
            <MenuItem value="ABS">ABS</MenuItem>
          </Select>
        </FormControl>

        {/* Color */}
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Color</InputLabel>
          <Select name="color" value={formData.color} onChange={handleInputChange}>
            <MenuItem value="Red">Red</MenuItem>
            <MenuItem value="Blue">Blue</MenuItem>
            <MenuItem value="Black">Black</MenuItem>
          </Select>
        </FormControl>

        {/* Finish */}
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Finish</InputLabel>
          <Select name="finish" value={formData.finish} onChange={handleInputChange}>
            <MenuItem value="Standard">Standard</MenuItem>
            <MenuItem value="Dyed">Dyed</MenuItem>
          </Select>
        </FormControl>

        {/* Thread & Tapped Holes */}
        <FormControlLabel
          control={
            <Checkbox
              name="threadTappedHoles"
              checked={formData.threadTappedHoles}
              onChange={handleCheckboxChange}
            />
          }
          label="Threads and Tapped Holes"
        />

        {/* Inserts */}
        <FormControlLabel
          control={
            <Checkbox
              name="inserts"
              checked={formData.inserts}
              onChange={handleCheckboxChange}
            />
          }
          label="Inserts"
        />

        {/* Post Assembly */}
        <FormControlLabel
          control={
            <Checkbox
              name="postAssembly"
              checked={formData.postAssembly}
              onChange={handleCheckboxChange}
            />
          }
          label="Post Assembly"
        />

        {/* Inspection */}
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Inspection</InputLabel>
          <Select name="inspection" value={formData.inspection} onChange={handleInputChange}>
            <MenuItem value="Standard Inspection">Standard Inspection</MenuItem>
            <MenuItem value="Detailed Inspection">Detailed Inspection</MenuItem>
            <MenuItem value="Custom Inspection">Custom Inspection</MenuItem>
          </Select>
        </FormControl>

        {/* Vertical Resolution */}
        <FormControlLabel
          control={<Checkbox checked={formData.verticalResolutionVisible} onChange={() => toggleVisibility('verticalResolutionVisible')} />}
          label="Select Vertical Resolution"
        />
        {formData.verticalResolutionVisible && (
          <>
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel>Vertical Resolution</InputLabel>
              <Select name="verticalResolution" value={formData.verticalResolution} onChange={handleInputChange}>
                <MenuItem value="0.1mm">0.1mm</MenuItem>
                <MenuItem value="0.2mm">0.2mm</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={<Checkbox name="verticalResolutionLetTeamDecide" checked={formData.verticalResolutionLetTeamDecide} onChange={handleCheckboxChange} />}
              label="Let our team decide for you"
            />
          </>
        )}

        {/* Infill Type */}
        <FormControlLabel
          control={<Checkbox checked={formData.infilTypeVisible} onChange={() => toggleVisibility('infilTypeVisible')} />}
          label="Select Infill Type"
        />
        {formData.infilTypeVisible && (
          <>
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel>Infill Type</InputLabel>
              <Select name="infilType" value={formData.infilType} onChange={handleInputChange}>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={<Checkbox name="infilTypeLetTeamDecide" checked={formData.infilTypeLetTeamDecide} onChange={handleCheckboxChange} />}
              label="Let our team decide for you"
            />
          </>
        )}

        {/* Certification */}
        <FormGroup>
          <Typography variant="h6">Certifications</Typography>
          <FormControlLabel
            control={
              <Checkbox
                name="as9100"
                checked={formData.certification.as9100}
                onChange={handleCertificationChange}
              />
            }
            label="AS9100"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="iso9001"
                checked={formData.certification.iso9001}
                onChange={handleCertificationChange}
              />
            }
            label="ISO9001"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="cpkPp"
                checked={formData.certification.cpkPp}
                onChange={handleCertificationChange}
              />
            }
            label="CPK/PP Control"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="certificateConformance"
                checked={formData.certification.certificateConformance}
                onChange={handleCertificationChange}
              />
            }
            label="Certificate of Conformance"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="ndtInspection"
                checked={formData.certification.ndtInspection}
                onChange={handleCertificationChange}
              />
            }
            label="NDT Inspection"
          />
        </FormGroup>

        {/* Special Instructions */}
        <TextareaAutosize
          minRows={4}
          name="specialInstructions"
          value={formData.specialInstructions}
          onChange={handleInputChange}
          placeholder="Enter any special instructions..."
          style={{ width: '100%', marginTop: '20px', padding: '10px', fontSize: '16px' }}
        />

        {/* Submit Button */}
        <Button variant="contained" color="primary" type="submit" style={{ marginTop: '20px' }}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default ModelPropertiesForm;
