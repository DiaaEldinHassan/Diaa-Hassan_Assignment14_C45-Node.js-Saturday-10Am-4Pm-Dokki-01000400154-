import { decrypt, encryption, errorThrow } from "../Common/index.js";
import { usersModel, messagesModel } from "./index.js";
import mongoose from "mongoose";


export async function find(model = usersModel, filter = {}, select = {}) {
  if (model === messagesModel) {
    const encryptedMessages = await messagesModel
      .find({ recipientId: filter.recipientId }, select)
      .sort({ createdAt: -1 })
      .lean();
    if (!encryptedMessages || encryptedMessages.length === 0) return [];
    const payloadForDecrypt = encryptedMessages.map((m) => ({
      data: m.content,
      iv: m.iv,
    }));
    const decryptedContents = await decrypt(payloadForDecrypt);
    return encryptedMessages.map((m, i) => ({
      ...m,
      content: decryptedContents[i],
    }));
  }
  return await model.find(filter, select);
}

export async function findOne(model = usersModel, filter = {}, select = {}) {

  return await usersModel.findOne(filter, select);
}


export async function createNewOne(model = usersModel, data = {}) {
  return await model.create(data);
}


export async function findAndUpdate(
  model = usersModel,
  filter = {},
  updateData = {},
  options = {
    new: true,
    runValidators: true,
  },
) {
  return await model.findOneAndUpdate(filter, updateData, options);
}


export async function deleteMany(model = usersModel, filter = {}) {
  return await model.deleteMany(filter);
}


export async function sendMessage(data = {}, model = messagesModel) {
  if (!data.message || typeof data.message !== "string") {
    errorThrow(400, "Message content is required");
  }
  const messageTrimmed = data.message.trim();
  if (!messageTrimmed) {
    errorThrow(400, "Message content cannot be empty");
  }

  const rawReceiver = data.receiver;
  if (!rawReceiver) {
    errorThrow(400, "Recipient is required");
  }
  const recipientId =
    mongoose.Types.ObjectId.isValid(rawReceiver)
      ? new mongoose.Types.ObjectId(rawReceiver)
      : rawReceiver;

  const encryptedData = await encryption(messageTrimmed);
  if (!encryptedData || encryptedData.length === 0) {
    errorThrow(500, "Encryption failed");
  }

  const created = [];
  for (const e of encryptedData) {
    const doc = await model.create({
      content: e.data,
      iv: e.iv,
      recipientId,
    });
    created.push({
      _id: doc._id,
      recipientId: doc.recipientId,
      isRead: doc.isRead,
      createdAt: doc.createdAt,
    });
  }

  return {
    message: "Message sent successfully",
    messages: created,
  };
}