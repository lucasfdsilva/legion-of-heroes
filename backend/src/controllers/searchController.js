const knexConnection = require('../database/knexConnection');

module.exports = {

  async incidentsByOrganization(req, res){
    try{
      const connectDB = await knexConnection.connect();

      const { organization_id } = req.query;

      const  incidents = await connectDB('incidents')
        .where('organization_id', organization_id)
        .select('*');

      return res.status(200).json(incidents);

    } catch(err){
      return res.status(400).json({ error: err })
    }
  }

}