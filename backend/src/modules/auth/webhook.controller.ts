import { prisma } from "../../utils/prisma";
import { Request, Response } from "express";
import { Webhook } from "svix";

export const clerkWebhookHandler = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("========== Clerk Webhook ==========");

    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET");
    }

    const svix_id = req.headers["svix-id"] as string;
    const svix_timestamp = req.headers["svix-timestamp"] as string;
    const svix_signature = req.headers["svix-signature"] as string;

    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error("Missing Svix headers");
      return res.status(400).json({
        error: "Missing Svix headers",
      });
    }

    console.log("Body is Buffer:", Buffer.isBuffer(req.body));
    console.log("Body type:", typeof req.body);

    const body = Buffer.isBuffer(req.body)
      ? req.body.toString("utf8")
      : JSON.stringify(req.body);

    console.log("Body length:", body.length);

    const wh = new Webhook(WEBHOOK_SECRET);

    console.log("Verifying webhook signature...");

    const evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as any;

    console.log("Webhook verified successfully");
    console.log("Event:", evt.type);

    const { data } = evt;

    switch (evt.type) {
      case "user.created": {
        console.log("Creating user:", data.id);

        await prisma.user.create({
          data: {
            clerkId: data.id,
            email: data.email_addresses?.[0]?.email_address,
            firstName: data.first_name,
            lastName: data.last_name,
            imageUrl: data.image_url,
          },
        });

        console.log("User created successfully");
        break;
      }

      case "user.updated": {
        console.log("Updating user:", data.id);

        await prisma.user.update({
          where: {
            clerkId: data.id,
          },
          data: {
            email: data.email_addresses?.[0]?.email_address,
            firstName: data.first_name,
            lastName: data.last_name,
            imageUrl: data.image_url,
          },
        });

        console.log("User updated successfully");
        break;
      }

      case "user.deleted": {
        console.log("Deleting user:", data.id);

        await prisma.user.delete({
          where: {
            clerkId: data.id,
          },
        });

        console.log("User deleted successfully");
        break;
      }

      default:
        console.log("Unhandled event:", evt.type);
    }

    console.log("========== Webhook Completed ==========");

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("========== WEBHOOK ERROR ==========");

    if (error instanceof Error) {
      console.error("Name:", error.name);
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);

      return res.status(500).json({
        error: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      error: "Unknown webhook error",
    });
  }
};