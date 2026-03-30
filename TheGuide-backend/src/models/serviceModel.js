const pool = require('../config/database');

class ServiceModel {
  // Récupérer tous les services avec leurs informations
  static async getAllServices() {
    const query = `
      SELECT 
        s.id,
        s.name,
        s.img_url,
        s.type,
        CASE s.type
          WHEN 0 THEN 'restauration'
          WHEN 1 THEN 'transport'
          WHEN 2 THEN 'boutique'
          WHEN 3 THEN 'activité'
          WHEN 4 THEN 'hébergement'
          WHEN 5 THEN 'guide'
        END as type_name,
        json_agg(
          json_build_object(
            'title', i.title,
            'description', i.description
          )
        ) as informations
      FROM services s
      LEFT JOIN informations i ON s.id = i.service_id
      GROUP BY s.id
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Récupérer les services formatés pour le LLM
  static async getServicesForLLM() {
    const services = await this.getAllServices();
    
    // Formater pour que le LLM puisse les utiliser facilement
    return services.map(service => ({
      id: service.id,
      name: service.name,
      type: service.type_name,
      image: service.img_url,
      characteristics: service.informations ? service.informations.reduce((acc, info) => {
        acc[info.title] = info.description;
        return acc;
      }, {}) : {}
    }));
  }


    // Ajouter un service
  static async addService({ name, img_url, type, user_id, facebook_id }) {
    const query = `
      INSERT INTO services (name, img_url, type, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;
    const values = [name, img_url, type, user_id];
    const result = await pool.query(query, values);
    return { id: result.rows[0].id };
  }

  // Ajouter une information
  static async addInformation({ title, description, service_id }) {
    const query = `
      INSERT INTO informations (title, description, service_id)
      VALUES ($1, $2, $3)
    `;
    const values = [title, description, service_id];
    await pool.query(query, values);
  }
}

module.exports = ServiceModel;