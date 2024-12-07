import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { STLLoader } from "three-stdlib";
import { OrbitControls } from "three-stdlib";
// import "./STLViewer.css";
import { Box, Button, Typography, Slider, Input, List, ListItem, IconButton, Tooltip, } from "@mui/material";
import {
  PanoramaFishEye,
  StarBorder,
  ScatterPlot,
  CropSquare,
  Navigation,
  Straighten,
  PanTool,
  CameraAlt,
} from "@mui/icons-material";
import ConfigurationHeader2 from "../header/ConfigurationHeader2";


const STLAdvanceViewer = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isXray, setIsXray] = useState(false);
  const [isHeatmap, setIsHeatmap] = useState(false); // Heatmap toggle
  const [mesh, setMesh] = useState(null);
  const [camera, setCamera] = useState(null);
  const [controls, setControls] = useState(null);
  const [clippingPlane, setClippingPlane] = useState(null); // Clipping plane
  const [clipValue, setClipValue] = useState(0); // Clipping value
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, depth: 0 });
  const [lightIntensity, setLightIntensity] = useState(1);
  const [lightColor, setLightColor] = useState("#ffffff");
  const [points, setPoints] = useState([]); // Store clicked points
  const [distance, setDistance] = useState(null); // Store the distance between points
  const [isMeasurementEnabled, setIsMeasurementEnabled] = useState(false); // Toggle for measurement mode
  const [line, setLine] = useState(null); // Line representing the distance
  const [integrityIssues, setIntegrityIssues] = useState(null); // Store integrity issues
  const [boundingBoxHelper, setBoundingBoxHelper] = useState(null);
  const [highlightEdges, setHighlightEdges] = useState(false);
  const [originalColors, setOriginalColors] = useState(null); // Store original geometry colors
  const [isTransparentMode, setIsTransparentMode] = useState(false); // Store original geometry colors

  const [renderer, setRenderer] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    const fileURL = localStorage.getItem("uploadedFileURL");
    if (fileURL) {
      setUploadedFile(fileURL);
    }
  }, []);

  const addLighting = (scene) => {
    // Directional Light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true; // Enable shadows
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    // Hemisphere Light
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x080820, 0.7);
    scene.add(hemisphereLight);
  };

  useEffect(() => {
    if (uploadedFile) {
      loadSTL();
    }
  }, [uploadedFile]);

  const loadSTL = () => {
    try {
      const scene = new THREE.Scene();
  
      // Create both cameras
      const perspectiveCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      const orthographicCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
  
      let currentCamera = perspectiveCamera;
      cameraRef.current = currentCamera;
  
      const renderer = rendererRef.current || new THREE.WebGLRenderer({ antialias: true });
      setRenderer(renderer);
      if (isTransparentMode) {
        renderer.setClearColor(0x222222, 1); // Dark background
      } else {
        renderer.setClearColor(0xeaeaea, 1); // Normal background
      }
  
      const viewerElement = document.getElementById("viewer");
      const { clientWidth, clientHeight } = viewerElement;
      renderer.setSize(clientWidth, clientHeight);
  
      perspectiveCamera.aspect = clientWidth / clientHeight;
      perspectiveCamera.updateProjectionMatrix();
  
      viewerElement.innerHTML = "";
      viewerElement.appendChild(renderer.domElement);

      addLighting(scene);
  
      const controls = new OrbitControls(currentCamera, renderer.domElement);
      controls.enableDamping = true;
      setControls(controls);
      setCamera(currentCamera);
  
      const loader = new STLLoader();
      loader.load(
        uploadedFile,
        (geometry) => {
          geometry.computeBoundingBox();
          const boundingBox = geometry.boundingBox;
          const centerX = (boundingBox.max.x + boundingBox.min.x) / 2;
          const centerY = (boundingBox.max.y + boundingBox.min.y) / 2;
          const centerZ = (boundingBox.max.z + boundingBox.min.z) / 2;
  
          // Initial Material Configuration
          const material = new THREE.MeshStandardMaterial({
            wireframe: isXray, // Initial state depends on isXray
            metalness: 0.3, // Slight metallic look
            clippingPlanes: [],
            clipIntersection: true,
            opacity: isTransparentMode ? 0.5 : 1, // Adjust opacity based on mode
            color: isTransparentMode ? 0x888888 : 0xffffff, // Grayscale for transparent mode, white otherwise
            emissive: isTransparentMode ? new THREE.Color(0x888888) : new THREE.Color(0x444444), // Subtle glow for transparent mode
            emissiveIntensity: isTransparentMode ? 0.05 : 0.3, // Glow intensity
            side: isTransparentMode ? THREE.DoubleSide : THREE.FrontSide, // Double-sided for transparency, front-side otherwise
          });
          

          const newMesh = new THREE.Mesh(geometry, material);
          const scaleFactor = 0.6; // Adjust this factor as needed (e.g., 1.2 = 20% larger, 1 = original size)
          newMesh.position.set(-centerX, -centerY, -centerZ);
          scene.add(newMesh);
          setMesh(newMesh);

          // Bounding Box Helper
        const boundingBoxHelper = new THREE.BoxHelper(newMesh, 0xff0000);
        boundingBoxHelper.visible = false;
        setBoundingBoxHelper(boundingBoxHelper);
        scene.add(boundingBoxHelper);
  
          const size = Math.max(
            boundingBox.max.x - boundingBox.min.x,
            boundingBox.max.y - boundingBox.min.y,
            boundingBox.max.z - boundingBox.min.z
          ) * scaleFactor;
  
          // Position the perspective camera
          const distance = size * 2; // Distance to model
          perspectiveCamera.position.set(0, 0, distance);
          perspectiveCamera.lookAt(newMesh.position);
          perspectiveCamera.updateProjectionMatrix();
  
          // Calculate the orthographic frustum based on the perspective camera's FoV
          const fov = THREE.MathUtils.degToRad(perspectiveCamera.fov); // Convert FoV to radians
          const viewHeight = 2 * Math.tan(fov / 2) * distance; // Visible height at the distance
          const aspect = perspectiveCamera.aspect;
  
          // Set orthographic camera frustum to match the perspective camera's view
          orthographicCamera.left = -viewHeight * aspect / 2;
          orthographicCamera.right = viewHeight * aspect / 2;
          orthographicCamera.top = viewHeight / 2;
          orthographicCamera.bottom = -viewHeight / 2;
          orthographicCamera.position.set(0, 0, distance);
          orthographicCamera.lookAt(newMesh.position);
          orthographicCamera.updateProjectionMatrix();
  
          const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, currentCamera);
          };
          animate();
        },
        undefined,
        (error) => console.error("Error loading STL:", error)
      );
  
      // Synchronize camera positions and orientations
      const syncCameras = () => {
        if (currentCamera === perspectiveCamera) {
          orthographicCamera.position.copy(perspectiveCamera.position);
          orthographicCamera.quaternion.copy(perspectiveCamera.quaternion);
          orthographicCamera.updateProjectionMatrix();
        } else {
          perspectiveCamera.position.copy(orthographicCamera.position);
          perspectiveCamera.quaternion.copy(orthographicCamera.quaternion);
          perspectiveCamera.updateProjectionMatrix();
        }
      };
  
      // Update both cameras whenever controls change
      controls.addEventListener("change", syncCameras);
  
      // Camera switching function
      const switchCamera = (newCamera) => {
        currentCamera = newCamera;
        cameraRef.current = currentCamera;
  
        controls.object = currentCamera;
        controls.update();
  
        // Sync the cameras immediately upon switch
        syncCameras();
      };
  
      // Add event listeners for camera switch buttons
      document.getElementById("perspectiveButton").addEventListener("click", () => {
        switchCamera(perspectiveCamera);
      });
  
      document.getElementById("orthographicButton").addEventListener("click", () => {
        switchCamera(orthographicCamera);
      });
    } catch (error) {
      console.error("Error in loadSTL:", error);
    }
  };
  

  const onResize = () => {
    const container = document.getElementById("viewer");
    if (!container || !rendererRef.current || !cameraRef.current) return;
  
    const { clientWidth, clientHeight } = container;
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
  
    // Update renderer size
    renderer.setSize(clientWidth, clientHeight);
  
    // Update camera aspect ratio
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
  };

  useEffect(() => {
    const handleResize = () => onResize();
    window.addEventListener("resize", handleResize);
  
    // Call it once to adjust on initial load
    onResize();
  
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //bonding box toggle
  const toggleBoundingBox = () => {
    if (boundingBoxHelper) {
      boundingBoxHelper.visible = !boundingBoxHelper.visible;
    }
  };

  const toggleXrayView = () => {
    if (mesh) {
      mesh.material.wireframe = !mesh.material.wireframe;
      mesh.material.transparent = !mesh.material.transparent;
      mesh.material.opacity = mesh.material.wireframe ? 0.3 : 1;
      setIsXray(!isXray);
    }
  };
  

  const toggleTransparentMode = () => {
    if (mesh) {
      const isEnabled = !isTransparentMode;
  
      if (isEnabled) {
        // Enable transparent mode with glowing effect
        mesh.material.transparent = true; 
        mesh.material.opacity = 0.5; // Semi-transparent
        mesh.material.color.set(0xffffff); // Light gray or white
        mesh.material.reflectivity = 0.3; // Subtle shine
        mesh.material.clearcoat = 1.0; // High clear coat for polish
        mesh.material.clearcoatRoughness = 0.1; // Smooth clear coat
        mesh.material.emissive.set(0x000000); // Add a soft glow
        mesh.material.emissiveIntensity = 0.3; // Glow intensity
        mesh.material.side = THREE.DoubleSide; // Render both sides for transparency
  
        // Set dark background for better glow visibility
        renderer.setClearColor(new THREE.Color(0x222222), 1);
      } else {
        // Disable transparent mode
        mesh.material.transparent = false;
        mesh.material.opacity = 1;
        mesh.material.color.set(0xffffff);
        mesh.material.reflectivity = 0.3;
        mesh.material.clearcoat = 1.0; // High clear coat for polish
        mesh.material.clearcoatRoughness = 0.07; // Smooth clear coat
        mesh.material.emissive.set(0x000000);
        mesh.material.emissiveIntensity = 0;
        mesh.material.side = THREE.FrontSide;
  
        // Reset background to white
        renderer.setClearColor(new THREE.Color(0xffffff), 1);
      }
  
      // Update state and refresh material
      setIsTransparentMode(isEnabled);
      mesh.material.needsUpdate = true;
    }
  };
  
  
  const handleBackgroundColorChange = (event) => {
    setBackgroundColor(event.target.value);
    if (renderer) {
      renderer.setClearColor(new THREE.Color(event.target.value));
    }
  };
  
  

  const zoomIn = () => {
    if (camera) camera.position.z -= 10;
  };

  const zoomOut = () => {
    if (camera) camera.position.z += 10;
  };

  
  

  // Function to analyze mesh integrity (non-manifold edges and holes)
  const analyzeIntegrity = () => {
    if (!mesh) return;
  
    const geometry = mesh.geometry;
    const scene = new THREE.Scene(); // Ensure you use the same scene from STL rendering
    const issues = [];
    let hasNonManifoldEdges = false;
    let hasHoles = false;
  
    // Check for non-manifold edges
    const edges = new THREE.EdgesGeometry(geometry);
    const nonManifoldEdges = edges.attributes.position.array;
    if (nonManifoldEdges.length === 0) {
        issues.push("No non-manifold edges detected.");
    } else {
        hasNonManifoldEdges = true; 
        highlightNonManifoldEdges(geometry, scene);
        issues.push("Non-manifold edges detected.");
    }
  
    // Check for holes (simplified check)
    const faces = geometry.index ? geometry.index.array : null; 
    if (!faces) {
      issues.push("No faces found to check for holes.");
    } else {
      let holeDetected = false;
      for (let i = 0; i < faces.length; i += 3) {
        const vertex1 = geometry.attributes.position.array.slice(faces[i] * 3, faces[i] * 3 + 3);
        const vertex2 = geometry.attributes.position.array.slice(faces[i + 1] * 3, faces[i + 1] * 3 + 3);
        const vertex3 = geometry.attributes.position.array.slice(faces[i + 2] * 3, faces[i + 2] * 3 + 3);
  
        // Perform a simple check for degenerate triangles
        const isDegenerate = isDegenerateTriangle(vertex1, vertex2, vertex3);
        if (isDegenerate) {
          holeDetected = true;
        }
      }
  
      if (holeDetected) { 
        hasHoles = true
        issues.push("Holes detected in the mesh.");
      } else {
        issues.push("No holes detected.");
      }

      // Visualize the issues on the model
  

  if (hasNonManifoldEdges) {
    highlightNonManifoldEdges(geometry, scene);
  }

  if (hasHoles) {
    highlightHoles(geometry, scene); // Add this function if you want to handle holes
  }
    }
  
    setIntegrityIssues(issues); 
  };

  const highlightNonManifoldEdges = (geometry, scene) => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const nonManifoldEdges = new Set();
    const edgeUsage = new Map();

    const position = geometry.attributes.position;
    const index = geometry.index ? geometry.index.array : null;

    if (index) {
        // Indexed geometry: Check edges as you already do
        for (let i = 0; i < index.length; i += 3) {
            const a = index[i];
            const b = index[i + 1];
            const c = index[i + 2];

            const edgePairs = [
                [a, b],
                [b, c],
                [c, a],
            ];

            edgePairs.forEach(([v1, v2]) => {
                const edgeKey = `${Math.min(v1, v2)}-${Math.max(v1, v2)}`;
                edgeUsage.set(edgeKey, (edgeUsage.get(edgeKey) || 0) + 1);
            });
        }
    } else {
        // Non-indexed geometry: Handle vertices directly
        const vertexCount = position.count;
        for (let i = 0; i < vertexCount; i += 3) {
            const edgePairs = [
                [i, i + 1],
                [i + 1, i + 2],
                [i + 2, i],
            ];

            edgePairs.forEach(([v1, v2]) => {
                const edgeKey = `${Math.min(v1, v2)}-${Math.max(v1, v2)}`;
                edgeUsage.set(edgeKey, (edgeUsage.get(edgeKey) || 0) + 1);
            });
        }
    }

    // Continue as before, detecting non-manifold edges and visualizing them
    edgeUsage.forEach((count, edgeKey) => {
        if (count > 2) {
            nonManifoldEdges.add(edgeKey);
        }
    });

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = [];

    nonManifoldEdges.forEach((edgeKey) => {
        const [v1, v2] = edgeKey.split('-').map(Number);

        const p1 = new THREE.Vector3(
            position.array[v1 * 3],
            position.array[v1 * 3 + 1],
            position.array[v1 * 3 + 2]
        );
        const p2 = new THREE.Vector3(
            position.array[v2 * 3],
            position.array[v2 * 3 + 1],
            position.array[v2 * 3 + 2]
        );

        linePositions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
    });

    if (linePositions.length > 0) {
        lineGeometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(linePositions, 3)
        );

        const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lineSegments);
    } else {
        console.log("No non-manifold edges detected.");
    }

    renderer.render(scene, camera); 
};

  
  
  

  const highlightHoles = (geometry, scene) => {
    const vertices = findVerticesOfHoles(geometry); // Your logic to find vertices causing holes
  
    if (vertices.length > 0) {
        console.log("Holes detected at vertices:", vertices);
      
        // Highlight vertices of holes in the scene
        vertices.forEach((vertex) => {
          const marker = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 16, 16), // Small sphere to mark the vertex
            new THREE.MeshBasicMaterial({ color: 0x0000ff }) // Blue color for holes
          );
          marker.position.copy(vertex);
          scene.add(marker); // Ensure you add this to the correct scene
        });
      }
  };

  const findVerticesOfHoles = (geometry) => {
    if (!geometry.index) {
      console.warn("Geometry is not indexed, skipping hole detection.");
      return [];
    }
  
    const index = geometry.index.array; // Indices of faces
    const vertices = geometry.attributes.position.array; // Vertex positions
    const edgeMap = new Map();
  
    // Step 1: Count occurrences of each edge
    for (let i = 0; i < index.length; i += 3) {
      const face = [index[i], index[i + 1], index[i + 2]];
  
      for (let j = 0; j < 3; j++) {
        const v1 = face[j];
        const v2 = face[(j + 1) % 3]; // Wrap to form an edge loop
        const edgeKey = `${Math.min(v1, v2)}_${Math.max(v1, v2)}`;
  
        if (edgeMap.has(edgeKey)) {
          edgeMap.set(edgeKey, edgeMap.get(edgeKey) + 1);
        } else {
          edgeMap.set(edgeKey, 1);
        }
      }
    }
  
    // Step 2: Find edges that appear only once (open edges)
    const openEdges = [];
    edgeMap.forEach((count, edgeKey) => {
      if (count === 1) {
        openEdges.push(edgeKey);
      }
    });
  
    // Step 3: Collect unique vertices from open edges
    const holeVertices = new Set();
    openEdges.forEach((edgeKey) => {
      const [v1, v2] = edgeKey.split("_").map(Number);
      holeVertices.add(v1);
      holeVertices.add(v2);
    });
  
    // Step 4: Convert vertex indices to actual positions
    const positions = Array.from(holeVertices).map((index) => {
      return new THREE.Vector3(
        vertices[index * 3],
        vertices[index * 3 + 1],
        vertices[index * 3 + 2]
      );
    });
  
    return positions;
  };
  
  
  
  
  // Simple function to check if a triangle is degenerate
  const isDegenerateTriangle = (vertex1, vertex2, vertex3) => {
    const v1 = new THREE.Vector3(...vertex1);
    const v2 = new THREE.Vector3(...vertex2);
    const v3 = new THREE.Vector3(...vertex3);
    
    const edge1 = new THREE.Vector3().subVectors(v2, v1);
    const edge2 = new THREE.Vector3().subVectors(v3, v1);
    
    const crossProduct = new THREE.Vector3().crossVectors(edge1, edge2);
    return crossProduct.length() === 0; // Degenerate if cross product is zero
  };
  

  const toggleIntegrityAnalysis = () => {
    analyzeIntegrity();
  };

  const onMouseClick = (event) => {
    if (!camera || !mesh || !isMeasurementEnabled) {
      return;
    }

    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const canvas = event.target;

    mouse.x = (event.clientX / canvas.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / canvas.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    raycaster.far = 1000;

    const intersects = raycaster.intersectObject(mesh); 
    if (intersects.length > 0) {
      const intersectionPoint = intersects[0].point; 
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(10),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
      );

      marker.position.copy(intersectionPoint);
      mesh.add(marker);

      camera.position.set(
        intersectionPoint.x + 10,
        intersectionPoint.y + 10,
        intersectionPoint.z + 10
      );
      camera.lookAt(intersectionPoint);

      setPoints((prevPoints) => {
        const newPoints = [...prevPoints, intersectionPoint];
        if (newPoints.length === 2) {
          calculateDistance(newPoints);
        }
        return newPoints; 
      });
    }
  };

  //hoghlight model edges
  const highlightModelEdges = () => {
    if (mesh) {
      if (highlightEdges) {
        // Remove the highlighted edges if they exist
        const edgesToRemove = mesh.children.find(child => child.isLineSegments); // Find the edge lines added
        if (edgesToRemove) {
          mesh.remove(edgesToRemove); // Remove from mesh
          edgesToRemove.geometry.dispose(); // Dispose geometry
          edgesToRemove.material.dispose(); // Dispose material
        }
      } else {
        // Add highlighted edges
        const edges = new THREE.EdgesGeometry(mesh.geometry);
        const line = new THREE.LineSegments(
          edges,
          new THREE.LineBasicMaterial({ color: 0xff0000 })
        );
        mesh.add(line);
      }
      setHighlightEdges(!highlightEdges); // Toggle state
    }
  };

  //create heat map colors
  const createHeatmapColors = (geometry) => {
    const position = geometry.attributes.position;
    const count = position.count;
    const colors = new Float32Array(count * 3);

    let minZ = Infinity;
    let maxZ = -Infinity;

    for (let i = 0; i < count; i++) {
      const z = position.getZ(i);
      minZ = Math.min(minZ, z);
      maxZ = Math.max(maxZ, z);
    }

    for (let i = 0; i < count; i++) {
      const z = position.getZ(i);
      const normalizedZ = (z - minZ) / (maxZ - minZ);

      const color = new THREE.Color();
      color.setHSL((1 - normalizedZ) * 0.7, 1, 0.5); // HSL gradient

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return colors;
  };

  //toggle heat map button
  const toggleHeatmap = () => {
    if (mesh && mesh.geometry) {
      const currentState = !isHeatmap;
      setIsHeatmap(currentState);

      if (currentState) {
        // Enable heatmap: set vertex colors
        mesh.geometry.setAttribute('color', new THREE.BufferAttribute(createHeatmapColors(mesh.geometry), 3));
        mesh.material.vertexColors = true;
        mesh.material.needsUpdate = true;
      } else {
        // Disable heatmap: revert to default color
        mesh.material.vertexColors = false;
        mesh.material.color.set(0xffffff); // White default color
        mesh.material.needsUpdate = true;
      }
    }
  };
  

  const toggleMeasurementMode = () => {
    setIsMeasurementEnabled((prevState) => !prevState);
    setPoints([]); // Clear previous points
    setDistance(null); // Reset distance
    if (line) {
      mesh.remove(line); // Remove the line if exists
      setLine(null);
    }
  };

  const calculateDistance = (points) => {
    if (points.length === 2) {
      const dist = points[0].distanceTo(points[1]);
      setDistance(dist.toFixed(2));
    }
  };

  
  //icons
  const TransparentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
  );
  
  const XrayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
    </svg>
  );
  

  return (
  <>
  <ConfigurationHeader2/>
        <Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative", // For absolute positioning
  }}
