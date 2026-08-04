import { ProjectBrief } from "../types/brief";

export const websiteBrief: ProjectBrief = {
  id: "kyruma-discovery",
  name: "KYRUMA Discovery™",
  description: "Las mejores soluciones no empiezan con tecnología. Empiezan entendiendo vuestro negocio.",
  sections: [
    {
      id: "business",
      title: "Conociendo vuestro negocio",
      description: "Empezamos por vuestra realidad: quiénes sois, qué hacéis y qué os mueve.",
      questions: [
        { id: "company_name", label: "¿Cómo se llama vuestra empresa o proyecto?", type: "text", required: true },
        { id: "contact_name", label: "¿Con quién estamos conversando?", type: "text", required: true },
        { id: "email", label: "¿A qué correo podemos escribiros?", type: "email", required: true },
        { id: "business_description", label: "Contadnos qué hacéis como si se lo explicarais a alguien que acaba de conoceros.", type: "textarea", required: true },
      ],
    },
    {
      id: "clients",
      title: "Vuestros clientes",
      description: "Entender a quién ayudáis es la base para tomar buenas decisiones.",
      questions: [
        { id: "ideal_customer", label: "¿A quién os gustaría ayudar más? Describid a esa persona o empresa.", type: "textarea", required: true },
        { id: "customer_problem", label: "¿Qué está viviendo antes de llegar a vosotros?", type: "textarea" },
        { id: "customer_goal", label: "¿Qué desea conseguir realmente?", type: "textarea" },
      ],
    },
    {
      id: "goals",
      title: "Objetivos",
      description: "Miramos hacia delante: el cambio que haría que este proyecto merezca la pena.",
      questions: [
        { id: "main_goal", label: "Si este proyecto tuviera un único impacto importante, ¿cuál sería?", type: "textarea", required: true },
        { id: "success", label: "¿Qué tendría que pasar para que dentro de seis meses dijerais “ha valido la pena”?", type: "textarea" },
      ],
    },
    {
      id: "obstacles",
      title: "Obstáculos",
      description: "Nombrar lo que hoy frena el avance nos permite encontrar un camino más útil.",
      questions: [
        { id: "problem", label: "¿Qué situación os gustaría resolver o mejorar ahora mismo?", type: "textarea", required: true },
        { id: "customer_objections", label: "¿Qué dudas o fricciones suelen impedir que alguien dé el siguiente paso?", type: "textarea" },
      ],
    },
    {
      id: "opportunities",
      title: "Oportunidades",
      description: "Ahora exploramos dónde puede estar el mayor impacto para vuestro negocio.",
      questions: [
        {
          id: "required_pages",
          label: "¿Qué resultados os sería más valioso conseguir?",
          type: "checkbox",
          options: [
            { label: "Explicar nuestra propuesta con claridad", value: "clarity" },
            { label: "Generar conversaciones de más calidad", value: "conversations" },
            { label: "Dar confianza antes del primer contacto", value: "trust" },
            { label: "Facilitar una decisión importante", value: "decisions" },
            { label: "Cuidar mejor la relación con clientes actuales", value: "relationships" },
          ],
        },
        { id: "main_services", label: "¿Qué parte de vuestra propuesta debería entenderse y valorarse mejor?", type: "textarea", required: true },
        { id: "conversion", label: "Cuando alguien conecte con vuestra propuesta, ¿qué os gustaría que hiciera después?", type: "textarea" },
      ],
    },
    {
      id: "brand",
      title: "Marca",
      description: "La solución debe sentirse coherente con quienes sois, no solo funcionar.",
      questions: [
        { id: "brand_values", label: "¿Qué valores no estáis dispuestos a negociar?", type: "textarea" },
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
      id: "experience",
      title: "Experiencia",
      description: "Nos ayuda conocer qué experiencias os representan y qué momentos merece la pena cuidar.",
      questions: [
        { id: "admired_websites", label: "¿Qué experiencias de otras marcas os inspiran y por qué?", type: "textarea" },
        {
          id: "media",
          label: "¿Contáis con historias, imágenes o testimonios que merezca la pena poner en valor?",
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
      id: "additional",
      title: "Información adicional",
      description: "Cerramos con cualquier contexto que nos ayude a preparar una conversación más útil.",
      questions: [
        { id: "hosting", label: "¿Hay alguna fecha, conversación o momento importante que debamos tener en cuenta?", type: "text" },
        { id: "additional_notes", label: "¿Hay algo más que os gustaría que supiéramos antes de la reunión?", type: "textarea" },
      ],
    },
  ],
};
