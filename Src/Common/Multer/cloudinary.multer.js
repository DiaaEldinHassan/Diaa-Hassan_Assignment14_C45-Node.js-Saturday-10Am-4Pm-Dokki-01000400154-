import { v2 as cloudinary } from "cloudinary";
import {
  cloud_key,
  cloud_name,
  cloud_secret,
} from "../../../Config/config.service.js";

cloudinary.config({ cloud_name, api_key: cloud_key, api_secret: cloud_secret });

export { cloudinary };
