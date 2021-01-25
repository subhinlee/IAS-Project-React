/* animate smooth scrolling sections */
$("nav ul li a[href^='#']").on('click', function(e) {

  // prevent default anchor click behavior
  e.preventDefault();

  // store hash
  var hash = this.hash;

  // animate
  $('html, body').animate({
      scrollTop: $(hash).offset().top
    }, 700, function(){

      // when done, add hash to url
      // (default click behaviour)
      window.location.hash = hash;
    });

});
/* animate smooth scrolling sections */
$("#started a[href^='#']").on('click', function(e) {

  // prevent default anchor click behavior
  e.preventDefault();

  // store hash
  var hash = this.hash;

  // animate
  $('html, body').animate({
      scrollTop: $(hash).offset().top
    }, 700, function(){

      // when done, add hash to url
      // (default click behaviour)
      window.location.hash = hash;
    });

});
/////////////////////////////////////////////

const container = document.getElementById('modelcanvas');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( 1200, 662 );
container.appendChild( renderer.domElement );

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xfafafafa ); 



    //PerspectiveCamera( fov, aspect, near, far )
    camera = new THREE.PerspectiveCamera (100, window.innerWidth/window.innerHeight, 1, 10000);
    camera.position.x = 10;
    camera.position.y = 5;
    camera.position.z = 10;
    camera.lookAt (new THREE.Vector3(0,0,0));
    
    // controls = new THREE.TrackballControls( camera, renderer.domElement );


    //OrthographicCamera( left, right, top, bottom, near, far )
    topCamera = new THREE.OrthographicCamera (-15,15,15,-15, 1, 2000);
    topCamera.position.set (40,15,10);
    // topCamera.up.set (1,1,1);
    topCamera.lookAt (new THREE.Vector3(0,0,0));
   
    // objectvies to render
    const planegeometry = new THREE.PlaneGeometry( 40,40,50,50 );
    const planematerial = new THREE.MeshBasicMaterial( {color: 0xD3D3D3, wireframe:true } );
    const plane = new THREE.Mesh( planegeometry, planematerial );
    plane.rotation.x = Math.PI / 2;
    scene.add( plane );
    
    const camgeometry = new THREE.BoxGeometry();
    const cammaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe:true, wireframeLinewidth: 3 } );
    const cam = new THREE.Mesh( camgeometry, cammaterial );
    cam.position.x = 10;
    cam.position.y = 5;
    cam.position.z = 10;
    scene.add( cam );
    
    const geometry = new THREE.BoxGeometry(5,5,5);
    const material = new THREE.MeshBasicMaterial( { color: 0xfbdb48, wireframe:true, wireframeLinewidth: 3 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    var camAxis = new THREE.AxesHelper(5);
    cam.add(camAxis);

    
    // create 2 different scenes using 2 different cameras
    var SCREEN_W, SCREEN_H;
    SCREEN_W = window.innerWidth;
    SCREEN_H = window.innerHeight;
   
    var left,bottom,width,height;
   
    left = 1; bottom = 1; width = 0.5*SCREEN_W-2; height = SCREEN_H-2;
    renderer.setViewport (left,bottom,width,height);
    renderer.setScissor(left,bottom,width,height);
    renderer.enableScissorTest (true);
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
    renderer.render (scene,camera);
   
    left = 0.5*SCREEN_W+1; bottom = 1; width = 0.5*SCREEN_W-2; height = SCREEN_H-2;
    renderer.setViewport (left,bottom,width,height);
    renderer.setScissor(left,bottom,width,height);
    renderer.enableScissorTest (true);  // clip out "viewport"
    topCamera.aspect = width/height;
    topCamera.updateProjectionMatrix();
    renderer.render (scene,topCamera);


    // renderer.render( scene, camera );

/////////////////////////////////////////////
    
    // // TODO new: three.js
    // var scene = new THREE.Scene();
    // scene.background = new THREE.Color( 0xfafafafa ); // light gray
    
    // const light = new THREE.DirectionalLight( 0xffffff );
    // light.position.set( 0.5, 1.0, 0.5 ).normalize();
    // scene.add( light );
    
    // var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    
    // //const helper = new THREE.CameraHelper( camera );
    // //scene.add( helper );
    // const axesHelper = new THREE.AxesHelper( 5 ); // The X axis is red. The Y axis is green. The Z axis is blue.
    // scene.add( axesHelper );
    // //const grid = new THREE.GridHelper( 50, 50, 0xffffff, 0x555555 );
    // //scene.add( grid );
    
    // const renderer = new THREE.WebGLRenderer();
    // renderer.setSize( 480, 340 );
    // document.getElementById('3d-model').appendChild( renderer.domElement );
    
    // const geometry = new THREE.BoxGeometry();
    // const material = new THREE.MeshBasicMaterial( { color: 0xfbdb48, wireframe:true, wireframeLinewidth: 3 } );
    // const cube = new THREE.Mesh( geometry, material );
    // scene.add( cube );

    // var radius = 10;
    // camera.position.z = radius; // default parameter
    
    // function adjust_camera_pos(){ // take the user input instead // TODO!
    //     var val = document.getElementById('camera_pos').value;
    //     camera.position.z = val;
    //     adjust_camera_angle();
    // }
    
    // // TODO: Visualize also the camera!?

    // // TODO: take the blender scale!?
    
    // var angle_grad =  45;
    // var angle_rad = angle_grad * Math.PI / 180;
    
    // // Option 1 to rotate the camera
    // //camera.rotation.z = angle_rad;

    // // Option 2 to rotate the camera: use Math.cos and Math.sin to set camera X and Z values based on angle. 
    // //camera.position.x = radius * Math.cos( angle_grad );  
    // //camera.position.z = radius * Math.sin( angle_grad );

    // // Option 3 to rotate the camera
    // var camera_pivot = new THREE.Object3D()
    // var Y_AXIS = new THREE.Vector3( 0, 1, 0 ); // x,y,z
    // scene.add( camera_pivot );
    // camera_pivot.add( camera );
    // camera.lookAt( camera_pivot.position );
    // camera_pivot.rotateOnAxis( Y_AXIS, angle_rad ); // radians
    
    // //scene.add( camera );
    
    // function adjust_camera_angle(){ // take the user input instead // TODO!
    //     var angle_grad = document.getElementById('camera_angle_grad').value;
    //     var angle_rad = angle_grad * Math.PI / 180;
    //     camera.rotation.y = angle_rad;
    // }
    
    // function animate() { // animate loop
    //     requestAnimationFrame( animate );
    //     // put here anything you want to move or change while the app is running
    //     renderer.render( scene, camera );
    // }
    
    // animate();
    
    
    // var gui = new Vue({ // TODO
    //     el: '#gui',
    //     methods: {
    //         start: function (event) {
    //             // TODO: alternatively open another page (localhost)
                
    //             alert("GUI TODO: Parameters to be set")
    //             // `event` is the native DOM event
    //             if (event) {
    //                 alert('The data has been sent. Please wait for the results. It could take a while..')
    //             }
    //         }
    //     }
    // })
    // //example2.start() // to invoke the method in JavaScript (button clicked from the beginning)
    
    // // TODO new:
    // function getPosition(element) {
    //     var e = document.getElementById(element);
    //     var left = 0;
    //     var top = 0;

    //     do {
    //         left += e.offsetLeft;
    //         top += e.offsetTop;
    //     } while (e = e.offsetParent);

    //     return [left, top];
    // }

    // function jumpTo(id) {
    //     window.scrollTo(getPosition(id));
    // }
    
    // // dragover and dragenter events need to have 'preventDefault' called
    // // in order for the 'drop' event to register. 
    // // See: https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_operations#droptargets
    // /*dropContainer.ondragover = dropContainer.ondragenter = function(evt) {
    //   evt.preventDefault();
    // };

    // dropContainer.ondrop = function(evt) {
    //   // pretty simple -- but not for IE :(
    //   fileInput.files = evt.dataTransfer.files;

    //   // If you want to use some of the dropped files
    //   const dT = new DataTransfer();
    //   dT.items.add(evt.dataTransfer.files[0]);
    //   dT.items.add(evt.dataTransfer.files[3]);
    //   fileInput.files = dT.files;

    //   evt.preventDefault();
    // };*/
    
    // //https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/; https://codepen.io/joezimjs/pen/yPWQbd
    
    // let dropArea = document.getElementById('drop-area')
    // let uploadProgress = [] // track the percentage completion of each request instead of just how many are done
    // let progressBar = document.getElementById('progress-bar')
    
    // // Prevent default drag behaviours, otherwise the browser will end up opening the dropped file instead of sending it along to the drop event handler!

    // ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    //   dropArea.addEventListener(eventName, preventDefaults, false)   
    //   document.body.addEventListener(eventName, preventDefaults, false)
    // })

    // function preventDefaults (e) {
    //   e.preventDefault()
    //   e.stopPropagation()
    // }
    
    // // Add an indicator to let the user know that they have indeed dragged the item over the correct area by using CSS to change the color of the border color of the drop area.
    
    // ;['dragenter', 'dragover'].forEach(eventName => {
    //   dropArea.addEventListener(eventName, highlight, false)
    // })

    // ;['dragleave', 'drop'].forEach(eventName => {
    //   dropArea.addEventListener(eventName, unhighlight, false)
    // })

    // function highlight(e) {
    //   dropArea.classList.add('highlight')
    // }

    // function unhighlight(e) {
    //   dropArea.classList.remove('highlight')
    // }
    
    // // Handle dropped files
    // dropArea.addEventListener('drop', handleDrop, false)

    // function handleDrop(e) {
    //   let dt = e.dataTransfer
    //   let files = dt.files

    //   handleFiles(files)
    // }
    
    // function handleFiles(files) {
    //   files = [...files]
    //   initializeProgress(files.length)
    //   files.forEach(uploadFile)
    //   files.forEach(previewFile)
    // }

    // function uploadFile(file, i) {
    //   //var url = 'YOUR URL HERE' // TODO: change the URL to work with the back-end or service
    //   var url = 'https://api.cloudinary.com/v1_1/magdalena/image/upload' // to test with a free cloudinary account
    //   var xhr = new XMLHttpRequest() // to support Internet Explorer
    //   var formData = new FormData()
    //   xhr.open('POST', url, true)
    //   xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
      
    //   // Update progress (can be used to show progress indicator)
    //   xhr.upload.addEventListener("progress", function(e) {
    //     updateProgress(i, (e.loaded * 100.0 / e.total) || 100)
    //   })

    //   xhr.addEventListener('readystatechange', function(e) {
    //     // TODO: Depending on how the server is set up, different ranges of status numbers rather than just 200 may also be checked
    //     if (xhr.readyState == 4 && xhr.status == 200) {
    //         updateProgress(i, 100)
    //         // Done. Inform the user
    //     }
    //     else if (xhr.readyState == 4 && xhr.status != 200) {
    //         // Error. Inform the user
    //     }
    //   })

    //   formData.append('upload_preset', 'pworvx7a') // preset name: pworvx7a, ml_default
    //   formData.append('file', file) // update, if the server needs more information
    //   xhr.send(formData)
    // }
    
    // // Image Preview
    
    // function previewFile(file) {
    //   let reader = new FileReader()
    //   reader.readAsDataURL(file)
    //   reader.onloadend = function() {
    //     let img = document.createElement('img')
    //     img.src = reader.result
    //     document.getElementById('gallery').appendChild(img)
    //   }
    // }
    
    // // Tracking Progress
    
    // function initializeProgress(numFiles) {
    //   progressBar.value = 0
    //   uploadProgress = []

    //   for(let i = numFiles; i > 0; i--) {
    //     uploadProgress.push(0)
    //   }
    // }

    // function updateProgress(fileNumber, percent) {
    //   uploadProgress[fileNumber] = percent
    //   let total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length
    //   console.debug('update', fileNumber, percent, total)
    //   progressBar.value = total
    // }
    
