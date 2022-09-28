import React from 'react'
import { Redirect } from 'react-router-dom'
import uuid from 'uuid/v4'
import { ColorContext } from '../context/colorcontext' 
import "./onboard.css"
const socket  = require('../connection/socket').socket

/**
 * Onboard is where we create the game room.
 */

class CreateNewGame extends React.Component {
    state = {
        didGetUserName: false,
        inputText: "",
        gameId: ""
    }

    constructor(props) {
        super(props);
        this.textArea = React.createRef();
    }
    
    send = () => {
        /**
         * This method should create a new room in the '/' namespace
         * with a unique identifier. 
         */
        const newGameRoomId = uuid()

        // set the state of this component with the gameId so that we can
        // redirect the user to that URL later. 
        this.setState({
            gameId: newGameRoomId
        })

        // emit an event to the server to create a new room 
        socket.emit('createNewGame', newGameRoomId)
    }

    typingUserName = () => {
        // grab the input text from the field from the DOM 
        const typedText = this.textArea.current.value
        
        // set the state with that text
        this.setState({
            inputText: typedText
        })
    }

    render() {
        // !!! TODO: edit this later once you have bought your own domain. 

        return (<React.Fragment>
            {
                this.state.didGetUserName ? 

                <Redirect to = {"/game/" + this.state.gameId}><button className="btn btn-success" style = {{marginLeft: String((window.innerWidth / 2) - 60) + "px", width: "120px"}}>Start Game</button></Redirect>

            :
               <div className='onboardContainer'>
                    <div className='onboardTitle'>
                        <h2>Multiplayer Chess</h2>
                    </div>
                    <div className='createRoom'>
                        <h3 className='text-white text-center'>Enter your name to start the game</h3>

                        <input ref = {this.textArea}
                            onInput = {this.typingUserName}></input>
                            
                        <button disabled = {!(this.state.inputText.length > 0)} 
                            onClick = {() => {
                                // When the 'Submit' button gets pressed from the username screen,
                                // We should send a request to the server to create a new room with
                                // the uuid we generate here.
                                this.props.didRedirect() 
                                this.props.setUserName(this.state.inputText) 
                                this.setState({
                                    didGetUserName: true
                                })
                                this.send()
                            }}>Create Room</button>
                    </div>
                </div>
            }
            </React.Fragment>)
    }
}

const Onboard = (props) => {
    const color = React.useContext(ColorContext)

    return <CreateNewGame didRedirect = {color.playerDidRedirect} setUserName = {props.setUserName}/>
}


export default Onboard