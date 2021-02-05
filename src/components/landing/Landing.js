import './Landing.css';
import backgroundVideo from './video.mp4';
import { Button } from '@material-ui/core';

function Landing(props) {

  const btnClicked = () => {
    props.stepChanged(1);
  }

  return (
    <div className="Landing">
      <video autoPlay muted loop id="video">
          <source src={backgroundVideo} type="video/mp4" />
      </video> 
      landing
      <Button fullWidth variant="outlined" color="secondary" onClick={btnClicked}> go to 1 </Button>
    </div>
  );
}

export default Landing;
  