>
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", md: "row" }, // Responsive design
      width: "90%", // 80% of viewport width
      height: "75vh", // 80% of viewport height
      p: 2,
      background: "#ffffff",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
      position: "relative", // Ensures children can be absolutely positioned
    }}
  >
    {/* Viewer Section */}
    <Box
      sx={{
        flex: 1,
        bgcolor: "#ffffff",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        minHeight: { xs: "300px", md: "auto" }, // Set minimum height for small screens
        position: "relative", // To position the bar at the bottom of the canvas
      }}
    >
      <Box
        id="viewer"
        sx={{
          width: "100%",
          height: "100%",
        }}
      />

      {/* Bottom Bar */}
      <Box
  sx={{
    position: "absolute",
    bottom: 0,
    width: "80%", // Set width to 80%
    left: "50%", // Move to center horizontally
    transform: "translateX(-50%)", // Center based on its width
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    bgcolor: "#ffffff",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)", // Shadow above the bar
  }}
>
  {/* First Group: X-ray and Transparent View */}
  <Box
    sx={{
      display: "flex",
      gap: 1, // Space between buttons in the group
    }}
  >
    {[
      { label: "X-ray view", icon: <XrayIcon />, onClick: toggleXrayView },
      { label: "Transparent View", icon: <TransparentIcon />, onClick: toggleTransparentMode },
    ].map((item, index) => (
      <Tooltip title={item.label} key={index}>
        <IconButton
          onClick={item.onClick}
          sx={{
            p: 1,
            borderRadius: "50%",
            backgroundColor: "#f5f5f5",
            border: "1px solid #ddd",
            ":hover": { backgroundColor: "#e3e3e3" },
          }}
        >
          {item.icon}
        </IconButton>
      </Tooltip>
    ))}
  </Box>

  {/* Second Group: Perspective and Orthographic Buttons */}
  <Box
    sx={{
      display: "flex",
      gap: 1, // Space between buttons in the group
    }}
  >
    {[
      {
        id: "perspectiveButton",
        label: "Perspective View",
        icon: <i className="fas fa-cube"></i>,
      },
      {
        id: "orthographicButton",
        label: "Orthographic View",
        icon: <i className="fas fa-square"></i>,
      },
    ].map((item, index) => (
      <Tooltip title={item.label} key={index}>
        <IconButton
          id={item.id}
          onClick={item.onClick}
          sx={{
            p: 1,
            borderRadius: "50%",
            backgroundColor: "#f5f5f5",
            border: "1px solid #ddd",
            ":hover": { backgroundColor: "#e3e3e3" },
          }}
        >
          {item.icon}
        </IconButton>
      </Tooltip>
    ))}
  </Box>

  {/* Third Group: Remaining Buttons */}
  <Box
    sx={{
      display: "flex",
      gap: 1, // Space between buttons in the group
    }}
  >
    {[
      { label: "Bounding Box", icon: <CropSquare />, onClick: toggleBoundingBox },
      { label: "Model Edges", icon: <Navigation />, onClick: highlightModelEdges },
      { label: "Measure", icon: <Straighten />, onClick: highlightModelEdges },
      { label: "Heat Map View", icon: <PanTool />, onClick: toggleHeatmap },
    ].map((item, index) => (
      <Tooltip title={item.label} key={index}>
        <IconButton
          onClick={item.onClick}
          sx={{
            p: 1,
            borderRadius: "50%",
            backgroundColor: "#f5f5f5",
            border: "1px solid #ddd",
            ":hover": { backgroundColor: "#e3e3e3" },
          }}
        >
          {item.icon}
        </IconButton>
      </Tooltip>
    ))}
  </Box>
