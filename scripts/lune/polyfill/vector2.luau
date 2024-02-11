local vector_mt = {}
local vector2 = {}

vector_mt.__index = vector_mt
vector2.__index = vector_mt

local function new(x,y)
	return setmetatable( {x = x or 0, y = y or 0} , vector_mt) 
end

function vector2.new(x, y)
    return new(x, y)
end

function vector_mt:__add( vector )
	return new( 
		self.x + vector.x,
		self.y + vector.y
	)
end

function vector_mt:__sub( vector )
	return new(
		self.x - vector.x,
		self.y - vector.y
	)
end

function vector_mt:__mul( vector )
	if type(vector) == "number" then
		return new(
			self.x * vector,
			self.y * vector
		)
	else
		return new(
			self.x * vector.x,
			self.y * vector.y
		)
	end
end

function vector_mt:__div( vector )
	if type(vector) == "number" then
		return new(
			self.x / vector,
			self.y / vector
		)
	else
		return new(
			self.x / vector.x,
			self.y / vector.y
		)
	end
end

--
-- Boolean operators
--

function vector_mt:__eq( vector )
	return self.x == vector.x and self.y == vector.y
end

function vector_mt:__unm()
	return new(-self.x,-self.y)
end

-- 
-- String Operators.
--

function vector_mt:__tostring()
	return "[" .. self.x .. "," .. self.y .. "]"
end        

--
-- Vector operator functions.
--

function vector_mt:Add( vector )
	self = self + vector
end

function vector_mt:Sub( vector )
	self = self - vector
end

function vector_mt:Mul( n )
	self.x = self.x * n
	self.y = self.y * n
end

function vector_mt:Zero()
	self.x = 0
	self.y = 0
	return self
end

function vector_mt:Length()
	return ( ( self.x * self.x ) + ( self.y * self.y ) ) ^ 0.5
end

-- This should really be named get normalised copy.
function vector_mt:GetNormal()
	local length = self:Length()
	return new( self.x / length, self.y / length )
end

function vector_mt:Dot( vector )
	return (self.x  * vector.x) + (self.y * vector.y)
end

-- Cross Product.
function vector_mt:Cross( vector )
	local vec = new(0,0)
	vec.x = ( self.y * vector.x ) - ( vector.y * self.x )
	vec.y = ( self.x * vector.y ) - ( vector.x * self.y )
	return vec
end

return vector2