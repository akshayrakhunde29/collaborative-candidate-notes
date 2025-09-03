const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const Candidate = require('../models/Candidate');

const socketHandler = (io) => {
  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return next(new Error('Authentication error'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.name} connected: ${socket.id}`);
    
    // Join user to their personal room for notifications
    socket.join(`user_${socket.userId}`);

    // Join candidate room
    socket.on('join_candidate_room', (candidateId) => {
      socket.join(`candidate_${candidateId}`);
      console.log(`User ${socket.user.name} joined candidate room: ${candidateId}`);
    });

    // Leave candidate room
    socket.on('leave_candidate_room', (candidateId) => {
      socket.leave(`candidate_${candidateId}`);
      console.log(`User ${socket.user.name} left candidate room: ${candidateId}`);
    });

    // Handle sending messages
    socket.on('send_message', async (data) => {
      try {
        const { candidateId, content, taggedUsers = [] } = data;

        // Verify candidate exists
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
          socket.emit('error', { message: 'Candidate not found' });
          return;
        }

        // Create message
        const message = new Message({
          candidateId,
          userId: socket.userId,
          content: content.trim(),
          taggedUsers
        });

        await message.save();
        await message.populate([
          { path: 'userId', select: 'name email' },
          { path: 'taggedUsers', select: 'name email' }
        ]);

        // Broadcast message to all users in the candidate room
        io.to(`candidate_${candidateId}`).emit('message_received', message);

        // Create notifications for tagged users
        for (const taggedUserId of taggedUsers) {
          // Don't notify the sender
          if (taggedUserId !== socket.userId) {
            const notification = new Notification({
              userId: taggedUserId,
              messageId: message._id,
              candidateId
            });
            
            await notification.save();
            await notification.populate([
              {
                path: 'messageId',
                populate: {
                  path: 'userId',
                  select: 'name email'
                }
              },
              { path: 'candidateId', select: 'name email' }
            ]);

            // Send real-time notification to tagged user
            io.to(`user_${taggedUserId}`).emit('user_tagged', {
              notification,
              message,
              candidate: candidate
            });

            // Update notification count
            const unreadCount = await Notification.countDocuments({
              userId: taggedUserId,
              isRead: false
            });
            
            io.to(`user_${taggedUserId}`).emit('notification_count_updated', {
              unreadCount
            });
          }
        }

        // Send confirmation to sender
        socket.emit('message_sent', { messageId: message._id });

      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      const { candidateId, isTyping } = data;
      socket.to(`candidate_${candidateId}`).emit('user_typing', {
        userId: socket.userId,
        userName: socket.user.name,
        isTyping
      });
    });

    // Handle user going online/offline
    socket.on('user_status', (status) => {
      socket.broadcast.emit('user_status_changed', {
        userId: socket.userId,
        userName: socket.user.name,
        status
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User ${socket.user.name} disconnected: ${socket.id}`);
      
      // Broadcast user offline status
      socket.broadcast.emit('user_status_changed', {
        userId: socket.userId,
        userName: socket.user.name,
        status: 'offline'
      });
    });
  });
};

module.exports = socketHandler;