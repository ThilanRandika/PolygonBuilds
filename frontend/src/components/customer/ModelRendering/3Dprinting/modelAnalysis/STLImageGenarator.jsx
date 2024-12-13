import { useEffect, useState } from "react";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import * as THREE from "three";

const STLImageGenarator = ({ fileUrl }) => {
  const [imageUrl, setImageUrl] = useState(null); // State to store the image URL

  useEffect(() => {
    const loadSTL = async () => {
      const loader = new STLLoader();
      try {
        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        const geometry = loader.parse(arrayBuffer);

        // Ensure geometry is valid before proceeding
        if (geometry && geometry.attributes) {
          // Create a mesh using the loaded geometry
          const material = new THREE.MeshStandardMaterial({ color: 0x888888 }); // Set the model color
          const mesh = new THREE.Mesh(geometry, material);

          // Calculate the bounding box of the geometry to center the model
          const bbox = new THREE.Box3().setFromObject(mesh);
          const center = new THREE.Vector3();
          bbox.getCenter(center);  // Get the center of the bounding box
          mesh.position.sub(center); // Center the mesh

          // Set up the scene and set the background to white
          const scene = new THREE.Scene();
          scene.background = new THREE.Color(0xffffff); // Set background color to white
          scene.add(mesh);

          const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
          camera.position.set(0, -120, 0); // Position the camera above the model (positive y-axis)
          camera.lookAt(0, 0, 0); // Ensure the camera is still looking at the center of the model



          // Create a WebGLRenderer
          const renderer = new THREE.WebGLRenderer({ antialias: true });
          renderer.setSize(100, 100); // Set the canvas size (100px x 100px)
          
          // Instead of appending to the body, create a ref for appending directly to the component container
          const canvas = renderer.domElement;
          
          // Add lighting to the scene
          const ambientLight = new THREE.AmbientLight(0x404040, 1); // Ambient light for soft lighting
          const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Directional light to cast shadows and illuminate the model
          // Change the angle of the light
directionalLight.position.set(0, 0, 70); // Adjust x, y, z to change the light angle

          scene.add(ambientLight, directionalLight);

          // Render the scene
          renderer.render(scene, camera);

          // Capture the canvas content as an image URL
          const imgUrl = canvas.toDataURL("image/png");
          setImageUrl(imgUrl); // Set the image URL to display
        } else {
          console.error("Error: Geometry is invalid or empty.");
        }
      } catch (error) {
        console.error("Error loading STL file:", error);
      }
    };

    if (fileUrl) {
      loadSTL();
    }

    // Cleanup function to remove the canvas when the component unmounts
    return () => {
      const canvas = document.querySelector("canvas");
      if (canvas) {
        canvas.remove(); // Remove the canvas element from the DOM
      }
    };
  }, [fileUrl]);

  if (!imageUrl) {
    return <div>Loading...</div>; // Show loading message while the model is being processed
  }

  return (
    <div>
      <img
        src={imageUrl}
        alt="STL model"
        style={{
          width: "200px",   // Set the width to 200px
          height: "200px",  // Set the height to 200px
          display: "block", // Ensure it's treated as a block element
          margin: "0 auto", // Center the image horizontally
        }}
      />
    </div>
  );
};

export default STLImageGenarator;
