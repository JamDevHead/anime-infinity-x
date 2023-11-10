local roblox = require("@lune/roblox")

local config = require("configManager"):getConfig()
local utils = require("utils")

local assetsManager = {}

function assetsManager.syncAssets(place: DataModel, dev: boolean?)
    local Workspace = place:GetService("Workspace")
    local ReplicatedStorage = place:GetService("ReplicatedStorage")
    local ServerStorage = place:GetService("ServerStorage")
    
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

    if not dev then assetsFolder:Destroy() end
end

function assetsManager.mergePlace(place: DataModel, placeToMerge: DataModel)
    for _, instance in placeToMerge:GetChildren() do
        utils.mergeInstance(instance, place)
    end
end

return assetsManager