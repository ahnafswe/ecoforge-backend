import { app } from "./app";
import { envVars } from "./app/config/env";

const start = () => {
	try {
		app.listen(Number(envVars.PORT), () => {
			console.log(`✓ EcoForge server is running on localhost:${envVars.PORT}`);
		});
	} catch (err) {
		console.error("✗ Unable to start server:", err);
	}
};

start();
