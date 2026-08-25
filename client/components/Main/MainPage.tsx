import React from 'react'

interface MainPageProps{
    progress: number
}
const MainPage = ({progress}: MainPageProps) => {
  return (
    <div className='h-full w-full'>
      {progress}
    </div>
  )
}

export default MainPage
