import { ProjectBrief } from "../types/brief";

export const websiteBrief: ProjectBrief = {
  id: "website",

  name: "Website Discovery Framework™",

  description:
    "Este cuestionario nos permitirá comprender tu negocio antes de diseñar cualquier solución digital.",

  sections: [

    // =====================================================
    // 01 · PROYECTO
    // =====================================================

    {
      id: "project",

      title: "Proyecto",

      description:
        "Comencemos entendiendo el tipo de proyecto.",

      questions: [

        {
          id: "project_type",

          label: "¿Qué vamos a desarrollar?",

          type: "radio",

          required: true,

          options: [
            { label: "Web Corporativa", value: "corporate" },
            { label: "Landing Page", value: "landing" },
            { label: "Ecommerce", value: "ecommerce" },
            { label: "Portal Privado", value: "portal" },
            { label: "SaaS", value: "saas" },
            { label: "Otro", value: "other" }
          ]
        },

        {
          id: "business_type",

          label: "¿Qué tipo de organización eres?",

          type: "radio",

          required: true,

          options: [
            { label: "Empresa", value: "company" },
            { label: "Marca Personal", value: "personal" },
            { label: "Clínica", value: "clinic" },
            { label: "Restaurante", value: "restaurant" },
            { label: "Hotel", value: "hotel" },
            { label: "Asociación", value: "association" },
            { label: "Startup", value: "startup" },
            { label: "Otro", value: "other" }
          ]
        }

      ]
    },

    // =====================================================
    // 02 · INFORMACIÓN GENERAL
    // =====================================================

    {
      id: "general",

      title: "Información General",

      description:
        "Háblanos sobre tu empresa.",

      questions: [

        {
          id: "company_name",

          label: "Nombre de la empresa",

          type: "text",

          required: true,
        },

        {
          id: "commercial_name",

          label: "Nombre comercial",

          type: "text",
        },

        {
          id: "contact_name",

          label: "Persona de contacto",

          type: "text",

          required: true,
        },

        {
          id: "position",

          label: "Cargo",

          type: "text",
        },

        {
          id: "email",

          label: "Correo electrónico",

          type: "email",

          required: true,
        },

        {
          id: "phone",

          label: "Teléfono",

          type: "tel",
        },

        {
          id: "city",

          label: "Ciudad",

          type: "text",
        },

        {
          id: "country",

          label: "País",

          type: "text",
        }

      ]
    },

    // =====================================================
    // 03 · NEGOCIO
    // =====================================================

    {
      id: "business",

      title: "El Negocio",

      description:
        "Queremos entender realmente cómo funciona tu negocio.",

      questions: [

        {
          id: "business_description",

          label:
            "Explícanos tu negocio como si hablases con alguien que nunca ha oído hablar de él.",

          type: "textarea",

          required: true,
        },

        {
          id: "problem",

          label:
            "¿Qué problema solucionáis?",

          type: "textarea",
        },

        {
          id: "services",

          label:
            "¿Qué productos o servicios ofrecéis?",

          type: "textarea",
        },

        {
          id: "difference",

          label:
            "¿Qué os hace diferentes de vuestra competencia?",

          type: "textarea",
        },

        {
          id: "why_choose",

          label:
            "¿Por qué debería elegirte un cliente?",

          type: "textarea",
        }

      ]
    },

    // =====================================================
    // 04 · CLIENTE IDEAL
    // =====================================================

    {
      id: "ideal_client",

      title: "Cliente Ideal",

      description:
        "Queremos comprender perfectamente a quién nos dirigimos.",

      questions: [

        {
          id: "ideal_customer",

          label:
            "Describe a tu cliente ideal.",

          type: "textarea",

          required: true,
        },

        {
          id: "customer_problem",

          label:
            "¿Qué problema tiene esa persona antes de llegar a ti?",

          type: "textarea",
        },

        {
          id: "customer_goal",

          label:
            "¿Qué quiere conseguir realmente?",

          type: "textarea",
        },

        {
          id: "customer_fears",

          label:
            "¿Qué miedos o dudas suele tener antes de contratar?",

          type: "textarea",
        },

        {
          id: "customer_questions",

          label:
            "¿Qué preguntas suele hacer antes de decidirse?",

          type: "textarea",
        },

        {
          id: "buying_reason",

          label:
            "¿Qué hace finalmente que compre?",

          type: "textarea",
        },

        {
          id: "customer_objections",

          label:
            "¿Cuáles son las objeciones más habituales?",

          type: "textarea",
        },

        {
          id: "geographic_area",

          label:
            "¿Dónde se encuentran tus clientes?",

          type: "text",
        },

        {
          id: "languages",

          label:
            "¿En qué idiomas quieres comunicarte?",

          type: "text",
        }

      ]
    },

    // =====================================================
    // 05 · OBJETIVOS
    // =====================================================

    {
      id: "goals",

      title: "Objetivos",

      description:
        "Queremos entender qué debe conseguir realmente este proyecto.",

      questions: [

        {
          id: "main_goal",

          label:
            "¿Cuál es el objetivo principal del proyecto?",

          type: "textarea",

          required: true,
        },

        {
          id: "secondary_goals",

          label:
            "¿Qué otros objetivos te gustaría conseguir?",

          type: "textarea",
        },

        {
          id: "conversion",

          label:
            "¿Qué acción quieres que haga el usuario al entrar en la web?",

          type: "textarea",
        },

        {
          id: "success",

          label:
            "¿Cómo sabrás que el proyecto ha sido un éxito?",

          type: "textarea",
        },

        {
          id: "current_problem",

          label:
            "¿Qué problema esperas solucionar con esta web?",

          type: "textarea",
        }

      ]
    },

    // =====================================================
    // 06 · MARCA
    // =====================================================

    {
      id: "brand",

      title: "Marca",

      description:
        "Queremos entender cómo debe percibirse tu marca.",

      questions: [

        {
          id: "brand_story",

          label:
            "Cuéntanos la historia de tu empresa.",

          type: "textarea",
        },

        {
          id: "brand_values",

          label:
            "¿Cuáles son los valores de vuestra marca?",

          type: "textarea",
        },

        {
          id: "brand_personality",

          label:
            "Si tu marca fuese una persona, ¿cómo sería?",

          type: "textarea",
        },

        {
          id: "brand_tone",

          label:
            "¿Qué tono debe transmitir vuestra comunicación?",

          type: "radio",

          options: [
            { label: "Profesional", value: "professional" },
            { label: "Cercano", value: "friendly" },
            { label: "Premium", value: "premium" },
            { label: "Elegante", value: "elegant" },
            { label: "Divertido", value: "fun" },
            { label: "Técnico", value: "technical" }
          ]
        },

        {
          id: "brand_keywords",

          label:
            "Escribe entre 5 y 10 palabras que definan vuestra marca.",

          type: "textarea",
        },

        {
          id: "brand_colors",

          label:
            "¿Tenéis colores corporativos?",

          type: "text",
        },

        {
          id: "brand_fonts",

          label:
            "¿Existe una tipografía corporativa?",

          type: "text",
        },

        {
          id: "brand_logo",

          label:
            "¿Disponéis del logotipo en formato vectorial?",

          type: "radio",

          options: [
            { label: "Sí", value: "yes" },
            { label: "No", value: "no" },
            { label: "No lo sé", value: "unknown" }
          ]
        }

      ]
    },

    // =====================================================
    // 07 · COMPETENCIA
    // =====================================================

    {
      id: "competition",

      title: "Competencia",

      description:
        "Analizar a vuestra competencia nos ayuda a diferenciarnos.",

      questions: [

        {
          id: "main_competitors",

          label:
            "¿Quiénes son vuestros principales competidores?",

          type: "textarea",
        },

        {
          id: "admired_websites",

          label:
            "¿Qué páginas web os gustan? ¿Por qué?",

          type: "textarea",
        },

        {
          id: "avoid_copy",

          label:
            "¿Qué cosas NO queréis copiar de vuestra competencia?",

          type: "textarea",
        },

        {
          id: "competitive_advantage",

          label:
            "¿En qué sois claramente mejores?",

          type: "textarea",
        },

        {
          id: "market_position",

          label:
            "¿Cómo queréis ser percibidos dentro del mercado?",

          type: "textarea",
        }

      ]
    },

    // =====================================================
    // 08 · CONTENIDO
    // =====================================================

    {
      id: "content",

      title: "Contenido",

      description:
        "Necesitamos conocer la información que aparecerá en la web.",

      questions: [

        {
          id: "main_services",

          label:
            "¿Cuáles son vuestros principales productos o servicios?",

          type: "textarea",

          required: true,
        },

        {
          id: "secondary_services",

          label:
            "¿Hay otros servicios que también deban aparecer?",

          type: "textarea",
        },

        {
          id: "hero_message",

          label:
            "¿Qué mensaje principal quieres que vea un usuario en los primeros 5 segundos?",

          type: "textarea",
        },

        {
          id: "frequent_questions",

          label:
            "¿Qué preguntas os hacen constantemente los clientes?",

          type: "textarea",
        },

        {
          id: "social_proof",

          label:
            "¿Disponéis de testimonios, casos de éxito o reseñas?",

          type: "textarea",
        },

        {
          id: "certifications",

          label:
            "¿Tenéis premios, certificaciones o reconocimientos?",

          type: "textarea",
        },

        {
          id: "media",

          label:
            "¿Disponéis de fotografías profesionales o vídeos?",

          type: "radio",

          options: [
            { label: "Sí", value: "yes" },
            { label: "No", value: "no" },
            { label: "Parcialmente", value: "partial" }
          ]
        }

      ]
    },

    // =====================================================
    // 09 · ARQUITECTURA WEB
    // =====================================================

    {
      id: "website",

      title: "Arquitectura Web",

      description:
        "Definiremos la estructura del proyecto.",

      questions: [

        {
          id: "required_pages",

          label:
            "¿Qué páginas quieres incluir?",

          type: "textarea",
        },

        {
          id: "blog",

          label:
            "¿Necesitarás un blog?",

          type: "radio",

          options: [
            { label: "Sí", value: "yes" },
            { label: "No", value: "no" }
          ]
        },

        {
          id: "languages_web",

          label:
            "¿La web será multidioma?",

          type: "radio",

          options: [
            { label: "No", value: "no" },
            { label: "Sí, dos idiomas", value: "2" },
            { label: "Sí, más de dos", value: "3+" }
          ]
        },

        {
          id: "online_booking",

          label:
            "¿Necesitas reservas online?",

          type: "radio",

          options: [
            { label: "Sí", value: "yes" },
            { label: "No", value: "no" }
          ]
        },

        {
          id: "online_payment",

          label:
            "¿La web tendrá pagos online?",

          type: "radio",

          options: [
            { label: "Sí", value: "yes" },
            { label: "No", value: "no" }
          ]
        },

        {
          id: "private_area",

          label:
            "¿Necesitas un área privada para clientes?",

          type: "radio",

          options: [
            { label: "Sí", value: "yes" },
            { label: "No", value: "no" }
          ]
        }

      ]
    },

    // =====================================================
    // 10 · SEO
    // =====================================================

    {
      id: "seo",

      title: "SEO",

      description:
        "Queremos construir una web preparada para posicionar desde el primer día.",

      questions: [

        {
          id: "seo_keywords",

          label:
            "¿Qué búsquedas debería hacer un cliente para encontrarte?",

          type: "textarea",
        },

        {
          id: "seo_locations",

          label:
            "¿En qué ciudades o zonas quieres posicionarte?",

          type: "textarea",
        },

        {
          id: "existing_domain",

          label:
            "¿Ya dispones de dominio?",

          type: "text",
        },

        {
          id: "google_business",

          label:
            "¿Tienes una ficha de Google Business Profile?",

          type: "radio",

          options: [
            { label: "Sí", value: "yes" },
            { label: "No", value: "no" }
          ]
        },

        {
          id: "seo_competitors",

          label:
            "¿Qué competidores aparecen actualmente en Google?",

          type: "textarea",
        }

      ]
    },

    // =====================================================
    // 11 · INTEGRACIONES
    // =====================================================

    {
      id: "integrations",

      title: "Integraciones",

      description:
        "Necesitamos conocer qué herramientas utiliza actualmente tu empresa.",

      questions: [

        {
          id: "crm",

          label:
            "¿Utilizáis algún CRM?",

          type: "text",
        },

        {
          id: "calendar",

          label:
            "¿Necesitáis integrar Google Calendar o Microsoft 365?",

          type: "radio",

          options: [
            { label: "Sí", value: "yes" },
            { label: "No", value: "no" }
          ]
        },

        {
          id: "email_platform",

          label:
            "¿Qué plataforma utilizáis para el correo electrónico?",

          type: "text",
        },

        {
          id: "payments",

          label:
            "¿Qué método de pago utilizaréis?",

          type: "text",
        },

        {
          id: "other_integrations",

          label:
            "¿Hay alguna otra integración necesaria?",

          type: "textarea",
        }

      ]
    },

    // =====================================================
    // 12 · RECURSOS
    // =====================================================

    {
      id: "resources",

      title: "Recursos",

      description:
        "Por último, necesitamos saber con qué materiales contamos.",

      questions: [

        {
          id: "logo_files",

          label:
            "¿Disponéis del logotipo en formato vectorial (.AI, .SVG, .EPS)?",

          type: "radio",

          options: [
            { label: "Sí", value: "yes" },
            { label: "No", value: "no" }
          ]
        },

        {
          id: "brand_manual",

          label:
            "¿Existe un manual de marca?",

          type: "radio",

          options: [
            { label: "Sí", value: "yes" },
            { label: "No", value: "no" }
          ]
        },

        {
          id: "hosting",

          label:
            "¿Quién gestiona actualmente el hosting?",

          type: "text",
        },

        {
          id: "domain_access",

          label:
            "¿Disponéis de acceso al dominio?",

          type: "radio",

          options: [
            { label: "Sí", value: "yes" },
            { label: "No", value: "no" }
          ]
        },

        {
          id: "additional_notes",

          label:
            "¿Hay algo importante que debamos saber antes de comenzar?",

          type: "textarea",
        }

      ]
    }

  ]
};