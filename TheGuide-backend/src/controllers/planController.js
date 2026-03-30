const ServiceModel = require('../models/serviceModel');
const { generatePlan, modifyPlan } = require('../services/groqService');

const generateTravelPlan = async (req, res) => {
  try {
    console.log('new');
    const { prompt } = req.body;
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt requis' });
    }

    const services = await ServiceModel.getServicesForLLM();
    const plan = await generatePlan(prompt, services);
    
    res.status(200).json({
      success: true,
      plan: {
        id: Date.now().toString(),
        ...plan
      }
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ 
      success: false,
      error: 'Erreur génération plan',
      details: error.message 
    });
  }
};

const modifyTravelPlan = async (req, res) => {
  try {
    console.log('modify');
    const { prompt, currentPlan } = req.body;
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt requis' });
    }
    
    if (!currentPlan) {
      return res.status(400).json({ error: 'Plan actuel requis' });
    }

    const services = await ServiceModel.getServicesForLLM();
    const modifiedPlan = await modifyPlan(prompt, currentPlan, services);
    
    res.status(200).json({
      success: true,
      plan: {
        id: Date.now().toString(),
        ...modifiedPlan
      }
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ 
      success: false,
      error: 'Erreur modification plan',
      details: error.message 
    });
  }
};

module.exports = { generateTravelPlan, modifyTravelPlan };