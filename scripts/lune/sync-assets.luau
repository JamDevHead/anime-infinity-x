local process = require("@lune/process")
local utils = require("modules/utils")

local initialTime = os.clock()

local args = process.args

local options = {
    dev = false,
    xml = false,
}

for _, arg in args do
    if arg == "--dev" then
        options.dev = true
    end
    if arg == "--xml" then
        options.xml = true
    end
end

utils.executeYarn(`build:{options.dev and "dev" or "prod"}`)

if options.dev then
    print("📦 Opening place...")

    local placeResult = process.spawn(process.os == "windows" and `scripts/open-place{not options.xml and "-binary" or ""}.bat` or "scripts/open-place.sh")

    if not placeResult.ok then
        error(`Failed to open place!\n${placeResult.stderr}`)
    end

    print("📦 Opened place!")
end

print(`📦 Synced assets in {string.format("%.2f", os.clock() - initialTime)} seconds!`)