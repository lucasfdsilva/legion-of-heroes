require('dotenv').config();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const connection = require('../database/connection');

module.exports = {

  async create(req, res){
    try{
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "Missing Required Information from Request" });
      }

      const organization = await connection('organizations')
        .where('email', email)
        .select('id', 'name', 'email', 'verified', 'password')
        .first();

      if(!organization){
        return res.status(401).json({ error: 'No Organization found with this email'});
      }

      if (organization.verified == 0){
        return res.status(401).json({ error: "Please verify your email before logging in" });
      }

      if (await bcryptjs.compare(password, organization.password)){
        const accessToken = jwt.sign(organization.id, process.env.JWT_SECRET);

        res.status(200).json({ message: "Organization Logged in succesfully", id: organization.id, accessToken: accessToken });

      } else {
        res.status(401).json({ message: "Password is incorrect" });
      }

    } catch(err){
      return res.status(400).json({ error: err })
    }
  },

  async show(req, res) {
    try{


    } catch(err){
      return res.status(400).json({ error: err })
    }
  }

}