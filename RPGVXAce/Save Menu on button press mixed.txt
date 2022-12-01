=begin
===============================================================================
 Save Menu on button press (by Zero_G) v1.0
 Version: RGSS3
===============================================================================
 ==  Description ==
 This script will open the save/load window on a button press.
 If quick function is activate it will save/load to a determine slot
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
  LOAD = true    # Activate or deactivate load function
  LOAD_KEY = :F9
  QUICK = false  # Actiavte or deactivate quick save/load function
  SLOT = 0       # Slot to quick save/load

end

class Scene_Map < Scene_Base
  
  #--------------------------------------------------------------------------
  # alias method: update_scene
  #--------------------------------------------------------------------------
  alias scene_map_update_scene_bce update_scene
  def update_scene
    scene_map_update_scene_bce
    unless scene_changing?
    	# Save function
	    if Input.trigger?(ZERO::SAVE_KEY)
	    	if ZERO::QUICK
	    		DataManager.save_game(ZERO::SLOT)
	      	Sound.play_save
	    	else
	      	SceneManager.call(Scene_Save)
	      end
	    end
	    
	    # Load function
	    if Input.trigger?(ZERO::LOAD_KEY) && ZERO::LOAD
	    	if ZERO::QUICK
	    		Sound.play_load
		      DataManager.load_game(ZERO::SLOT)
		      SceneManager.goto(Scene_Map)
		    else
	      	SceneManager.call(Scene_Load)
	      end
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
    	if ZERO::QUICK
    		Sound.play_load
	      DataManager.load_game(ZERO::SLOT)
	      SceneManager.goto(Scene_Map)
	    else
      	SceneManager.call(Scene_Load)
      end
    end
  end
end # Window_message