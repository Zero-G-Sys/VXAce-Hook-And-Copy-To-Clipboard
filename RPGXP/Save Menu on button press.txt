=begin
===============================================================================
 Save Menu on button press (by Zero_G)
 Version: RGSS
===============================================================================
   ==  Description ==
 This script will open the save/load window on a button press.

 More actions for buttons can be done.
 
 == Terms of Use ==
 - Free for use in non-commercial projects with credits
 - Free for use in commercial projects
 - Please provide credits to Zero_G
 
 == Credits ==
 -Script modified from "Button Common Events" (VXACE) by "Yanfly"

 == Changelog ==
 v1.1 - Canceling load screen now returns to game instead of main menu
 
 == Usage ==
 Just add the plugin before main.
-------------------------------------------------------------------------------
=end

module ZERO
  
  SAVE_KEY = Input::L
  LOAD = true    #Activate or deactivate load function
  LOAD_KEY = Input::F9

end

# Change on_cancel behaviour of Scene_load so it returns to game instead of menu
class Scene_Title
  alias zero_save_main main
  def main
    $load_from_key = false # Reset var when loading main menu
    zero_save_main
  end  
end

class Scene_Load < Scene_File
  def on_cancel
    if ($load_from_key)
      $game_system.se_play($data_system.cancel_se)
      $scene = Scene_Map.new
    else
      $game_system.se_play($data_system.cancel_se)
      $scene = Scene_Title.new
    end
  end
end

# Call scene load and scene save when button is pressed
class Scene_Map
  alias zero_update update
  def update
    zero_update
    
    if Input.trigger?(ZERO::SAVE_KEY)
      call_save
    end
    
    if Input.trigger?(ZERO::LOAD_KEY) && ZERO::LOAD
      $game_player.straighten
      $load_from_key = true
      $scene = Scene_Load.new
    end
  end
end

class Scene_Battle
  alias save_battle_update update
  def update
    if Input.trigger?(ZERO::LOAD_KEY) && ZERO::LOAD
      $game_player.straighten
      $load_from_key = true
      $scene = Scene_Load.new
    end
    save_battle_update
  end
end 