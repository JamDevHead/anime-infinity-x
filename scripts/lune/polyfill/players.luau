local roblox = require("@lune/roblox")

roblox.implementProperty("Players", "PlayerRemoving", function()
    return {
        Connect = function() end
    }
end)

return nil