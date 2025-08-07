import React from 'react'
import { Carousel, TestimonialCard } from './retro-testimonial';



const testimonialData = {
	ids: [
		"e60aa346-f6da-11ed-b67e-0242ac120002",
		"e60aa346-f6da-11ed-b67e-0242ac120003",
		"e60aa346-f6da-11ed-b67e-0242ac120004",
		"e60aa346-f6da-11ed-b67e-0242ac120005",
		"e60aa346-f6da-11ed-b67e-0242ac120006",
		"e60aa346-f6da-11ed-b67e-0242ac120007",
		"e60aa346-f6da-11ed-b67e-0242ac120008",
		"e60aa346-f6da-11ed-b67e-0242ac120009",
		"e60aa346-f6da-11ed-b67e-0242ac120010",
	],
	details: {
		"e60aa346-f6da-11ed-b67e-0242ac120002": {
			id: "e60aa346-f6da-11ed-b67e-0242ac120002",
			description:
				"I'm in love with my new kurta set from CCHHAAP! The fabric is so comfortable and the embroidery is exquisite. Perfect fit and arrived 2 days earlier than expected. Will definitely shop again!",
			profileImage:
				"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
			name: "Priya Sharma",
			designation: "Happy Customer",
		},
		"e60aa346-f6da-11ed-b67e-0242ac120003": {
			id: "e60aa346-f6da-11ed-b67e-0242ac120003",
			description:
				"CCHHAAP never disappoints! The latest kurta set I bought is perfect for festive occasions. The colors are vibrant and the stitching is flawless. Their size guide was accurate too.",
			profileImage:
				"https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
			name: "Ananya Patel",
			designation: "Loyal Customer",
		},
		"e60aa346-f6da-11ed-b67e-0242ac120004": {
			id: "e60aa346-f6da-11ed-b67e-0242ac120004",
			description:
				"Excellent shopping experience! The website is easy to navigate with clear product images. My kurta set came beautifully packaged and the quality exceeded my expectations for the price.",
			profileImage:
				"https://images.unsplash.com/photo-1544005313-94ddf0286df2",
			name: "Neha Gupta",
			designation: "First-time Buyer",
		},
		"e60aa346-f6da-11ed-b67e-0242ac120005": {
			id: "e60aa346-f6da-11ed-b67e-0242ac120005",
			description:
				"Good product but delivery took longer than promised. The kurta is lovely but the dupatta was slightly different from the picture. Customer service was helpful in resolving my concern.",
			profileImage:
				"https://images.unsplash.com/photo-1554151228-14d9def656e4",
			name: "Riya Joshi",
			designation: "Customer",
		},
		"e60aa346-f6da-11ed-b67e-0242ac120006": {
			id: "e60aa346-f6da-11ed-b67e-0242ac120006",
			description:
				"Absolutely stunning collection! Bought three kurta sets for a family wedding and we all received countless compliments. The fabric drapes beautifully and the colors don't fade after washing.",
			profileImage:
				"https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
			name: "Ayesha Khan",
			designation: "Satisfied Customer",
		},
		"e60aa346-f6da-11ed-b67e-0242ac120007": {
			id: "e60aa346-f6da-11ed-b67e-0242ac120007",
			description:
				"Great value for money! The kurta set I received is perfect for daily wear - comfortable yet stylish. The only improvement would be adding more size options for petite frames.",
			profileImage:
				"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
			name: "Divya Nair",
			designation: "Regular Shopper",
		},
		"e60aa346-f6da-11ed-b67e-0242ac120008": {
			id: "e60aa346-f6da-11ed-b67e-0242ac120008",
			description:
				"Perfect for summer! The lightweight fabric and breezy design of my new kurta set makes it ideal for hot weather. Washed it twice already and the color hasn't faded one bit.",
			profileImage:
				"https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5",
			name: "Meera Desai",
			designation: "Happy Customer",
		},
		"e60aa346-f6da-11ed-b67e-0242ac120009": {
			id: "e60aa346-f6da-11ed-b67e-0242ac120009",
			description:
				"Beautiful traditional designs with modern cuts! I especially appreciate how CCHHAAP offers complete sets with matching bottoms. Saves me the hassle of finding coordinating pieces.",
			profileImage:
				"https://images.unsplash.com/photo-1528892952291-009c663ce843",
			name: "Kavita Reddy",
			designation: "Fashion Enthusiast",
		},
		"e60aa346-f6da-11ed-b67e-0242ac120010": {
			id: "e60aa346-f6da-11ed-b67e-0242ac120010",
			description:
				"Minor issue with stitching on one kurta, but customer service was prompt in offering a replacement. Overall happy with the quality and will order again. Love their festive collection!",
			profileImage:
				"https://images.unsplash.com/photo-1545167622-3a6ac756afa4",
			name: "Shreya Malhotra",
			designation: "Customer",
		},
	},
};

const cards = testimonialData.ids.map((cardId, index) => {
	const details = testimonialData.details 
	return (
		<TestimonialCard
			key={cardId}
			testimonial={details[cardId]}
			index={index}
			backgroundImage="https://images.unsplash.com/photo-1528458965990-428de4b1cb0d?q=80&w=3129&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
		/>
	);
});



const Testimonial = () => {
  return (
    <div>
        <div className="">
			
			<section className="py-12 ">
                <div className='flex flex-col justify-center items-center'>
                    <h1 className='text-4xl'>छाप And ME</h1>
                </div>
				<div className="max-w-[90vw] mx-auto  text-c1">
					<Carousel items={cards} />
				</div>
			</section>

			
		</div>
    </div>
  )
}

export default Testimonial
