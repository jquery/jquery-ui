define([ "./intern" ], function (config) {
	config.environments = [ { browserName: "chrome" } ];
	config.tunnel = "NullTunnel";
	return config;
});
