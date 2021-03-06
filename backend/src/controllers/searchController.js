const knexConnection = require('../database/knexConnection');

module.exports = {

  async incidentsByOrganization(req, res){
    try{
      const connectDB = await knexConnection.connect();

      const { organization_id } = req.query;

      if(!organization_id){
        return res.status(401).json({ error: 'ERROR: Missing Organization ID'})
      }

      const incidents = await connectDB('incidents')
        .where('organization_id', organization_id)
        .select('*');

      if(!incidents){
        return res.status(401).json({ message: 'This organization has no incidents'})
      }

      return res.status(200).json(incidents);

    } catch(err){
      return res.status(400).json({ error: err })
    }
  }

}