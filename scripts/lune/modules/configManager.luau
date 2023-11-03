local serde = require("@lune/serde")
local fs = require("@lune/fs")

local configManager = {}

local CONFIG_TYPE = "json"

function configManager:getConfig()
    local config = fs.readFile("lune.config.json")
    if not config then
        return {}
    end
    return serde.decode(CONFIG_TYPE, config)
end

return configManager