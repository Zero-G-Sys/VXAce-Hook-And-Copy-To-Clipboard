=begin
===============================================================================
 Speedup (by Zero_G)
 Version: RGSS
===============================================================================
 == Description ==
 This script will change the game FPS (and thus the speed of the game) while 
 a button is pressed.
 
 == Terms of Use ==
 - Free for use in non-commercial projects with credits
 - Free for use in commercial projects
 - Please provide credits to Zero_G
 
 == Credits ==
 -No one

 == Usage ==
 Just add the plugin before main.
-------------------------------------------------------------------------------
=end

module ZERO
  
  SPEEDUP_KEY = Input::X
  SPEEDUP_AMOUNT = 120 # In FPS; 60 x2; 120 x4
  FRAME_RATE = Graphics.frame_rate # Default should be 30 in most games

end

class Scene_Map
  alias zero_update_speedup update
  def update
    zero_update_speedup

    if Input.press?(ZERO::SPEEDUP_KEY)
      Graphics.frame_rate = ZERO::SPEEDUP_AMOUNT
    else
      Graphics.frame_rate = ZERO::FRAME_RATE
    end
  end
end

class Scene_Battle
  alias speedup_battle_update update
  def update
    if Input.press?(ZERO::SPEEDUP_KEY)
      Graphics.frame_rate = ZERO::SPEEDUP_AMOUNT
    else
      Graphics.frame_rate = ZERO::FRAME_RATE
    end
    speedup_battle_update
  end
end 