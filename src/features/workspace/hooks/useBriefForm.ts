"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  websiteBriefSchema,
  type WebsiteBriefForm,
} from "../schema/websiteBriefSchema";

export function useBriefForm() {
  return useForm<WebsiteBriefForm>({
    resolver: zodResolver(websiteBriefSchema),
    mode: "onBlur",
    defaultValues: {
      businessName: "",
      contactName: "",
      email: "",
      phone: "",
    },
  });
}