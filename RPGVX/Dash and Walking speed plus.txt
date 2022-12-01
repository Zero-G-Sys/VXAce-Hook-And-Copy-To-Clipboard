=begin
===============================================================================
 Dash and Walking speed plus
===============================================================================
 This script will set Walking and Dashing up by x levels for main character
 Speed during events will follow the engine default and the one set in move
 route
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
  
  def update_animation
    if @move_route_forcing
      speed = @move_speed + (dash? ? 1 : 0)
    elsif
      speed = ZERO::SPEED + (dash? ? 1 : 0)
    end
    if @anime_count > 18 - speed * 2
      if not @step_anime and @stop_count > 0
        @pattern = @original_pattern
      else
        @pattern = (@pattern + 1) % 4
      end
      @anime_count = 0
    end
  end
end