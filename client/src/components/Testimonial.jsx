import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Testimonial = () => {
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Delhi",
      comment: "The kurta set I ordered from Chhaapp is absolutely stunning! The fabric quality exceeded my expectations and the fit was perfect. Will definitely shop again!",
      rating: 5
    },
    {
      id: 2,
      name: "Ananya Patel",
      location: "Mumbai",
      comment: "I'm in love with my new suit from Chhaapp! The embroidery work is exquisite and the delivery was faster than promised. Highly recommend!",
      rating: 5
    },
    {
      id: 3,
      name: "Riya Gupta",
      location: "Bangalore",
      comment: "Great collection of ethnic wear at reasonable prices. The customer service helped me choose the right size and I'm very happy with my purchase.",
      rating: 4
    },
    {
      id: 4,
      name: "Neha Kapoor",
      location: "Kolkata",
      comment: "The fabric of my kurta set is so comfortable and breathable. Perfect for summer weddings. The packaging was also very elegant.",
      rating: 5
    },
    {
      id: 5,
      name: "Sanya Malhotra",
      location: "Hyderabad",
      comment: "First time shopping at Chhaapp and I'm impressed! The colors are exactly as shown on the website and the stitching is flawless.",
      rating: 4
    }
  ];

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="py-12 ">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-100 mb-2">What Our Customers Say</h2>
        <p className="text-center text-gray-200 mb-12 max-w-2xl mx-auto">
          Hear from our happy customers about their shopping experience with Chhaapp
        </p>

        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="pb-12"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="bg-c2 p-6 rounded-lg shadow-md h-full flex flex-col">
                <div className="mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-c1 mb-6 flex-grow">"{testimonial.comment}"</p>
                <div className="mt-auto">
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonial;