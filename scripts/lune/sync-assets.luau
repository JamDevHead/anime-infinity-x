local roblox = require("@lune/roblox")
local _process = require("@lune/process")
local fs = require("@lune/fs")
local place = require("modules/place")
local config = require("modules/configManager"):getConfig()

local buildersPlaceId = config.places.builders

print("📦 Downloading building place...")
local buildPlace = place.download(buildersPlaceId)
print("📦 Downloaded building place!")

local game = roblox.deserializePlace(buildPlace)
local scriptsPlace = roblox.deserializePlace(fs.readFile("place.rbxlx"))

local Workspace = game:GetService("Workspace")

-- Get the assets folder
local assetsFolder = assert(Workspace:FindFirstChild("LunaAssets"), "Missing LunaAssets folder in place!")

local avatarsFolder = assert(assetsFolder:FindFirstChild("Avatars"), "Missing Avatars folder in LunaAssets!")

-- Serialize the avatars folder
local avatarFile = roblox.serializeModel({avatarsFolder})
fs.writeFile("assets/avatars.rbxm", avatarFile)
print("📦 Serialized avatars!")

-- Setup test dev place
print("📦 Generating dev place...")
assetsFolder:Destroy()

-- merge the scripts place into the game
for _, instance in ipairs(scriptsPlace:GetChildren()) do
    if instance:IsA("StarterPlayer") then
        -- temp fix for starter player scripts (duplicated starter player scripts)
        for _, child in ipairs(instance.StarterPlayerScripts:GetChildren()) do
            child.Parent = game.StarterPlayer.StarterPlayerScripts
        end
        continue
    end
    instance.Parent = game
end

-- Serialize the game
local gameFile = roblox.serializePlace(game)
fs.writeFile("place.rbxlx", gameFile)
print("📦 Serialized dev place!")