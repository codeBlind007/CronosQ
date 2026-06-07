import {prisma} from "../../utils/prisma";
import { Request, Response } from "express";
import {Webhook} from "svix";

export const clerkWebhookHandler = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("Webhook received");
    
    const WEBHOOK_SECRET =
      process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      throw new Error(
        "Missing CLERK_WEBHOOK_SECRET"
      );
    }

    const headers = req.headers;

    const svix_id = headers["svix-id"] as string;
    const svix_timestamp =
      headers["svix-timestamp"] as string;

    const svix_signature =
      headers["svix-signature"] as string;

    if (
      !svix_id ||
      !svix_timestamp ||
      !svix_signature
    ) {
      return res
        .status(400)
        .json({ error: "Missing svix headers" });
    }

    const payload = req.body;

    const body = payload.toString();

    const wh = new Webhook(WEBHOOK_SECRET);

    const evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as any;

    const eventType = evt.type;
    console.log(eventType);
    console.log(evt.data);

    if (eventType === "user.created") {
      const {
        id,
        email_addresses,
        first_name,
        last_name,
        image_url,
      } = evt.data;

      await prisma.user.create({
        data: {
          clerkId: id,
          email: email_addresses[0]?.email_address,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        },
      });
    }


    if (eventType === "user.updated") {
      const {
        id,
        email_addresses,
        first_name,
        last_name,
        image_url,
      } = evt.data;

      await prisma.user.update({
        where: {
          clerkId: id,
        },

        data: {
          email: email_addresses[0]?.email_address,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        },
      });
    }


    if (eventType === "user.deleted") {
      const { id } = evt.data;

      await prisma.user.delete({
        where: {
          clerkId: id,
        },
      });
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Webhook error",
    });
  }
};