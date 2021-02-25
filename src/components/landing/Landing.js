import './Landing.css';
import React, { useState } from 'react';
import backgroundVideo from './video.mp4';
import { Button } from '@material-ui/core';
import axios from 'axios';

function Landing(props) {
  const [fileSelected, setFileSelected] = useState(false);

  const btnClicked = () => {
    if(fileSelected)
      props.stepChanged(1);
    else
      alert('Please select a file');
  }

  const sendData = data => {
    
    setFileSelected(true);

    props.sendOjb3dToParent(data);

    var bodyFormData = new FormData();
    bodyFormData.append('name', 'obj');
    bodyFormData.append('obj3d', data); 
    axios({
      "method": "POST",
      "url": "http://localhost:3001/upload3d",
      "data": bodyFormData,
      "headers": {'Content-Type': 'multipart/form-data' }
    })
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
    })

  }

  const dragAndDropArea = event => {

    let dropArea = document.getElementById('drop-area')
    let uploadProgress = [] // track the percentage completion of each request instead of just how many are done
    let progressBar = document.getElementById('progress-bar')
    
    // Prevent default drag behaviours, otherwise the browser will end up opening the dropped file instead of sending it along to the drop event handler!

    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      let dropArea = document.getElementById('drop-area')
      dropArea.addEventListener(eventName, preventDefaults, false)   
      document.body.addEventListener(eventName, preventDefaults, false)
    })

    function preventDefaults (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    // Add an indicator to let the user know that they have indeed dragged the item over the correct area by using CSS to change the color of the border color of the drop area.
    
    ;['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, highlight, false)
    })

    ;['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, unhighlight, false)
    })

    function highlight(e) {
      dropArea.classList.add('highlight')
    }

    function unhighlight(e) {
      dropArea.classList.remove('highlight')
    }
    
    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false)

    function handleDrop(e) {
      let dt = e.dataTransfer
      let files = dt.files

      handleFiles(files)
    }
    
    function handleFiles(files) {
      files = [...files]
      initializeProgress(files.length)
      files.forEach(uploadFile)
    }

    function uploadFile(file, i) {
      //var url = 'YOUR URL HERE' // change the URL to work with the back-end or service
      var url = 'https://api.cloudinary.com/v1_1/magdalena/image/upload' // to test with a free cloudinary account (works only for images, not for ply files)
      var xhr = new XMLHttpRequest() // to support Internet Explorer
      var formData = new FormData()
      xhr.open('POST', url, true)
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
      
      // TODO: the progress bar will then show how much it takes to upload it to a cloud, but not to our server, it will still be very fast, so could be still used for showing an approximate time
      // Update progress (can be used to show progress indicator)
      xhr.upload.addEventListener("progress", function(e) {
        updateProgress(i, (e.loaded * 100.0 / e.total) || 100)
      })

      xhr.addEventListener('readystatechange', function(e) {
        // Depending on how the server is set up, different ranges of status numbers rather than just 200 may also be checked
        if (xhr.readyState === 4 && xhr.status === 200) {
          updateProgress(i, 100)
          // Done. Inform the user
        }
        else if (xhr.readyState === 4 && xhr.status !== 200) {
          // Error. Inform the user
        }
      })

      formData.append('upload_preset', 'pworvx7a') // preset name: pworvx7a, ml_default
      formData.append('file', file) // update, if the server needs more information
      xhr.send(formData)

      // Send (NEW)
      sendData(file);

    }
    
    // Tracking Progress
    
    function initializeProgress(numFiles) {
      progressBar.value = 0
      uploadProgress = []

      for(let i = numFiles; i > 0; i--) {
      uploadProgress.push(0)
      }
    }

    function updateProgress(fileNumber, percent) {
      uploadProgress[fileNumber] = percent
      let total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length
      console.debug('update', fileNumber, percent, total)
      progressBar.value = total
    }

  }

  //When file selected, post it to server
  const onChangeHandler = event => {
    sendData(event.target.files[0]);
  }

  const getStarted = event => {
    // TODO: maybe better to make a third separate page, where only the button is shown
  }

  return (
    <div className="Landing">
      <video autoPlay muted loop id="video">
          <source src={backgroundVideo} type="video/mp4" />
      </video> 
      {/*<input type="file" name="file" accept=".ply"onChange={onChangeHandler}/>*/}

      <Button fullWidth variant="outlined" color="secondary" onClick={btnClicked}> go to 1 </Button>

      {/*<div className="container">
        <div className="center">*/}
          {/*<a  href="#get-started" className="button">GET STARTED</a>*/}
          {/*<form className="my-form">
            <input type="button" name="start" id="get-started" onChange={getStarted}/>
            <label className="button" htmlFor="get-started">GET STARTED</label>
          </form>
        </div>
      </div>*/}

      <div id="drop-area">
        <Button color="secondary" onClick={dragAndDropArea}> activate </Button>
        <form className="my-form">
          <br /><br /><p>Upload a 3D object ( one ply file )<br />with the file dialog or<br />by dragging and dropping onto the dashed region</p>
          <br /><input type="file" name="file" id="fileElem" accept=".ply,.obj" onChange={onChangeHandler}/>
          <label className="button" htmlFor="fileElem">Select a file</label>
          <br /><br /><progress id="progress-bar" max="100" value="0"></progress>
        </form>
      </div>

      <div className="container">
        <div className="center">
          <h3 className="set-parameters">Parameters</h3>
        </div>
      </div>

      {/* TODO: The three parameters should be also send! */}
      <div className="container">
        <div className="center set-parameters">
          Amount of by blender generated images:&nbsp;
          <input className="form-control" type="number"/>&nbsp;
          <span className="btn btn-secondary tooltip" data-bs-toggle="tooltip" data-bs-placement="right" title="Put information here..">Info</span>
        </div>
      </div>
      <div className="container">
        <div className="center set-parameters">
          Amount of real images:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input className="form-control" type="number"/>&nbsp;
          <span className="btn btn-secondary tooltip" data-bs-toggle="tooltip" data-bs-placement="right" title="Put information here..">Info</span>
        </div>
      </div>
      <div className="container">
        <div className="center set-parameters">
          "Training data / test data" - relation:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input className="form-control" type="text"/>&nbsp;
          <span className="btn btn-secondary tooltip" data-bs-toggle="tooltip" data-bs-placement="right" title="Put information here..">Info</span>
        </div>
      </div>

    </div>
  );
}

export default Landing;
  