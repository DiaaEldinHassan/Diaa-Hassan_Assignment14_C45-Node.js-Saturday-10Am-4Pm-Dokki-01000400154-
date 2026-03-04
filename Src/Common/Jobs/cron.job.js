import { usersModel } from "../../index.js";
import cron from "node-cron";

export const cronJob = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;
      const twentyThreeHours = 23 * oneHour;
      const twentyFourHours = 24 * oneHour;

      const warningThreshold = new Date(now - twentyThreeHours);
      const deleteThreshold = new Date(now - twentyFourHours);

      const usersToWarn = await usersModel.find({
        isConfirmed: false,
        warned: { $ne: true },
        createdAt: { $lt: warningThreshold, $gt: deleteThreshold },
      });

      for (const user of usersToWarn) {
        await sendEmail(
          user.email,
          "Action Required: Account Deletion Soon",
          "Your account will be deleted in 1 hour if not confirmed!",
        );

        user.warned = true;
        await user.save();
      }

      const result = await usersModel.deleteMany({
        isConfirmed: false,
        createdAt: { $lt: deleteThreshold },
      });

      if (result.deletedCount > 0) {
        console.log(`[Cron] Deleted ${result.deletedCount} unconfirmed users.`);
      }
    } catch (error) {
      console.error("[Cron Error]:", error);
    }
  });
};
