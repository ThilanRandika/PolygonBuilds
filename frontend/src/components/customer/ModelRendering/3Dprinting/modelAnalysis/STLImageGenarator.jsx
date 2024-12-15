import { useEffect, useState } from "react";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import * as THREE from "three";

const STLImageGenerator = ({ fileUrl }) => {
  const [imageUrl, setImageUrl] = useState(null); // State to store the image URL
  const [isReady, setIsReady] = useState(false); // To check when image is ready for download

  useEffect(() => {
    const loadSTL = async () => {
      const loader = new STLLoader();
      try {
        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        const geometry = loader.parse(arrayBuffer);

        if (geometry && geometry.attributes) {
          const material = new THREE.MeshStandardMaterial({ color: 0x888888 });
          const mesh = new THREE.Mesh(geometry, material);

          const bbox = new THREE.Box3().setFromObject(mesh);
          const center = new THREE.Vector3();
          bbox.getCenter(center);
          mesh.position.sub(center);

          const scene = new THREE.Scene();
          scene.background = new THREE.Color(0xffffff);
          scene.add(mesh);

          const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
          camera.position.set(0, -120, 0);
          camera.lookAt(0, 0, 0);

          const renderer = new THREE.WebGLRenderer({ antialias: true });
          renderer.setSize(100, 100);

          const canvas = renderer.domElement;

          const ambientLight = new THREE.AmbientLight(0x404040, 1);
          const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
          directionalLight.position.set(0, 0, 70);

          scene.add(ambientLight, directionalLight);

          renderer.render(scene, camera);

          const imgUrl = canvas.toDataURL("image/png");
          setImageUrl(imgUrl);
          setIsReady(true); // Set ready flag to true once the image is ready
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

    return () => {
      const canvas = document.querySelector("canvas");
      if (canvas) {
        canvas.remove();
      }
    };
  }, [fileUrl]);

  const downloadImage = () => {
    if (imageUrl) {
      const a = document.createElement("a");
      a.href = imageUrl;
      a.download = "model.png"; // The name of the downloaded file
      a.click();
    }
  };

  if (!imageUrl) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <img
        src={imageUrl}
        alt="STL model"
        style={{
          width: "200px",
          height: "200px",
          display: "block",
          margin: "0 auto",
        }}
      />
      {isReady && (
        <button onClick={downloadImage} style={{ marginTop: "10px" }}>
          Download Image
        </button>
      )}
    </div>
  );
};

export default STLImageGenerator;
