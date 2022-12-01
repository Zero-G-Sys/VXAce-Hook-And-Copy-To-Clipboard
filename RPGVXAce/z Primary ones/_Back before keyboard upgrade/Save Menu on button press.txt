=begin
===============================================================================
 Save Menu on button press (by Zero_G)
 Version: RGSS3
===============================================================================
  ==  Description ==
 This script will open the save/load window on a button press.
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
  LOAD_KEY = :F9

end

# Actions during normal play
class Scene_Map < Scene_Base
  alias scene_map_update_scene_bce update_scene
  def update_scene
    scene_map_update_scene_bce
    unless scene_changing?
      if Input.trigger?(ZERO::SAVE_KEY)
        SceneManager.call(Scene_Save) # Input code for button press here
      end
      if Input.trigger?(ZERO::LOAD_KEY) && ZERO::LOAD
        SceneManager.call(Scene_Load)
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
      SceneManager.call(Scene_Load)
    end
  end
end # Window_message