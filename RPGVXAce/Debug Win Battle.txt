=begin
===============================================================================
 Debug Win Battle (by Zero_G) v1.0
 Version: RGSS3
===============================================================================
 ==  Description ==
 This script will win a battle when a button is pressed
 
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
  WIN_KEY = :F8
end

class Scene_Battle < Scene_Base
  alias zero_debug_win_update update
  def update
    zero_debug_win_update

    if Input.trigger?(ZERO::WIN_KEY)
      @party_command_window.close if @party_command_window.active

      for enemy in $game_troop.members
        enemy.add_new_state(enemy.death_state_id)
      end

      BattleManager.process_victory
    end
  end
end