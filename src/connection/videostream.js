import React, { useEffect, useState, useRef } from 'react';
import Peer from "simple-peer";
import styled from "styled-components";
import VideoIcon from "../chess/assets/video.svg"
const socket  = require('../connection/socket').socket


const Container = styled.div`
  height: 100%;
  width: 100%;
`;

const Row = styled.div`
  width: 100%;
`;

const Video = styled.video`
  border: 1px solid blue;
`;

function VideoStream(props) {
  /**
   * initial state: both player is neutral and have the option to call each other
   * 
   * player 1 calls player 2: Player 1 should display: 'Calling {player 2 username},' and the 
   *                          'CallPeer' button should disappear for Player 1.
   *                          Player 2 should display '{player 1 username} is calling you' and
   *                          the 'CallPeer' button for Player 2 should also disappear. 
   * 
   * Case 1: player 2 accepts call - the video chat begins and there is no button to end it.
   * 
   * Case 2: player 2 ignores player 1 call - nothing happens. Wait until the connection times out. 
   * 
   */

  const [stream, setStream] = useState();
  const userVideo = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    })

    // socket.on("hey", (data) => {
    //   setReceivingCall(true);
    //   setCaller(data.from);
    //   setCallerSignal(data.signal);
    // })
  }, []);




  let UserVideo;
  if (stream) {
    UserVideo = (
      <Video className='userVideo' playsInline muted ref={userVideo} autoPlay />
    );
  }




  return (<Container>
      <Row>
        {UserVideo}
      </Row>
    </Container>);
}

export default VideoStream;
