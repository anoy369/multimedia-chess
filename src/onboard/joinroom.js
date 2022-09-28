import React from 'react'
import JoinGame from './joingame'
import "./joinroom.css"
import ChessGame from '../chess/ui/chessgame'


/**
 * joinroom is where we create the game room.
 */

class JoinRoom extends React.Component {
    state = {
        didGetUserName: false,
        inputText: ""
    }

    constructor(props) {
        super(props);
        this.textArea = React.createRef();
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
    
        return (<React.Fragment>
            {
                this.state.didGetUserName ? 
                <React.Fragment>
                    <JoinGame userName = {this.state.inputText} isCreator = {false}/>
                    <ChessGame myUserName = {this.state.inputText}/>
                </React.Fragment>
            :
               <div>
                    <div className='joinroomContainer'>
                    <div className='joinroomTitle'>
                        <h2>Multiplayer Chess</h2>
                    </div>
                        <div className='joinUser'>
                            <h3>Enter You name to start the game</h3>
                            <input ref = {this.textArea}
                                onInput = {this.typingUserName}></input>
                                
                            <button disabled = {!(this.state.inputText.length > 0)} 
                                onClick = {() => {
                                    // When the 'Submit' button gets pressed from the username screen,
                                    // We should send a request to the server to create a new room with
                                    // the uuid we generate here.
                                    this.setState({
                                        didGetUserName: true
                                    })
                                }}>Join game</button>
                        </div>
                    </div>
                </div>
            }
            </React.Fragment>)
    }
}

export default JoinRoom