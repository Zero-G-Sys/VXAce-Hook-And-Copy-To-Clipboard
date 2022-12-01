=begin
===============================================================================
 Debug Walk Through Walls (by Zero_G) v1.0
 Version: RGSS3
===============================================================================
 ==  Description ==
 This script will let you walk through walls
 
 == Terms of Use ==
 - Free for use in non-commercial projects
 - Free for use in commercial projects
 - Please provide credits to Zero_G
 
 == Credits ==
 - No one
 
 == Usage ==
 Just add the plugin before main.
-------------------------------------------------------------------------------
=end
module ZERO
  WALK_WALLS_KEY = :F7
end

class Game_Player < Game_Character
  # New child method
  def passable?(x, y, d)
    if Input.press?(ZERO::WALK_WALLS_KEY)
      return true
    end
    super(x, y, d)
  end
end
