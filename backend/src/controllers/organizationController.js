const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const AWS = require('aws-sdk');

const knexConnection = require('../database/knexConnection');

const AWSEmailService = require('../resources/AWSEmailService');

module.exports = {

  async index(req, res){
    try{
      const connectDB = await knexConnection.connect();

      const organizations = await connectDB('organizations').select('*');

      return res.json(organizations);

    } catch(err){
        return res.status(400).json({ error: err })
    }
  },

  async show(req, res){
    try{
      const connectDB = await knexConnection.connect();

      const { organization_id } = req.params;

      if(!organization_id){
        return res.status(400).json({ error: 'Missing Organization ID'})
      }

      const organization = await connectDB('organizations')
       .where('id', organization_id)
       .select('id', 'name', 'email', 'whatsapp', 'city', 'country', 'eircode')
       .first()

      if(!organization){
        return res.status(400).json({ error: 'Organization Not Found'})
      }

      return res.status(200).json(organization)

    } catch(err){
        return res.status(400).json({ error: err })
    }
  },

  async create(req, res){
    try{
      const connectDB = await knexConnection.connect();

      const { name, email, whatsapp, city, eircode, country, password } = req.body;
      
      const id = crypto.randomBytes(4).toString('HEX');
      
      //Generating Email Verification Token
      verificationToken = crypto.randomBytes(15).toString('HEX');
      
      //Password Hashing
      const salt = await bcryptjs.genSalt();
      const hashedPassword = await bcryptjs.hash(password, salt);

      //Inserting Organization into AWS RDS Database
      await connectDB('organizations').insert({
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

      //AWS SES Preparation
      const SESData = await AWSEmailService.getAWSSESConfig(email);

      // Builder to send a new email from SES
      new AWS.SES(SESData.SESConfig).sendEmail(SESData.SESparams).promise().then((res) => {
        console.log(res);
      })

      return res.status(200).json({ message: 'Verification email sent', id, name })

    } catch(err){
        return res.status(400).json({ error: err })
    }
  },

  async update(req, res){
    try{
      const connectDB = await knexConnection.connect();

      const { organization_id, name, email, whatsapp, city, eircode, country } = req.body;

      if (!organization_id) {
        return res.status(401).json({ error: "Missing Organization ID from Request" });
      }

      const organization = await connectDB('organizations')
        .where('id', organization_id)
        .select('id', 'name', 'email', 'whatsapp', 'city', 'eircode', 'country')
        .first()

      if (!organization) {
        return res.status(401).json({ error: "Organization Not Found" });
      }

      const updateDetails = { 
        name, 
        email, 
        whatsapp, 
        city, 
        eircode, 
        country 
      };

      await connectDB('organizations')
        .where('id', organization_id)
        .update({ 
          name: updateDetails.name,
          email: updateDetails.email,
          whatsapp: updateDetails.whatsapp,
          city: updateDetails.city,
          eircode: updateDetails.eircode,
          country: updateDetails.country,
        });

      const updatedOrganization = await connectDB('organizations')
      .where('id', organization_id)
      .select('id', 'name', 'email', 'whatsapp', 'city', 'eircode', 'country')
      .first()

      return res.status(200).json({ message: 'Success: Organization updated succesfully', updatedOrganization });

    } catch(err){
      return res.status(400).json({ error: err })
    }
  },

  async delete(req, res){
    try{
      const connectDB = await knexConnection.connect();

      const { organization_id } = req.body;

      if (!organization_id) {
        res.status(401).json({ error: "Missing Organization ID from Request" });
      }

      const organization = await connectDB('organizations')
        .where('id', organization_id)
        .select('id', 'name')
        .first()

      if (!organization) {
        return res.status(401).json({ error: "Organization Not Found" });
      }

      await connectDB('incidents')
        .where('organization_id', organization_id)
        .del()

      await connectDB('organizations')
        .where('id', organization_id)
        .del()

      return res.status(200).json({ message: "Organization deleted successfully" });

    } catch(err){
        return res.status(400).json({ error: err })
    }
  }

}

