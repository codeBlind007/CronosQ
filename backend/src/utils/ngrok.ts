import ngrok from "@ngrok/ngrok";
const Port = process.env.PORT || 8000;
console.log("ngrok will forward to port:", Port);

async function forwardToApp() {
	try {
		await ngrok.disconnect();
	} catch (_) {

	}

	const forwarder = await ngrok.forward({
		addr: `localhost:${Port}`,
		authtoken_from_env: true,
	});
	console.log(`Available at: ${forwarder.url()}`);
}

process.on("SIGINT", async () => {
	await ngrok.disconnect();
	process.exit(0);
});

export default forwardToApp;