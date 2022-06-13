import React, { useState,useRef,useEffect } from "react";
import socketIOFileUpload from 'socketio-file-upload';
import io from "socket.io-client";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { AiOutlineAudio } from "react-icons/ai";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import { host } from "../utils/APIRoutes";
import MicRecorder from 'mic-recorder-to-mp3';

export default function ChatInput({ handleSendMsg,handleSendAudio }) {
  const [msg, setMsg] = useState({message:"",isFile:false});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [audio,setAudio] = useState();
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  //siofu
  const siofu = new socketIOFileUpload(io.connect(host));
  const socketRef = useRef();

  //recorder

  const recorder = new MicRecorder({
    bitRate:128
  });

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if(audio){
      console.log("recorded");
      siofu.submitFiles([audio]);
      setAudio();
    }
    else if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };
  
  const stopRecording = ()=>{
    recorder.stop().getMp3().then(([buffer,blob])=>{
      const file = new File(buffer,"music.mp3",{
        type:blob.type,
        lastModified: Date.now()
      });
      console.log("stopped recording")
      setAudio(file)
    })
  }
  const startRecording = ()=>{
    recorder.start().then(()=>{
      console.log("recording")
    }).catch((e)=>{
      console.log(e);
    })
  }
  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder="type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg.message}
        />
        <button type="submit">
          <IoMdSend />
        </button>
        <button 
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
        >
          <AiOutlineAudio />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: #080420;
  padding: 0 2rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute;
        top: -350px;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
          &-thumb {
            background-color: #9a86f3;
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          background-color: transparent;
          border-color: #9a86f3;
        }
        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;
