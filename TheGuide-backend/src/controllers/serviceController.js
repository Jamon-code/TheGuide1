const ServiceModel = require('../models/serviceModel');

const addService = async (req, res) => {
  try {
    const { name, image, type, typeName, characteristics, facebookId } = req.body;

    // Validation des champs requis
    if (!name || !image || type === undefined || !facebookId) {
      return res.status(400).json({ 
        error: 'Champs requis manquants: name, image, type, facebookId' 
      });
    }

    // Ajouter le service à la base de données
    const newService = await ServiceModel.addService({
      name,
      img_url: image,
      type,
      user_id: null, // à remplacer par l'ID utilisateur réel si tu as une table users
      facebook_id: facebookId
    });

    // Ajouter les caractéristiques
    if (characteristics && Object.keys(characteristics).length > 0) {
      for (const [title, description] of Object.entries(characteristics)) {
        await ServiceModel.addInformation({
          title,
          description,
          service_id: newService.id
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Service ajouté avec succès',
      service: {
        id: newService.id,
        name,
        image,
        type,
        typeName,
        characteristics,
        facebookId
      }
    });

  } catch (error) {
    console.error('Erreur ajout service:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'ajout du service',
      details: error.message 
    });
  }
};

module.exports = { addService };