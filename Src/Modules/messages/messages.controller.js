import Router from "express";
import { authorization, role, success, validation } from "../../index.js";
import { getMessages, sendNewMessage } from "./messages.service.js";
import { messagesSchema } from "./messages.validation.js";

export const router= Router({ mergeParams: true , strict: true, caseSensitive: true });

router.get("/myMessages", authorization([role.Admin, role.User]), async (req, res, next) => {
    try {
        const result = await getMessages(req.user);
        success(res, result.status ?? 200, result);
    } catch (error) {
        next(error);
    }
});

router.post("/sendMessage/:id", validation(messagesSchema), async (req, res, next) => {
    try {
        const result = await sendNewMessage(req.body.message, req.params.id);
        success(res, result.status ?? 201, result);
    } catch (error) {
        next(error);
    }
});