=begin
===============================================================================
 Save Quick on button press (by Zero_G)
 Version: RGSS3
===============================================================================
  ==  Description ==
 This script will quick save/load to a determine slot
 More actions for buttons can be done.
 
 == Terms of Use ==
 - Free for use in non-commercial projects with credits
 - Free for use in commercial projects
 - Please provide credits to Zero_G
 
 == Credits ==
 -Script modified from "Button Common Events" by "Yanfly"
 
 == Usage ==
 Just add the plugin before main.
-------------------------------------------------------------------------------
=end

module ZERO
  
  SAVE_KEY = :L
  LOAD = true    #Activate or deactivate load function
  LOAD_KEY = :R
  SLOT = 0

end

# Actions during normal play
class Scene_Map < Scene_Base
  alias scene_map_update_scene_bce update_scene
  def update_scene
    scene_map_update_scene_bce
    unless scene_changing?
	    if Input.trigger?(ZERO::SAVE_KEY)
	      DataManager.save_game(ZERO::SLOT)
	      Sound.play_save
	    end
	    if Input.trigger?(ZERO::LOAD_KEY) && ZERO::LOAD
	      Sound.play_load
	      DataManager.load_game(ZERO::SLOT)
	      SceneManager.goto(Scene_Map)
	    end
	    #More inputs con be put here
	  end
  end
end # Scene_Map

#Actions during message window
class Window_Message < Window_Base
  alias zero_save_update update
  def update
    zero_save_update
    if Input.trigger?(ZERO::LOAD_KEY) && ZERO::LOAD
      Sound.play_load
      DataManager.load_game(ZERO::SLOT)
      SceneManager.goto(Scene_Map)
    end
  end
end # Window_message