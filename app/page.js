"use client"

import { useEffect, useRef, useState } from "react"

export default function app() {

  // message = input tag ; mArray = list of all messages
  const [message, setMessage] = useState('');
  const [mArray, setMArray] = useState([])

  useEffect(() => {
    if(!localStorage.getItem('identifier')) {
      const identifier = Math.random().toString(16).slice(2);
      localStorage.setItem('identifier', identifier);
    }

    // Check changes in DB
    const interval = setInterval(() => {
      fetchMessages().then(msg => {
        if(mArray.length != msg.length) {
          setMArray(msg)
        }
      })
    }, 100)

    return () => {clearInterval(interval)}
  },[mArray])

  // Fetch DB
  function fetchMessages() {
    return fetch('http://[IP]:3200/messages')
      .then(response => response.json())
  }

  // Upload to DB
  async function uploadMessages(msg) {
    await fetch('http://[IP]:3200/uploadMessage', {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({messageID: 0, userID: localStorage.getItem('identifier'), message: msg})
    })
    .then((result) => result.json())
  }

  return (
    <>
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="h-[60%] w-[50%] bg-white drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)] rounded-md">
        <div className="my-[3%] overflow-y-auto h-[80%] w-[100%]" id="mainTextField">
          {mArray.map((i, l) => {
            return (
                <div className="flex mx-[15%] my-[1%] gap-[1%]">
                  <h1 className={i.userID == localStorage.getItem('identifier') ? "text-green-600 text-left font-serif" : "text-blue-600 text-right font-serif"}>{i.userID == localStorage.getItem('identifier') ? `MAIN_USER: ` : `ALT_USER: `}</h1>
                  <h1 className={i.userID == localStorage.getItem('identifier') ? "text-left font-sans max-w-[100%] break-all" : "text-left font-sans max-w-[100%] break-all"}>{`${i.message}`}</h1>
                </div>
            )
          })}
        </div>
        <div className="fixed bottom-0 w-[100%] my-[2%] flex justify-center items-center">
          <input className="border-2 border-black w-[60%] mx-[1%] rounded-md" type="text" value={message} onKeyDown={ev => {
            if(ev.key == 'Enter') {
              uploadMessages(message);
              setMessage("");
              setTimeout(() =>{
                document.getElementById("mainTextField").scrollTop = document.getElementById("mainTextField").scrollHeight
              }, 150)
            }
          }} onChange={ev => {setMessage(ev.target.value)}}></input>
          <button className="border-2 border-black w-[10%] rounded-md hover:bg-black hover:text-white" onClick={() => {uploadMessages(message); setMessage(""); setTimeout(() =>{document.getElementById("mainTextField").scrollTop = document.getElementById("mainTextField").scrollHeight}, 150)}}>Send</button>
        </div>
      </div>
    </div>
    </>
  )
}
