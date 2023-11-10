local roblox = require("@lune/roblox")
local fs = require("@lune/fs")
local process = require("@lune/process")

local typeGeneration = require("modules/typeGeneration")
local config = require("modules/configManager"):getConfig()

local initialTime = os.clock()
local args = process.args

local options = {
    dev = false,
    xml = false,
}

for _, arg in args do
    if arg == "--xml" then
        options.xml = true
    end
end

local file = config.outputName
local extension = options.xml and "rbxlx" or "rbxl"
local output = `{file}.{extension}`

if not fs.isDir("@types/generated") then
    fs.writeDir("@types/generated")
end

local game = roblox.deserializePlace(fs.readFile(output))

local ServerStorage = game:GetService("ServerStorage")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local privateAssets = assert(ServerStorage:FindFirstChild("assets"), "Missing assets folder in ServerStorage!")
local publicAssets = assert(ReplicatedStorage:FindFirstChild("assets"), "Missing assets folder in ReplicatedStorage!")

fs.writeFile("@types/generated/private-assets.d.ts", typeGeneration.parseInstance(privateAssets))
fs.writeFile("@types/generated/public-assets.d.ts", typeGeneration.parseInstance(publicAssets))

print(`📦 Generated types in {string.format("%.2f", os.clock() - initialTime)} seconds!`)