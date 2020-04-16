const connection = require('../database/connection');

module.exports = {

  async verifyOrganization(req, res){
    try{
      const { verificationToken } = req.params;

      if (!verificationToken) {
        res.status(401).json({ error: "Missing Verification Token from Request" });
      }

      const organization = await connection('organizations')
        .where('verificationToken', verificationToken)
        .select('id', 'name', 'verified');

      if(!organization){
        return res.status(401).json({ error: 'No Organization found with provided Verification Token'})
      }

      await connection('organizations')
        .where('verificationToken', verificationToken)
        .update({
          verified: 1
      });

      return res.status(200).json({ message: 'Email Verified Succesfully' });

    } catch(err){
        return res.status(400).json({ error: err })
    }
  }

}
