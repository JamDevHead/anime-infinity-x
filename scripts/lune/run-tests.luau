local process = require("@lune/process")
local fs = require("@lune/fs")

local config = require("modules/configManager"):getConfig()

local args = process.args

local options = {
    dev = false,
    xml = false,
}

for _, arg in args do
    if arg == "--xml" then
        options.xml = true
    end
end

local file = config.outputName
local extension = options.xml and "rbxlx" or "rbxl"
local output = `{file}.{extension}`

local success, existsOrError = pcall(fs.isFile, output)

assert(success and existsOrError, (existsOrError and `❌ Internal error, failed to check place existence: {existsOrError}`) or `❌ Failed to find place "{output}" to test`)

print("🔧 Running tests")

local startTime = os.clock()

local success, resultOrError = pcall(function()
    return process.spawn("run-in-roblox", {
        "--place",
        output,
        "--script",
        "scripts/testez/run-tests.server.lua"
    })
end)

local endTime = os.clock()

local gotResult = type(resultOrError) == "table"

if gotResult then
    local template = "🔧 Ran tests in %.2f, did ok: (%s), code: (%s)\n\t%s\n\t%s"

    if resultOrError.ok == true and resultOrError.stdout == "" and resultOrError.stderr == "" then
        error("❌ RunInRoblox failed to return test result, re-run")
    end

    print(template:format(endTime - startTime, tostring(resultOrError.ok), tostring(resultOrError.code), resultOrError.stdout:gsub("\n", "\n\t")), resultOrError.stderr:gsub("\n", "\n\t"))

    if not resultOrError.ok then
        error("❌ Something went wrong in testing")
    end

else 
    local result = resultOrError

    if gotResult then
        result = resultOrError.stderr
    end

    error(`❌ Tests didn't run, result: {result}`)
end