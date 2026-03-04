import {
  messagesModel,
  errorThrow,
  successThrow,
  sendMessage,
  decrypt,
} from "../../index.js";
import mongoose from "mongoose";


export async function getMessages(user) {
  try {
    if (!user || (user instanceof Object && Object.keys(user).length === 0)) {
      errorThrow(401, "User identifier missing");
    }


    const rawId = user.id ?? user._id;
    if (rawId === undefined || rawId === null) {
      errorThrow(401, "User identifier missing");
    }
    const idStr = typeof rawId === "string" ? rawId : String(rawId);
    if (!mongoose.Types.ObjectId.isValid(idStr)) {
      errorThrow(400, "Invalid user identifier");
    }
    const recipientId = new mongoose.Types.ObjectId(idStr);


    const encryptedMessages = await messagesModel
      .find({ recipientId })
      .sort({ createdAt: -1 })
      .lean();

    if (!encryptedMessages || encryptedMessages.length === 0) {
      return successThrow(200, {
        message: "No messages found for your account",
        messages: [],
      });
    }


    const toDecrypt = encryptedMessages.map((doc) => ({
      data: doc.content,
      iv: doc.iv,
    }));

    let decryptedStrings;
    try {
      decryptedStrings = decrypt(toDecrypt);
    } catch (decErr) {
      console.error("getMessages decrypt error:", decErr);
      errorThrow(500, "Failed to decrypt messages.");
    }

    if (!Array.isArray(decryptedStrings) || decryptedStrings.length !== encryptedMessages.length) {
      errorThrow(500, "Decryption produced invalid result.");
    }

  
    const messages = encryptedMessages.map((doc, i) => ({
      _id: doc._id,
      recipientId: doc.recipientId,
      content: decryptedStrings[i],
      isRead: doc.isRead,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));

    return successThrow(200, { messages });
  } catch (err) {
    if (err.status) throw err;
    console.error("getMessages error:", err);
    errorThrow(500, "An unexpected error occurred while fetching messages.");
  }
}

export async function sendNewMessage(data, recipientId) {
  try {
    if (data === undefined || data === null) {
      errorThrow(400, "Message content is required");
    }
    const messageContent = typeof data === "string" ? data : String(data);

    if (!recipientId) {
      errorThrow(400, "Recipient id is required");
    }
    const receiver =
      mongoose.Types.ObjectId.isValid(recipientId)
        ? new mongoose.Types.ObjectId(recipientId)
        : recipientId;

    const payload = { message: messageContent, receiver };
    const result = await sendMessage(payload);
    return successThrow(201, result);
  } catch (err) {
    if (err.status) throw err;
    console.error("sendNewMessage error:", err);
    errorThrow(err.status || 500, err.message || "Failed to send message");
  }
}
