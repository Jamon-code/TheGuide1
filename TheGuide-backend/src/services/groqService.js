const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generatePlan = async (prompt, services) => {
  try {
    // Filtrer pour n'envoyer que les services pertinents (limiter pour ne pas dépasser la limite de tokens)
    const relevantServices = services.slice(0, 50);
    
    const systemPrompt = `Tu es un expert en planification de voyages. Tu dois créer un plan de voyage en utilisant UNIQUEMENT les services disponibles dans la base de données.
    
RÈGLES IMPORTANTES:
- Utilise EXACTEMENT les noms des services fournis
- Utilise EXACTEMENT les images des services fournies
- tu peux ajouter des caractéristiques des services fournies (pas obligatoirement de ce que je t'ai donné)
- Ne crée PAS de nouveaux services
- Réponds UNIQUEMENT avec un JSON valide
- Pour le champ "name", commence toujours par un VERBE D'ACTION (Voyager, Aller, Découvrir, Visiter, Déjeuner, Dîner, Explorer, etc.) pour former une phrase d'action complète`;

    const userPrompt = `
DEMANDE DE L'UTILISATEUR:
${prompt}

SERVICES DISPONIBLES DANS LA BASE DE DONNÉES:
${JSON.stringify(relevantServices, null, 2)}

Génère un plan de voyage au format JSON suivant:
{
  "title": "titre du voyage",
  "location": "destination",
  "countryFlag": "emoji drapeau",
  "items": [
    {
      "date": "jj mois aaaa",
      "time": "hh:mm",
      "name": "VERBE D'ACTION + description avec NOM_EXACT_DU_SERVICE_DE_LA_BDD",
      "image": "URL_IMAGE_DU_SERVICE_DE_LA_BDD",
      "characteristics": {
        "caractéristique1": "description1"
      }
    }
  ]
}

IMPORTANT: 
1. Pour chaque item, utilise obligatoirement un service de la liste ci-dessus avec son image exacte.
2. Ne crée pas de noms ou d'images inventés.
3. Le champ "name" doit être une phrase d'action qui commence par un verbe (Voyager, Aller, Déjeuner, Visiter, etc.).
`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 4096,
    });

    let response = completion.choices[0]?.message?.content || '';
    
    // Nettoyer la réponse
    response = response.trim();
    response = response.replace(/^```json\s*/i, '');
    response = response.replace(/^```\s*/, '');
    response = response.replace(/\s*```$/, '');
    response = response.trim();
    
    const plan = JSON.parse(response);
    
    // Vérifier que les items utilisent des services existants
    for (const item of plan.items) {
      const matchingService = services.find(s => item.name.includes(s.name) || s.name === item.name);
      if (matchingService) {
        item.image = matchingService.image;
      }
    }
    
    return plan;
    
  } catch (error) {
    console.error('Groq API Error:', error);
    throw error;
  }
};

const modifyPlan = async (prompt, currentPlan, services) => {
  try {
    // Filtrer pour n'envoyer que les services pertinents (limiter pour ne pas dépasser la limite de tokens)
    const relevantServices = services.slice(0, 50);
    
    const systemPrompt = `Tu es un expert en planification de voyages. Tu dois MODIFIER un plan de voyage existant selon la demande de l'utilisateur.
    
RÈGLES IMPORTANTES:
- Tu DOIS retourner l'INTÉGRALITÉ du plan modifié (tous les items), pas seulement les changements
- Copie TOUS les items du plan actuel
- Modifie SEULEMENT les items concernés par la demande
- Les items non concernés restent IDENTIQUES au plan actuel
- Utilise UNIQUEMENT les services disponibles dans la base de données
- Utilise EXACTEMENT les images des services fournies
- Ne crée PAS de nouveaux services
- Réponds UNIQUEMENT avec un JSON valide
- Pour le champ "name", commence toujours par un VERBE D'ACTION (Voyager, Aller, Découvrir, Visiter, Déjeuner, Dîner, Explorer, etc.) pour former une phrase d'action complète`;

    const userPrompt = `
PLAN ACTUEL (à modifier - contient TOUS les items du voyage):
${JSON.stringify(currentPlan, null, 2)}

DEMANDE DE MODIFICATION DE L'UTILISATEUR:
${prompt}

SERVICES DISPONIBLES DANS LA BASE DE DONNÉES:
${JSON.stringify(relevantServices, null, 2)}

INSTRUCTIONS IMPORTANTES:
1. Commence par copier TOUS les items du plan actuel
2. Identifie les items qui correspondent à la demande de modification
3. Remplace UNIQUEMENT ces items par des services de la base de données
4. Pour TOUS les autres items, garde-les EXACTEMENT comme dans le plan actuel
5. Retourne le plan COMPLET avec TOUS les items (les modifiés ET les inchangés)

Génère le plan MODIFIÉ au format JSON suivant:
{
  "title": "titre du voyage",
  "location": "destination",
  "countryFlag": "emoji drapeau",
  "items": [
    // TOUS les items du plan original, avec les modifications demandées
  ]
}
`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 4096,
    });

    let response = completion.choices[0]?.message?.content || '';
    
    // Nettoyer la réponse
    response = response.trim();
    response = response.replace(/^```json\s*/i, '');
    response = response.replace(/^```\s*/, '');
    response = response.replace(/\s*```$/, '');
    response = response.trim();
    
    let plan = JSON.parse(response);
    
    // Si le LLM a retourné moins d'items que dans le plan original, on les remet
    if (plan.items.length < currentPlan.items.length) {
      console.log(`Attention: Le LLM a retourné ${plan.items.length} items au lieu de ${currentPlan.items.length}. Correction...`);
      
      // Créer un Map pour identifier les items modifiés
      const modifiedItems = new Map();
      for (const item of plan.items) {
        // Utiliser une clé combinée pour identifier l'item
        const key = `${item.date}_${item.time}`;
        modifiedItems.set(key, item);
      }
      
      // Fusionner avec les items originaux
      const mergedItems = [];
      for (const originalItem of currentPlan.items) {
        const key = `${originalItem.date}_${originalItem.time}`;
        if (modifiedItems.has(key)) {
          mergedItems.push(modifiedItems.get(key));
        } else {
          mergedItems.push(originalItem);
        }
      }
      
      plan.items = mergedItems;
      
      // Trier par date
      plan.items.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
    }
    
    // Vérifier que les items utilisent des services existants
    for (const item of plan.items) {
      const matchingService = services.find(s => item.name.includes(s.name) || s.name === item.name);
      if (matchingService) {
        item.image = matchingService.image;
      }
    }
    
    return plan;
    
  } catch (error) {
    console.error('Groq API Error:', error);
    throw error;
  }
};

module.exports = { generatePlan, modifyPlan };