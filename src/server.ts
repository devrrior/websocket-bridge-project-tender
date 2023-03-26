import config from "./config";
import setUpWebsocket from "./websocket/websocket";

(async () => {
	const PORT = config.port;
	const websocket = await setUpWebsocket();

	websocket.listen(PORT);
	console.log(`Listening on port ${PORT}`);
})();
