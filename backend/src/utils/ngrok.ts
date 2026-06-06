import ngrok from "@ngrok/ngrok";

async function forwardToApp() {
	const forwarder = await ngrok.forward({
		addr: "localhost:3000",
		authtoken_from_env: true,
	});
	console.log(`Available at: ${forwarder.url()}`);
}

export default forwardToApp;