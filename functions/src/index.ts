/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as sharp from "sharp";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript
admin.initializeApp();

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("I love white women!");
});

export const optimizeProfileImage = functions.storage
  .object()
  .onFinalize(async (object) => {
    if (object.contentType === "image/webp") {
      return;
    }
    const bucket = admin.storage().bucket(object.bucket);
    const filePath = object.name;
    const file = bucket.file(filePath!);
    logger.info(`file metadata: `, file.metadata);
    logger.info(`file path: `, filePath);
    const [buffer] = await file.download();
    const optimizedBuffer = await sharp(buffer)
      .resize(200, 200, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 90 })
      .toBuffer();
    await file.save(optimizedBuffer, { contentType: "image/webp" });
  });
