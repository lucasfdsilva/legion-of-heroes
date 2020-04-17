const { Router } = require('express');

const organizationController = require('./controllers/organizationController');
const incidentController = require('./controllers/incidentController');
const searchController = require('./controllers/searchController');
const sessionController = require('./controllers/sessionController');
const verificationController = require('./controllers/verificationController')

const routes = Router();

routes.post('/sessions', sessionController.create);
routes.get('/sessions', sessionController.show);

routes.get('/organizations', organizationController.index);
routes.get('/organizations/:organization_id', organizationController.show);
routes.post('/organizations', organizationController.create);
routes.put('/organizations', organizationController.update);
routes.delete('/organizations', organizationController.delete);

routes.get('/organizations/verify/:verificationToken', verificationController.verifyOrganization);

routes.get('/incidents', incidentController.index);
routes.get('/incidents/:incident_id', incidentController.show);
routes.post('/incidents', incidentController.create);
routes.put('/incidents/:id', incidentController.update);
routes.delete('/incidents/:id', incidentController.delete);

routes.get('/search/incidents', searchController.incidentsByOrganization);

module.exports = routes;