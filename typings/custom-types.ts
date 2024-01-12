import { VendorDisplay } from "src/app/models/vendor-display";
import { VendorProfile } from "src/app/services/neat-boutique-api.service";

export type StringOrNull = string | null;

export type VendorProfileOrNull = VendorProfile | null;



export enum ImageFileEventType {
    WRONG_FILE_TYPE_DETECTED,
    IMAGE_LOADING,
    IMAGE_FINISHED_LOADING,
  };