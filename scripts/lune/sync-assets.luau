local roblox = require("@lune/roblox")
local process = require("@lune/process")
local fs = require("@lune/fs")
local place = require("modules/place")
local utils = require("modules/utils")
local config = require("modules/configManager"):getConfig()

local args = process.args

local IsDev = false

for _, arg in args do
    if arg == "dev" then
        IsDev = true
        break
    end
end

local buildersPlaceId = config.places.builders

print("📦 Downloading building place...")
local buildPlace = place.download(buildersPlaceId)
print("📦 Downloaded building place!")

local game = roblox.deserializePlace(buildPlace)

local scriptFile = assert(fs.readFile("place.rbxlx"), "Missing place.rbxlx file! Please run `yarn build:dev or yarn build:prod`")
local scriptsPlace = roblox.deserializePlace(scriptFile)

local Workspace = game:GetService("Workspace")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerStorage = game:GetService("ServerStorage")

-- Get the assets folder
local assetsFolder = assert(Workspace:FindFirstChild("LunaAssets"), "Missing LunaAssets folder in place!")

local publicAssets = assert(assetsFolder:FindFirstChild("public"), "Missing Public folder in LunaAssets!")
local privateAssets = assert(assetsFolder:FindFirstChild("private"), "Missing Private folder in LunaAssets!")

-- Sync public assets
print("📦 Syncing public assets...")
if config.assets.public then
    for _, asset in ipairs(config.assets.public) do
        local specificInstance = assert(utils.getInstanceByString(asset, publicAssets), "Missing asset in public assets!")
        utils.createAssetPublic(specificInstance)
        specificInstance:Destroy()
    end
end

for _, instance in ipairs(publicAssets:GetChildren()) do
    if not ReplicatedStorage:FindFirstChild("assets") then
        local folder = roblox.Instance.new("Folder")
        folder.Name = "assets"
        folder.Parent = ReplicatedStorage
    end
    instance.Parent = ReplicatedStorage.assets
end

-- Sync private assets
print("📦 Syncing private assets...")
if config.assets.private then
    for _, asset in ipairs(config.assets.private) do
        local specificInstance = assert(utils.getInstanceByString(asset, privateAssets), "Missing asset in private assets!")
        utils.createAssetPrivate(specificInstance)
        specificInstance:Destroy()
    end
end

for _, instance in ipairs(privateAssets:GetChildren()) do
    if not ServerStorage:FindFirstChild("assets") then
        local folder = roblox.Instance.new("Folder")
        folder.Name = "assets"
        folder.Parent = ServerStorage
    end
    instance.Parent = ServerStorage.assets
end

-- Setup test place
print(`📦 Generating{if IsDev then " dev " else " "}place...`)
assetsFolder:Destroy()

-- Merge the scripts place into the game
function mergeInstance(instance, parent)
    local existingInstance = parent:FindFirstChild(instance.Name)
    if existingInstance then
        for _, child in ipairs(instance:GetChildren()) do
            mergeInstance(child, existingInstance)
        end
        return
    end

    instance.Parent = parent
end

for _, instance in scriptsPlace:GetChildren() do
    mergeInstance(instance, game)
end

-- Serialize the game
local gameFile = roblox.serializePlace(game)
fs.writeFile("place.rbxlx", gameFile)
print("📦 Serialized dev place!")