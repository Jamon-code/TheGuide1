const buildPlanPrompt = (userPrompt, services) => {
  return `
Tu es un expert en planification de voyages. Génére UNIQUEMENT un JSON valide.

RÈGLES STRICTES:
- Réponds UNIQUEMENT avec le JSON, AUCUN texte avant ou après
- Pas de commentaires, pas de markdown, pas de \`\`\`json
- JSON valide avec guillemets doubles
- Pas de virgules en fin d'objet ou tableau

RÈGLES POUR LE CHAMP "name":
- Le champ "name" doit être une phrase d'action qui commence par un VERBE
- Utilise des verbes d'action comme: "Voyager", "Aller", "Découvrir", "Visiter", "Déjeuner", "Dîner", "Explorer", "Se promener", "S'installer", "Profiter", "Prendre", "Admirer", "Se rendre", "Partir", "Arriver"
- Sois créatif et varie les verbes selon l'activité
- Exemples:
  * "Voyager en train ONCF de Rabat à Marrakech"
  * "Déjeuner à La Table du Marché"
  * "Visiter la Kasbah des Oudayas"
  * "S'installer à l'hôtel Farah Rabat"
  * "Découvrir le Jardin d'Essais Botaniques"
  * "Prendre un taxi pour se déplacer"

STRUCTURE EXACTE À RESPECTER:
{
  "title": "titre du voyage",
  "location": "destination",
  "countryFlag": "emoji drapeau",
  "items": [
    {
      "date": "jj mois aaaa",
      "time": "hh:mm",
      "name": "VERBE D'ACTION + description détaillée de l'activité",
      "image": "image de l'activité",
      "characteristics": {
        "caractéristique1": "valeur1",
        ...
      }
    },
    ...
  ]
}

DEMANDE DE L'UTILISATEUR:
${userPrompt}

SERVICES DISPONIBLES:
${JSON.stringify(services, null, 2)}

Génère le JSON maintenant.`;
};

module.exports = { buildPlanPrompt };