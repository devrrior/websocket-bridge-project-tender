import expressApp from "./api/express";
import config from "./config";
import setUpWebsocket from "./websocket/websocket";

(async () => {
	const websocket = await setUpWebsocket();

	websocket.listen(config.websocketPort);
	console.log(`Websocket running on ${config.websocketPort} port`);
	expressApp.listen(config.apiPort, () => {
		console.log(`Express running on ${config.apiPort} port`);
	});
})();
