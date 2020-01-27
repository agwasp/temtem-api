import cors from "../../util/cors";
import pruneData from "../../util/pruneData";
import {sendPageView} from '../../util/gaMeasurementProtocol';

const traits = require("../../data/traits.json");

export default cors((req, res) => {
  sendPageView(req, 'traits');
  res.json(pruneData(traits, req.query.names, req.query.fields));
});
