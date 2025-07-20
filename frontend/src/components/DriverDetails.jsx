import React, { useContext } from 'react'

const DriverDetails = (props) => {
    return (
        <div className=''>
            <div className='flex flex-col gap-6'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <img className='h-10 w-10 rounded-full object-cover md:h-12 md:w-12' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="" />
                        <h4 className='text-xl font-bold capitalize md:text-2xl'>{props.driver.fullname.firstname}</h4>
                    </div>
                    <div>
                        <h4 className='text-xl font-semibold md:text-2xl'>₹{props.driverStats.totalEarnings}</h4>
                        <p className='text-sm text-gray-600 md:text-base'>Earned</p>
                    </div>
                </div>
                <div className='flex p-3 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start md:gap-8'>
                    <div className='text-center'>
                        <i className="text-3xl mb-2 font-thin ri-timer-2-line md:text-4xl"></i>
                        <h5 className='text-lg font-medium md:text-xl'>{props.driverStats.totalTime}</h5>
                        <p className='text-sm text-gray-600 md:text-base'>Hours Online</p>
                    </div>
                    <div className='text-center'>
                        <i className="text-3xl mb-2 font-thin ri-speed-up-line md:text-4xl"></i>
                        <h5 className='text-lg font-medium md:text-xl'>{props.driverStats.totalDistance} KM</h5>
                        <p className='text-sm text-gray-600 md:text-base'>Distance Travelled</p>
                    </div>
                    <div className='text-center'>
                        <i className="text-3xl mb-2 font-thin ri-steering-2-fill md:text-4xl"></i>
                        <h5 className='text-lg font-medium md:text-xl'>{props.driverStats.totalRides}</h5>
                        <p className='text-sm text-gray-600 md:text-base'>Total Rides</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DriverDetails