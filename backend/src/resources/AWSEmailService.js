const AWSSecretsManager = require("../../AWSSecretsManager");

module.exports = {
  async getAWSSESConfig(email) {
    const credentials = await AWSSecretsManager.getCredentials("legion-of-heroes-ses-credentials");

    return {
      SESConfig : {
        apiVersion: "2010-12-01",
        accessKeyId: credentials.accesskeyid,
        secretAccessKey: credentials.accesskeysecret,
        region: credentials.region,
      },

      SESparams : {
        Source: "support@legionofheroes.co.uk",
        Destination: {
          ToAddresses: [email],
        },
        ReplyToAddresses: ["support@legionofheroes.co.uk"],
        Message: {
          Subject: {
            Charset: "UTF-8",
            Data: "Legion of Heroes Registration - Email Account Verification",
          },
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: `<p>Please click on the following link to verify your email address: http://legionofheroes.co.uk/organizations/verify/${verificationToken}</p>`,
            },
          },
        },
      }
    }
  }
}
