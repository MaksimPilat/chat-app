import React from 'react'

export const Message = ({ userName, text, own }) => {

  return (
    <div className={`${own ? "ml-6" : "mr-6"} flex justify-center`}>
        <div
            className={`${own
            ? "ml-auto bg-sky-500"
            : " mr-auto bg-indigo-600"
            } text-white text-left mx-3 inline-block p-2 rounded-md mt-1`}
        >
            {!own ? <div className={`${userName === "admin" ? "text-pink-400" : "text-sky-300"} text-sm font-bold`}>
                {userName}
            </div> : null}

            <pre className="leading-5">{text}</pre>
        </div>
    </div>
  )
}
