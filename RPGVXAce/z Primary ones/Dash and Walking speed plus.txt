=begin
===============================================================================
 Dash and Walking speed plus (by Zero_G)
 Version: RGSS3
===============================================================================
 == Description ==
 This script will set Walking and Dashing up by one level for main character
 
 == Terms of Use ==
 - Free for use in non-commercial projects with credits
 - Free for use in commercial projects
 - Please provide credits to Zero_G
 
 == Credits ==
 -CACAO, for the followers part

 == Usage ==
 Just add the plugin.
 
 == Changelog ==
 v2.0
 - Character will move at normal speed in events
 - Follower character fix
-------------------------------------------------------------------------------
=end
module ZERO
	MOVE_SPEED = 5
end


class Game_Player < Game_Character
  @@duringEvent = 0
  
  # Determine if walking during event
  def process_move_command(command)
     @@duringEvent = 1
    super
   end
   
   # Determine if walking via inputs
   def normal_walk?
    if @vehicle_type == :walk && !@move_route_forcing
      @@duringEvent = 0 
      return true
    else 
      return false
    end
  end

  # Cange character speed (4 normal, 5 fast)
  def real_move_speed
    return @move_speed + (dash? ? 1 : 0) if @@duringEvent == 1
    return ZERO::MOVE_SPEED + (dash? ? 1 : 0)
  end

end


class Game_Follower
  # Cancel Distance traveled by frame
  def distance_per_frame
    @preceding_character.distance_per_frame
  end
end