import React from 'react'
import { CardCarousel } from './card-carousel'


const FeaturedProducts = () => {
   const images = [
  {
    src: "https://shopmulmul.com/cdn/shop/files/1_575180dc-16bf-4eec-aeae-f69c4fcd07fb.jpg?v=1752567814&width=500",
    title: "Handwoven Cotton Saree",
  },
  {
    src: "https://shopmulmul.com/cdn/shop/files/2_338ca38d-fb3b-4621-9d1e-7e802efe5f10.jpg?v=1752567815&width=500",
    title: "Floral Chikankari Saree",
  },
  {
    src: "https://shopmulmul.com/cdn/shop/files/6_89d10c7a-9902-4841-b8ba-75d5a205760b.jpg?v=1752567815&width=500",
    title: "Soft Peach Organza",
  },
  {
    src: "https://shopmulmul.com/cdn/shop/files/1_575180dc-16bf-4eec-aeae-f69c4fcd07fb.jpg?v=1752567814&width=500",
    title: "Ivory Dream Drape",
  },
  {
    src: "https://shopmulmul.com/cdn/shop/files/2_338ca38d-fb3b-4621-9d1e-7e802efe5f10.jpg?v=1752567815&width=500",
    title: "Hand-Embroidered Beauty",
  },
  {
    src: "https://shopmulmul.com/cdn/shop/files/6_89d10c7a-9902-4841-b8ba-75d5a205760b.jpg?v=1752567815&width=500",
    title: "Soft Mulmul Classic",
  },
]


  return (
       <div className="w-full">
      <CardCarousel
        images={images}
        autoplayDelay={1000}
        showPagination={true}
        showNavigation={true}
      />
    </div>
  )
}

export default FeaturedProducts
