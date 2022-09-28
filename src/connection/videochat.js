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

function VideoChatApp(props) {
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
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [isCalling, setIsCalling] = useState(false)
  const userVideo = useRef();
  const partnerVideo = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    })

    socket.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    })
  }, []);

  function callPeer(id) {
    setIsCalling(true)
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", data => {
      socket.emit("callUser", { userToCall: id, signalData: data, from: props.mySocketId})
    })

    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.on("callAccepted", signal => {
      setCallAccepted(true);
      peer.signal(signal);
    })

  }

  function acceptCall() {
    setCallAccepted(true);
    setIsCalling(false)
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", data => {
      socket.emit("acceptCall", { signal: data, to: caller })
    })

    peer.on("stream", stream => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  }

  let mainView;

  if (callAccepted) {
    mainView = (
      <Video className='partnerVideo' playsInline ref={partnerVideo} autoPlay />
    );
  } else if (receivingCall) {
    mainView = (
      <div>
        <small className='text-white'>{props.opponentUserName} is calling you</small>
        <button onClick={acceptCall}><h5>Accept</h5></button>
      </div>
    )
  } else if (isCalling) {
    mainView = (
      <div>
        <small className='text-white'>Currently calling {props.opponentUserName}...</small>
      </div>
    )
  } else {
    mainView = (
      <button className='videoCallButton' onClick = {() => {
        callPeer(props.opponentSocketId)
      }}><img src={VideoIcon} /></button>
    )
  }



  return (<Container>
      <Row>
        {mainView}
      </Row>
    </Container>);
}

export default VideoChatApp;
