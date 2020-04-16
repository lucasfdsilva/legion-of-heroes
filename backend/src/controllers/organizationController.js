const bcryptjs = require('bcryptjs');
const crypto = require('crypto');

const connection = require('../database/connection');

module.exports = {

  async index(req, res){
    try{
      const organizations = await connection('organizations').select('*');

      return res.json(organizations);

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
      const { name, email, whatsapp, city, eircode, country, password } = req.body;
      
      const id = crypto.randomBytes(4).toString('HEX');
      
      //Generating Email Verification Token
      verificationToken = crypto.randomBytes(15).toString('HEX');
      
      //Password Hashing
      const salt = await bcryptjs.genSalt();
      const hashedPassword = await bcryptjs.hash(password, salt);

      //Inserting Organization into SQLite
      await connection('organizations').insert({
        id,
        name,
        email,
        whatsapp,
        city,
        eircode,
        country,
        password: hashedPassword,
        verified: 0,
        verificationToken
      });

      return res.json({ id, name })

    } catch(err){
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
      const { organization_id } = req.body;

      if (!organization_id) {
        res.status(401).json({ error: "Missing Organization ID from Request" });
      }

      const organization = await connection('organizations')
        .where('id', organization_id)
        .select('id', 'name')
        .first()

      if (!organization) {
        return res.status(401).json({ error: "Organization Not Found" });
      }

      await connection('incidents')
        .where('organization_id', organization_id)
        .del()

      await connection('organizations')
        .where('id', organization_id)
        .del()

      return res.status(200).json({ message: "Organization deleted successfully" });

    } catch(err){
        return res.status(400).json({ error: err })
    }
  }

}

