import React, { useState, useEffect } from "react";
import * as THREE from "three";
import { STLLoader } from "three-stdlib";
import { OrbitControls } from "three-stdlib";
import {
  FaSearchPlus,
  FaSearchMinus,
  FaRegEye,
  FaRegEyeSlash,
} from "react-icons/fa";

const STLViewer = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isXray, setIsXray] = useState(false);
  const [mesh, setMesh] = useState(null);
  const [controls, setControls] = useState(null);
  const [camera, setCamera] = useState(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    depth: 0,
  });
  const [surfaceArea, setSurfaceArea] = useState(0);
  const [volume, setVolume] = useState(0);
  const [unit, setUnit] = useState("mm");

  // Load the file URL from localStorage
  useEffect(() => {
    const fileURL = localStorage.getItem("uploadedFileURL");
    if (fileURL) {
      setUploadedFile(fileURL);
    }
  }, []);

  useEffect(() => {
    if (uploadedFile) {
      loadSTL();
    }
  }, [uploadedFile]);

  const loadSTL = () => {
    const scene = new THREE.Scene();
    const newCamera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      (window.innerWidth * 60) / 100,
      (window.innerHeight * 3) / 5
    );
    renderer.setClearColor(0xd8d8d8, 1); // Set background to white

    const viewerElement = document.getElementById("viewer");
    if (viewerElement) {
      viewerElement.innerHTML = ""; // Clear previous renders
      viewerElement.appendChild(renderer.domElement);
    }

    const newControls = new OrbitControls(newCamera, renderer.domElement);
    newControls.enableDamping = true;
    newControls.dampingFactor = 0.25;
    newControls.enableZoom = true;
    setControls(newControls);
    setCamera(newCamera);

    const loader = new STLLoader();
    loader.load(
      uploadedFile,
      (geometry) => {
        const material = new THREE.MeshPhongMaterial({ color: 0xc0c0c0 });
        const newMesh = new THREE.Mesh(geometry, material);
        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox;
        const centerX = (boundingBox.max.x + boundingBox.min.x) / 2;
        const centerY = (boundingBox.max.y + boundingBox.min.y) / 2;
        const centerZ = (boundingBox.max.z + boundingBox.min.z) / 2;
        newMesh.position.set(-centerX, -centerY, -centerZ);

        scene.add(newMesh);
        setMesh(newMesh);

        // Calculate dimensions
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        setDimensions({ width, height, depth });

        // Calculate surface area and volume
        const area = calculateSurfaceArea(geometry);
        const vol = calculateVolume(geometry);
        setSurfaceArea(area);
        setVolume(vol);

        const size = Math.max(width, height, depth);
        newCamera.position.z = size * 2;

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(10, 10, 10);
        scene.add(light);
        scene.add(new THREE.AmbientLight(0x404040));

        const gridHelper = new THREE.GridHelper(10, 10);
        scene.add(gridHelper);

        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        const animate = () => {
          requestAnimationFrame(animate);
          newControls.update();
          renderer.render(scene, newCamera);
        };
        animate();
      },
      undefined,
      (error) => console.error("Error loading STL:", error)
    );

    window.addEventListener("resize", () => {
      if (viewerElement) {
        const width = viewerElement.clientWidth;
        const height = viewerElement.clientHeight;
        renderer.setSize(width, height);
        newCamera.aspect = width / height;
        newCamera.updateProjectionMatrix();
      }
    });
  };

  const calculateSurfaceArea = (geometry) => {
    let surfaceArea = 0;
    const position = geometry.attributes.position;
    for (let i = 0; i < position.count; i += 3) {
      const vA = new THREE.Vector3().fromBufferAttribute(position, i);
      const vB = new THREE.Vector3().fromBufferAttribute(position, i + 1);
      const vC = new THREE.Vector3().fromBufferAttribute(position, i + 2);
      surfaceArea += triangleArea(vA, vB, vC);
    }
    return surfaceArea;
  };

  const triangleArea = (vA, vB, vC) => {
    const ab = new THREE.Vector3().subVectors(vB, vA);
    const ac = new THREE.Vector3().subVectors(vC, vA);
    return ab.cross(ac).length() / 2;
  };

  const calculateVolume = (geometry) => {
    let volume = 0;
    const position = geometry.attributes.position;
    for (let i = 0; i < position.count; i += 3) {
      const vA = new THREE.Vector3().fromBufferAttribute(position, i);
      const vB = new THREE.Vector3().fromBufferAttribute(position, i + 1);
      const vC = new THREE.Vector3().fromBufferAttribute(position, i + 2);
      volume += signedVolumeOfTriangle(vA, vB, vC);
    }
    return Math.abs(volume);
  };

  const signedVolumeOfTriangle = (vA, vB, vC) => {
    return vA.dot(vB.cross(vC)) / 6;
  };

  const convertUnit = (value, from, to) => {
    const conversionFactors = {
      mm: 1,
      cm: 0.1,
      inch: 0.0393701,
    };
    return (value * conversionFactors[to]) / conversionFactors[from];
  };

  const toggleXrayView = () => {
    if (mesh) {
      mesh.material.wireframe = !mesh.material.wireframe;
      mesh.material.transparent = !mesh.material.transparent;
      mesh.material.opacity = mesh.material.wireframe ? 0.3 : 1;
      setIsXray(!isXray);
    }
  };

  const zoomIn = () => {
    if (camera) camera.position.z -= 10;
  };

  const zoomOut = () => {
    if (camera) camera.position.z += 10;
  };

  const handleUnitChange = (e) => {
    setUnit(e.target.value);
  };

  return (
    <div>
      <h1>STL Viewer</h1>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ position: "relative", width: "70%", height: "440px" }}>
          <div id="viewer" style={{ width: "100%", height: "100%" }}></div>
          <button
            onClick={zoomIn}
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              zIndex: 1,
              padding: "10px",
              borderRadius: "50%",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            <FaSearchPlus />
          </button>
          <button
            onClick={zoomOut}
            style={{
              position: "absolute",
              top: "10px",
              left: "60px",
              zIndex: 1,
              padding: "10px",
              borderRadius: "50%",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            <FaSearchMinus />
          </button>
          <button
            onClick={toggleXrayView}
            style={{
              position: "absolute",
              top: "10px",
              left: "110px",
              zIndex: 1,
              padding: "10px",
              borderRadius: "50%",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            {isXray ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>
        </div>
        <div style={{ width: "25%" }}>
          <h3>STL File Details</h3>
          <p>
            Dimensions (WxHxD):{" "}
            {`${convertUnit(dimensions.width, "mm", unit).toFixed(2)} x ${convertUnit(
              dimensions.height,
              "mm",
              unit
            ).toFixed(2)} x ${convertUnit(dimensions.depth, "mm", unit).toFixed(2)} ${unit}`}
          </p>
          <p>
            Surface Area: {convertUnit(surfaceArea, "mm", unit).toFixed(2)}{" "}
            {unit}²
          </p>
          <p>
            Volume: {convertUnit(volume, "mm", unit).toFixed(2)} {unit}³
          </p>
          <select onChange={handleUnitChange} value={unit}>
            <option value="mm">Millimeters (mm)</option>
            <option value="cm">Centimeters (cm)</option>
            <option value="inch">Inches (inch)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default STLViewer;
