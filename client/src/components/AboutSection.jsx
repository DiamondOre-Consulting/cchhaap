import React from 'react'

const AboutSection = () => {
  return (
    <div className='grid grid-cols-2 bg-[#C6953F]/20'>
      
      <video src="https://videos.pexels.com/video-files/853800/853800-hd_1920_1080_25fps.mp4
      "
      autoPlay 
      />

      <div className='flex  flex-col max-w-md  mx-auto text-center justify-center items-center'>
     <p className='text-[4rem]'>छाप</p>  
     <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maiores iusto perferendis dolores, ad ab, consequatur, et veritatis aut amet dolorem reprehenderit! Fuga delectus saepe cum reiciendis eius, consequuntur enim dolores!</p>
      </div>
    </div>
  )
}

export default AboutSection
