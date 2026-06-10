import ngrok from "@ngrok/ngrok";
const Port = process.env.PORT || 8000;
console.log("ngrok will forward to port:", Port);

async function forwardToApp() {
	const forwarder = await ngrok.forward({
		addr: `localhost:${Port}`,
		authtoken_from_env: true,
	});
	console.log(`Available at: ${forwarder.url()}`);
}

export default forwardToApp;