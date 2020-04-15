const { Router } = require('express');

const organizationController = require('./controllers/organizationController');
const incidentController = require('./controllers/incidentController');

const routes = Router();

routes.get('/organizations', organizationController.index);
routes.get('/organizations/:id', organizationController.show);
routes.post('/organizations', organizationController.create);
routes.put('/organizations', organizationController.update);
routes.delete('/organizations', organizationController.delete);

routes.get('/incidents', incidentController.index);
routes.get('/incidents/:id', incidentController.show);
routes.post('/incidents', incidentController.create);
routes.put('/incidents', incidentController.update);
routes.delete('/incidents', incidentController.delete);

module.exports = routes;