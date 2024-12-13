import { useState, useEffect, useContext } from "react";
import * as THREE from "three";
import { STLLoader } from "three-stdlib";
import { OrbitControls } from "three-stdlib";
import {
  FaSearchPlus,
  FaSearchMinus,
  FaRegEye,
  FaRegEyeSlash,
} from "react-icons/fa";
import { ModelContext } from "../../../../../context/ModelContext";

const STLViewer = () => {
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
  const [loading, setLoading] = useState(false); // Add loading state
  const { modelLink } = useContext(ModelContext); // Access modelLink from context

  useEffect(() => {
    if (modelLink) {
      setLoading(true); // Start loader
      loadSTL();
    }
  }, [modelLink]);

  const loadSTL = () => {
    const scene = new THREE.Scene();
    const newCamera = new THREE.PerspectiveCamera(
      75,
      370 / 424, // Match aspect ratio to the new width and height
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(370, 424); // Set width and height of canvas
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
      modelLink,
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

        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        setDimensions({ width, height, depth });

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

        const animate = () => {
          requestAnimationFrame(animate);
          newControls.update();
          renderer.render(scene, newCamera);
        };
        animate();
        setLoading(false); // Stop loader on error
      },
      undefined,
      (error) => {
        console.error("Error loading STL:", error);
        setLoading(false); // Stop loader on error
      }
    );

    window.addEventListener("resize", () => {
      if (viewerElement) {
        const width = 370;
        const height = 424;
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
    <div style={{ width: "320px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ position: "relative", width: "370px", height: "424px" }}>
        {loading && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                padding: "10px 20px",
                borderRadius: "5px",
                zIndex: 10,
              }}
            >
              <p>Loading model...</p>
            </div>
          )}
          <div id="viewer" style={{ width: "100%", height: "100%" }}>
          </div>
          <div
            style={{
              position: "absolute",
              top: "80px",
              right: "10px",
              display: "flex",
              flexDirection: "column",
              transform: "translateY(-50%)",
            }}
          >
            <button
              onClick={zoomIn}
              style={{
                padding: "10px",
                borderRadius: "50%",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                marginBottom: "10px",
                cursor: "pointer",
              }}
            >
              <FaSearchPlus />
            </button>
            <button
              onClick={zoomOut}
              style={{
                padding: "10px",
                borderRadius: "50%",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                marginBottom: "10px",
                cursor: "pointer",
              }}
            >
              <FaSearchMinus />
            </button>
            <button
              onClick={toggleXrayView}
              style={{
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
        </div>
        <div style={{ width: "320px", marginTop: "20px" }}>
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
            {unit === "inch" ? "in²" : unit === "cm" ? "cm²" : "mm²"}
          </p>
          <p>
            Volume: {convertUnit(volume, "mm", unit).toFixed(2)}{" "}
            {unit === "inch" ? "in³" : unit === "cm" ? "cm³" : "mm³"}
          </p>
          <label>
            Unit:{" "}
            <select value={unit} onChange={handleUnitChange}>
              <option value="mm">mm</option>
              <option value="cm">cm</option>
              <option value="inch">inch</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
};

export default STLViewer;
