import React from 'react'

const RidePopUp = (props) => {
    return (
        <div className="flex flex-col gap-4 px-3 md:px-6 lg:px-10">
            <h5
                className="p-1 text-center w-[93%] absolute top-0 cursor-pointer"
                onClick={() => {
                    props.setRidePopupPanel(false);
                }}
            >
                <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className="text-2xl font-semibold mb-5 md:text-3xl">New Ride Available!</h3>
            <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4">
                <div className="flex items-center gap-3">
                    <img
                        className="h-12 rounded-full object-cover w-12 md:h-14 md:w-14"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlnjgeUHzhewcHd0QAPJFev0Gz4_18Ba-lkw&s"
                        alt=""
                    />
                    <h2 className="text-lg font-medium md:text-xl">
                        {props.ride?.user.fullname.firstname +
                            " " +
                            props.ride?.user.fullname.lastname}
                    </h2>
                </div>
                <h5 className="text-lg font-semibold md:text-xl">2.2 KM</h5>
            </div>
            <div className="flex flex-col gap-4 mt-5">
                <div className="flex items-center gap-5 p-3 border-b-2">
                    <i className="ri-map-pin-user-fill"></i>
                    <div>
                        <h3 className="text-lg font-medium md:text-xl">Pickup Location</h3>
                        <p className="text-sm text-gray-600 md:text-base">{props.ride?.pickup}</p>
                    </div>
                </div>
                <div className="flex items-center gap-5 p-3 border-b-2">
                    <i className="text-lg ri-map-pin-2-fill"></i>
                    <div>
                        <h3 className="text-lg font-medium md:text-xl">Destination Location</h3>
                        <p className="text-sm text-gray-600 md:text-base">{props.ride?.destination}</p>
                    </div>
                </div>
                <div className="flex items-center gap-5 p-3">
                    <i className="ri-cash-line"></i>
                    <div>
                        <h3 className="text-lg font-medium md:text-xl">₹{props.ride?.fare}</h3>
                        <p className="text-sm text-gray-600 md:text-base">Cash Cash</p>
                    </div>
                </div>
            </div>
            <div className="mt-5 flex justify-between gap-4 sm:mb-5">
                <button
                    onClick={() => {
                        props.setConfirmRidePopupPanel(true);
                        props.confirmRide();
                    }}
                    className="bg-green-600 w-1/2 text-white font-semibold p-2 rounded-lg text-lg md:text-xl"
                >
                    Accept
                </button>
                <button
                    onClick={() => {
                        props.setRidePopupPanel(false);
                    }}
                    className="bg-gray-300 w-1/2 text-gray-700 font-semibold p-2 rounded-lg text-lg md:text-xl"
                >
                    Ignore
                </button>
            </div>
        </div>
    )
}

export default RidePopUp