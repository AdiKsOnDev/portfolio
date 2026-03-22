import profileData from "@/data/config/profile.json";
import contactData from "@/data/config/contact.json";
import type { Profile, Contact } from "@/types";

export function getProfile(): Profile {
  return profileData as Profile;
}

export function getContact(): Contact {
  return contactData as Contact;
}
