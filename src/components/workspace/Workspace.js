import './Workspace.css';
import React, { useEffect } from 'react';
import * as THREE from "three";
// import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';

function Workspace(props) {

  useEffect(() => {
    initThree();
    return () => {
    };
  });
  
  const size = 1;
  const near = 5;
  const far = 50;
  const camera = new THREE.OrthographicCamera(-size, size, size, -size, near, far);

  const initThree = () => {
    const canvas = document.querySelector('#c');
    const view1Elem = document.querySelector('#view1');
    const view2Elem = document.querySelector('#view2');
    const renderer = new THREE.WebGLRenderer({canvas});
  
    
    camera.zoom = 0.2;
    camera.position.set(0, 10, 20);
  
    const cameraHelper = new THREE.CameraHelper(camera);
  
    class MinMaxGUIHelper {
      constructor(obj, minProp, maxProp, minDif) {
        this.obj = obj;
        this.minProp = minProp;
        this.maxProp = maxProp;
        this.minDif = minDif;
      }
      get min() {
        return this.obj[this.minProp];
      }
      set min(v) {
        this.obj[this.minProp] = v;
        this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
      }
      get max() {
        return this.obj[this.maxProp];
      }
      set max(v) {
        this.obj[this.maxProp] = v;
        this.min = this.min;  // this will call the min setter
      }
    }
  
    const gui = new GUI({ autoPlace: false });

    // const cubeFolder = gui.addFolder("Cube")
    // cubeFolder.add(cube.rotation, "x", 0, Math.PI * 2, 0.01)
    // cubeFolder.add(cube.rotation, "y", 0, Math.PI * 2, 0.01)
    // cubeFolder.add(cube.rotation, "z", 0, Math.PI * 2, 0.01)
    // cubeFolder.open()

    // const cameraFolder = gui.addFolder("Camera")
    // cameraFolder.add(camera.position, "z", 0, 10, 0.01)
    // cameraFolder.open()


    const cameraFolder = gui.addFolder("Camera view");
    cameraFolder.add(camera, 'zoom', 0.01, 1, 0.01).listen();
    const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
    cameraFolder.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near');
    cameraFolder.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far');
    // cameraFolder.open()

    const coordinateFolder = gui.addFolder("Coordinates");
    coordinateFolder.add(camera.position, "x", -40, 40, 0.01);
    coordinateFolder.add(camera.position, "y", 10, 20, 0.01);
    coordinateFolder.add(camera.position, "z", 0, 100, 0.01);
    // coordinateFolder.open()
    var guiContainer = document.getElementById('gui-container');
    guiContainer.appendChild(gui.domElement);

    const controls = new OrbitControls(camera, view1Elem);
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
    var x = camera.position.x;
    console.log("camera X coordinate value is set as : " + x);
  }
  // go back to landing page button setting
  const btnClicked = () => {
    props.stepChanged(0);
  }

  // // Camera zoom simple test 
  // var camera = null;
  // const zoom = () => {
  //   camera.position.z = camera.position.z + 5;
  // }

  // const initThree = () => {
  //   // main canvas
  //   // -----------------------------------------------

  //   //dom 
  //   var threeContainer = document.getElementById('threeContainer');

  //   // renderer
  //   var renderer = new THREE.WebGLRenderer();
  //   renderer.setClearColor( 0xffffff, 1 );
  //   renderer.setSize( window.innerWidth, window.innerHeight );
  //   threeContainer.appendChild( renderer.domElement );

  //   //scene
  //   var scene = new THREE.Scene();

  //   //camera
  //   camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

  //   var cameraOrtho;
  //   var cameraOrthoHelper;
  //   const size = 1;
  //   const near = 1;
  //   const far = 5;
  //   cameraOrtho = new THREE.OrthographicCamera( -size, size, size, -size, near, far );
  //   cameraOrthoHelper = new THREE.CameraHelper( cameraOrtho );
  //   scene.add( cameraOrthoHelper );
    
  //   //cube
  //   var cube;
  //   cube = new THREE.Mesh( 
  //       new THREE.BoxGeometry(1, 1, 1 ), 
  //       new THREE.MeshBasicMaterial( { color : 0xff0000, wireframe: true } 
  //   ) );
  //   scene.add( cube );

  //   //axes
  //   var axes;
  //   axes = new THREE.AxisHelper( 1 );
  //   scene.add( axes );
    
  //   //controls
  //   var controls;
  //   controls = new TrackballControls( camera, renderer.domElement );

  //   // inset canvas
  //   // -----------------------------------------------
    
  //   // dom
  //   var insetContainer;
  //   insetContainer = document.getElementById('inset');

  //   // renderer
  //   var CANVAS_WIDTH = 300;
  //   var CANVAS_HEIGHT = 300;
  //   var renderer2;
  //   renderer2 = new THREE.WebGLRenderer();
  //   renderer2.setClearColor( 0xf0f0f0, 1 );
  //   renderer2.setSize( CANVAS_WIDTH, CANVAS_HEIGHT );
  //   insetContainer.appendChild( renderer2.domElement );

  //   // scene
  //   var scene2
  //   scene2 = new THREE.Scene();

  //   // camera
  //   var camera2;
  //   camera2 = new THREE.PerspectiveCamera( 75, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );
  //   // camera2.up = camera.up; // important!

  //   // axes
  //   var axes2;
  //   axes2 = new THREE.AxisHelper( 100 );
  //   scene2.add( axes2 );
    
  //   // enable resize screen of the scene using onWindowResize()
  //   window.addEventListener( 'resize', onWindowResize, false );
  //   function onWindowResize() {
  //       camera.aspect = window.innerWidth / window.innerHeight;
  //       camera.updateProjectionMatrix();
  //       renderer.setSize(window.innerWidth, window.innerHeight);
  //   }

  //   camera.position.z = 5;

  //   function render() {
  //       renderer.render( scene, camera );
  //       renderer2.render( scene2, camera2 );
  //   }


  //   var CAM_DISTANCE = 300;
    

  //   var animate = function () {
  //     requestAnimationFrame( animate );
  //   //   cube.rotation.x += 0.01;
  //   //   cube.rotation.y += 0.01;
  //   controls.update();
    
  //   camera2.position.copy( cameraOrtho.position );
  //   // camera2.position.sub( controls.target ); // added by @libe
  //   camera2.position.setLength( CAM_DISTANCE );

  //   camera2.lookAt( scene2.position );
  //   render();

  //   };
  //   animate();
  // }
    
  return (
    <div className="App">
      workspace 
      <button class="back" onClick={btnClicked} >go to 0</button>
      <button id="sendData" onClick={initData} >get Value</button>
      <div id="gui-container"></div>
      {/* <button onClick={zoom} >zoom</button> */}
      <canvas id="c"></canvas>
      <div class="split">
        <div id="view1" tabindex="1"></div>
        <div id="view2" tabindex="2"></div>
      </div>
      
      {/* <div id="threeContainer" />
      <div id="inset" /> */}
    </div>
  );
}

export default Workspace;
  