const connection = require('../database/connection');

module.exports = {

  async index(req, res){
    try{
      const { page = 1 } = req.query;

      const [count] = await connection('incidents').count();

      const incidents = await connection('incidents')
        .join('organizations', 'organizations.id', '=', 'incidents.organization_id')
        .limit(5)
        .offset((page - 1) * 5)
        .select([
          'incidents.*', 
          'organizations.name', 
          'organizations.email', 
          'organizations.whatsapp', 
          'organizations.city', 
          'organizations.country'
        ]);

      res.header('X-Total-Count', count['count(*)']);

      return res.status(200).json(incidents);

    } catch(err){
        return res.status(400).json({ error: err })
    }
  },

  async show(req, res){
    try{

    } catch(err){
      return res.status(400).json({ error: err })
    }
  },

  async create(req, res){
    try{
      const { title, description, value } = req.body;
      const organization_id = req.headers.authorization;

      const result = await connection('incidents').insert({
        title,
        description,
        value,
        organization_id
      });

      const incident_id = result[0];

      return res.json({ incident_id });

    } catch(err){
      console.log(err)
      return res.status(400).json({ error: err })
    }
  },

  async update(req, res){
    try{

    } catch(err){
      return res.status(400).json({ error: err })
    }
  },

  async delete(req, res){
    try{
      const { id } = req.params;
      const organization_id = req.headers.authorization;

      const incident = await connection('incidents')
        .where('id', id)
        .select('organization_id')
        .first();

      if(incident.organization_id !== organization_id){
        return res.status(401).json({ error: 'Operation not permitted. Incident belongs to a different organization'});
      }

      await connection('incidents').where('id', id).delete();

      return res.status(204).send();

    } catch(err){
      return res.status(400).json({ error: err })
    }
  },

}