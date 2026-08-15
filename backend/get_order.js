import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.mongoURL)
  .then(async () => {
    const ReturnRequest = (await import('./models/ReturnRequest.js')).default;
    const r = await ReturnRequest.findOne();
    if(r) {
        console.log("ORDER_ID:", r.orderObjectId.toString());
    } else {
        console.log("NO_RETURN_REQUEST");
    }
    process.exit(0);
  });
