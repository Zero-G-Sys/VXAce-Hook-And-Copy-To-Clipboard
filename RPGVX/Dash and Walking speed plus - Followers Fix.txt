=begin
===============================================================================
 Dash and Walking speed plus
===============================================================================
 This script will set Walking and Dashing up by x levels for main character
 
 Followers fix, may speed up rest of npcs
-------------------------------------------------------------------------------
=end

module ZERO

   SPEED = 5  #New Speed, engine default 4 
  
end

class Game_Player < Game_Character
  
  def update_move
    if @move_route_forcing
      distance = 2 ** @move_speed
    elsif
      distance = 2 ** ZERO::SPEED   # Convert to movement distance
    end
    distance *= 2 if dash?        # If dashing, double it
    @real_x = [@real_x - distance, @x * 256].max if @x * 256 < @real_x
    @real_x = [@real_x + distance, @x * 256].min if @x * 256 > @real_x
    @real_y = [@real_y - distance, @y * 256].max if @y * 256 < @real_y
    @real_y = [@real_y + distance, @y * 256].min if @y * 256 > @real_y
    update_bush_depth unless moving?
    if @walk_anime
      @anime_count += 1.5
    elsif @step_anime
      @anime_count += 1
    end
  end
end

class Game_Character
  
  def update_move
    if @move_route_forcing
      distance = 2 ** @move_speed
    elsif
      distance = 2 ** ZERO::SPEED   # Convert to movement distance
    end
    distance *= 2 if dash?        # If dashing, double it
    @real_x = [@real_x - distance, @x * 256].max if @x * 256 < @real_x
    @real_x = [@real_x + distance, @x * 256].min if @x * 256 > @real_x
    @real_y = [@real_y - distance, @y * 256].max if @y * 256 < @real_y
    @real_y = [@real_y + distance, @y * 256].min if @y * 256 > @real_y
    update_bush_depth unless moving?
    if @walk_anime
      @anime_count += 1.5
    elsif @step_anime
      @anime_count += 1
    end
  end
end
