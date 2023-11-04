local roblox = require("@lune/roblox")
local fs = require("@lune/fs")
local utils = {}

function utils.createAssetLocal(instance, folder: string)
    fs.writeFile(`assets/{folder}/{instance.Name}.rbxmx`, roblox.serializeModel({instance}))
end

function utils.createAssetsLocal(instances, folder: string) 
    for _, instance in instances do
        utils.createAssetLocal(instance, folder)
    end
end

function utils.createAssetPublic(instance: Instance) 
    utils.createAssetLocal(instance, "public")
end

function utils.createAssetPrivate(instance: {Instance}) 
    utils.createAssetLocal(instance, "private")
end

function utils.createAssetsPublic(instances: {Instance}) 
    utils.createAssetsLocal(instances, "public")
end

function utils.createAssetsPrivate(instances: {Instance}) 
    utils.createAssetsLocal(instances, "private")
end

function utils.getInstanceByString(path: string, parent: Instance) 
    local instance = parent
    for _, name in ipairs(path:split(".")) do
        instance = instance:FindFirstChild(name)
        if not instance then
            return nil
        end
    end
    return instance
end

return utils