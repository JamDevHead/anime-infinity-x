-- Rewrite from https://github.com/roblox-ts/roblox-ts/blob/master/tests/runLuneTests.lua

local process = require("@lune/process")
local fs = require("@lune/fs")
local roblox = require("@lune/roblox")
local luau = require("@lune/luau")
local stdio = require("@lune/stdio")
local task = require("@lune/task")

local placePath = process.args[1]

local placeFile = fs.readFile(placePath)
local game = roblox.deserializePlace(placeFile)

local failed = false
local requireCache = {}
local requireWrapper

function runPlaceScript(script: ModuleScript | { Source: string, Name: string }, name: string?)
    local runTests = luau.load(script.Source, {
        debugName = name or script.Name,
        environment = {
            game = game,
            require = requireWrapper,
            script = script,
            tick = os.clock,
            task = task,
            Vector3 = require("./polyfill/vector3"),
            Vector2 = require("./polyfill/vector2"),
            debug = require("./polyfill/debug")
        }
    })

    local success, result = pcall(function()
        return runTests()
    end)

    if not success then
        print(`[ERROR] {result}`)
        process.exit(1)
    end

    if failed then
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

    local result = runPlaceScript(target, target:GetFullName())
    requireCache[path] = table.pack(result)

    return result
end


-- PreCreate workspace
game:GetService("Workspace")

-- RuntimeLib uses :WaitForChild(), but tests don't need networking so :FindFirstChild() should be fine
roblox.implementMethod("Instance", "WaitForChild", function(self, ...)
	return self:FindFirstChild(...)
end)

-- TestEZ uses TestService:Error() when tests fail
roblox.implementMethod("TestService", "Error", function(self, description: string, source: Instance?, line: number?)
	stdio.ewrite(`{description}\n`)
    failed = true
end)

require("./polyfill/runservice")

local testRunnerSource = fs.readFile("scripts/testez/run-tests.server.lua")

runPlaceScript({
    Source = testRunnerSource,
    Name = "Test runner - INTERNAL"
})