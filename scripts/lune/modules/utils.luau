local roblox = require("@lune/roblox")
local process = require("@lune/process")
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

function utils.mergeInstance(instance, parent)
    local existingInstance = parent:FindFirstChild(instance.Name)
    if existingInstance then
        for _, child in ipairs(instance:GetChildren()) do
            utils.mergeInstance(child, existingInstance)
        end
        return
    end

    instance.Parent = parent
end

function utils.executeYarn(command: string, ...)
    local yarn = process.spawn(process.os == "windows" and "yarn.cmd" or "yarn", {command, ...}, {
        cwd = process.cwd,
        env = process.env,
        stdio = "inherit",
    })
    
    if not yarn.ok then
        error(`Failed to execute yarn command!\n${yarn.stderr}`)
    end

    return yarn
end

return utils