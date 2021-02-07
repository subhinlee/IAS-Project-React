import './Workspace.css';
import React, { useEffect } from 'react';
import * as THREE from "three";
// import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import MinMaxGUIHelper from '../../helpers/MinMaxGUIHelper/MinMaxGUIHelper';
import axios from 'axios';

function Workspace(props) {
  // const data = [1,2,3,4,5];
  // const id = 34000;

  useEffect(() => {
    initThree();
  });

  const size = 1;
  const near = 5;
  const far = 50;
  const camera = new THREE.OrthographicCamera(-size, size, size, -size, near, far);

  const xmin = -40;
  const xmax = 40;
  const ymin = 10;
  const ymax = 20;
  const zmin = 0;
  const zmax = 100;

  const initThree = () => {
    const canvas = document.querySelector('#c');
    const view1Elem = document.querySelector('#view1');
    const view2Elem = document.querySelector('#view2');
    const renderer = new THREE.WebGLRenderer({canvas});
      
    camera.zoom = 0.2;
    camera.position.set(0, 10, 20);
    const cameraHelper = new THREE.CameraHelper(camera);
  
    const gui = new GUI({ autoPlace: false });
    const cameraFolder = gui.addFolder("Camera view");
    cameraFolder.add(camera, 'zoom', 0.05, 0.5, 0.01).listen();
    const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
    cameraFolder.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near');
    cameraFolder.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far');
    // cameraFolder.open()

    const coordinateFolder = gui.addFolder("Coordinates");
    coordinateFolder.add(camera.position, "x", xmin, xmax, 0.01);
    coordinateFolder.add(camera.position, "y", ymin, ymax, 0.01);
    coordinateFolder.add(camera.position, "z", zmin, zmax, 0.01);
    // coordinateFolder.open()
    var guiContainer = document.getElementById('gui-container');
    guiContainer.appendChild(gui.domElement);

    const controls = new OrbitControls(camera, view1Elem);
    controls.minZoom = 0.05;
    controls.maxZoom = 0.5;
    controls.maxPolarAngle = Math.PI/2; 
    controls.target.set(0, 5, 0);
    controls.update();
  
    const camera2 = new THREE.PerspectiveCamera(
      60,  // fov
      2,   // aspect
      0.1, // near
      500, // far
    );
    camera2.position.set(16, 28, 40);
    camera2.lookAt(0, 5, 0);
  
    const controls2 = new OrbitControls(camera2, view2Elem);
    controls2.target.set(0, 5, 0);
    controls2.update();
  
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('black');
    scene.add(cameraHelper);
  
    // Objects in scenes
    {
      const planeSize = 100;
  
      const loader = new THREE.TextureLoader();
      const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.magFilter = THREE.NearestFilter;
      const repeats = planeSize / 2;
      texture.repeat.set(repeats, repeats);
  
      const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
      const planeMat = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(planeGeo, planeMat);
      mesh.rotation.x = Math.PI * -.5;
      scene.add(mesh);
    }
    {
      const cubeSize = 4;
      const cubeGeo = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize);
      const cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'});
      const mesh = new THREE.Mesh(cubeGeo, cubeMat);
      mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
      scene.add(mesh);
    }
    {
      const sphereRadius = 3;
      const sphereWidthDivisions = 32;
      const sphereHeightDivisions = 16;
      const sphereGeo = new THREE.SphereBufferGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
      const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
      scene.add(mesh);
    }
  
    {
      const color = 0xFFFFFF;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(0, 10, 0);
      light.target.position.set(-5, 0, 0);
      scene.add(light);
      scene.add(light.target);
    }
    
    // resize renderer to screen
    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }
  
    function setScissorForElement(elem) {
      const canvasRect = canvas.getBoundingClientRect();
      const elemRect = elem.getBoundingClientRect();
  
      // compute a canvas relative rectangle
      const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
      const left = Math.max(0, elemRect.left - canvasRect.left);
      const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
      const top = Math.max(0, elemRect.top - canvasRect.top);
  
      const width = Math.min(canvasRect.width, right - left);
      const height = Math.min(canvasRect.height, bottom - top);
  
      // setup the scissor to only render to that part of the canvas
      const positiveYUpBottom = canvasRect.height - bottom;
      renderer.setScissor(left, positiveYUpBottom, width, height);
      renderer.setViewport(left, positiveYUpBottom, width, height);
  
      // return the aspect
      return width / height;
    }
  
    function render() {
  
      resizeRendererToDisplaySize(renderer);
  
      // turn on the scissor
      renderer.setScissorTest(true);
  
      // render the original view
      {
        const aspect = setScissorForElement(view1Elem);
  
        // update the camera for this aspect
        camera.left   = -aspect;
        camera.right  =  aspect;
        camera.updateProjectionMatrix();
        cameraHelper.update();
  
        // don't draw the camera helper in the original view
        cameraHelper.visible = false;
  
        scene.background.set(0x000000);
        renderer.render(scene, camera);
      }
  
      // render from the 2nd camera
      {
        const aspect = setScissorForElement(view2Elem);
  
        // update the camera for this aspect
        camera2.aspect = aspect;
        camera2.updateProjectionMatrix();
  
        // draw the camera helper in the 2nd view
        cameraHelper.visible = true;
  
        scene.background.set(0x000040);
        renderer.render(scene, camera2);
      }
  
      requestAnimationFrame(render);
    }
  
    requestAnimationFrame(render);
  }

  // console.log(camera.position.x);
  const initData = () => {
    // var xval = obj1.x;

    var data = { 
        "cam_xmin": xmin,
        "cam_xmax": xmax,
        "cam_ymin": ymin,
        "cam_ymax": ymax,
        "cam_zmin": zmin,
        "cam_zmax": zmax,
    }
    //Node API test
    axios({
      "method": "POST",
      "url": "http://localhost:3000/api/courses",
      "headers": {
        
      }, "params": {
        "myData": data
      }
    })
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
    })
    console.log("camera X coordinate value is set as : " + xmin);
  }
  // go back to landing page button setting
  const btnClicked = () => {
    props.stepChanged(0);
  }
    
  return (
    <div className="App">
      workspace 
      <button className="back" onClick={btnClicked} >go to 0</button>
      <button id="sendData" onClick={initData} >get Value</button>
      <div id="gui-container"></div>
      {/* <button onClick={zoom} >zoom</button> */}
      <canvas id="c"></canvas>
      <div className="split">
        <div id="view1" tabIndex="1"></div>
        <div id="view2" tabIndex="2"></div>
      </div>
      
      {/* <div id="threeContainer" />
      <div id="inset" /> */}
    </div>
  );
}

export default Workspace;
  