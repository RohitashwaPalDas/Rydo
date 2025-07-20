import { Server } from 'socket.io';
import userModel from './models/userModel.js';
import driverModel from './models/driverModel.js';

let io;

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('join', async (data) => {
      const { userId, userType } = data;

      if (userType === 'user') {
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
      } else if (userType === 'driver') {
        await driverModel.findByIdAndUpdate(userId, { socketId: socket.id });
      }
    });

    socket.on('update-location-driver', async ({ userId, location }) => {
      try {
        if (!userId || !location?.coordinates || !Array.isArray(location.coordinates)) {
          console.log("⚠️ Invalid location data received");
          return;
        }

        const updated = await driverModel.findByIdAndUpdate(userId, {
          location: {
            type: 'Point',
            coordinates: location.coordinates
          },
          socketId: socket.id,
          status: 'active'
        }, { new: true });

        
      } catch (err) {
        console.error(`❌ Failed to update driver location: ${err.message}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

const sendMessageToSocketId = (socketId, messageObject) => {
  console.log(messageObject);

  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log('Socket.io not initialized.');
  }
};

export { initializeSocket, sendMessageToSocketId };
