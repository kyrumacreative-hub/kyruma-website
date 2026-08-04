import { ProjectBrief } from "../types/brief";

export const websiteBrief: ProjectBrief = {
  id: "kyruma-discovery",
  name: "KYRUMA Discovery™",
  description: "Una conversación guiada para comprender vuestro negocio, detectar oportunidades y dar forma a la solución adecuada.",
  sections: [
    {
      id: "starting-point",
      title: "Empecemos por el cambio",
      description: "No buscamos encajaros en una solución prediseñada. Queremos entender qué os gustaría hacer posible.",
      questions: [
        {
          id: "project_type",
          label: "¿Qué te gustaría que fuera diferente dentro de unos meses?",
          type: "radio",
          required: true,
          options: [
            { label: "Atraer oportunidades más adecuadas", value: "attract" },
            { label: "Explicar mejor el valor que aportamos", value: "clarify" },
            { label: "Convertir más interés en conversaciones", value: "convert" },
            { label: "Dar a nuestra marca la presencia que merece", value: "presence" },
            { label: "Hacer una experiencia más sencilla para clientes", value: "simplify" },
            { label: "Explorarlo juntos", value: "explore" },
          ],
        },
        {
          id: "business_type",
          label: "¿En qué momento se encuentra vuestro negocio?",
          type: "radio",
          required: true,
          options: [
            { label: "Estamos empezando una nueva etapa", value: "new-stage" },
            { label: "Queremos crecer con más claridad", value: "growth" },
            { label: "Necesitamos evolucionar lo que ya funciona", value: "evolve" },
            { label: "Estamos reposicionando nuestra propuesta", value: "reposition" },
            { label: "Otro momento importante", value: "other" },
          ],
        },
      ],
    },
    {
      id: "context",
      title: "Conocer vuestra realidad",
      description: "Empezamos por poner nombre a las personas y al contexto que hay detrás del proyecto.",
      questions: [
        { id: "company_name", label: "¿Cómo se llama vuestra empresa o proyecto?", type: "text", required: true },
        { id: "commercial_name", label: "¿Hay algún nombre con el que os conozcan vuestros clientes?", type: "text" },
        { id: "contact_name", label: "¿Con quién estamos conversando?", type: "text", required: true },
        { id: "position", label: "¿Qué papel desempeñas dentro del proyecto?", type: "text" },
        { id: "email", label: "¿A qué correo podemos escribirte?", type: "email", required: true },
        { id: "phone", label: "¿Hay un teléfono al que podamos llamarte si hace falta?", type: "tel" },
        { id: "city", label: "¿Desde dónde trabajáis?", type: "text" },
      ],
    },
    {
      id: "business",
      title: "Vuestro negocio hoy",
      description: "Queremos entender vuestra realidad antes de hablar de soluciones.",
      questions: [
        {
          id: "business_description",
          label: "Cuéntanos qué hacéis como si se lo explicaras a alguien que acaba de conoceros.",
          type: "textarea",
          required: true,
        },
        {
          id: "problem",
          label: "¿Qué situación os gustaría resolver o mejorar ahora mismo?",
          type: "textarea",
          required: true,
        },
        {
          id: "services",
          label: "¿Qué ofrecéis hoy y qué parte de ello tiene más potencial?",
          type: "textarea",
        },
        {
          id: "difference",
          label: "¿Qué hacéis de una manera que no sea fácil de sustituir?",
          type: "textarea",
        },
      ],
    },
    {
      id: "people",
      title: "Las personas a las que importáis",
      description: "Las mejores decisiones empiezan por comprender a quien está al otro lado.",
      questions: [
        {
          id: "ideal_customer",
          label: "¿A quién os gustaría ayudar más? Descríbenos a esa persona o empresa.",
          type: "textarea",
          required: true,
        },
        {
          id: "customer_problem",
          label: "¿Qué está viviendo esa persona antes de llegar a vosotros?",
          type: "textarea",
        },
        {
          id: "customer_goal",
          label: "¿Qué desea conseguir realmente?",
          type: "textarea",
        },
        {
          id: "customer_objections",
          label: "¿Qué dudas suelen frenar una decisión?",
          type: "textarea",
        },
        {
          id: "geographic_area",
          label: "¿Dónde se encuentran las personas a las que queréis llegar?",
          type: "text",
        },
      ],
    },
    {
      id: "opportunity",
      title: "La oportunidad",
      description: "Ahora miramos hacia delante: el cambio que haría que este proyecto merezca la pena.",
      questions: [
        {
          id: "main_goal",
          label: "Si este proyecto tuviera un único impacto importante, ¿cuál sería?",
          type: "textarea",
          required: true,
        },
        {
          id: "secondary_goals",
          label: "¿Qué otras mejoras te gustaría desbloquear?",
          type: "textarea",
        },
        {
          id: "conversion",
          label: "Cuando alguien conecte con vuestra propuesta, ¿qué te gustaría que hiciera después?",
          type: "textarea",
        },
        {
          id: "success",
          label: "¿Qué tendría que pasar para que dentro de seis meses dijerais “ha valido la pena”?",
          type: "textarea",
        },
      ],
    },
    {
      id: "brand",
      title: "Cómo queréis ser recordados",
      description: "La solución debe sentirse coherente con quienes sois, no solo funcionar.",
      questions: [
        { id: "brand_story", label: "¿Qué historia, decisión o convicción hay detrás de vuestra marca?", type: "textarea" },
        { id: "brand_values", label: "¿Qué valores no estáis dispuestos a negociar?", type: "textarea" },
        { id: "brand_personality", label: "Si vuestra marca entrara en una sala, ¿cómo se comportaría?", type: "textarea" },
        {
          id: "brand_tone",
          label: "¿Qué sensación debería dejar cada interacción?",
          type: "radio",
          options: [
            { label: "Confianza y solvencia", value: "confidence" },
            { label: "Cercanía y claridad", value: "closeness" },
            { label: "Ambición y energía", value: "ambition" },
            { label: "Calma y elegancia", value: "elegance" },
            { label: "Atrevimiento y diferencia", value: "difference" },
          ],
        },
      ],
    },
    {
      id: "possibilities",
      title: "Caminos que podemos explorar",
      description: "A partir de lo que nos habéis contado, estas son las experiencias que puede tener sentido diseñar juntos.",
      questions: [
        {
          id: "main_services",
          label: "¿Qué parte de vuestra propuesta debería entenderse y valorarse mejor?",
          type: "textarea",
          required: true,
        },
        {
          id: "required_pages",
          label: "¿Qué resultados te sería más valioso conseguir?",
          type: "checkbox",
          options: [
            { label: "Explicar nuestra propuesta con claridad", value: "clarity" },
            { label: "Generar más conversaciones de calidad", value: "conversations" },
            { label: "Facilitar una decisión o una solicitud", value: "decisions" },
            { label: "Dar confianza antes del primer contacto", value: "trust" },
            { label: "Cuidar mejor la relación con clientes actuales", value: "relationships" },
          ],
        },
        {
          id: "online_booking",
          label: "¿Sería útil que alguien pudiera reservar un momento con vosotros sin esperas?",
          type: "radio",
          options: [
            { label: "Sí, sería muy valioso", value: "yes" },
            { label: "No es una prioridad", value: "no" },
            { label: "Queremos valorarlo", value: "explore" },
          ],
        },
        {
          id: "online_payment",
          label: "¿Hay alguna decisión, compra o gestión que os gustaría hacer más sencilla?",
          type: "textarea",
        },
        {
          id: "private_area",
          label: "¿Necesitáis cuidar la relación con clientes una vez empieza el proyecto?",
          type: "radio",
          options: [
            { label: "Sí, es importante", value: "yes" },
            { label: "No por ahora", value: "no" },
            { label: "Queremos descubrir posibilidades", value: "explore" },
          ],
        },
        {
          id: "other_integrations",
          label: "¿Hay algún momento de vuestro día a día que os gustaría simplificar?",
          type: "textarea",
        },
      ],
    },
    {
      id: "visibility",
      title: "Cómo queréis que os encuentren",
      description: "También necesitamos entender el contexto en el que las personas descubren vuestra propuesta.",
      questions: [
        { id: "seo_keywords", label: "¿Qué diría alguien que necesita vuestra ayuda antes de conocer vuestro nombre?", type: "textarea" },
        { id: "seo_locations", label: "¿En qué lugares o mercados os gustaría crecer?", type: "textarea" },
        { id: "admired_websites", label: "¿Qué experiencias de otras marcas os inspiran y por qué?", type: "textarea" },
        {
          id: "media",
          label: "¿Contáis ya con historias, imágenes o testimonios que merezca la pena poner en valor?",
          type: "radio",
          options: [
            { label: "Sí, tenemos bastante material", value: "yes" },
            { label: "Tenemos parte del material", value: "partial" },
            { label: "Necesitamos construirlo", value: "no" },
          ],
        },
      ],
    },
    {
      id: "next-step",
      title: "Para dar el siguiente paso",
      description: "Con esto tendremos una base excelente para preparar una conversación de propuesta con sentido.",
      questions: [
        { id: "existing_domain", label: "Si ya tenéis una presencia actual, compártenos dónde podemos conocerla.", type: "url", placeholder: "https://" },
        {
          id: "brand_manual",
          label: "¿Disponéis de materiales de marca que nos ayuden a conoceros mejor?",
          type: "radio",
          options: [
            { label: "Sí, los tenemos listos", value: "yes" },
            { label: "Tenemos algunos materiales", value: "partial" },
            { label: "No por ahora", value: "no" },
          ],
        },
        { id: "hosting", label: "¿Hay alguna fecha, conversación o momento importante que debamos tener en cuenta?", type: "text" },
        { id: "additional_notes", label: "¿Hay algo más que te gustaría que supiéramos antes de proponerte el siguiente paso?", type: "textarea" },
      ],
    },
  ],
};
