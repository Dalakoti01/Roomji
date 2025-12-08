"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Loader2,
} from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";
import axios from "axios";
import toast from "react-hot-toast";

export default function EditProfileDialog({ children }) {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [phoneVisible, setPhoneVisible] = useState(
    user?.phoneNumberShow ?? true
  );
  const [whatsappVisible, setWhatsappVisible] = useState(
    user?.whatsappNumberShow ?? true
  );
  const [loading, setLoading] = useState(false);

  // ✅ form state
  const [formData, setFormData] = useState({
    firstName: user?.fullName?.split(" ")[0] || "",
    lastName: user?.fullName?.split(" ")[1] || "",
    address: user?.address || "",
    instagramLink: user?.socialLinks?.instagram || "",
    facebookLink: user?.socialLinks?.facebook || "",
    twitterLink: user?.socialLinks?.twitter || "",
    linkedinLink: user?.socialLinks?.linkedIn || "",
    phoneNumber: user?.phoneNumber || "",
    whatsappNumber: user?.whatsappNumber || "",
  });

  const [coverPhotoPreview, setCoverPhotoPreview] = useState(
    user?.coverPhoto || ""
  );
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(
    user?.profilePhoto || ""
  );

  const coverPhotoRef = useRef(null);
  const profilePhotoRef = useRef(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ image upload handlers
  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePhotoPreview(URL.createObjectURL(file));
  };
  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setCoverPhotoPreview(URL.createObjectURL(file));
  };

  // ✅ form submit handler
  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      const form = new FormData();

      // append text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) form.append(key, value);
      });

      // append images if changed
      if (profilePhotoRef.current?.files[0]) {
        form.append("profilePhoto", profilePhotoRef.current.files[0]);
      }
      if (coverPhotoRef.current?.files[0]) {
        form.append("coverPhoto", coverPhotoRef.current.files[0]);
      }

      // append toggles
      form.append("phoneNumberShow", phoneVisible);
      form.append("whatsappNumberShow", whatsappVisible);

      const res = await axios.post("/api/user/updateProfile", form, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Profile updated successfully");
        dispatch(setUser(res.data.user));
      } else {
        toast.error(res.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating your profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-3xl p-0 overflow-y-auto max-h-[90vh] rounded-2xl">
        {/* Cover Image Section */}
        <div className="relative h-40 w-full">
          <Image
            src={
              coverPhotoPreview ||
              user?.coverPhoto ||
              "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            }
            alt="Cover"
            fill
            className="object-cover rounded-t-2xl"
          />
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-3 right-3 bg-red-500 hover:bg-red-600 text-white text-xs cursor-pointer"
            onClick={() => coverPhotoRef.current.click()}
          >
            Change Cover
          </Button>
          <input
            type="file"
            ref={coverPhotoRef}
            accept="image/*"
            className="hidden"
            onChange={handleCoverPhotoChange}
          />

          {/* Profile Photo */}
          <div className="absolute -bottom-12 left-6">
            <div className="relative w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-md">
              <Image
                src={
                  profilePhotoPreview ||
                  user?.profilePhoto ||
                  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80"
                }
                alt="User"
                fill
                className="object-cover"
              />
              <div
                className="absolute bottom-1 right-1 bg-red-500 p-1 rounded-full cursor-pointer"
                onClick={() => profilePhotoRef.current.click()}
              >
                <Camera size={14} color="white" />
              </div>
            </div>
            <input
              type="file"
              ref={profilePhotoRef}
              accept="image/*"
              className="hidden"
              onChange={handleProfilePhotoChange}
            />
          </div>
        </div>

        {/* Main Form Section */}
        <div className="p-6 mt-12">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold mb-4">
              Edit Profile
            </DialogTitle>
          </DialogHeader>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label>First Name</Label>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Address */}
          <div className="mb-4">
            <Label>Address</Label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {/* Social Media Links */}
          <div className="mb-4">
            <Label>Social Media Links</Label>
            <div className="space-y-3 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center">
                  <Facebook size={16} color="white" />
                </div>
                <Input
                  name="facebookLink"
                  value={formData.facebookLink}
                  onChange={handleChange}
                  placeholder="Facebook profile URL"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center">
                  <Instagram size={16} color="white" />
                </div>
                <Input
                  name="instagramLink"
                  value={formData.instagramLink}
                  onChange={handleChange}
                  placeholder="Instagram profile URL"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center">
                  <Twitter size={16} color="white" />
                </div>
                <Input
                  name="twitterLink"
                  value={formData.twitterLink}
                  onChange={handleChange}
                  placeholder="Twitter profile URL"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center">
                  <Linkedin size={16} color="white" />
                </div>
                <Input
                  name="linkedinLink"
                  value={formData.linkedinLink}
                  onChange={handleChange}
                  placeholder="LinkedIn profile URL"
                />
              </div>
            </div>
          </div>

          {/* Phone & WhatsApp */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="flex items-center justify-between">
                <span>Phone Number</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Show</span>
                  <ToggleSwitch
                    initialState={phoneVisible}
                    onChange={setPhoneVisible}
                  />
                </div>
              </Label>
              <Input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label className="flex items-center justify-between">
                <span>WhatsApp Number</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Show</span>
                  <ToggleSwitch
                    initialState={whatsappVisible}
                    onChange={setWhatsappVisible}
                  />
                </div>
              </Label>
              <Input
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <DialogFooter className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" className="cursor-pointer">
              Cancel
            </Button>
            {loading ? (
              <Button className="bg-red-500 hover:bg-red-600 text-white cursor-pointer">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Saving ...
              </Button>
            ) : (
              <Button
                className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
