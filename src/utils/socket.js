const socket = require("socket.io");
const { Chat } = require("../models/chat");

const intializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      if (!userId || !targetUserId) return;
      const roomId = [String(userId), String(targetUserId)].sort().join("_");
      console.log(`${firstName || "User"} joined room: ${roomId}`);
      socket.join(roomId);
    });

    socket.on("sendMessage", async ({ firstName, lastName, userId, targetUserId, text }) => {
      if (!text || !userId || !targetUserId) return;

      const roomId = [String(userId), String(targetUserId)].sort().join("_");

      try {
        let chatDoc = await Chat.findOne({
          participants: { $all: [userId, targetUserId] },
        });

        if (!chatDoc) {
          chatDoc = new Chat({
            participants: [userId, targetUserId],
            messages: [],
          });
        }

        chatDoc.messages.push({
          senderId: userId,
          text,
        });

        await chatDoc.save();

        const messageData = {
          firstName,
          lastName: lastName || "",
          text,
          senderId: userId,
          createdAt: new Date(),
        };

        // Emit message to all sockets in room
        io.to(roomId).emit("messageReceived", messageData);

      } catch (err) {
        console.error("Error saving/sending chat message:", err);
      }
    });

    socket.on("disconnect", () => {
      // socket disconnected
    });
  });
};

module.exports = intializeSocket;