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

  //When file selected, post it to server
  const onChangeHandler = event => {
    const selected3dObj = event.target.files[0];
    setFileSelected(true);

    props.sendOjb3dToParent(selected3dObj);

    var bodyFormData = new FormData();
    bodyFormData.append('name', 'obj');
    bodyFormData.append('obj3d', selected3dObj); 
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

  return (
    <div className="Landing">
      <video autoPlay muted loop id="video">
          <source src={backgroundVideo} type="video/mp4" />
      </video> 
      <input type="file" name="file" accept=".ply,.obj"onChange={onChangeHandler}/>

      <Button fullWidth variant="outlined" color="secondary" onClick={btnClicked}> go to 1 </Button>
    </div>
  );
}

export default Landing;
  