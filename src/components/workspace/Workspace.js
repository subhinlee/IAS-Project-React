import './Workspace.css';
import React, { useEffect } from 'react';
import * as THREE from "three";
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';

function Workspace(props) {

  useEffect(() => {
    initThree();
    return () => {
    };
  });

  // go back to landing page button setting
  const btnClicked = () => {
    props.stepChanged(0);
  }

  // Camera zoom simple test 
  var camera = null;
  const zoom = () => {
    camera.position.z = camera.position.z + 5;
  }

  const initThree = () => {
    // main canvas
    // -----------------------------------------------

    //dom 
    var threeContainer = document.getElementById('threeContainer');

    // renderer
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0xffffff, 1 );
    renderer.setSize( window.innerWidth, window.innerHeight );
    threeContainer.appendChild( renderer.domElement );

    //scene
    var scene = new THREE.Scene();

    //camera
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    
    //cube
    var cube;
    cube = new THREE.Mesh( 
        new THREE.BoxGeometry(1, 1, 1 ), 
        new THREE.MeshBasicMaterial( { color : 0xff0000, wireframe: true } 
    ) );
    scene.add( cube );

    //axes
    var axes;
    axes = new THREE.AxisHelper( 1 );
    scene.add( axes );
    
    //controls
    var controls;
    controls = new TrackballControls( camera, renderer.domElement );

    // inset canvas
    // -----------------------------------------------
    
    // dom
    var insetContainer;
    insetContainer = document.getElementById('inset');

    // renderer
    var CANVAS_WIDTH = 300;
    var CANVAS_HEIGHT = 300;
    var renderer2;
    renderer2 = new THREE.WebGLRenderer();
    renderer2.setClearColor( 0xf0f0f0, 1 );
    renderer2.setSize( CANVAS_WIDTH, CANVAS_HEIGHT );
    insetContainer.appendChild( renderer2.domElement );

    // scene
    var scene2
    scene2 = new THREE.Scene();

    // camera
    var camera2;
    camera2 = new THREE.PerspectiveCamera( 75, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );
    camera2.up = camera.up; // important!

    // axes
    var axes2;
    axes2 = new THREE.AxisHelper( 100 );
    scene2.add( axes2 );
    
    // enable resize screen of the scene using onWindowResize()
    window.addEventListener( 'resize', onWindowResize, false );
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    camera.position.z = 5;

    function render() {

        renderer.render( scene, camera );
        renderer2.render( scene2, camera2 );
    
    }


    var CAM_DISTANCE = 300;
    

    var animate = function () {
      requestAnimationFrame( animate );
    //   cube.rotation.x += 0.01;
    //   cube.rotation.y += 0.01;
    controls.update();
    
	camera2.position.copy( camera.position );
	camera2.position.sub( controls.target ); // added by @libe
	camera2.position.setLength( CAM_DISTANCE );

    camera2.lookAt( scene2.position );
    render();

    };
    animate();
  }
    
  return (
    <div className="App">
      workspace 
      <button onClick={btnClicked} >go to 0</button>
      <button onClick={zoom} >zoom</button>
      <div id="threeContainer" />
      <div id="inset" />
    </div>
  );
}

export default Workspace;
  