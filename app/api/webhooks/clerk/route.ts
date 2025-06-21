import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
 
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
 
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }
 
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");
 
  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }
 
  // Get the body
  const payload = await req.json()
  console.log("Webhook payload:", payload);

  const body = JSON.stringify(payload);
 
  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);
 
  let evt: WebhookEvent
 
  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }
 
  const eventType = evt.type;
  console.log("Webhook event type:", eventType);

 
  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, ...attributes } = evt.data;

    const name = [attributes.first_name, attributes.last_name].filter(Boolean).join(' ') || 'New User';
    const email = attributes.email_addresses?.find(e => e.id === attributes.primary_email_address_id)?.email_address || attributes.email_addresses?.[0]?.email_address;

    if (!email) {
        console.error('User has no email address. Cannot create user.');
        return new Response('User has no email address.', { status: 200 });
    }

    try {
        console.log(`Upserting user ${id} with email ${email}`);
        await db.user.upsert({
          where: { clerkId: id as string },
          create: {
            clerkId: id as string,
            email: email,
            name: name,
            image: attributes.image_url,
          },
          update: {
            email: email,
            name: name,
            image: attributes.image_url,
          },
        });
        console.log(`Successfully upserted user ${id}`);
    } catch (dbError) {
        console.error('Database error during user upsert:', dbError);
        return new Response('Error occured during database operation', {
            status: 500
        });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;
    if (id) {
        try {
            console.log(`Deleting user ${id}`);
            await db.user.delete({
                where: { clerkId: id as string },
            });
            console.log(`Successfully deleted user ${id}`);
        } catch (dbError) {
            console.error('Database error during user deletion:', dbError);
            return new Response('Error occured during database operation', {
                status: 500
            });
        }
    }
  }

  return new Response('', { status: 200 })
 
}
