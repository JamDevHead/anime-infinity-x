local process = require("@lune/process")
local roblox = require("@lune/roblox")

local auth = {}

function auth.getAuthCookieWithFallbacks()
	local cookieFromEnv = process.env.ROBLOSECURITY

	if cookieFromEnv and #cookieFromEnv > 0 then
		return `.ROBLOSECURITY={cookieFromEnv}`
	end
	
	for index, arg in process.args do
		if arg == "--auth" then
			local cookieFromArgs = process.args[index + 1]
			if cookieFromArgs and #cookieFromArgs > 0 then
				return `.ROBLOSECURITY={cookieFromArgs}`
			end
			break
		end
	end

	local cookie = roblox.getAuthCookie()

	-- todo: check if cookie string is valid, a simple nil check wont work (could return ".ROBLOSECURITY=; ...")
	if cookie then
		return cookie
	end
 
	error([[
		Failed to find ROBLOSECURITY cookie for authentication!
		Make sure you have logged into studio, or set the ROBLOSECURITY environment variable.
	]])
end

return auth