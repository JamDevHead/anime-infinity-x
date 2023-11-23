local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerScriptService = game:GetService("ServerScriptService")
local StarterPlayer = game:GetService("StarterPlayer")

local TestEZ = require(ReplicatedStorage.rbxts_include.node_modules["@rbxts"].testez.src)

TestEZ.TestBootstrap:run({
    StarterPlayer.StarterPlayerScripts.client.tests,
	ServerScriptService.server.tests,
	ReplicatedStorage.shared.tests,
}, TestEZ.Reporters.TextReporter)