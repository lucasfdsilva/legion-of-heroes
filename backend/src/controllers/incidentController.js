const knexConnection = require('../database/knexConnection');

module.exports = {

  async index(req, res){
    try{
      const connectDB = await knexConnection.connect();

      const { page = 1 } = req.query;

      const [count] = await connectDB('incidents').count();

      const incidents = await connectDB('incidents')
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
      const connectDB = await knexConnection.connect();

      const { incident_id } = req.params;

      if(!incident_id){
        return res.status(401).json({ error: 'ERROR: Missing Incident ID on request'})
      }

      const incident = await connectDB('incidents')
       .where('id', incident_id)
       .select('*')
       .first()

      if(!incident){
        return res.status(401).json({ error: 'ERROR: Incident Not Found with Provided ID'})
      }

      return res.status(200).json(incident);

    } catch(err){
        return res.status(400).json({ error: err })
    }
  },

  async create(req, res){
    try{
      const connectDB = await knexConnection.connect();

      const { title, description, value } = req.body;
      const organization_id = req.headers.authorization;

      const result = await connectDB('incidents').insert({
        title,
        description,
        value,
        organization_id
      });

      const incident_id = result[0];

      return res.status(200).json({ incident_id, title, value, organization_id });

    } catch(err){
        return res.status(400).json({ error: err })
    }
  },

  async update(req, res){
    try{
      const connectDB = await knexConnection.connect();

      const { incident_id, title, description, value } = req.body;
      const organization_id = req.headers.authorization;

      if (!incident_id) {
        return res.status(401).json({ error: "Missing Incident ID from Request" });
      }

      const incident = await connectDB('incidents')
        .where('id', incident_id)
        .select('id', 'title', 'description', 'value', 'organization_id')
        .first()

      if (!incident) {
        return res.status(401).json({ error: "ERROR: Incident Not Found" });
      }

      if(incident.organization_id !== organization_id){
        return res.status(401).json({ error: 'ERROR: Incident belongs to another organization'});
      }

      const updateDetails = { 
        title, 
        description, 
        value
      };

      await connectDB('incidents')
        .where('id', incident_id)
        .update({ 
          title: updateDetails.title,
          description: updateDetails.description,
          value: updateDetails.value,
        });

      const updatedIncident = await connectDB('incidents')
      .where('id', incident_id)
      .select('id', 'title', 'description', 'value', 'organization_id')
      .first()

      return res.status(200).json({ message: 'Success: Incident updated succesfully', updatedIncident });

    } catch(err){
        return res.status(400).json({ error: err })
    }
  },

  async delete(req, res){
    try{
      const connectDB = await knexConnection.connect();

      const { incident_id } = req.body;
      const organization_id = req.headers.authorization;

      if (!incident_id) {
        return res.status(401).json({ error: "ERROR: Missing Incident ID from Request" });
      }

      const incident = await connectDB('incidents')
        .where('id', incident_id)
        .select('organization_id')
        .first();

      if (!incident) {
        return res.status(401).json({ error: "ERROR: Incident Not Found" });
      }

      if(incident.organization_id !== organization_id){
        return res.status(401).json({ error: 'ERROR: Incident belongs to another organization' });
      }

      await connectDB('incidents').where('id', incident_id).delete();

      return res.status(204).send();

    } catch(err){
        return res.status(400).json({ error: err })
    }
  }

}