import React, { useContext } from 'react'
import "../App.css"
import { dataContext ,prevUser} from '../Context/UserContext'
function Chat() {
  let {genImgUrl,setGenImgUrl,prevFeature, setPrevFeature,input,previous, setPrevious,showResult,setShowResult,feature,setFeature} = useContext(dataContext)
  return (
    <div className='chat-page'>
       <div className='user'>
        {prevFeature === "UpImg" ? (
          <>
            <img src={prevUser.imgUrl} alt="" />
            <span>{prevUser.prompt}</span>
          </>
        ) : (
          <span>{prevUser.prompt}</span>
        )}
       </div>
       <div className='ai'>
         {prevFeature === "genImg" ? (
          <>
            {!genImgUrl ? (
              <span>{showResult || "Generating images..."}</span>
            ) : (
              <img src={genImgUrl} alt="Generated result" />
            )}
          </>
        ) : 
         !showResult ? <span>Loading...</span>:<span>{showResult}</span>}
       </div>
    </div>
  )
}

export default Chat
