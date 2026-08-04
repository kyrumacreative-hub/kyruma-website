import { ProjectBrief } from "../types/brief";

export const websiteBrief: ProjectBrief = {
  id: "website",

  name: "Website Development",

  description:
    "Help us understand your business before we start designing your website.",

  sections: [
    {
      id: "general",

      title: "General Information",

      description:
        "Tell us a little about your business.",

      questions: [
        {
          id: "company_name",
          label: "Company or Brand Name",
          type: "text",
          required: true,
        },

        {
          id: "contact_name",
          label: "Main Contact",
          type: "text",
          required: true,
        },

        {
          id: "email",
          label: "Email",
          type: "email",
          required: true,
        },

        {
          id: "phone",
          label: "Phone",
          type: "tel",
        },

        {
          id: "website",
          label: "Current Website",
          type: "url",
        },
      ],
    },
  ],
};