</Box>




    </Box>

    {/* Controls Section */}
    <Box
  sx={{
    flex: { xs: "none", md: 0.4 },
    display: "flex",
    flexDirection: "column",
    gap: 2,
    bgcolor: "#ffffff",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    p: 2,
    minHeight: { xs: "auto", md: "100%" },
    maxHeight: "100%",
    overflowY: "auto",
  }}
>
  <Typography
    variant="h6"
    sx={{
      textAlign: "center",
      fontWeight: "bold",
      color: "#333",
      mb: 2,
    }}
  >
    Manufacturability Analysis
  </Typography>
  {/* Status Card */}
  <Box
    sx={{
      bgcolor: "#f5f7fa",
      borderRadius: "12px",
      p: 2,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    }}
  >
    <Typography
      variant="body1"
      sx={{ fontWeight: "bold", color: "#4caf50", mb: 1 }}
    >
      Passed Initial Checks
    </Typography>

    {/* Individual Checks */}
    {[
      { title: "Thin Walls", description: "No thin walls detected", passed: true },
      {
        title: "Internal Corners",
        description: "No sharp internal corners detected",
        passed: true,
      },
      {
        title: "Hard to Remove Material",
        description: "No hard-to-remove material detected",
        passed: true,
      },
      { title: "Holes", description: "No deep holes detected", passed: true },
    ].map((item, index) => (
      <Box
        key={index}
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          mb: 1,
          borderRadius: "8px",
          bgcolor: "#ffffff",
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: "50%",
            bgcolor: item.passed ? "#e8f5e9" : "#ffebee",
            color: item.passed ? "#4caf50" : "#f44336",
            mr: 2,
          }}
        >
          {/* {item.passed ? <CheckCircleOutline /> : <ErrorOutline />} */}
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {item.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "#777" }}>
            {item.description}
          </Typography>
        </Box>
      </Box>
    ))}
  </Box>
</Box>

  </Box>
  </Box>
  </>
  );
};

export default STLAdvanceViewer;
