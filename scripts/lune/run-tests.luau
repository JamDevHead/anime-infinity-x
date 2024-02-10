-- Rewrite from https://github.com/roblox-ts/roblox-ts/blob/master/tests/runLuneTests.lua

local process = require("@lune/process")
local fs = require("@lune/fs")
local roblox = require("@lune/roblox")
local luau = require("@lune/luau")
local stdio = require("@lune/stdio")

local placePath = process.args[1]

local placeFile = fs.readFile(placePath)
local game = roblox.deserializePlace(placeFile)

local requireCache = {}

function runPlaceScript(script: ModuleScript | { Source: string, Name: string })
    local runTests = luau.load(script.Source, {
        debugName = script.Name,
        environment = {
            game = game,
            require = requireWrapper,
            script = script,
            tick = os.clock
        }
    })

    local success, result = pcall(function()
        return runTests()
    end)

    if not success then
        print(`[ERROR] {result}`)
        process.exit(1)
    end

    return result
end

function requireWrapper(target: ModuleScript)
    local path = target:GetFullName()
    local cached = requireCache[path]

    if cached then
        return table.unpack(cached)
    end 

    local result = runPlaceScript(target)
    requireCache[path] = table.pack(result)

    return result
end


-- TestEZ uses TestService:Error() when tests fail
roblox.implementMethod("TestService", "Error", function(self, description: string, source: Instance?, line: number?)
	stdio.ewrite(`{description}\n`)
end)


local testRunnerSource = fs.readFile("scripts/testez/run-tests.server.lua")

runPlaceScript({
    Source = testRunnerSource,
    Name = "Test runner - INTERNAL"
})