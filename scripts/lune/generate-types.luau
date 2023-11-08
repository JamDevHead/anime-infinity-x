local roblox = require("@lune/roblox")
local fs = require("@lune/fs")

local typeGeneration = require("modules/typeGeneration")

local initialTime = os.clock()

local game = roblox.deserializePlace(fs.readFile("place.rbxlx"))

local ServerStorage = game:GetService("ServerStorage")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local privateAssets = assert(ServerStorage:FindFirstChild("assets"), "Missing assets folder in ServerStorage!")
local publicAssets = assert(ReplicatedStorage:FindFirstChild("assets"), "Missing assets folder in ReplicatedStorage!")


fs.writeFile("@types/generated/private-assets.d.ts", typeGeneration.parseInstance(privateAssets))
fs.writeFile("@types/generated/public-assets.d.ts", typeGeneration.parseInstance(publicAssets))

print(`📦 Generated types in {string.format("%.2f", os.clock() - initialTime)} seconds!`)