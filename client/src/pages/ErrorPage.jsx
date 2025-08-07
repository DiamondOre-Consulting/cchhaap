import React from "react";

const TopLeftSvg = () => {
	return (
		<svg
			className="absolute top-0 left-0 -z-[1]"
			width="280"
			height="381"
			viewBox="0 0 280 381"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle
				cx="-45"
				cy="73"
				r="307"
				stroke="#C8C6FC"
				strokeOpacity="0.52"
				strokeWidth="2"
			/>
			<circle cx="258" cy="121" r="22" fill="#5243C2" />
			<circle cx="79.5" cy="350.5" r="16.5" fill="#FFC107" />
		</svg>
	);
};

const TopRightSvg = () => {
	return (
		<svg
			className="absolute top-0 right-0 hidden sm:block -z-[1]"
			width="852"
			height="656"
			viewBox="0 0 852 656"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M292.329 224.493C207.524 138.952 22.4868 147.027 0 -2H854C854 134.174 852.001 436.049 852.001 560.411C594.652 699.364 368.784 560.411 368.784 460.713C368.784 348.161 368.784 301.612 292.329 224.493Z"
				fill="#f1e1a9ff"
			/>
			<circle
				cx="921.143"
				cy="160.345"
				r="339.591"
				transform="rotate(132.903 921.143 160.345)"
				stroke="white"
				strokeOpacity="0.9"
				strokeWidth="2"
			/>
			<circle
				cx="654.164"
				cy="369.644"
				r="24.3279"
				transform="rotate(132.903 654.164 369.644)"
				fill="#5243C2"
			/>
			<circle
				cx="602.642"
				cy="52.2899"
				r="18.2459"
				transform="rotate(132.903 602.642 52.2899)"
				fill="#FFC107"
			/>
		</svg>
	);
};

export const ErrorPage = () => {
	return (
		<section className="ezy__httpcodes1 light py-48 md:py-40   text-white dark:text-white relative overflow-hidden z-[1]">
			<TopLeftSvg />
			{/* <TopRightSvg /> */}

			<div className="container px-4 mx-auto">
				<div className="flex flex-col items-center text-center">
					<h2 className="text-[100px] md:text-[160px] leading-none font-bold mb-6">
						404
					</h2>
					<p className="text-3xl leading-none md:text-5xl opacity-80">
						Page Not Available!
					</p>
				</div>
			</div>
		</section>
	);
};
