const connection = require('../database/connection');

module.exports = {

  async create(req, res){
    try{

      const { organization_id } = req.body;

      const organization = await connection('organizations')
        .where('id', organization_id)
        .select('id', 'name')
        .first();

      if(!organization){
        return res.status(400).json({ error: 'No Organization found with this ID'});
      }

      return res.status(200).json(organization);

    } catch(err){
      return res.status(400).json({ error: err })
    }

  }

}