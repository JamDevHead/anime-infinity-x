local auth = require("./authentication")
local net = require("@lune/net")
local serde = require("@lune/serde")

local place = {}

function place.download(assetId: number)
	-- 1. Try to find the auth cookie for the current user
	local cookie = auth.getAuthCookieWithFallbacks()
 
	-- 2. Send a request to the asset delivery API,
	--    which will respond with cdn download link(s)
	local assetApiResponse = net.request({
		url = `https://assetdelivery.roblox.com/v1/assetId/{assetId}`,
		headers = {
			Accept = "application/json",
			Cookie = cookie,
		},
	})
    
	if not assetApiResponse.ok then
		error(
			string.format(
				"Failed to fetch asset download link for asset id %s!\n%s (%s)\n%s",
				tostring(assetId),
				tostring(assetApiResponse.statusCode),
				tostring(assetApiResponse.statusMessage),
				tostring(assetApiResponse.body)
			)
		)
	end
 
	-- 3. Make sure we got a valid response body
	local assetApiBody = serde.decode("json", assetApiResponse.body)
	if type(assetApiBody) ~= "table" then
		error(
			string.format(
				"Asset delivery API returned an invalid response body!\n%s",
				assetApiResponse.body
			)
		)
	elseif type(assetApiBody.location) ~= "string" then
		error(
			string.format(
				"Asset delivery API returned an invalid response body!\n%s",
				assetApiResponse.body
			)
		)
	end

	-- 4. Fetch the place contents from the cdn
    local location = assetApiBody.location
	local cdnResponse = net.request({
		url = location,
		headers = {
			Cookie = cookie,
		},
	})

	if not cdnResponse.ok then
		error(
			string.format(
				"Failed to download asset with id %s from the Roblox cdn!\n%s (%s)\n%s",
				tostring(assetId),
				tostring(cdnResponse.statusCode),
				tostring(cdnResponse.statusMessage),
				tostring(cdnResponse.body)
			)
		)
	end
 
	-- 5. The response body should now be the contents of the asset file
	return cdnResponse.body
end

return place