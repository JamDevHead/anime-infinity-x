local _debug = setmetatable({}, {
    __index = debug
})

function _debug.profilebegin() end
function _debug.profileend() end

return _debug