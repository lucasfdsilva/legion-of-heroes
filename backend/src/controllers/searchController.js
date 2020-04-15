const connection = require('../database/connection');

module.exports = {

  async incidentsByOrganization(req, res){
    try{
      const { organization_id } = req.query;

      const  incidents = await connection('incidents')
        .where('organization_id', organization_id)
        .select('*');

      return res.status(200).json(incidents);

    } catch(err){
      return res.status(400).json({ error: err })
    }
  }

}