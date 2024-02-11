local roblox = require("@lune/roblox")

-- Promise.lua indexes RunService.Heartbeat, but only uses it in Promise.defer and Promise.delay
roblox.implementProperty("RunService", "Heartbeat", function()
	return {
        Once = function(self: RunService, callback: () -> ())
            callback()
        end,
        Connect = function(self: RunService)
            return {
                Disconnect = function() end,
                Connected = true
            }
        end
    }
end, function() end)

roblox.implementMethod("RunService", "IsRunning", function()
    return false
end)

roblox.implementMethod("RunService", "IsRunMode", function()
    return true
end)

roblox.implementMethod("RunService", "IsStudio", function()
    return true
end)

roblox.implementMethod("RunService", "IsServer", function()
    return true
end)

roblox.implementMethod("RunService", "IsClient", function()
    return true
end)

return nil