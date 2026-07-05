import React, { useContext } from 'react'
import "../App.css"
import { MdOutlineUploadFile } from "react-icons/md";
import { RiImageAiLine } from "react-icons/ri";
import { CiChat2 } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { FaArrowUp } from "react-icons/fa";
import { dataContext, prevUser, user } from '../Context/UserContext';
import Chat from './Chat';
import { generateResponse } from '../Gemini';
import { query } from '../Hugging';
function Home() {
      let {genImgUrl,setGenImgUrl,prevFeature, setPrevFeature,showResult,setShowResult,previous, setPrevious,feature, setFeature,startRes, setStartRes,popUp, setPopUp,input, setInput}= useContext(dataContext)
      async function handleSubmit(e){
        e.preventDefault()
        if (!input.trim()) return

        setStartRes(true)
        setPrevFeature(feature)
        setFeature("chat")
        setShowResult("")
        prevUser.data = user.data
        prevUser.mime_type = user.mime_type
        prevUser.imgUrl = user.imgUrl
        prevUser.prompt = input
        setInput("")

        const result = await generateResponse()
        setShowResult(result ?? "Sorry, I couldn't generate a response right now.")

        user.data = null
        user.mime_type = null
        user.imgUrl = null
      }

      function handleImage(e){
        const file = e.target.files[0]
        if (!file) return

        setFeature("upimg")
        const reader = new FileReader()
        reader.onload =(event)=>{
          const base64 = event.target.result.split(",")[1]
          user.data= base64
          user.mime_type = file.type
          user.imgUrl = `data:${user.mime_type};base64,${user.data}`
        }
        reader.readAsDataURL(file)
      }

      async function handleGenerateImg(e) {
        e.preventDefault()
        if (!input.trim()) return

        setStartRes(true)
        setPrevFeature(feature)
        setGenImgUrl("")
        setShowResult("")
        prevUser.prompt = input

        try {
          const result = await query(input)
          if (!result) {
            setShowResult("Sorry, I couldn't generate the image right now. Please try again.")
            setGenImgUrl("")
            return
          }

          if (typeof result === "string") {
            setGenImgUrl(result)
          } else {
            const url = URL.createObjectURL(result)
            setGenImgUrl(url)
          }
        } catch (error) {
          setShowResult("Sorry, I couldn't generate the image right now. Please try again.")
          setGenImgUrl("")
        }

        setInput("")
        setFeature("chat")
      }
  return (
    <div className='home'>
      <nav>
        <div className='logo' onClick={()=>{
          setStartRes(false)
          setFeature("chat")
        }}>
            Smart AI Bot
        </div>
      </nav>
      <input type="file" accept='image/*' id="inputImage" hidden onChange={handleImage} />
      {!startRes ? <div className='hero'>
        <span id='tag'>what can i help with..?</span>
        <div className='cate'>
            <div className="upImg" onClick={()=>{
              document.getElementById("inputImage").click()
            }}>
              <MdOutlineUploadFile /> <span>Upload Image</span>
            </div>
            <div className="genImg" onClick={()=>setFeature("genImg")}>
            <RiImageAiLine /> <span>Generate Image</span>
            </div>
            <div className="chat" onClick={()=>setFeature("chat")}>
            <CiChat2 /> <span>let us chat</span>
            </div>
        </div>
      </div>
: <Chat/>}
      
      <form className='input-box' onSubmit={(e)=>
        {  e.preventDefault()
           if(input.trim()){
            if(feature === "genImg"){
              handleGenerateImg(e)
            }
            else{
                  handleSubmit(e)
            }
           }
        }} >
        <img src={user.imgUrl} alt="Selected preview" id='im'/>  
        {popUp ? <div className="pop-up">
            <div className="select-up" onClick={()=>{
              setPopUp(false)
              setFeature("chat")
              document.getElementById("inputImage").click()
            }}>
                <MdOutlineUploadFile /> <span>Upload Image</span>
            </div>
            <div className="select-gen" onClick={()=>{
               setPopUp(false)
              setFeature("genImg")
            }}>
                 <RiImageAiLine /> <span>Generate Image</span>
            </div>
        </div> : ""}
        <div id='add' onClick={()=>{
            setPopUp(prev=>!prev)
        }}>
          {feature=="genImg" ?<RiImageAiLine /> :<FaPlus /> }
            
        </div>
        <input type="text" placeholder='Ask Something' onChange={(e)=>setInput(e.target.value)}  value={input}/>
        {input ?<button type="submit" id='submit'>
            <FaArrowUp/>
        </button> : "" }
      </form>
    </div>
  )
}

export default Home
